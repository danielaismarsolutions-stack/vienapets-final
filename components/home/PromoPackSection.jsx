"use client";

import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";

export function PromoPackSection({ models = [] }) {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "60px 20px" : "100px 40px", background: "var(--vp-cream-soft)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: isMobile ? 24 : 80, alignItems: "center", marginBottom: 40 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-olive-deep)" }}>— Oferta de lanzamiento</div>
            <h2 className="vp-display" style={{ fontSize: "clamp(40px, 5vw, 80px)", color: "var(--vp-brown)", margin: 0, lineHeight: 1 }}>
              Lleva el conjunto<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>completo</span>.
            </h2>
          </div>
          <p style={{ fontSize: 17, color: "var(--vp-ink-soft)", lineHeight: 1.7, alignSelf: "center", maxWidth: 520 }}>
            El conjunto completo de la edición. Precio especial al llevar las tres piezas a juego.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 20 : 24 }}>
          {models.map((m) => {
            const packPrice = m.priceConjunto;
            if (packPrice == null) return null;
            const slug = m.slugs?.conjunto ?? m.slugs?.arnes ?? m.id;
            return (
              <article key={m.id} onClick={() => go(`/producto/${slug}`)} style={{ cursor: "pointer", background: "var(--vp-paper)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ aspectRatio: "4/5", background: "var(--vp-cream)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <img src={m.heroImg} alt={`Conjunto ${m.name}`} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: 16 }} />
                </div>
                <div>
                  <div className="vp-serif" style={{ fontSize: 24, color: "var(--vp-brown)" }}>Conjunto <span className="vp-italic" style={{ fontStyle: "italic" }}>{m.name}</span></div>
                  <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 4, letterSpacing: ".08em" }}>Arnés + correa + portabolsas</div>
                  <div style={{ marginTop: 12 }}>
                    <span className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)" }}>€{packPrice.toFixed(2)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="vp-btn olive" onClick={() => go("/tienda?cat=conjuntos")}>
            Ver todos los conjuntos <Icon.Arrow style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </section>
  );
}
