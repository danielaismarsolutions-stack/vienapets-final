import "server-only";

// Cliente Stripe server-side. Usa STRIPE_SECRET_KEY — NUNCA debe llegar al
// navegador (CLAUDE.md §8). `server-only` hace fallar el build si se importa
// desde un Client Component.
//
// Sólo se usa desde Route Handlers (app/api/checkout/*). Stripe Checkout es
// hosted (CLAUDE.md §8: prohibido Stripe Elements).
import Stripe from "stripe";

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
