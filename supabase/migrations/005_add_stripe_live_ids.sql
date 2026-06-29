-- =====================================================================
-- Sprint 7 — Sync de catálogo a Stripe LIVE
-- =====================================================================
-- Las columnas stripe_product_id / stripe_price_id existentes contienen
-- IDs de Stripe TEST (Sprint 3). Para preparar el switch a producción sin
-- perder los IDs de test, guardamos los IDs de LIVE en columnas separadas.
-- La web sigue usando las columnas _test (stripe_product_id /
-- stripe_price_id) hasta el switch manual.
-- =====================================================================

alter table public.products add column if not exists stripe_product_id_live text;
alter table public.variants add column if not exists stripe_price_id_live  text;

comment on column public.products.stripe_product_id_live is
  'ID del Stripe Product en modo LIVE. Las columnas _live se rellenan con scripts/sync-products-to-stripe-live.js. stripe_product_id sigue conteniendo el ID de TEST.';
comment on column public.variants.stripe_price_id_live is
  'ID del Stripe Price en modo LIVE. stripe_price_id sigue conteniendo el ID de TEST.';
