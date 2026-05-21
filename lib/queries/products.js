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

function enrich(row) {
  if (!row) return null;
  const meta = getModelMeta(row.model);
  const images = Array.isArray(row.images) ? row.images : [];
  return {
    ...row,
    price_eur: row.price_cents / 100,
    image: images[0] ?? null,
    meta,
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

export async function getAllProducts() {
  const supabase = getPublicSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
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
    .select(PRODUCT_COLUMNS)
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
