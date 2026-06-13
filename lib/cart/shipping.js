// Reglas de envío del Sprint 3, compartidas entre cliente (carrito) y servidor
// (API de checkout) para que el cálculo sea idéntico en ambos lados.
//
// Plano 5,90 € · gratis a partir de 60 €. Importes en céntimos (CLAUDE.md §7).
export const FREE_SHIPPING_THRESHOLD_CENTS = 6000;
export const FLAT_SHIPPING_CENTS = 590;

export function shippingCents(subtotalCents, hasItems = true) {
  if (!hasItems || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  return FLAT_SHIPPING_CENTS;
}
