"use client";

// Carrito persistente en localStorage. Migrado idéntico de legacy/scripts/shared.jsx.
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

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, count, subtotal, open, setOpen }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
