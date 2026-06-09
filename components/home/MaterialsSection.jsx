"use client";

import { useIsMobile } from "@/components/shared/useIsMobile";

export function MaterialsSection({ models = [] }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "140px 40px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 80, marginBottom: isMobile ? 48 : 80 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 22 }}>— Diseño de autor</div>
            <h2 className="vp-display" style={{ fontSize: "clamp(48px, 5vw, 86px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
              La diferencia está<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>en el diseño</span>.
            </h2>
          </div>
          <p style={{ fontSize: 16, color: "var(--vp-ink-soft)", lineHeight: 1.75, alignSelf: "center", maxWidth: 480 }}>
            Cada colección empieza con un estampado original exclusivo, traducido a tejido en ediciones limitadas. Tres patrones que no encontrarás en ninguna otra parte — y que, cuando se agotan, no se reeditan.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 32 : 32 }}>
          {models.map((m, i) => (
            <div key={m.id}>
              <div style={{ aspectRatio: "4/5", background: "var(--vp-cream-soft)", position: "relative", overflow: "hidden" }}>
                <img src={m.materialsImg} alt={`Estampado ${m.name}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
                <div style={{ position: "absolute", top: 16, left: 16, background: "var(--vp-paper)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", padding: "4px 10px", color: "var(--vp-brown)" }}>Estampado · 0{i + 1}</div>
                <div style={{ position: "absolute", bottom: 16, right: 16, background: "var(--vp-paper)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", padding: "4px 10px", color: "var(--vp-brown)", fontFamily: "var(--font-mono, monospace)" }}>
                  {m.pantones.join(" · ")}
                </div>
              </div>
              <div className="vp-serif" style={{ fontSize: 28, color: "var(--vp-brown)", marginTop: 22, letterSpacing: ".01em" }}>
                <span className="vp-italic" style={{ fontStyle: "italic" }}>{m.name}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 4, letterSpacing: ".08em" }}>{m.subtitle}</div>
              <div style={{ fontSize: 14, color: "var(--vp-ink-soft)", marginTop: 14, lineHeight: 1.65 }}>{m.description}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: isMobile ? 56 : 100, padding: isMobile ? "32px 24px" : "48px 56px", background: "var(--vp-cream-soft)", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: isMobile ? 24 : 48, alignItems: "center" }}>
          <div>
            <div className="vp-display" style={{ fontSize: isMobile ? 48 : 64, color: "var(--vp-brown)", lineHeight: 1 }}>03</div>
            <div style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 8 }}>Estampados originales</div>
          </div>
          <div>
            <div className="vp-display" style={{ fontSize: "clamp(16px, 1.5vw, 22px)", color: "var(--vp-brown)", lineHeight: 1.1, wordBreak: "break-word", overflowWrap: "anywhere", hyphens: "auto" }}>Edición limitada</div>
            <div style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 8 }}>Colección de temporada</div>
          </div>
          <div>
            <div className="vp-display" style={{ fontSize: isMobile ? 48 : 64, color: "var(--vp-brown)", lineHeight: 1 }}>0</div>
            <div style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 8 }}>Reediciones</div>
          </div>
          <div style={{ borderLeft: isMobile ? "none" : "1px solid rgba(74,46,28,.2)", paddingLeft: isMobile ? 0 : 32, gridColumn: isMobile ? "1 / -1" : undefined }}>
            <div className="vp-serif vp-italic" style={{ fontSize: isMobile ? 16 : 22, color: "var(--vp-brown)", lineHeight: 1.45, fontStyle: "italic" }}>
              &ldquo;No diseño accesorios. Diseño piezas para perros que tienen estilo propio.&rdquo;
            </div>
            <div style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 12 }}>— Viena Pets</div>
          </div>
        </div>
      </div>
    </section>
  );
}
