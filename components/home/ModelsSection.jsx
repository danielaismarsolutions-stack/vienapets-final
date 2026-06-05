"use client";

import { useState } from "react";
import { ModelSwatch } from "@/components/shared/ModelSwatch";
import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";

export function ModelsSection({ models = [] }) {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "60px 20px 32px" : "140px 40px 80px", position: "relative" }}>
      <div style={{
        maxWidth: 1400,
        margin: isMobile ? "0 auto 40px" : "0 auto 80px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "end",
        gap: isMobile ? 24 : 0,
      }}>
        <div>
          <div className="vp-eyebrow" style={{ marginBottom: 20 }}>— Edición limitada</div>
          <h2 className="vp-display" style={{ fontSize: "clamp(40px, 5.5vw, 92px)", color: "var(--vp-brown)", margin: 0, lineHeight: 1, maxWidth: 720 }}>
            Tres estampados,<br/><span className="vp-italic" style={{ fontStyle: "italic" }}>una firma</span>.
          </h2>
        </div>
        <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.65, maxWidth: 360, paddingBottom: 10 }}>
          Tres estampados originales firmados por Lucía. Cada modelo es una pieza de autor: un diseño exclusivo que no encontrarás en ninguna otra marca.
        </p>
      </div>

      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
        gap: isMobile ? 32 : 40,
      }}>
        {models.map((m, i) => (
          <ModelCard key={m.id} model={m} index={i + 1} onClick={() => go(`/producto/${m.slugs?.conjunto ?? m.slugs?.arnes ?? m.id}`)} />
        ))}
      </div>
    </section>
  );
}

function ModelCard({ model, index, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", width: "100%" }}
    >
      {/* Imagen siempre full-width cuadrada — el grid exterior controla cuántas columnas hay */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1/1",
        overflow: "hidden",
        background: "var(--vp-cream-soft)",
        flexShrink: 0,
      }}>
        <img
          src={model.heroImg}
          alt={model.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
            transform: hover ? "scale(1.03)" : "scale(1)",
            transition: "transform .8s cubic-bezier(.2,.7,.2,1)",
            opacity: hover ? 0 : 1,
          }}
        />
        <div style={{ position: "absolute", inset: 0, opacity: hover ? 1 : 0, transition: "opacity .5s ease" }}>
          <ModelSwatch model={model} style={{ width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ background: "var(--vp-paper)", padding: "14px 20px", borderRadius: 2 }}>
              <span className="vp-eyebrow">Ver modelo {model.name}</span>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 16, left: 16, fontSize: 11, color: "var(--vp-brown)", background: "var(--vp-paper)", padding: "4px 10px", letterSpacing: ".2em", textTransform: "uppercase" }}>
          0{index} / 03
        </div>
      </div>

      {/* Texto siempre debajo de la imagen */}
      <div style={{ paddingTop: 16, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <div className="vp-serif" style={{ fontSize: "clamp(20px, 3vw, 28px)", color: "var(--vp-brown)", letterSpacing: ".01em" }}>
            Modelo <span className="vp-italic" style={{ fontStyle: "italic" }}>{model.name}</span>
          </div>
          <div className="vp-serif" style={{ fontSize: "clamp(15px, 2vw, 20px)", color: "var(--vp-brown)" }}>
            €{model.priceHarness}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 4, letterSpacing: ".08em" }}>
          {model.subtitle}
        </div>
      </div>
    </article>
  );
}
