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

const PRODUCT_COLUMNS =
  "id, slug, name, model, category, description, price_cents, stripe_product_id, images, active, created_at";
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
  return (data ?? []).map(enrich);
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
  return (data ?? []).map(enrich);
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
      `${PRODUCT_COLUMNS}, variants(id, size, sku, stripe_price_id, stock, stock_reserved)`
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
  return { ...enriched, variants };
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
