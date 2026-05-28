"use client";

import { VP_SIZES, VP_LEASH_SIZE } from "@/lib/data";

/**
 * Contenido reutilizable de la guía de tallas.
 * Consumidores: GuiaTallasPage (página /guia-de-tallas) y modal en ProductPage.
 *
 * Props:
 *  - variant: "page" | "modal"   — ajusta tamaños tipográficos y espaciados
 *  - onProbador?: () => void      — callback del CTA "Probador IA"
 *  - showCTA?: boolean            — muestra/oculta el CTA Probador (default true)
 *  - headingId?: string           — id del heading principal (para aria-labelledby del modal)
 */
export default function SizeGuide({ variant = "page", onProbador, showCTA = true, headingId }) {
  const isPage = variant === "page";
  const Heading = isPage ? "h1" : "h3";
  const cellPad = isPage ? "18px 16px" : "16px 14px";
  const thPad   = isPage ? "14px 16px" : "12px 14px";

  return (
    <div>
      <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Guía de tallas</div>

      <Heading
        id={headingId}
        className="vp-display"
        style={{
          fontSize: isPage ? "clamp(40px, 6vw, 80px)" : 36,
          color: "var(--vp-brown)",
          margin: isPage ? "0 0 24px 0" : "0 0 28px",
          lineHeight: isPage ? .95 : 1,
        }}
      >
        Encuentra {isPage ? "la" : "su"} talla{" "}
        <span className="vp-italic" style={{ fontStyle: "italic" }}>exacta</span>.
      </Heading>

      {isPage && (
        <p style={{ fontSize: 16, color: "var(--vp-ink-soft)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
          Mide el contorno del pecho de tu perro justo detrás de las patas delanteras y el cuello en su punto más ancho. Si queda entre dos tallas, recomendamos la mayor por comodidad.
        </p>
      )}

      <div style={{ overflowX: "auto", marginBottom: isPage ? 32 : 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", ...(isPage ? { minWidth: 480 } : {}) }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--vp-brown)" }}>
              {["Talla", "Ancho cinta", "Cuello", "Pecho"].map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: thPad, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VP_SIZES.map((s) => (
              <tr key={s.size} style={{ borderBottom: "1px solid rgba(74,46,28,.12)" }}>
                <td style={{ padding: cellPad }}><span className="vp-serif" style={{ fontSize: isPage ? 24 : 22, color: "var(--vp-brown)" }}>{s.size}</span></td>
                <td style={{ padding: cellPad, fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.webbing}</td>
                <td style={{ padding: cellPad, fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.neck}</td>
                <td style={{ padding: cellPad, fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.chest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        ...(isPage
          ? { padding: 20, marginBottom: 24 }
          : { marginTop: 24, padding: 16 }),
        background: "var(--vp-cream-soft)",
        fontSize: isPage ? 14 : 13,
        color: "var(--vp-ink-soft)",
        lineHeight: isPage ? 1.7 : 1.65,
      }}>
        <b style={{ color: "var(--vp-brown)" }}>Correa:</b> talla única — ancho de cinta {VP_LEASH_SIZE.webbing}, longitud total {VP_LEASH_SIZE.length}.<br/>
        <b style={{ color: "var(--vp-brown)" }}>Portabolsas:</b> talla única.
      </div>

      {showCTA && onProbador && (
        <div style={{
          ...(isPage
            ? { padding: 24 }
            : { marginTop: 24, padding: 16 }),
          background: "var(--vp-olive-soft)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: isPage ? 16 : 12,
        }}>
          <div style={{ fontSize: isPage ? 15 : 14, color: "var(--vp-brown)" }}>
            <b>{isPage ? "¿Aún tienes dudas?" : "¿Prefieres probarlo virtualmente?"}</b><br/>
            <span style={{ fontSize: isPage ? 14 : 13, color: "var(--vp-ink-soft)" }}>
              {isPage
                ? "Sube una foto de tu perro y prueba virtualmente cómo le queda."
                : "Sube una foto de tu perro y comprueba cómo le queda."}
            </span>
          </div>
          <button className="vp-btn olive" onClick={onProbador}>✦ Probador IA →</button>
        </div>
      )}
    </div>
  );
}
