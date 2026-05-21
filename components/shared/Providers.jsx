"use client";

import { CartProvider } from "./CartProvider";

// Wrapper único para todos los providers de cliente. Centralizado para que
// app/layout.jsx siga siendo un Server Component.
export function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
