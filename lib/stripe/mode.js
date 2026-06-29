// Modo de Stripe: "test" | "live".
//
// Decide SÓLO qué columna de Supabase se lee para los IDs de Stripe. No es un
// secreto (no contiene claves), por eso lleva el prefijo NEXT_PUBLIC_ y puede
// usarse también en Client Components si hiciera falta.
//
// Sprint 7: el catálogo está duplicado en Supabase —
//   stripe_product_id / stripe_product_id_live
//   stripe_price_id   / stripe_price_id_live
// La columna sin sufijo tiene los IDs de TEST; la "_live" los de LIVE.
//
// El SWITCH a producción consiste en poner NEXT_PUBLIC_STRIPE_MODE=live (además
// de cambiar STRIPE_SECRET_KEY y NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY a sus
// valores live y el STRIPE_WEBHOOK_SECRET del endpoint live). Ver README.
//
// Por seguridad, cualquier valor distinto de "live" (incluida la ausencia de la
// variable) se interpreta como "test".
export const STRIPE_MODE = process.env.NEXT_PUBLIC_STRIPE_MODE === "live" ? "live" : "test";

export const PRICE_COLUMN = STRIPE_MODE === "live" ? "stripe_price_id_live" : "stripe_price_id";
export const PRODUCT_COLUMN = STRIPE_MODE === "live" ? "stripe_product_id_live" : "stripe_product_id";
