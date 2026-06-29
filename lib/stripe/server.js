import "server-only";

// Cliente Stripe server-side. Usa STRIPE_SECRET_KEY — NUNCA debe llegar al
// navegador (CLAUDE.md §8). `server-only` hace fallar el build si se importa
// desde un Client Component.
//
// Sólo se usa desde Route Handlers (app/api/checkout/*). Stripe Checkout es
// hosted (CLAUDE.md §8: prohibido Stripe Elements).
import Stripe from "stripe";

// Modo de la cuenta (test vs live) derivado de la propia clave secreta. Stripe
// asigna IDs de Price distintos en cada modo y el catálogo guarda ambos:
//   variants.stripe_price_id      → ID en modo TEST
//   variants.stripe_price_id_live → ID en modo LIVE
// Tanto el checkout (crear sesión) como el webhook (mapear line_item → variante)
// DEBEN usar la columna que corresponde al modo de la clave activa. Si no
// coinciden, Stripe rechaza con "No such price: …; a similar object exists in
// live mode, but a test mode key was used" y el pago no se inicia.
export const STRIPE_LIVE_MODE = (process.env.STRIPE_SECRET_KEY || "").startsWith("sk_live_");
export const STRIPE_PRICE_COLUMN = STRIPE_LIVE_MODE ? "stripe_price_id_live" : "stripe_price_id";

// Devuelve el ID de Price correcto para una fila de `variants` según el modo.
export function priceIdOf(variant) {
  return STRIPE_LIVE_MODE ? variant?.stripe_price_id_live : variant?.stripe_price_id;
}

let _stripe = null;

export function getStripe() {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY no definido");
  _stripe = new Stripe(key, {
    // Versión pinneada para comportamiento reproducible (igual que el script de sync).
    apiVersion: "2026-05-27.dahlia",
    appInfo: { name: "vienapets", url: "https://vienapets.com" },
  });
  return _stripe;
}
