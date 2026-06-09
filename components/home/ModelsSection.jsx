"use client";

import Image from "next/image";
import { useState } from "react";
import { ModelSwatch } from "@/components/shared/ModelSwatch";
import { useRoute } from "@/components/shared/useRoute";
import { LQIP_CREAM } from "@/lib/lqip";

// Imágenes principales de cada modelo (webp editoriales)
const MODEL_HERO = {
  capri:  "/images/productos/capri-main.webp",
  peachy: "/images/productos/peachy-main.webp",
  daisy:  "/images/productos/daisy-main.webp",
};

export function ModelsSection({ models = [] }) {
  const { go } = useRoute();
  return (
    <section style={{ padding: "clamp(60px, 10vw, 140px) clamp(20px, 3vw, 40px) clamp(32px, 6vw, 80px)", position: "relative" }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto clamp(40px, 6vw, 80px)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 24,
      }}>
        <div>
          <div className="vp-eyebrow" style={{ marginBottom: 20 }}>— Edición limitada</div>
          <h2 className="vp-display" style={{ fontSize: "clamp(40px, 5.5vw, 92px)", color: "var(--vp-brown)", margin: 0, lineHeight: 1, maxWidth: 720 }}>
            Tres estampados,<br/><span className="vp-italic" style={{ fontStyle: "italic" }}>una firma</span>.
          </h2>
        </div>
        <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.65, maxWidth: 360, paddingBottom: 10 }}>
          Tres estampados originales de autor. Cada modelo es una pieza única: un diseño exclusivo que no encontrarás en ninguna otra marca.
        </p>
      </div>

      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
        gap: "clamp(24px, 3vw, 40px)",
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
  const heroSrc = MODEL_HERO[model.name?.toLowerCase()] ?? model.heroImg;

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", width: "100%" }}
    >
      {/* Contenedor 4:5 — ratio de ficha de producto */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        overflow: "hidden",
        background: "var(--vp-cream-soft)",
        flexShrink: 0,
        borderRadius: 2,
        boxShadow: "0 4px 24px rgba(42,29,18,.07)",
      }}>
        {heroSrc && (
          <Image
            fill
            src={heroSrc}
            alt={`Modelo ${model.name} — Viena Pets`}
            style={{
              objectFit: "cover",
              objectPosition: "top center",
              transform: hover ? "scale(1.03)" : "scale(1)",
              transition: "transform .8s cubic-bezier(.2,.7,.2,1)",
              opacity: hover ? 0 : 1,
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={LQIP_CREAM}
          />
        )}

        {/* Hover: swatch de color del modelo */}
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

      {/* Texto debajo de la imagen */}
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
