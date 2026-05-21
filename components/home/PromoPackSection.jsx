"use client";

import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";

export function PromoPackSection({ models = [] }) {
  const { go } = useRoute();
  return (
    <section style={{ padding: "100px 40px", background: "var(--vp-cream-soft)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "center", marginBottom: 56 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-olive-deep)" }}>— Oferta de lanzamiento</div>
            <h2 className="vp-display" style={{ fontSize: "clamp(40px, 5vw, 80px)", color: "var(--vp-brown)", margin: 0, lineHeight: 1 }}>
              Lleva el conjunto<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>completo</span>.
            </h2>
          </div>
          <p style={{ fontSize: 17, color: "var(--vp-ink-soft)", lineHeight: 1.7, alignSelf: "center", maxWidth: 520 }}>
            Arnés, correa y portabolsas a juego. Combina el set completo de cualquier modelo y aplicamos un <b style={{ color: "var(--vp-olive-deep)" }}>10% de descuento</b> automáticamente al carrito.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {models.map((m) => {
            const totalRaw = m.priceHarness + m.priceLeash + m.priceBag;
            const totalDiscounted = m.priceConjunto ?? Math.round(totalRaw * 0.9 * 100) / 100;
            const slug = m.slugs?.conjunto ?? m.slugs?.arnes ?? m.id;
            return (
              <article key={m.id} onClick={() => go(`/producto/${slug}`)} style={{ cursor: "pointer", background: "var(--vp-paper)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ aspectRatio: "4/5", background: "var(--vp-cream)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <img src={m.heroImg} alt={`Conjunto ${m.name}`} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: 16 }} />
                  <div style={{ position: "absolute", top: 12, right: 12, background: "var(--vp-olive)", color: "var(--vp-paper)", padding: "5px 10px", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>−10%</div>
                </div>
                <div>
                  <div className="vp-serif" style={{ fontSize: 24, color: "var(--vp-brown)" }}>Conjunto <span className="vp-italic" style={{ fontStyle: "italic" }}>{m.name}</span></div>
                  <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 4, letterSpacing: ".08em" }}>Arnés + correa + portabolsas</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 12 }}>
                    <span className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)" }}>€{totalDiscounted.toFixed(2)}</span>
                    <span style={{ fontSize: 13, color: "var(--vp-ink-muted)", textDecoration: "line-through" }}>€{totalRaw.toFixed(2)}</span>
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
