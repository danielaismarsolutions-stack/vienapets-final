"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { LQIP_CREAM } from "@/lib/lqip";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useProbadorState } from "./ProbadorIA/useProbadorState";
import { EmailGateForm } from "./ProbadorIA/EmailGateForm";
import { PhotoUploader } from "./ProbadorIA/PhotoUploader";
import { ResultDisplay } from "./ProbadorIA/ResultDisplay";

// Imagen de preview en panel derecho por modelo (antes de generar)
const MODEL_PREVIEW_IMG = {
  capri: "/images/productos/capri-main.webp",
  peachy: "/images/productos/peachy-main.webp",
  daisy: "/images/productos/daisy-main.webp",
};

export function ProbadorPage() {
  const isMobile = useIsMobile();
  const { state, dispatch } = useProbadorState();
  const { phase, selectedModel, email, remainingUses, imageBase64, previewObjectUrl, errorMessage } = state;

  // Precios / slugs de arneses cargados desde Supabase
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const sb = getBrowserSupabase();
        const { data } = await sb
          .from("products")
          .select("slug, price_cents, model")
          .eq("category", "arnes")
          .in("model", ["capri", "peachy", "daisy"]);
        if (!data) return;
        const map = {};
        for (const p of data) {
          if (p.model) map[p.model] = { price: p.price_cents, slug: p.slug };
        }
        setProductMap(map);
      } catch {
        // Sin red: CTA de compra permanece oculta silenciosamente
      }
    }
    fetchProducts();
  }, []);

  // Revocar objectURL al desmontar (limpieza de memoria)
  const previewRef = useRef(previewObjectUrl);
  previewRef.current = previewObjectUrl;
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectModel = (model) => {
    // Solo se puede cambiar modelo en fases tempranas
    if (["idle", "model_selected", "gate_pending"].includes(phase)) {
      dispatch({ type: "SELECT_MODEL", model });
    }
  };

  const handleGateOk = ({ email: e, remainingUses: r }) => {
    dispatch({ type: "GATE_OK", email: e, remainingUses: r });
  };

  const handleQuotaExhausted = (msg) => {
    dispatch({ type: "SET_QUOTA_EXHAUSTED", message: msg });
  };

  const handleGenerateOk = ({ imageBase64: b64, remainingUses: r }) => {
    dispatch({ type: "GENERATE_OK", imageBase64: b64, remainingUses: r });
  };

  const handleGenerateError = (msg) => {
    dispatch({ type: "GENERATE_ERROR", message: msg });
  };

  const handleRetry = () => {
    dispatch({ type: "RESET_TO_GATE" });
  };

  const scrollToModels = () => {
    document.getElementById("modelos")?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Derivados de fase ──────────────────────────────────────────────────────

  const isLoadingGate = phase === "gate_pending";
  const isGenerating = phase === "generating";
  const isLoading = isLoadingGate || isGenerating;

  const showModelSelector = ["idle", "model_selected", "gate_pending"].includes(phase);
  const showModelLocked = ["gate_passed", "generating", "result", "quota_exhausted"].includes(phase);

  const showEmailGate = phase === "model_selected" || phase === "gate_pending";
  const showUploader = phase === "gate_passed" || phase === "generating";
  const showResult = phase === "result" && !!imageBase64;
  const showQuota = phase === "quota_exhausted";

  const currentProduct = selectedModel ? productMap[selectedModel] : null;

  return (
    <div style={{ background: "var(--vp-cream)", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section style={{
        padding: isMobile ? "48px 20px 36px" : "80px 40px 60px",
        background: "var(--vp-olive-soft)",
        textAlign: "center",
      }}>
        <div className="vp-eyebrow" style={{ color: "var(--vp-olive-deep)", marginBottom: 16 }}>
          ✨ Tecnología exclusiva · Impulsado por IA
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
          Hasta 3 visualizaciones gratuitas.
        </p>
      </section>

      {/* ── Flujo principal ── */}
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

          {/* ════ PANEL IZQUIERDO ════ */}
          <div>

            {/* PASO 1 */}
            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-brown)" }}>
              Paso 1 · Elige un modelo
            </div>

            {showModelLocked && selectedModel ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "var(--vp-paper)",
                border: "1px solid var(--vp-olive)",
                marginBottom: 32,
              }}>
                <span className="vp-serif" style={{
                  fontSize: 20,
                  color: "var(--vp-brown)",
                  textTransform: "capitalize",
                }}>
                  {selectedModel}
                </span>
                <button
                  onClick={() => dispatch({ type: "RESET_ALL" })}
                  className="vp-btn ghost small"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 40,
              }}>
                {["capri", "peachy", "daisy"].map((id) => (
                  <button
                    key={id}
                    onClick={() => handleSelectModel(id)}
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
                    }}
                  >
                    {id}
                  </button>
                ))}
              </div>
            )}

            {/* PASO 2 */}
            <div>
              <div className="vp-eyebrow" style={{
                marginBottom: 16,
                color: "var(--vp-brown)",
                opacity: phase === "idle" ? 0.35 : 1,
                transition: "opacity 0.3s ease",
              }}>
                Paso 2 ·{" "}
                {showEmailGate ? "Introduce tu email" : "Sube una foto"}
              </div>

              {/* Placeholder cuando idle */}
              {phase === "idle" && (
                <div style={{
                  border: "2px dashed var(--vp-olive-muted)",
                  padding: "60px 30px",
                  textAlign: "center",
                  background: "var(--vp-paper)",
                  opacity: 0.35,
                  pointerEvents: "none",
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12, color: "var(--vp-olive-deep)" }}>📷</div>
                  <div className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>
                    Elige primero un modelo
                  </div>
                </div>
              )}

              {/* Email gate */}
              {showEmailGate && (
                <EmailGateForm
                  modelo={selectedModel}
                  onGateOk={handleGateOk}
                  onQuotaExhausted={handleQuotaExhausted}
                  isLoading={isLoading}
                />
              )}

              {/* Uploader — gate_passed y generating */}
              {showUploader && (
                <>
                  <PhotoUploader
                    email={email}
                    modelo={selectedModel}
                    remainingUses={remainingUses ?? 0}
                    onGenerateOk={handleGenerateOk}
                    onQuotaExhausted={handleQuotaExhausted}
                    onGenerateError={handleGenerateError}
                  />
                  {errorMessage && (
                    <div style={{
                      marginTop: 12,
                      padding: "12px 16px",
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                      color: "#B91C1C",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}>
                      {errorMessage}
                    </div>
                  )}
                  <div style={{
                    marginTop: 16,
                    padding: "14px 20px",
                    background: "var(--vp-cream-soft)",
                    fontSize: 12,
                    color: "var(--vp-ink-soft)",
                    lineHeight: 1.65,
                  }}>
                    Tu foto se envía cifrada a Google (EE.UU.) bajo Cláusulas Contractuales Tipo únicamente
                    para generar la visualización. No la guardamos. La visualización es orientativa: para elegir
                    talla consulta siempre nuestra{" "}
                    <a href="/guia-tallas" style={{ color: "var(--vp-olive-deep)", textDecoration: "underline" }}>
                      guía de medidas
                    </a>.
                  </div>
                </>
              )}

              {/* Fase result: uploader compacto para probar otra foto */}
              {showResult && (
                <div style={{ padding: "16px 0" }}>
                  <div style={{
                    fontSize: 13,
                    color: "var(--vp-ink-muted)",
                    marginBottom: 12,
                  }}>
                    {remainingUses > 0
                      ? `Te quedan ${remainingUses} prueba${remainingUses === 1 ? "" : "s"}`
                      : "Has agotado tus pruebas"}
                  </div>
                  {remainingUses > 0 && (
                    <button onClick={handleRetry} className="vp-btn ghost small">
                      Probar con otra foto
                    </button>
                  )}
                </div>
              )}

              {/* Quota exhausted en panel izquierdo */}
              {showQuota && (
                <div style={{
                  padding: "24px 20px",
                  background: "var(--vp-cream-soft)",
                  textAlign: "center",
                }}>
                  <div className="vp-serif" style={{
                    fontSize: 20,
                    color: "var(--vp-brown)",
                    marginBottom: 8,
                  }}>
                    Has agotado tus 3 visualizaciones.
                  </div>
                  <p style={{ fontSize: 14, color: "var(--vp-ink-soft)", marginBottom: 20 }}>
                    ¿Listo para elegir el tuyo?
                  </p>
                  <button onClick={scrollToModels} className="vp-btn olive">
                    Ver modelos →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ════ PANEL DERECHO ════ */}
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-brown)" }}>
              Paso 3 · Resultado
            </div>

            {/* Skeleton / spinner durante carga */}
            {isLoading && (
              <div style={{
                aspectRatio: isMobile ? "3/4" : "4/5",
                background: "var(--vp-cream-soft)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                border: "1px solid rgba(74,46,28,.1)",
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  border: "3px solid var(--vp-olive-muted)",
                  borderTopColor: "var(--vp-olive)",
                  borderRadius: "50%",
                  animation: "vp-spin 0.9s linear infinite",
                }} />
                <div style={{
                  fontSize: 13,
                  color: "var(--vp-ink-muted)",
                  textAlign: "center",
                  maxWidth: 220,
                  lineHeight: 1.5,
                }}>
                  {isLoadingGate
                    ? "Verificando email…"
                    : "Generando visualización… esto puede tardar hasta 30 segundos"}
                </div>
              </div>
            )}

            {/* Resultado generado por IA */}
            {showResult && (
              <>
                <ResultDisplay
                  imageBase64={imageBase64}
                  modelo={selectedModel}
                  productPrice={currentProduct?.price ?? null}
                  productSlug={currentProduct?.slug ?? null}
                  onRetry={handleRetry}
                />
                <div style={{
                  marginTop: 12,
                  padding: "14px 20px",
                  background: "var(--vp-cream-soft)",
                  fontSize: 12,
                  color: "var(--vp-ink-soft)",
                  lineHeight: 1.65,
                }}>
                  Visualización orientativa generada con IA. La textura final del producto puede variar respecto a la imagen.
                </div>
              </>
            )}

            {/* Quota exhausted en panel derecho */}
            {showQuota && !isLoading && (
              <div style={{
                aspectRatio: isMobile ? "3/4" : "4/5",
                background: "var(--vp-cream-soft)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 32,
                gap: 16,
              }}>
                <div style={{ fontSize: 52 }}>✨</div>
                <div className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)" }}>
                  3 visualizaciones usadas
                </div>
                <p style={{ fontSize: 14, color: "var(--vp-ink-soft)", maxWidth: 240, margin: 0 }}>
                  Ya tienes una buena idea de cómo queda. ¿Lo hacemos tuyo?
                </p>
                {currentProduct?.slug && (
                  <a href={`/producto/${currentProduct.slug}`} className="vp-btn olive">
                    Ver arnés{" "}
                    <span style={{ textTransform: "capitalize" }}>{selectedModel}</span>
                    {" "}→
                  </a>
                )}
              </div>
            )}

            {/* Preview del modelo seleccionado (idle, model_selected, gate_passed sin foto subida aún) */}
            {!isLoading && !showResult && !showQuota && (
              <div style={{
                aspectRatio: isMobile ? "3/4" : "4/5",
                background: "var(--vp-cream-soft)",
                border: "1px solid rgba(74,46,28,.1)",
                position: "relative",
                overflow: "hidden",
              }}>
                <Image
                  fill
                  src={MODEL_PREVIEW_IMG[selectedModel ?? "capri"]}
                  alt={`Ejemplo real · ${selectedModel ?? "capri"}`}
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
                  Ejemplo real ·{" "}
                  <span style={{ textTransform: "capitalize" }}>{selectedModel ?? "capri"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
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
              {
                q: "¿Mis fotos se guardan?",
                a: "Tu foto se envía cifrada a Google (EE.UU.) únicamente para generar la visualización, bajo Cláusulas Contractuales Tipo. No la almacenamos en nuestros servidores.",
              },
              {
                q: "¿Funciona con cualquier raza?",
                a: "Sí, está optimizado para perros de tamaño pequeño, mediano y grande. Funciona mejor con fotos a la altura del perro, con fondo neutro y buena iluminación.",
              },
              {
                q: "¿Es 100% preciso?",
                a: "La visualización es orientativa. Los colores y texturas reales del producto pueden variar ligeramente. Consulta siempre nuestra guía de tallas para elegir la talla correcta.",
              },
              {
                q: "¿Cuántas visualizaciones tengo?",
                a: "Cada email tiene derecho a 3 visualizaciones gratuitas. Puedes probar distintas fotos o distintos modelos dentro de ese límite.",
              },
            ].map((f, i) => (
              <div key={i} style={{
                padding: "20px 24px",
                background: "var(--vp-cream-soft)",
                borderLeft: "3px solid var(--vp-olive)",
              }}>
                <div className="vp-serif" style={{ fontSize: 18, color: "var(--vp-brown)", marginBottom: 6 }}>
                  {f.q}
                </div>
                <div style={{ fontSize: 14, color: "var(--vp-ink-soft)", lineHeight: 1.65 }}>
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes vp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
