"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { LQIP_CREAM } from "@/lib/lqip";

export function ProbadorPage() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  const [selectedModel, setSelectedModel] = useState("capri");
  const [hasUpload, setHasUpload] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Revocar URL de objeto al desmontar para evitar fugas de memoria.
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setHasUpload(true);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setHasUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
            {/* Input real oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
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
                {hasUpload ? "Cambiar foto" : "Haz clic para elegir una imagen"}
              </div>
              <div style={{ fontSize: 13, color: "var(--vp-ink-muted)" }}>
                Formatos: PNG, JPG, WEBP · Máx. 10 MB
              </div>
            </div>

            <div style={{
              marginTop: 16,
              padding: "14px 20px",
              background: "var(--vp-cream-soft)",
              fontSize: 13,
              color: "var(--vp-ink-soft)",
              lineHeight: 1.6,
            }}>
              Tu foto no sale de tu dispositivo — la vista previa se genera localmente.
              El probador con IA está en preparación.
            </div>
          </div>

          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-brown)" }}>
              Paso 3 · Resultado
            </div>
            <div style={{
              aspectRatio: isMobile ? "3/4" : "4/5",
              background: "var(--vp-cream-soft)",
              borderRadius: 4,
              border: hasUpload ? "2px solid var(--vp-olive)" : "1px solid rgba(74,46,28,.1)",
              transition: "border-color .4s ease",
              position: "relative",
              overflow: "hidden",
            }}>
              {hasUpload && previewUrl ? (
                /* Preview de la foto del usuario */
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Vista previa de tu foto"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    background: "rgba(74,46,28,.72)",
                    color: "var(--vp-paper)",
                    padding: "12px 16px",
                    fontSize: 13,
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}>
                    Vista previa — el probador con IA llega pronto
                  </div>
                </>
              ) : !hasUpload ? (
                /* Sin upload: muestra el perro real del modelo elegido */
                <>
                  <Image
                    fill
                    src={`/images/productos/${selectedModel}-main.webp`}
                    alt={`Ejemplo real · ${selectedModel}`}
                    style={{ objectFit: "cover", objectPosition: "center 40%" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={LQIP_CREAM}
                  />
                  <div style={{
                    position: "absolute",
                    top: 12, left: 12,
                    background: "var(--vp-paper)",
                    padding: "4px 10px",
                    fontSize: 10,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    color: "var(--vp-brown)",
                  }}>
                    Ejemplo real · <span style={{ textTransform: "capitalize" }}>{selectedModel}</span>
                  </div>
                </>
              ) : null}
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
                <button className="vp-btn ghost" onClick={handleReset}>
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
              { q: "¿Mis fotos se guardan?", a: "No se suben a ningún servidor: la vista previa se genera en tu dispositivo. El probador con IA está en preparación." },
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
