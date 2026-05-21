"use client";

import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { VP_SIZES, VP_LEASH_SIZE } from "@/lib/data";

export function GuiaTallasPage() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "40px 20px 80px" : "40px 40px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginBottom: 24 }}>
          <a onClick={() => go("/")} style={{ cursor: "pointer" }}>Inicio</a> · <span style={{ color: "var(--vp-brown)" }}>Guía de tallas</span>
        </div>

        <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Guía de tallas</div>
        <h1 className="vp-display" style={{
          fontSize: "clamp(40px, 6vw, 80px)",
          color: "var(--vp-brown)",
          margin: "0 0 24px 0",
          lineHeight: .95,
        }}>
          Encuentra la talla <span className="vp-italic" style={{ fontStyle: "italic" }}>exacta</span>.
        </h1>
        <p style={{ fontSize: 16, color: "var(--vp-ink-soft)", lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
          Mide el contorno del pecho de tu perro justo detrás de las patas delanteras y el cuello en su punto más ancho. Si queda entre dos tallas, recomendamos la mayor por comodidad.
        </p>

        <div style={{ overflowX: "auto", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--vp-brown)" }}>
                {["Talla", "Ancho cinta", "Cuello", "Pecho"].map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "14px 16px", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VP_SIZES.map((s) => (
                <tr key={s.size} style={{ borderBottom: "1px solid rgba(74,46,28,.12)" }}>
                  <td style={{ padding: "18px 16px" }}><span className="vp-serif" style={{ fontSize: 24, color: "var(--vp-brown)" }}>{s.size}</span></td>
                  <td style={{ padding: "18px 16px", fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.webbing}</td>
                  <td style={{ padding: "18px 16px", fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.neck}</td>
                  <td style={{ padding: "18px 16px", fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.chest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: 20, background: "var(--vp-cream-soft)", fontSize: 14, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginBottom: 24 }}>
          <b style={{ color: "var(--vp-brown)" }}>Correa:</b> talla única — ancho de cinta {VP_LEASH_SIZE.webbing}, longitud total {VP_LEASH_SIZE.length}.<br/>
          <b style={{ color: "var(--vp-brown)" }}>Portabolsas:</b> talla única.
        </div>

        <div style={{
          padding: 24,
          background: "var(--vp-olive-soft)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ fontSize: 15, color: "var(--vp-brown)" }}>
            <b>¿Aún tienes dudas?</b><br/>
            <span style={{ fontSize: 14, color: "var(--vp-ink-soft)" }}>Sube una foto de tu perro y prueba virtualmente cómo le queda.</span>
          </div>
          <button className="vp-btn olive" onClick={() => go("/probador")}>✦ Probador IA →</button>
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <button className="vp-btn ghost" onClick={() => go("/tienda")}>Ir a la tienda →</button>
        </div>
      </div>
    </div>
  );
}
