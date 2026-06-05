"use client";

import { useState } from "react";
import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";

export function ProbadorPage() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  const [selectedModel, setSelectedModel] = useState("capri");
  const [hasUpload, setHasUpload] = useState(false);

  return (
    <div style={{ background: "var(--vp-cream)", minHeight: "100vh" }}>
      <section style={{
        padding: isMobile ? "48px 20px 36px" : "80px 40px 60px",
        background: "var(--vp-olive-soft)",
        textAlign: "center",
      }}>
        <div className="vp-eyebrow" style={{ color: "var(--vp-olive-deep)", marginBottom: 16 }}>
          ✨ Tecnología exclusiva en fase beta
        </div>
        <h1 className="vp-display" style={{
          fontSize: "clamp(44px, 5vw, 72px)",
          color: "var(--vp-brown)",
          lineHeight: 1,
          margin: "0 0 20px 0",
        }}>
          Probador <span className="vp-italic" style={{ color: "var(--vp-olive-deep)" }}>virtual</span>
        </h1>
        <p style={{
          fontSize: 18,
          color: "var(--vp-ink-soft)",
          maxWidth: 560,
          margin: "0 auto",
          lineHeight: 1.6,
        }}>
          Sube una foto de tu perro y descubre cómo le quedan nuestros diseños.
          Tres modelos, resultados instantáneos.
        </p>
      </section>

      <section style={{
        padding: isMobile ? "40px 20px 60px" : "80px 40px",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 40 : 60,
          alignItems: "start",
        }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-brown)" }}>
              Paso 1 · Elige un modelo
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 40,
            }}>
              {["capri", "peachy", "daisy"].map((id) => (
                <button key={id}
                  onClick={() => setSelectedModel(id)}
                  style={{
                    padding: "20px 12px",
                    background: selectedModel === id ? "var(--vp-olive)" : "var(--vp-paper)",
                    color: selectedModel === id ? "var(--vp-paper)" : "var(--vp-brown)",
                    border: `1px solid ${selectedModel === id ? "var(--vp-olive)" : "rgba(74,46,28,.2)"}`,
                    cursor: "pointer",
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    transition: "all .25s ease",
                    textTransform: "capitalize",
                  }}>
                  {id}
                </button>
              ))}
            </div>

            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-brown)" }}>
              Paso 2 · Sube una foto
            </div>
            <div
              onClick={() => setHasUpload(true)}
              style={{
                border: "2px dashed var(--vp-olive-muted)",
                borderRadius: 4,
                padding: "60px 30px",
                textAlign: "center",
                cursor: "pointer",
                background: "var(--vp-paper)",
                transition: "border-color .25s ease, background .25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--vp-olive)";
                e.currentTarget.style.background = "var(--vp-olive-soft)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--vp-olive-muted)";
                e.currentTarget.style.background = "var(--vp-paper)";
              }}>
              <div style={{ fontSize: 48, marginBottom: 16, color: "var(--vp-olive-deep)" }}>📷</div>
              <div className="vp-serif" style={{
                fontSize: 20,
                color: "var(--vp-brown)",
                marginBottom: 8,
              }}>
                Haz clic para subir o arrastra una imagen
              </div>
              <div style={{
                fontSize: 13,
                color: "var(--vp-ink-muted)",
              }}>
                Formatos: PNG, JPG, WEBP · Máx. 10 MB
              </div>
            </div>

            <div style={{
              marginTop: 24,
              padding: "16px 20px",
              background: "var(--vp-cream-soft)",
              fontSize: 13,
              color: "var(--vp-ink-soft)",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}>
              Este probador está en fase beta y usa inteligencia artificial.
              Es posible que algunos resultados no sean perfectos. Estamos
              mejorándolo continuamente.
            </div>
          </div>

          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-brown)" }}>
              Paso 3 · Resultado
            </div>
            <div style={{
              aspectRatio: "1/1",
              background: hasUpload ? "var(--vp-olive-soft)" : "var(--vp-cream-soft)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              border: hasUpload ? "2px solid var(--vp-olive)" : "1px solid rgba(74,46,28,.1)",
              transition: "all .4s ease",
              position: "relative",
              overflow: "hidden",
            }}>
              {hasUpload ? (
                <>
                  <div style={{ fontSize: 100, marginBottom: 20 }}>🐕‍🦺</div>
                  <div className="vp-serif" style={{
                    fontSize: 22,
                    color: "var(--vp-brown)",
                    textAlign: "center",
                    padding: "0 30px",
                  }}>
                    Vista previa con modelo<br/>
                    <span className="vp-italic" style={{ color: "var(--vp-olive-deep)", textTransform: "capitalize" }}>
                      {selectedModel}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{
                  textAlign: "center",
                  color: "var(--vp-ink-muted)",
                  padding: "0 40px",
                }}>
                  <div style={{ fontSize: 60, marginBottom: 16, opacity: 0.4 }}>🖼️</div>
                  <div className="vp-serif" style={{ fontSize: 18 }}>
                    Sube una foto para ver el resultado
                  </div>
                </div>
              )}
            </div>

            {hasUpload && (
              <div style={{
                marginTop: 20,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}>
                <button className="vp-btn olive" onClick={() => go(`/producto/${selectedModel}`)}>
                  Comprar este modelo →
                </button>
                <button className="vp-btn ghost" onClick={() => setHasUpload(false)}>
                  Probar otra foto
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{
        padding: isMobile ? "48px 20px 72px" : "60px 40px 100px",
        background: "var(--vp-paper)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-olive-deep)", textAlign: "center" }}>
            Preguntas frecuentes
          </div>
          <h3 className="vp-display" style={{
            fontSize: 36,
            color: "var(--vp-brown)",
            textAlign: "center",
            margin: "0 0 40px 0",
          }}>
            Sobre el probador
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { q: "¿Mis fotos se guardan?", a: "No. Las imágenes se procesan en el momento y se eliminan automáticamente." },
              { q: "¿Funciona con cualquier raza?", a: "Sí, está optimizado para perros de tamaño pequeño, mediano y grande." },
              { q: "¿Es 100% preciso?", a: "Está en fase beta y mejora cada semana. Si el resultado no convence, puedes probar otra foto o contactarnos." },
            ].map((f, i) => (
              <div key={i} style={{
                padding: "20px 24px",
                background: "var(--vp-cream-soft)",
                borderLeft: "3px solid var(--vp-olive)",
              }}>
                <div className="vp-serif" style={{
                  fontSize: 18,
                  color: "var(--vp-brown)",
                  marginBottom: 6,
                }}>
                  {f.q}
                </div>
                <div style={{
                  fontSize: 14,
                  color: "var(--vp-ink-soft)",
                  lineHeight: 1.65,
                }}>
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
