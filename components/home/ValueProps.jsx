"use client";

import { Icon } from "@/components/shared/Icon";
import { useIsMobile } from "@/components/shared/useIsMobile";

export function ValueProps() {
  const isMobile = useIsMobile();
  const values = [
    { icon: Icon.Scissors, title: "Diseño de autor", text: "Cada estampado es una creación original de Lucía, fundadora de la marca." },
    { icon: Icon.Leaf,     title: "Edición limitada", text: "Series cortas y numeradas. Cuando se agotan, no se reeditan." },
    { icon: Icon.Truck,    title: "Envío gratuito", text: "Envío gratuito en pedidos desde 45 €. Preparamos cada pedido con mimo." },
    { icon: Icon.Heart,    title: "Ajuste a medida", text: "Cuatro tallas y múltiples puntos de ajuste para cada perro." },
  ];
  return (
    <section style={{ padding: isMobile ? "60px 20px 32px" : "100px 40px 40px", background: "var(--vp-cream)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 40 }}>
        {values.map((v, i) => (
          <div key={i} style={{ borderLeft: "1px solid rgba(74,46,28,.2)", paddingLeft: 24 }}>
            <v.icon style={{ width: 28, height: 28, color: "var(--vp-brown)", marginBottom: 16 }} />
            <div className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)", marginBottom: 8 }}>{v.title}</div>
            <div style={{ fontSize: 13, color: "var(--vp-ink-soft)", lineHeight: 1.6 }}>{v.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
