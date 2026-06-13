"use client";

// Carrito persistente en localStorage (CLAUDE.md §4: carrito en localStorage,
// checkout invitado, sin registro de usuario).
//
// El precio se trabaja en céntimos como entero (price_cents) para los cálculos
// de pedido (CLAUDE.md §7). Se conserva `price` en EUR sólo para presentación
// en la UI ya existente. La lógica de envío vive aquí para que /carrito y el
// drawer muestren lo mismo que cobrará Stripe.
import { createContext, useContext, useEffect, useState } from "react";

const CartCtx = createContext(null);

// Clave versionada: al introducir variantId/price_cents invalidamos los
// carritos antiguos (formato 'vp_cart') que no llevaban esos campos.
const STORAGE_KEY = "vienapets-cart-v1";

// Reglas de envío (Sprint 3): plano 5,90 € · gratis a partir de 60 €.
export const FREE_SHIPPING_THRESHOLD_CENTS = 6000;
export const FLAT_SHIPPING_CENTS = 590;

// Céntimos de un item: price_cents manda; fallback desde price (EUR) por compat.
function itemCents(it) {
  if (typeof it.price_cents === "number") return it.price_cents;
  return Math.round((it.price ?? 0) * 100);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hidratación desde localStorage tras el primer render para evitar mismatch SSR.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  // Identidad de línea: el variantId es único por variante (talla incluida).
  // Fallback al esquema legacy (modelo-categoría-talla) si no viniera.
  const itemKey = (item) =>
    item.variantId || `${item.modelId}-${item.category || "unknown"}-${item.size || ""}`;

  const add = (item) => {
    const key = itemKey(item);
    const addQty = Math.max(1, item.quantity ?? 1);
    setItems((prev) => {
      const existing = prev.find((p) => p.key === key);
      if (existing) return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + addQty } : p));
      return [...prev, { ...item, key, qty: addQty }];
    });
    setOpen(true);
  };
  const remove = (key) => setItems((prev) => prev.filter((p) => p.key !== key));
  const updateQty = (key, qty) =>
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty: Math.max(1, qty) } : p)));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  // Subtotal en EUR (presentación, compat con UI existente).
  const subtotal = items.reduce((s, i) => s + (i.price ?? itemCents(i) / 100) * i.qty, 0);
  // Subtotal/envío/total en céntimos (fuente de verdad para el pedido).
  const subtotal_cents = items.reduce((s, i) => s + itemCents(i) * i.qty, 0);
  const shipping_cents =
    items.length === 0 || subtotal_cents >= FREE_SHIPPING_THRESHOLD_CENTS
      ? 0
      : FLAT_SHIPPING_CENTS;
  const total_cents = subtotal_cents + shipping_cents;

  return (
    <CartCtx.Provider
      value={{
        items,
        add,
        remove,
        updateQty,
        clear,
        count,
        subtotal,
        subtotal_cents,
        shipping_cents,
        total_cents,
        open,
        setOpen,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
