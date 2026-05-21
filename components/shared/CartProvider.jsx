"use client";

// Carrito persistente en localStorage. Migrado idéntico de legacy/scripts/shared.jsx.
// En Sprint 3 el checkout se conecta a Stripe Checkout; la lógica de pack 10%
// se mantiene en cliente para la vista del carrito.
import { createContext, useContext, useEffect, useState } from "react";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hidratación desde localStorage tras el primer render para evitar mismatch SSR.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vp_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("vp_cart", JSON.stringify(items));
  }, [items, hydrated]);

  const add = (item) => {
    setItems((prev) => {
      const cat = item.category || "unknown";
      const key = `${item.modelId}-${cat}-${item.size || ""}`;
      const existing = prev.find((p) => p.key === key);
      if (existing) return prev.map((p) => p.key === key ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...item, key, qty: 1 }];
    });
    setOpen(true);
  };
  const remove = (key) => setItems((prev) => prev.filter((p) => p.key !== key));
  const updateQty = (key, qty) => setItems((prev) => prev.map((p) => p.key === key ? { ...p, qty: Math.max(1, qty) } : p));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  // Descuento pack 10%: si en el carrito hay arnés + correa + portabolsas del mismo modelo,
  // se aplica 10% sobre el subtotal de esas 3 piezas. El qty considerado es el mínimo de las 3.
  // Los items con category="conjunto" ya vienen con el precio descontado y no se cuentan aquí.
  const packDiscount = (() => {
    const byModel = {};
    items.forEach((it) => {
      if (!it.category || it.category === "conjunto") return;
      if (!byModel[it.modelId]) byModel[it.modelId] = {};
      byModel[it.modelId][it.category] = it;
    });
    let discount = 0;
    Object.values(byModel).forEach((g) => {
      if (g.harness && g.leash && g.bag) {
        const minQty = Math.min(g.harness.qty, g.leash.qty, g.bag.qty);
        const packSubtotal = (g.harness.price + g.leash.price + g.bag.price) * minQty;
        discount += packSubtotal * 0.1;
      }
    });
    return Math.round(discount * 100) / 100;
  })();

  const totalAfterDiscount = Math.round((subtotal - packDiscount) * 100) / 100;

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, count, subtotal, packDiscount, totalAfterDiscount, open, setOpen }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
