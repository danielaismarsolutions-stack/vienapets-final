"use client";

// Singleton de Stripe.js para el navegador. Carga la publishable key (pública
// por diseño) una sola vez. Se usa para redirigir a Stripe Checkout hosted.
import { loadStripe } from "@stripe/stripe-js";

let _promise = null;

export function getStripeClient() {
  if (_promise) return _promise;
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no definido");
  _promise = loadStripe(key);
  return _promise;
}
