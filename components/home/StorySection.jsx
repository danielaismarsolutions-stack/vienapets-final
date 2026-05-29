"use client";

import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";

export function StorySection() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "140px 40px", background: "var(--vp-cream-soft)", marginTop: isMobile ? 0 : 60 }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr",
        gap: isMobile ? 40 : 80,
        alignItems: "center",
      }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", height: isMobile ? 380 : 520, borderRadius: 2, overflow: "hidden", background: "var(--vp-cream-soft)" }}>
            <img src="/assets/capri-conjunto.jpeg" alt="Estampado Capri" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
          <div style={{ position: "absolute", right: isMobile ? 16 : -40, bottom: isMobile ? -24 : -40, background: "var(--vp-brown)", color: "var(--vp-paper)", padding: isMobile ? "20px 24px" : "28px 32px", maxWidth: 220 }}>
            <div className="vp-display" style={{ fontSize: isMobile ? 40 : 56, lineHeight: .9 }}>Edición limitada</div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", marginTop: 8, opacity: .85 }}>Nueva colección · diseño de autor</div>
          </div>
        </div>
        <div>
          <div className="vp-eyebrow" style={{ marginBottom: 22 }}>— El estudio</div>
          <h2 className="vp-display" style={{ fontSize: "clamp(48px, 5vw, 86px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
            Cada pieza, <span className="vp-italic" style={{ fontStyle: "italic" }}>un dibujo</span>.
          </h2>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18, fontSize: 16, color: "var(--vp-ink-soft)", lineHeight: 1.75, maxWidth: 520 }}>
            <p>Lucía Larrondobuno buscaba algo que no existía: accesorios para perros con estampados de autor, pensados como moda. No lo encontró, así que lo creó.</p>
            <p>Viena Pets nace como una marca de diseño de autor: cada colección empieza con un estampado original de Lucía y se produce en ediciones limitadas. Cuidado en el detalle, exclusividad en el resultado.</p>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
            <div>
              <div className="vp-display" style={{ fontSize: 48, color: "var(--vp-brown)", lineHeight: 1 }}>03</div>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 6 }}>Modelos · edición limitada</div>
            </div>
            <div>
              <div className="vp-display" style={{ fontSize: 48, color: "var(--vp-brown)", lineHeight: 1 }}>Edición limitada</div>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 6 }}>Colección de temporada</div>
            </div>
            <div>
              <div className="vp-display" style={{ fontSize: 48, color: "var(--vp-brown)", lineHeight: 1 }}>0</div>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 6 }}>Plástico en envíos</div>
            </div>
          </div>
          <button className="vp-btn" style={{ marginTop: 40 }} onClick={() => go("/historia")}>Conoce a Lucía <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
        </div>
      </div>
    </section>
  );
}
