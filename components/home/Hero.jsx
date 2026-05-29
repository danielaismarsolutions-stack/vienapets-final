"use client";

import { Icon } from "@/components/shared/Icon";
import { ModelSwatch } from "@/components/shared/ModelSwatch";
import { useRoute } from "@/components/shared/useRoute";

export function Hero({ model, models = [], heroStyle }) {
  const { go } = useRoute();

  if (heroStyle === "mosaic") {
    return <HeroMosaic models={models} />;
  }

  // SINGLE hero: foto editorial a la derecha + bloque editorial-comercial a la izquierda
  return (
    <section style={{
      position: "relative",
      padding: "60px 40px 80px",
      overflow: "hidden",
      background: "var(--vp-cream)",
    }}>
      <div style={{
        maxWidth: 1500,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: 80,
        alignItems: "center",
      }}>
        <div style={{ paddingLeft: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <img src="/assets/logo-viena-pets-oficial.png" alt="" style={{ height: 28, width: "auto", opacity: .9 }} />
            <span style={{ height: 1, flex: 1, maxWidth: 80, background: "var(--vp-olive-deep)", opacity: .35 }}></span>
            <span className="vp-eyebrow" style={{ color: "var(--vp-olive-deep)", fontSize: 10 }}>Madrid</span>
          </div>

          <h1 className="vp-display" style={{
            fontSize: "clamp(48px, 6vw, 84px)",
            color: "var(--vp-brown)",
            lineHeight: 1,
            margin: "0 0 28px 0",
            letterSpacing: "-0.02em",
          }}>
            Para perros con estilo<br/>
            y dueños con <span className="vp-italic" style={{ color: "var(--vp-olive-deep)" }}>buen gusto</span>.
          </h1>

          <p style={{
            fontSize: 17,
            color: "var(--vp-ink-soft)",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 0 40px 0",
          }}>
            Arneses, correas y portabolsas con diseños exclusivos firmados por Lucía.
            Diseñados en España, en ediciones limitadas.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            <button className="vp-btn olive" onClick={() => go("/tienda?cat=conjuntos")}>
              Conjuntos
            </button>
            <button className="vp-btn olive ghost" onClick={() => go("/tienda?cat=arneses")}>
              Arneses
            </button>
            <button className="vp-btn olive ghost" onClick={() => go("/tienda?cat=correas")}>
              Correas
            </button>
            <button className="vp-btn olive ghost" onClick={() => go("/tienda?cat=portabolsas")}>
              Portabolsas
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36, flexWrap: "wrap" }}>
            <button
              className="vp-btn"
              onClick={() => go("/probador")}
              style={{
                position: "relative",
                background: "var(--vp-brown)",
                color: "var(--vp-paper)",
                borderColor: "var(--vp-brown)",
                paddingRight: 22,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1, marginRight: 2 }}>✦</span>
              Probador IA
              <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1, marginLeft: 4 }}>→</span>
              <span style={{
                position: "absolute",
                top: -8,
                right: -10,
                background: "var(--vp-olive-deep)",
                color: "var(--vp-paper)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                padding: "3px 7px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                borderRadius: 2,
                lineHeight: 1,
              }}>
                Nuevo
              </span>
            </button>
            <span style={{
              fontSize: 12,
              color: "var(--vp-ink-muted)",
              letterSpacing: ".04em",
              maxWidth: 260,
              lineHeight: 1.45,
            }}>
              Sube una foto de tu perro y descubre cómo le queda cada modelo.
            </span>
          </div>

          <div style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            fontSize: 12,
            color: "var(--vp-ink-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            <span>✓ Envío gratuito desde 45 €</span>
            <span>✓ Diseñado en España</span>
            <span>✓ 15 días de devolución</span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{
            width: "100%",
            aspectRatio: "4/5",
            borderRadius: "var(--radius-arch)",
            background: "url(/assets/hero-dalmata.png) center/contain no-repeat, var(--vp-cream-deep)",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 30px 80px rgba(42,29,18,.12)",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(74,46,28,.10) 100%)",
            }} />
          </div>

          <div style={{
            position: "absolute",
            left: -40,
            bottom: 40,
            background: "var(--vp-paper)",
            padding: "22px 26px 22px 22px",
            borderRadius: 2,
            boxShadow: "0 24px 60px rgba(42,29,18,.16)",
            maxWidth: 320,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 16,
            alignItems: "center",
            borderTop: "3px solid var(--vp-olive)",
          }}>
            <img src="/assets/monograma-viena.png" alt="" style={{ width: 56, height: 56, objectFit: "contain", display: "block" }} />
            <div>
              <div className="vp-eyebrow" style={{ fontSize: 9, marginBottom: 6, color: "var(--vp-olive-deep)", letterSpacing: ".28em" }}>
                EDICIÓN LIMITADA
              </div>
              <div className="vp-serif" style={{
                fontSize: 15,
                color: "var(--vp-brown)",
                lineHeight: 1.35,
                fontStyle: "italic",
              }}>
                Diseño de autor · Edición limitada
              </div>
            </div>
          </div>

          <div style={{
            position: "absolute",
            top: -8,
            right: 8,
            fontFamily: "var(--font-display)",
            fontSize: 11,
            letterSpacing: ".42em",
            textTransform: "uppercase",
            color: "var(--vp-brown)",
            opacity: .55,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}>
            MADRID
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMosaic({ models = [] }) {
  const { go } = useRoute();
  return (
    <section style={{ padding: "30px 40px 60px" }}>
      <div style={{ maxWidth: 1600, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 16, alignItems: "stretch" }}>
        <div style={{ gridColumn: "1 / 3", padding: "60px 20px 40px" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 28 }}>— Primavera / Verano 2026</div>
          <h1 className="vp-display" style={{ fontSize: "clamp(72px, 9vw, 156px)", color: "var(--vp-brown)", margin: 0, lineHeight: 0.88 }}>
            Un paseo,<br/>
            <span style={{ fontStyle: "italic" }}>una</span> ceremonia.
          </h1>
        </div>

        <div style={{ gridRow: "1 / 3", height: 680, borderRadius: "280px 280px 4px 4px", overflow: "hidden", background: "var(--vp-cream-deep)" }}>
          <img src="/assets/hero-dalmata.png" alt="Viena" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
        </div>

        {models[0] && <div style={{ height: 260 }}><ModelSwatch model={models[0]} style={{ width: "100%", height: "100%", display: "block" }} /></div>}
        {models[1] && <div style={{ height: 260 }}><ModelSwatch model={models[1]} style={{ width: "100%", height: "100%", display: "block" }} /></div>}

        <div style={{ background: "var(--vp-brown)", color: "var(--vp-paper)", padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: 260 }}>
          <div>
            <div className="vp-eyebrow" style={{ color: "var(--vp-paper)", fontSize: 10 }}>Tres modelos · Tres historias</div>
            <p className="vp-serif" style={{ fontSize: 22, marginTop: 14, lineHeight: 1.35 }}>Capri, Peachy y Daisy. Cada uno pensado para un perro que no se parece a ningún otro.</p>
          </div>
          <button className="vp-btn ghost" style={{ color: "var(--vp-paper)", borderColor: "var(--vp-paper)", alignSelf: "flex-start" }} onClick={() => go("/tienda")}>
            Ver colección <Icon.Arrow style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
      <Ticker />
    </section>
  );
}

function Ticker() {
  const items = ["Diseños exclusivos firmados", "✶", "Diseñado en España", "✶", "Edición limitada", "✶", "Envío gratuito desde 45 €", "✶"];
  const row = [...items, ...items, ...items];
  return (
    <div style={{ marginTop: 80, borderTop: "1px solid rgba(74,46,28,.2)", borderBottom: "1px solid rgba(74,46,28,.2)", padding: "16px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 48, animation: "vpTicker 40s linear infinite", whiteSpace: "nowrap" }}>
        {row.map((t, i) => (
          <span key={i} style={{ fontSize: 13, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--vp-brown)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
