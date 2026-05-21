"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { VP_FAQ } from "@/lib/data";

export function FAQSection() {
  const [open, setOpen] = useState(0);
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "140px 40px" }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr",
        gap: isMobile ? 32 : 80,
      }}>
        <div style={isMobile ? {} : { position: "sticky", top: 120, alignSelf: "start" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 22 }}>— Preguntas</div>
          <h2 className="vp-display" style={{ fontSize: "clamp(36px, 4.5vw, 72px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
            Lo que suelen<br/>
            <span className="vp-italic" style={{ fontStyle: "italic" }}>preguntarnos</span>.
          </h2>
          <p style={{ fontSize: 14, color: "var(--vp-ink-soft)", marginTop: 20, lineHeight: 1.65 }}>
            ¿Tienes una duda concreta? <a style={{ borderBottom: "1px solid", cursor: "pointer" }}>Escríbenos</a>.
          </p>
        </div>
        <div>
          {VP_FAQ.map((f, i) => (
            <div key={i} style={{ borderTop: "1px solid rgba(74,46,28,.2)", padding: "24px 0" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", gap: 16 }}>
                <span className="vp-serif" style={{ fontSize: isMobile ? 18 : 22, color: "var(--vp-brown)", lineHeight: 1.3 }}>{f.q}</span>
                <span style={{ width: 24, height: 24, display: "grid", placeItems: "center", color: "var(--vp-brown)", transition: "transform .3s ease", transform: open === i ? "rotate(45deg)" : "rotate(0)", flexShrink: 0 }}>
                  <Icon.Plus style={{ width: 20, height: 20 }} />
                </span>
              </button>
              <div style={{ maxHeight: open === i ? 500 : 0, overflow: "hidden", transition: "max-height .4s ease" }}>
                <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 14, marginBottom: 0 }}>{f.a}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(74,46,28,.2)" }} />
        </div>
      </div>
    </section>
  );
}
