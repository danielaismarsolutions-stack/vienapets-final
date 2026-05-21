"use client";

// Wrapper de transición entre rutas. La key se regenera con cada cambio de
// pathname, lo que reinicia la animación CSS vpFadeIn definida en globals.css.
import { usePathname } from "next/navigation";

export function PageFade({ children }) {
  const pathname = usePathname();
  return (
    <div key={pathname} style={{ animation: "vpFadeIn .5s ease" }}>
      {children}
    </div>
  );
}
