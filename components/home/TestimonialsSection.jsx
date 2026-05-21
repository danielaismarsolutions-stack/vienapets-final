import { Icon } from "@/components/shared/Icon";

// Reseñas reales aún no disponibles (Directiva Ómnibus prohíbe inventarlas).
// Este bloque comunica el estado pre-drop. Se sustituye por reseñas
// verificadas tras junio 2026.
export function TestimonialsSection() {
  return (
    <section style={{ padding: "120px 40px", background: "var(--vp-brown)", color: "var(--vp-paper)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <div className="vp-eyebrow" style={{ color: "var(--vp-paper)", opacity: .7, marginBottom: 28 }}>— Comunidad #vienapets</div>
        <h2 className="vp-display" style={{ fontSize: "clamp(40px, 5vw, 72px)", color: "var(--vp-paper)", margin: 0, lineHeight: 1.05 }}>
          Sé el <span className="vp-italic" style={{ fontStyle: "italic" }}>primero</span><br/>en probarnos.
        </h2>
        <p style={{ fontSize: 16, color: "var(--vp-paper)", opacity: .85, marginTop: 28, lineHeight: 1.7, maxWidth: 560, margin: "28px auto 0" }}>
          Los testimonios de nuestra comunidad aparecerán aquí cuando lleguen las primeras piezas a sus perros. Apúntate a la newsletter y entérate del drop antes que nadie.
        </p>
        <div style={{ marginTop: 36, fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "var(--vp-paper)", opacity: .7 }}>
          Drop · Junio 2026
        </div>
      </div>

      <Icon.Paw style={{ position: "absolute", top: 50, left: 40, width: 44, height: 44, color: "var(--vp-paper)", opacity: .07 }} />
      <Icon.Paw style={{ position: "absolute", bottom: 80, right: 60, width: 60, height: 60, color: "var(--vp-paper)", opacity: .07 }} />
      <Icon.Paw style={{ position: "absolute", top: 120, right: 120, width: 32, height: 32, color: "var(--vp-paper)", opacity: .08 }} />
    </section>
  );
}
