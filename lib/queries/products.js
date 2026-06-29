import "server-only";

// Queries de catálogo (lectura pública).
// Toda consulta pasa por el cliente anon → RLS (CLAUDE.md §6): solo lee
// productos activos y variantes asociadas.
//
// Cada producto se enriquece con MODEL_META (lib/model-meta.js): hex, pantones,
// subtitle, partsImg, materialsImg, moodImg, *Img de piezas. Estos campos no
// viven en Supabase porque son constantes del sistema visual de marca.
//
// Convenciones de shape devuelto:
//   - price_cents: integer (fuente de verdad)
//   - price_eur:   number con decimales para presentación
//   - image:       primera ruta de `images` (atajo)
//   - meta:        objeto MODEL_META[product.model] o null
import { getPublicSupabase } from "@/lib/supabase/public";
import { getModelMeta } from "@/lib/model-meta";
import { PRODUCT_IMAGES } from "@/scripts/product-images";
import { PRICE_COLUMN, PRODUCT_COLUMN } from "@/lib/stripe/mode";

function enrich(row) {
  if (!row) return null;
  const meta = getModelMeta(row.model);
  const images = Array.isArray(row.images) ? row.images : [];
  // Si la fila viene con variants embebidas, calculamos `total_available` y
  // `in_stock` (agotado si todas las variantes tienen disponible <= 0).
  let total_available = null;
  let in_stock = null;
  if (Array.isArray(row.variants)) {
    total_available = row.variants.reduce((sum, v) => {
      return sum + Math.max(0, (v.stock ?? 0) - (v.stock_reserved ?? 0));
    }, 0);
    in_stock = total_available > 0;
  }
  return {
    ...row,
    price_eur: row.price_cents / 100,
    // Imagen de estudio siempre gana para display; Supabase manda en precio/stock.
    image: PRODUCT_IMAGES[row.slug]?.main ?? images[0] ?? null,
    meta,
    total_available,
    in_stock,
  };
}

function enrichVariant(v) {
  const stock = v.stock ?? 0;
  const reserved = v.stock_reserved ?? 0;
  const available = Math.max(0, stock - reserved);
  return {
    ...v,
    available,
    in_stock: available > 0,
  };
}

const ALL_SIZES = ["XS", "S", "M", "L"];

function availOf(v) {
  return Math.max(0, (v?.stock ?? 0) - (v?.stock_reserved ?? 0));
}

// Disponibilidad de los componentes de un conjunto (CLAUDE.md §6 + decisión de
// negocio): un conjunto NO tiene stock propio. Su disponibilidad por talla se
// deriva del arnés de esa talla + la correa + el portabolsas del mismo modelo.
// Devuelve un mapa model -> { harness: {size: available}, leash, bag } a partir
// de filas products(model, category, variants(size, stock, stock_reserved)).
function indexComponentsByModel(rows) {
  const byModel = new Map();
  for (const p of rows ?? []) {
    if (!p.model) continue;
    if (!byModel.has(p.model)) byModel.set(p.model, { harness: {}, leash: 0, bag: 0 });
    const bucket = byModel.get(p.model);
    if (p.category === "arnes") {
      for (const v of p.variants ?? []) {
        if (v.size) bucket.harness[v.size] = availOf(v);
      }
    } else if (p.category === "correa") {
      bucket.leash = availOf((p.variants ?? [])[0]);
    } else if (p.category === "portabolsas") {
      bucket.bag = availOf((p.variants ?? [])[0]);
    }
  }
  return byModel;
}

// Para un modelo, devuelve la disponibilidad de conjunto por talla
// (limitada por correa y portabolsas, comunes a todas las tallas).
function conjuntoSizeAvailability(comp) {
  const out = {};
  if (!comp) return out;
  for (const s of ALL_SIZES) {
    const harness = comp.harness[s] ?? 0;
    out[s] = Math.max(0, Math.min(harness, comp.leash, comp.bag));
  }
  return out;
}

// Recalcula in_stock / total_available de los productos 'conjunto' de la lista
// a partir del stock real de sus componentes (no del SKU del bundle). Hace UNA
// query extra sólo si hay conjuntos en la lista.
async function attachConjuntoAvailability(products, supabase) {
  const conjuntos = products.filter((p) => p.category === "conjunto" && p.model);
  if (conjuntos.length === 0) return products;

  const models = [...new Set(conjuntos.map((p) => p.model))];
  const { data, error } = await supabase
    .from("products")
    .select("model, category, variants(size, stock, stock_reserved)")
    .eq("active", true)
    .in("model", models)
    .in("category", ["arnes", "correa", "portabolsas"]);
  if (error) throw new Error(`attachConjuntoAvailability: ${error.message}`);

  const byModel = indexComponentsByModel(data);
  for (const p of conjuntos) {
    const sizes = conjuntoSizeAvailability(byModel.get(p.model));
    // Un conjunto sólo se puede formar tantas veces como la pieza más escasa:
    // limitado por correa y portabolsas (comunes) y la suma de arneses por talla.
    const comp = byModel.get(p.model);
    const harnessTotal = comp ? ALL_SIZES.reduce((s, sz) => s + (comp.harness[sz] ?? 0), 0) : 0;
    p.total_available = comp ? Math.max(0, Math.min(harnessTotal, comp.leash, comp.bag)) : 0;
    p.in_stock = ALL_SIZES.some((s) => (sizes[s] ?? 0) > 0);
    // Disponibilidad por talla para la ficha de producto.
    p.conjunto_sizes = sizes;
  }
  return products;
}

// Alias `stripe_product_id:<columna>` para que la clave devuelta siga siendo
// `stripe_product_id` independientemente del modo (test/live). La columna real
// la decide STRIPE_MODE (lib/stripe/mode.js).
const PRODUCT_COLUMNS =
  `id, slug, name, model, category, description, price_cents, stripe_product_id:${PRODUCT_COLUMN}, images, active, created_at`;
// Para listados embebemos stock de variants para poder marcar "Agotado".
const PRODUCT_WITH_STOCK = `${PRODUCT_COLUMNS}, variants(stock, stock_reserved)`;

export async function getAllProducts() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_STOCK)
    .eq("active", true)
    .order("model", { ascending: true })
    .order("category", { ascending: true });
  if (error) throw new Error(`getAllProducts: ${error.message}`);
  return attachConjuntoAvailability((data ?? []).map(enrich), supabase);
}

export async function getProductsByCategory(category) {
  if (!category) return getAllProducts();
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_STOCK)
    .eq("active", true)
    .eq("category", category)
    .order("model", { ascending: true });
  if (error) throw new Error(`getProductsByCategory(${category}): ${error.message}`);
  return attachConjuntoAvailability((data ?? []).map(enrich), supabase);
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`getProductBySlug(${slug}): ${error.message}`);
  return enrich(data);
}

export async function getProductWithVariants(slug) {
  if (!slug) return null;
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${PRODUCT_COLUMNS}, variants(id, size, sku, stripe_price_id:${PRICE_COLUMN}, stock, stock_reserved)`
    )
    .eq("active", true)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`getProductWithVariants(${slug}): ${error.message}`);
  if (!data) return null;
  const enriched = enrich(data);
  const variants = (data.variants ?? []).map(enrichVariant);
  // Orden estable: XS, S, M, L, null.
  const SIZE_ORDER = { XS: 0, S: 1, M: 2, L: 3 };
  variants.sort((a, b) => (SIZE_ORDER[a.size] ?? 9) - (SIZE_ORDER[b.size] ?? 9));
  const result = { ...enriched, variants };
  // Conjunto: su disponibilidad por talla deriva de los componentes del modelo
  // (arnés de la talla + correa + portabolsas), no del SKU del bundle.
  if (result.category === "conjunto") {
    await attachConjuntoAvailability([result], supabase);
  }
  return result;
}

export async function getAllProductSlugs() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("active", true);
  if (error) throw new Error(`getAllProductSlugs: ${error.message}`);
  return (data ?? []).map((r) => r.slug);
}

// Vista model-centric derivada de productos + MODEL_META.
// La usa el home/landing (PromoPack, Materials, Models...) para iterar por
// modelo: agrega precios de cada pieza y los slugs (que es lo que se linka).
const MODEL_ORDER = ["capri", "peachy", "daisy"];

export async function getModelsView() {
  const products = await getAllProducts();
  const byModel = new Map();
  for (const p of products) {
    if (!p.model) continue;
    if (!byModel.has(p.model)) byModel.set(p.model, {});
    byModel.get(p.model)[p.category] = p;
  }
  const out = [];
  for (const id of MODEL_ORDER) {
    const buckets = byModel.get(id);
    if (!buckets) continue;
    const meta = getModelMeta(id);
    const arnes = buckets.arnes;
    const correa = buckets.correa;
    const portabolsas = buckets.portabolsas;
    const conjunto = buckets.conjunto;
    if (!arnes || !correa || !portabolsas) continue;
    out.push({
      id,
      name: arnes.name.replace(/^Arnés\s+/, ""),
      subtitle: meta?.subtitle ?? null,
      description: arnes.description,
      priceHarness: arnes.price_eur,
      priceLeash: correa.price_eur,
      priceBag: portabolsas.price_eur,
      priceConjunto: conjunto?.price_eur ?? null,
      pantones: meta?.pantones ?? [],
      hex: meta?.hex ?? { primary: "#816754", secondary: "#816754" },
      heroImg: meta?.heroImg ?? arnes.image,
      harnessImg: meta?.harnessImg ?? arnes.image,
      leashImg: meta?.leashImg ?? correa.image,
      bagImg: meta?.bagImg ?? portabolsas.image,
      partsImg: meta?.partsImg ?? null,
      materialsImg: meta?.materialsImg ?? null,
      moodImg: meta?.moodImg ?? null,
      slugs: {
        arnes: arnes.slug,
        correa: correa.slug,
        portabolsas: portabolsas.slug,
        conjunto: conjunto?.slug ?? null,
      },
    });
  }
  return out;
}
