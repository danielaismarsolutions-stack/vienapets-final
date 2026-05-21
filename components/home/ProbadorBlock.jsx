"use client";

import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";

export function ProbadorBlock() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "60px 20px" : "100px 40px",
      background: "var(--vp-olive-soft)",
      position: "relative",
    }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 40 : 80,
        alignItems: "center",
      }}>
        <div>
          <div className="vp-eyebrow" style={{ color: "var(--vp-olive-deep)", marginBottom: 16 }}>
            ✨ Nuevo · Tecnología exclusiva
          </div>
          <h2 className="vp-display" style={{
            fontSize: "clamp(36px, 4.5vw, 64px)",
            color: "var(--vp-brown)",
            lineHeight: 1.05,
            margin: "0 0 24px 0",
          }}>
            Pruébalo <span className="vp-italic" style={{ color: "var(--vp-olive-deep)" }}>en tu perro</span><br/>
            antes de comprar.
          </h2>
          <p style={{
            fontSize: isMobile ? 15 : 17,
            color: "var(--vp-ink-soft)",
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 460,
          }}>
            Sube una foto de tu mascota y nuestra IA te muestra cómo le quedaría
            cada modelo. Tres pasos, resultado instantáneo.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 36 }}>
            {[
              { n: "01", t: "Sube una foto de tu perro", d: "Cualquier ángulo, fondo neutro funciona mejor" },
              { n: "02", t: "Elige el modelo", d: "Capri, Peachy o Daisy" },
              { n: "03", t: "Ve cómo le queda", d: "Resultado en segundos, listo para compartir" },
            ].map((step) => (
              <div key={step.n} style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: 18,
                alignItems: "start",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: "var(--vp-olive-deep)",
                  fontWeight: 500,
                  paddingTop: 2,
                }}>
                  {step.n}
                </div>
                <div>
                  <div className="vp-serif" style={{
                    fontSize: 19,
                    color: "var(--vp-brown)",
                    marginBottom: 4,
                  }}>
                    {step.t}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: "var(--vp-ink-muted)",
                  }}>
                    {step.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="vp-btn olive" onClick={() => go("/probador")}>
            Probar ahora →
          </button>
        </div>

        <div style={{
          position: "relative",
          aspectRatio: "1/1",
          background: "var(--vp-paper)",
          borderRadius: 4,
          padding: 24,
          boxShadow: "0 30px 80px rgba(74,107,58,.15)",
          maxWidth: isMobile ? "100%" : "none",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            height: "100%",
          }}>
            <div style={{
              background: "var(--vp-cream-soft)",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}>
              <div style={{
                position: "absolute",
                top: 12, left: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--vp-ink-muted)",
                background: "var(--vp-paper)",
                padding: "4px 10px",
              }}>
                Antes
              </div>
              <div style={{ fontSize: 80, paddingBottom: 30 }}>🐕</div>
            </div>
            <div style={{
              background: "var(--vp-olive-soft)",
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              border: "2px solid var(--vp-olive)",
            }}>
              <div style={{
                position: "absolute",
                top: 12, left: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--vp-olive-deep)",
                background: "var(--vp-paper)",
                padding: "4px 10px",
              }}>
                Después
              </div>
              <div style={{ fontSize: 80, paddingBottom: 30 }}>🐕‍🦺</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
