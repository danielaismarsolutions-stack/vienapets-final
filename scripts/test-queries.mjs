// Test ad-hoc de lib/queries/products.js.
// Replica la lógica de enrichment localmente porque Node no resuelve el alias
// "@/" ni la directiva "server-only" sin Next.
import { createClient } from "@supabase/supabase-js";
import { MODEL_META } from "../lib/model-meta.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon) throw new Error("Faltan vars de entorno");

const supabase = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const PRODUCT_COLUMNS =
  "id, slug, name, model, category, description, price_cents, stripe_product_id, images, active, created_at";

function enrich(row) {
  if (!row) return null;
  const meta = row.model ? MODEL_META[row.model] ?? null : null;
  const images = Array.isArray(row.images) ? row.images : [];
  return { ...row, price_eur: row.price_cents / 100, image: images[0] ?? null, meta };
}
function enrichVariant(v) {
  const available = Math.max(0, (v.stock ?? 0) - (v.stock_reserved ?? 0));
  return { ...v, available, in_stock: available > 0 };
}

async function getAllProducts() {
  const { data, error } = await supabase.from("products").select(PRODUCT_COLUMNS).eq("active", true).order("model").order("category");
  if (error) throw error;
  return data.map(enrich);
}
async function getProductsByCategory(category) {
  const { data, error } = await supabase.from("products").select(PRODUCT_COLUMNS).eq("active", true).eq("category", category).order("model");
  if (error) throw error;
  return data.map(enrich);
}
async function getProductBySlug(slug) {
  const { data, error } = await supabase.from("products").select(PRODUCT_COLUMNS).eq("active", true).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return enrich(data);
}
async function getProductWithVariants(slug) {
  const { data, error } = await supabase.from("products")
    .select(`${PRODUCT_COLUMNS}, variants(id, size, sku, stripe_price_id, stock, stock_reserved)`)
    .eq("active", true).eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const SIZE_ORDER = { XS: 0, S: 1, M: 2, L: 3 };
  const variants = (data.variants ?? []).map(enrichVariant).sort((a, b) => (SIZE_ORDER[a.size] ?? 9) - (SIZE_ORDER[b.size] ?? 9));
  return { ...enrich(data), variants };
}
async function getAllProductSlugs() {
  const { data, error } = await supabase.from("products").select("slug").eq("active", true);
  if (error) throw error;
  return data.map((r) => r.slug);
}

const summary = (p) => ({ slug: p.slug, name: p.name, model: p.model, category: p.category, price_eur: p.price_eur, has_meta: !!p.meta });

console.log("\n── getAllProducts ──");
const all = await getAllProducts();
console.log(`total: ${all.length}`);
console.log(all.map(summary));

console.log("\n── getProductsByCategory('arnes') ──");
const arneses = await getProductsByCategory("arnes");
console.log(`total: ${arneses.length}`);
console.log(arneses.map(summary));

console.log("\n── getProductBySlug('arnes-capri') ──");
const one = await getProductBySlug("arnes-capri");
console.log({ ...summary(one), meta_subtitle: one.meta?.subtitle, image: one.image });

console.log("\n── getProductWithVariants('arnes-capri') ──");
const full = await getProductWithVariants("arnes-capri");
console.log({ ...summary(full), variants: full.variants.map((v) => ({ size: v.size, sku: v.sku, stock: v.stock, reserved: v.stock_reserved, available: v.available })) });

console.log("\n── getProductWithVariants('correa-peachy') (sin tallas) ──");
const leash = await getProductWithVariants("correa-peachy");
console.log({ ...summary(leash), variants: leash.variants.map((v) => ({ size: v.size, sku: v.sku, available: v.available })) });

console.log("\n── getAllProductSlugs ──");
const slugs = await getAllProductSlugs();
console.log(slugs);
