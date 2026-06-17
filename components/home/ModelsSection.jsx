"use client";

import Image from "next/image";
import { useState } from "react";
import { ModelSwatch } from "@/components/shared/ModelSwatch";
import { useRoute } from "@/components/shared/useRoute";
import { useTilt } from "@/lib/useTilt";
import { useReveal } from "@/lib/hooks/useReveal";
import { LQIP_CREAM } from "@/lib/lqip";
import styles from "./ModelsSection.module.css";

// Imágenes de estudio por modelo (recortes transparentes sobre crema de marca)
const MODEL_HERO = {
  capri:  "/images/productos/capri-conjunto.webp",
  peachy: "/images/productos/peachy-conjunto.webp",
  daisy:  "/images/productos/daisy-conjunto.webp",
};

export function ModelsSection({ models = [] }) {
  const { go } = useRoute();
  return (
    <section style={{ padding: "clamp(60px, 10vw, 140px) clamp(20px, 3vw, 40px) clamp(32px, 6vw, 80px)", position: "relative", overflowX: "clip" }}>
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
  const { ref, onMouseMove, onMouseLeave } = useTilt(9);
  const [revealRef, visible] = useReveal();
  const heroSrc = MODEL_HERO[model.name?.toLowerCase()] ?? model.heroImg;
  const delay = (index - 1) * 120;

  return (
    <article
      ref={revealRef}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); onMouseLeave(); }}
      onMouseMove={onMouseMove}
      className={`${styles.card} ${styles.reveal} ${visible ? styles.visible : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Contador de modelo: en flujo normal sobre la imagen en mobile, oculto en desktop */}
      <div className={styles.mobileCounter}>
        MODELO 0{index} / 03
      </div>

      {/* Imagen del modelo: 4/3 desktop, 1/1 mobile (CSS module) */}
      <div
        ref={ref}
        className={styles.imageWrap}
      >
        {heroSrc && (
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              fill
              src={heroSrc}
              alt={`Conjunto Viena Pets modelo ${model.name}`}
              style={{
                objectFit: "contain",
                inset: "2%",
                filter: "drop-shadow(0 14px 22px rgba(70,50,30,.18)) drop-shadow(0 4px 6px rgba(70,50,30,.12))",
                opacity: hover ? 0 : 1,
                transition: "opacity .5s ease",
                animation: "vpFloat 4s ease-in-out infinite",
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={LQIP_CREAM}
            />
          </div>
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

        <div className={styles.modelEyebrow} style={{ position: "absolute", top: 16, left: 16, background: "var(--vp-paper)", padding: "4px 10px" }}>
          MODELO 0{index} / 03
        </div>
      </div>

      {/* Texto debajo de la imagen */}
      <div className={styles.textBlock}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <div className={`vp-serif ${styles.modelName}`}>
            Modelo <span className="vp-italic" style={{ fontStyle: "italic" }}>{model.name}</span>
          </div>
          <div className={`vp-serif ${styles.modelPrice}`}>
            €{model.priceHarness}
          </div>
        </div>
        <div className={styles.modelSubtitle}>
          {model.subtitle}
        </div>
        {/* Elementos extra solo visibles en mobile */}
        <div className={styles.mobileSwatches}>
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: model.hex?.primary, display: "inline-block", border: "1px solid rgba(74,46,28,.15)" }} />
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: model.hex?.secondary, display: "inline-block", border: "1px solid rgba(74,46,28,.15)" }} />
        </div>
        <button className={`vp-btn ${styles.mobileCta}`} onClick={onClick}>
          DESCUBRIR {model.name.toUpperCase()}
        </button>
      </div>
    </article>
  );
}
