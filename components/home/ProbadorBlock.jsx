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
              <DogSilhouette color="var(--vp-ink-muted)" />
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
              <DogSilhouette color="var(--vp-brown)" withHarness />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Silueta SVG de perfil de perro — línea fina monocromática
// withHarness añade el trazo del arnés sobre el pecho para la card "Después"
function DogSilhouette({ color = "var(--vp-brown)", withHarness = false }) {
  return (
    <div style={{ paddingBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <svg
        viewBox="0 0 120 90"
        width="96"
        height="72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Cuerpo */}
        <ellipse cx="58" cy="56" rx="32" ry="22" stroke={color} strokeWidth="1.5" />
        {/* Cabeza */}
        <circle cx="92" cy="38" r="14" stroke={color} strokeWidth="1.5" />
        {/* Hocico */}
        <ellipse cx="103" cy="44" rx="7" ry="5" stroke={color} strokeWidth="1.2" />
        {/* Oreja caída */}
        <path d="M84 28 Q78 18 80 30" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Ojo */}
        <circle cx="96" cy="36" r="1.5" fill={color} />
        {/* Nariz */}
        <circle cx="108" cy="43" r="1.2" fill={color} />
        {/* Patas delanteras */}
        <line x1="76" y1="74" x2="76" y2="88" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="68" y1="74" x2="68" y2="88" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Patas traseras */}
        <line x1="40" y1="74" x2="40" y2="88" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="74" x2="32" y2="88" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Cola */}
        <path d="M26 48 Q12 36 18 28" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Arnés (solo en card "Después") */}
        {withHarness && (
          <>
            <path d="M44 44 Q58 36 74 44" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M54 44 L54 62" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <ellipse cx="54" cy="50" rx="12" ry="8" stroke={color} strokeWidth="1.5" fill="none" />
          </>
        )}
      </svg>
    </div>
  );
}
