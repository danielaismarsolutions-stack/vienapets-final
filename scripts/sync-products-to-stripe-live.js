// scripts/sync-products-to-stripe-live.js
//
// Sincroniza el catálogo de Supabase → Stripe **LIVE** (modo producción).
//
// Espejo de scripts/sync-products-to-stripe.js (test) pero apuntando a la
// cuenta LIVE y guardando los IDs en columnas separadas para NO pisar los de
// test (Sprint 3). Así, cuando hagamos el switch manual a producción, las
// sesiones de Checkout encontrarán los price_ids correctos.
//
// Mapa de columnas:
//   products.stripe_product_id      → ID en Stripe TEST   (NO se toca)
//   products.stripe_product_id_live → ID en Stripe LIVE   (lo rellena este script)
//   variants.stripe_price_id        → ID en Stripe TEST   (NO se toca)
//   variants.stripe_price_id_live   → ID en Stripe LIVE   (lo rellena este script)
//
// Idempotente:
//   - Si products.stripe_product_id_live ya existe → product UPDATE (no create).
//   - Si variants.stripe_price_id_live ya existe   → se respeta (los Prices son
//     inmutables en importe; no se duplican).
//
// Decisión de negocio (CLAUDE.md §6): el precio vive en `products.price_cents`
// CON IVA incluido. Cada Price usa ese importe con tax_behavior=inclusive.
//
// Imágenes: se construyen como URLs públicas del sitio en producción
// (https://www.vienapets.com + ruta guardada). Como Stripe descarga la imagen
// al crear el producto, si la URL no es accesible reintentamos SIN imágenes y
// lo reportamos (no abortamos el sync por una imagen).
//
// Uso:
//   node scripts/sync-products-to-stripe-live.js
//
// Variables de entorno requeridas:
//   STRIPE_SECRET_KEY_LIVE, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Opcional:
//   LIVE_IMAGE_BASE_URL (por defecto https://www.vienapets.com)

const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

// Código fiscal de Stripe Tax. txcd_99999999 = "General - Tangible Goods".
const TAX_CODE = "txcd_99999999";
// Misma versión de API que el sync de test para comportamiento reproducible.
const STRIPE_API_VERSION = "2026-05-27.dahlia";
// Base pública de imágenes en producción (Stripe las descarga desde aquí).
const IMAGE_BASE_URL = (process.env.LIVE_IMAGE_BASE_URL || "https://www.vienapets.com").replace(/\/$/, "");

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`✗ Falta la variable de entorno ${name}`);
    process.exit(1);
  }
  return v;
}

const STRIPE_SECRET_KEY_LIVE = requireEnv("STRIPE_SECRET_KEY_LIVE");
const SUPABASE_URL = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

if (!STRIPE_SECRET_KEY_LIVE.startsWith("sk_live_")) {
  console.error("✗ STRIPE_SECRET_KEY_LIVE no parece una clave live (sk_live_…). Abortando.");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY_LIVE, { apiVersion: STRIPE_API_VERSION });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Contadores y avisos para el reporte final.
const stats = {
  productsCreated: 0,
  productsUpdated: 0,
  pricesCreated: 0,
  pricesExisting: 0,
  imageWarnings: [],
};

// Construye las URLs absolutas de imágenes (Stripe admite hasta 8).
function imageUrls(images) {
  if (!Array.isArray(images)) return [];
  return images
    .filter((p) => typeof p === "string" && p.length > 0)
    .slice(0, 8)
    .map((p) => (p.startsWith("http") ? p : `${IMAGE_BASE_URL}${p}`));
}

// ¿El error de Stripe se debe a una imagen no descargable?
function isImageError(err) {
  const msg = (err && err.message ? err.message : "").toLowerCase();
  return (
    (err && err.param === "images") ||
    msg.includes("image") ||
    msg.includes("url") && msg.includes("not")
  );
}

async function abortIfNotLive() {
  const bal = await stripe.balance.retrieve();
  if (bal.livemode !== true) {
    console.error("✗ La cuenta Stripe NO está en livemode. Abortando.");
    process.exit(1);
  }
}

async function syncProduct(product) {
  const images = imageUrls(product.images);
  const baseParams = {
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

  let stripeProductId = product.stripe_product_id_live;

  // Helper que ejecuta create/update con reintento sin imágenes.
  async function run(withImages) {
    const params = { ...baseParams };
    if (withImages && images.length > 0) params.images = images;
    if (stripeProductId) {
      await stripe.products.update(stripeProductId, params);
      return "updated";
    }
    const created = await stripe.products.create(params);
    stripeProductId = created.id;
    return "created";
  }

  let action;
  try {
    action = await run(true);
  } catch (err) {
    if (images.length > 0 && isImageError(err)) {
      stats.imageWarnings.push(`${product.slug}: imagen rechazada por Stripe (${err.message}). Producto creado SIN imágenes.`);
      console.warn(`  ⚠ ${product.slug}: imagen no aceptada, reintentando sin imágenes…`);
      action = await run(false);
    } else {
      throw err;
    }
  }

  if (action === "created") {
    const { error } = await supabase
      .from("products")
      .update({ stripe_product_id_live: stripeProductId })
      .eq("id", product.id);
    if (error) throw new Error(`Supabase update products(${product.slug}): ${error.message}`);
    stats.productsCreated += 1;
    console.log(`  ✓ product creado:    ${product.slug} (${stripeProductId})`);
  } else {
    stats.productsUpdated += 1;
    console.log(`  ↻ product actualizado: ${product.slug} (${stripeProductId})`);
  }
  return stripeProductId;
}

async function syncVariant(product, variant, stripeProductId) {
  if (variant.stripe_price_id_live) {
    stats.pricesExisting += 1;
    console.log(`    · price ya existe:  ${variant.sku} (${variant.stripe_price_id_live})`);
    return variant.stripe_price_id_live;
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
    .update({ stripe_price_id_live: price.id })
    .eq("id", variant.id);
  if (error) throw new Error(`Supabase update variants(${variant.sku}): ${error.message}`);
  stats.pricesCreated += 1;
  console.log(`    ✓ price creado:     ${variant.sku} (${price.id}) → €${(product.price_cents / 100).toFixed(2)}`);
  return price.id;
}

async function main() {
  console.log("→ Sincronizando catálogo Supabase → Stripe (LIVE)\n");
  await abortIfNotLive();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, category, price_cents, stripe_product_id_live, images, active, variants(id, size, sku, stripe_price_id_live)"
    )
    .order("category", { ascending: true })
    .order("slug", { ascending: true });
  if (error) throw new Error(`Supabase select products: ${error.message}`);

  for (const product of products) {
    console.log(`• ${product.name}`);
    const stripeProductId = await syncProduct(product);
    const variants = product.variants || [];
    const SIZE_ORDER = { XS: 0, S: 1, M: 2, L: 3 };
    variants.sort((a, b) => (SIZE_ORDER[a.size] ?? 9) - (SIZE_ORDER[b.size] ?? 9));
    for (const variant of variants) {
      await syncVariant(product, variant, stripeProductId);
    }
  }

  console.log("\n──────── RESUMEN ────────");
  console.log(`Products creados:      ${stats.productsCreated}`);
  console.log(`Products actualizados: ${stats.productsUpdated}`);
  console.log(`Prices creados:        ${stats.pricesCreated}`);
  console.log(`Prices ya existentes:  ${stats.pricesExisting}`);
  if (stats.imageWarnings.length > 0) {
    console.log(`\n⚠ Avisos de imágenes (${stats.imageWarnings.length}):`);
    stats.imageWarnings.forEach((w) => console.log(`  - ${w}`));
  } else {
    console.log("Imágenes:              sin errores");
  }

  // Verificación contra Stripe live.
  const stripeProducts = await stripe.products.list({ limit: 100, active: true });
  const stripePrices = await stripe.prices.list({ limit: 100 });
  console.log(`\nStripe LIVE ahora: ${stripeProducts.data.length} products · ${stripePrices.data.length} prices.`);
}

main().catch((err) => {
  console.error("\n✗ Error en la sincronización LIVE:", err.message);
  process.exit(1);
});
