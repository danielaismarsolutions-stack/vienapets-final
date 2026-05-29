"use client";

import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";
import SizeGuide from "@/components/shared/SizeGuide";

export function GuiaTallasPage() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "40px 20px 80px" : "40px 40px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginBottom: 24 }}>
          <a onClick={() => go("/")} style={{ cursor: "pointer" }}>Inicio</a> · <span style={{ color: "var(--vp-brown)" }}>Guía de tallas</span>
        </div>

        <SizeGuide variant="page" onProbador={() => go("/probador")} />

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <button className="vp-btn ghost" onClick={() => go("/tienda")}>Ir a la tienda →</button>
        </div>
      </div>
    </div>
  );
}
