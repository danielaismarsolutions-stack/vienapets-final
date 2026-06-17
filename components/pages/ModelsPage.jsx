"use client";

import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import styles from "./ModelsPage.module.css";

// Fallback para cuando heroImg no viene de Supabase (imágenes ya existentes en el proyecto)
const MODEL_HERO = {
  capri:  "/images/productos/capri-conjunto.webp",
  peachy: "/images/productos/peachy-conjunto.webp",
  daisy:  "/images/productos/daisy-conjunto.webp",
};

export function ModelsPage({ models = [] }) {
  const { go } = useRoute();

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Modelos</div>
          <h1 className="vp-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", color: "var(--vp-brown)", margin: 0, lineHeight: 0.95 }}>
            Capri <span className="vp-italic" style={{ fontStyle: "italic" }}>·</span> Peachy <span className="vp-italic" style={{ fontStyle: "italic" }}>·</span> Daisy
          </h1>
        </div>

        <div className={styles.grid}>
          {models.map((m, i) => {
            const imgSrc = m.heroImg ?? MODEL_HERO[m.id] ?? null;
            const href = m.slugs?.conjunto ?? m.slugs?.arnes ?? m.id;
            return (
              <article key={m.id} className={styles.card} onClick={() => go(`/producto/${href}`)}>
                <div className={styles.imageWrap}>
                  {imgSrc && (
                    <img src={imgSrc} alt={`Conjunto Viena Pets modelo ${m.name}`} />
                  )}
                </div>
                <div className={styles.textBlock}>
                  <div className="vp-eyebrow" style={{ color: "var(--vp-ink-muted)" }}>
                    Modelo 0{i + 1} / 03
                  </div>
                  <h2 className={`vp-serif ${styles.modelName}`}>
                    Modelo <span className="vp-italic" style={{ fontStyle: "italic" }}>{m.name}</span>
                  </h2>
                  {m.subtitle && (
                    <p className={styles.subtitle}>{m.subtitle}</p>
                  )}
                  <div className={styles.swatches}>
                    {m.hex?.primary && (
                      <span className={styles.swatch} style={{ background: m.hex.primary }} />
                    )}
                    {m.hex?.secondary && (
                      <span className={styles.swatch} style={{ background: m.hex.secondary }} />
                    )}
                  </div>
                  <button
                    className={`vp-btn ${styles.cta}`}
                    onClick={(e) => { e.stopPropagation(); go(`/producto/${href}`); }}
                  >
                    DESCUBRIR {m.name?.toUpperCase()} <Icon.Arrow style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
