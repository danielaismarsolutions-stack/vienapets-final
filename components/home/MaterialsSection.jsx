export function MaterialsSection({ models = [] }) {
  return (
    <section style={{ padding: "140px 40px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginBottom: 80 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 22 }}>— Diseño de autor</div>
            <h2 className="vp-display" style={{ fontSize: "clamp(48px, 5vw, 86px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
              La diferencia está<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>en el diseño</span>.
            </h2>
          </div>
          <p style={{ fontSize: 16, color: "var(--vp-ink-soft)", lineHeight: 1.75, alignSelf: "center", maxWidth: 480 }}>
            Cada colección empieza con un estampado original diseñado por Lucía, traducido a tejido en ediciones limitadas. Tres patrones que no encontrarás en ninguna otra parte — y que, cuando se agotan, no se reeditan.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
          {models.map((m, i) => (
            <div key={m.id}>
              <div style={{ aspectRatio: "4/5", background: "var(--vp-cream-soft)", position: "relative", overflow: "hidden" }}>
                <img src={m.materialsImg} alt={`Estampado ${m.name}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
                <div style={{ position: "absolute", top: 16, left: 16, background: "var(--vp-paper)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", padding: "4px 10px", color: "var(--vp-brown)" }}>Estampado · 0{i + 1}</div>
                <div style={{ position: "absolute", bottom: 16, right: 16, background: "var(--vp-paper)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", padding: "4px 10px", color: "var(--vp-brown)", fontFamily: "var(--font-mono, monospace)" }}>
                  {m.pantones.join(" · ")}
                </div>
              </div>
              <div className="vp-serif" style={{ fontSize: 28, color: "var(--vp-brown)", marginTop: 22, letterSpacing: ".01em" }}>
                <span className="vp-italic" style={{ fontStyle: "italic" }}>{m.name}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 4, letterSpacing: ".08em" }}>{m.subtitle}</div>
              <div style={{ fontSize: 14, color: "var(--vp-ink-soft)", marginTop: 14, lineHeight: 1.65 }}>{m.description}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 100, padding: "48px 56px", background: "var(--vp-cream-soft)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div className="vp-display" style={{ fontSize: 64, color: "var(--vp-brown)", lineHeight: 1 }}>03</div>
            <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 8 }}>Estampados originales · firmados por Lucía</div>
          </div>
          <div>
            <div className="vp-display" style={{ fontSize: 64, color: "var(--vp-brown)", lineHeight: 1 }}>SS26</div>
            <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 8 }}>Colección de temporada · Madrid</div>
          </div>
          <div>
            <div className="vp-display" style={{ fontSize: 64, color: "var(--vp-brown)", lineHeight: 1 }}>0</div>
            <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 8 }}>Reediciones · cuando se agota, descansa</div>
          </div>
          <div style={{ borderLeft: "1px solid rgba(74,46,28,.2)", paddingLeft: 32 }}>
            <div className="vp-serif vp-italic" style={{ fontSize: 22, color: "var(--vp-brown)", lineHeight: 1.35, fontStyle: "italic" }}>
              &ldquo;No diseño accesorios. Diseño piezas para perros que tienen estilo propio.&rdquo;
            </div>
            <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 12 }}>— Lucía Larrondobuno Verdejo, fundadora</div>
          </div>
        </div>
      </div>
    </section>
  );
}
