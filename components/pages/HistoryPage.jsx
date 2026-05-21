"use client";

import { useRoute } from "@/components/shared/useRoute";

export function HistoryPage() {
  // useRoute reservado por simetría con el legacy aunque no se usa aún;
  // se eliminará si tras Sprint 2/3 sigue sin consumirse.
  useRoute();
  return (
    <div style={{ padding: "40px 40px 80px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", marginBottom: 120 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Nuestra historia</div>
            <h1 className="vp-display" style={{ fontSize: "clamp(60px, 7vw, 120px)", color: "var(--vp-brown)", margin: 0, lineHeight: .9 }}>
              El estudio<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>de</span> Lucía.
            </h1>
          </div>
          <div style={{ width: "100%", height: 560, borderRadius: "300px 300px 4px 4px", overflow: "hidden", background: "var(--vp-cream-deep)" }}>
            <img src="/assets/capri-conjunto.jpeg" alt="Estampado Capri" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, fontSize: 18, color: "var(--vp-ink-soft)", lineHeight: 1.8, fontFamily: "var(--font-serif)", fontWeight: 300 }}>
          <p>Lucía Larrondobuno fundó Viena Pets porque no encontraba lo que buscaba: accesorios para perros con un diseño cuidado, pensados como pieza de moda y no como producto de tienda genérica.</p>
          <p>El proceso empieza en papel. Cada colección parte de un estampado original — un dibujo que se traduce después a tejido, herrajes y patronística adaptada al cuerpo del perro. La intención manda en cada decisión.</p>
          <p>Hoy Viena Pets es una marca de diseño de autor con sede en Madrid. Cada colección se produce en ediciones limitadas — porque la exclusividad es parte del valor, y porque hacer las cosas con cuidado lleva tiempo.</p>
        </div>
      </div>
    </div>
  );
}
