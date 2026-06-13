// scripts/sync-products-to-stripe.js
//
// Sincroniza el catálogo de Supabase → Stripe (test mode).
//
// Por cada `products` crea (o actualiza) un Stripe Product, y por cada
// `variants` crea un Stripe Price con tax_behavior=inclusive. Guarda de vuelta
// en Supabase los IDs generados (`products.stripe_product_id`,
// `variants.stripe_price_id`).
//
// Idempotente:
//   - Si products.stripe_product_id ya existe  → product UPDATE (no create).
//   - Si variants.stripe_price_id ya existe     → se respeta (los Prices son
//     inmutables en importe; no se duplican).
//
// Decisión de negocio (CLAUDE.md §6): el precio vive en `products.price_cents`
// CON IVA incluido. Todas las variantes de un producto comparten ese importe,
// por eso cada Price usa `product.price_cents` y tax_behavior=inclusive.
//
// Uso:
//   node scripts/sync-products-to-stripe.js
//
// Variables de entorno requeridas:
//   STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//   NEXT_PUBLIC_SITE_URL

const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

// Código fiscal de Stripe Tax. txcd_99999999 = "General - Tangible Goods".
const TAX_CODE = "txcd_99999999";
// Pinneamos la versión de la API para que el comportamiento sea reproducible.
const STRIPE_API_VERSION = "2026-05-27.dahlia";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Falta la variable de entorno ${name}`);
    process.exit(1);
  }
  return v;
}

const STRIPE_SECRET_KEY = requireEnv("STRIPE_SECRET_KEY");
const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Comprueba que una URL de imagen es accesible (best-effort). Stripe valida la
// URL al crear el producto, así que sólo incluimos las que respondan 2xx.
async function reachableImageUrls(images) {
  if (!SITE_URL || !Array.isArray(images) || images.length === 0) return [];
  const first = images[0];
  if (typeof first !== "string") return [];
  const url = first.startsWith("http") ? first : `${SITE_URL}${first}`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) return [url];
    console.warn(`  ⚠ imagen no accesible (${res.status}), se omite: ${url}`);
  } catch (err) {
    console.warn(`  ⚠ imagen no verificable, se omite: ${url} (${err.message})`);
  }
  return [];
}

async function syncProduct(product) {
  const images = await reachableImageUrls(product.images);
  const params = {
    name: product.name,
    description: product.description || undefined,
    active: product.active !== false,
    tax_code: TAX_CODE,
    metadata: {
      supabase_product_id: product.id,
      slug: product.slug,
      category: product.category,
    },
  };
  if (images.length > 0) params.images = images;

  let stripeProductId = product.stripe_product_id;
  if (stripeProductId) {
    await stripe.products.update(stripeProductId, params);
    console.log(`  ↻ product actualizado: ${product.slug} (${stripeProductId})`);
  } else {
    const created = await stripe.products.create(params);
    stripeProductId = created.id;
    const { error } = await supabase
      .from("products")
      .update({ stripe_product_id: stripeProductId })
      .eq("id", product.id);
    if (error) throw new Error(`Supabase update products(${product.slug}): ${error.message}`);
    console.log(`  ✓ product creado:    ${product.slug} (${stripeProductId})`);
  }
  return stripeProductId;
}

async function syncVariant(product, variant, stripeProductId) {
  if (variant.stripe_price_id) {
    console.log(`    · price ya existe:  ${variant.sku} (${variant.stripe_price_id})`);
    return variant.stripe_price_id;
  }
  const price = await stripe.prices.create({
    product: stripeProductId,
    currency: "eur",
    unit_amount: product.price_cents, // IVA incluido (tax_behavior inclusive)
    tax_behavior: "inclusive",
    nickname: variant.sku || undefined,
    metadata: {
      supabase_variant_id: variant.id,
      sku: variant.sku || "",
      size: variant.size || "",
    },
  });
  const { error } = await supabase
    .from("variants")
    .update({ stripe_price_id: price.id })
    .eq("id", variant.id);
  if (error) throw new Error(`Supabase update variants(${variant.sku}): ${error.message}`);
  console.log(`    ✓ price creado:     ${variant.sku} (${price.id}) → €${(product.price_cents / 100).toFixed(2)}`);
  return price.id;
}

async function main() {
  console.log("→ Sincronizando catálogo Supabase → Stripe (test mode)\n");

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, category, price_cents, stripe_product_id, images, active, variants(id, size, sku, stripe_price_id)"
    )
    .order("category", { ascending: true })
    .order("slug", { ascending: true });
  if (error) throw new Error(`Supabase select products: ${error.message}`);

  let nProducts = 0;
  let nPrices = 0;
  for (const product of products) {
    console.log(`• ${product.name}`);
    const stripeProductId = await syncProduct(product);
    nProducts += 1;
    const variants = product.variants || [];
    // Orden estable de tallas para logs legibles.
    const SIZE_ORDER = { XS: 0, S: 1, M: 2, L: 3 };
    variants.sort((a, b) => (SIZE_ORDER[a.size] ?? 9) - (SIZE_ORDER[b.size] ?? 9));
    for (const variant of variants) {
      await syncVariant(product, variant, stripeProductId);
      nPrices += 1;
    }
  }

  console.log(`\n✓ Procesados ${nProducts} products y ${nPrices} variants.`);

  // Verificación contra Stripe.
  const stripeProducts = await stripe.products.list({ limit: 100, active: true });
  const stripePrices = await stripe.prices.list({ limit: 100 });
  console.log(`  Stripe ahora: ${stripeProducts.data.length} products · ${stripePrices.data.length} prices.`);
}

main().catch((err) => {
  console.error("\n✗ Error en la sincronización:", err.message);
  process.exit(1);
});
