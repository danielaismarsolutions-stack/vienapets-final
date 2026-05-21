// Viena Pets — "Moderna" variant: home with saturated colors, more DTC vibe
const { useState: _modS, useEffect: _modE } = React;

function HomePageModerna({ heroModelId }) {
  const { go } = useRoute();
  const model = VP_MODELS.find(m => m.id === heroModelId) || VP_MODELS[0];
  return (
    <>
      <HeroModerna model={model} />
      <BigMarquee />
      <ModelsModerna />
      <StoryModerna />
      <TestimonialsSection />
      <InstagramStrip />
    </>
  );
}

function HeroModerna({ model }) {
  const { go } = useRoute();
  return (
    <section style={{ padding: "20px 20px 40px" }}>
      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: model.hex.primary, minHeight: 640, padding: "60px 60px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40, alignItems: "center", position: "relative", zIndex: 2, minHeight: 520 }}>
          <div>
            <div style={{ display: "inline-block", background: "var(--vp-paper)", color: "var(--vp-brown)", padding: "6px 14px", borderRadius: 999, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", marginBottom: 28 }}>Nuevo · SS26</div>
            <h1 className="vp-display" style={{ fontSize: "clamp(72px, 9vw, 160px)", color: "var(--vp-paper)", margin: 0, lineHeight: .88 }}>
              Para<br/>
              perros con<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>carácter</span>.
            </h1>
            <p style={{ fontSize: 18, color: "var(--vp-paper)", opacity: .9, marginTop: 28, maxWidth: 440, lineHeight: 1.6 }}>
              Arneses de diseño de autor con estampados originales firmados por Lucía — piezas exclusivas que no verás en ningún otro sitio.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
              <button className="vp-btn" style={{ background: "var(--vp-paper)", color: "var(--vp-brown)", borderColor: "var(--vp-paper)" }} onClick={() => go("/tienda")}>Comprar ahora</button>
              <button className="vp-btn ghost" style={{ color: "var(--vp-paper)", borderColor: "var(--vp-paper)" }} onClick={() => go(`/producto/${model.id}`)}>Modelo {model.name}</button>
              <button className="vp-btn" onClick={() => go("/probador")} style={{
                position: "relative",
                background: "var(--vp-olive)",
                color: "var(--vp-paper)",
                borderColor: "var(--vp-olive)",
              }}>
                <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1, marginRight: 4 }}>✦</span>
                Probador IA
                <span style={{
                  position: "absolute",
                  top: -8, right: -10,
                  background: "var(--vp-paper)",
                  color: "var(--vp-brown)",
                  fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 500,
                  padding: "3px 7px",
                  letterSpacing: ".18em", textTransform: "uppercase",
                  borderRadius: 2, lineHeight: 1,
                }}>Nuevo</span>
              </button>
            </div>
          </div>
          <div style={{ position: "relative", width: "100%", height: 560, borderRadius: 16, overflow: "hidden", transform: "rotate(2deg)", background: "var(--vp-cream-deep)" }}>
            <img src={model.heroImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
            <div style={{ position: "absolute", top: 20, right: -30, background: "var(--vp-paper)", padding: "14px 20px", borderRadius: 999, transform: "rotate(-6deg)", fontSize: 13, color: "var(--vp-brown)" }}>
              ✶ desde €{model.priceHarness}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BigMarquee() {
  const items = ["Paseos bien vestidos", "✶", "Diseñado en España", "✶", "Edición limitada", "✶"];
  const row = [...items, ...items, ...items];
  return (
    <section style={{ padding: "60px 0", background: "var(--vp-brown)", color: "var(--vp-paper)", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 60, animation: "vpTicker 30s linear infinite", whiteSpace: "nowrap" }}>
        {row.map((t, i) => <span key={i} className="vp-display" style={{ fontSize: 72, fontStyle: i % 2 ? "italic" : "normal" }}>{t}</span>)}
      </div>
    </section>
  );
}

function ModelsModerna() {
  const { go } = useRoute();
  return (
    <section style={{ padding: "100px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {VP_MODELS.map((m) => (
          <a key={m.id} onClick={() => go(`/producto/${m.id}`)} style={{ cursor: "pointer", borderRadius: 16, overflow: "hidden", background: m.hex.primary, padding: 24, minHeight: 560, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 20, transition: "transform .3s ease" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="vp-display" style={{ fontSize: 48, color: "var(--vp-paper)", lineHeight: 1 }}>{m.name}</span>
              <span style={{ background: "var(--vp-paper)", color: "var(--vp-brown)", padding: "6px 12px", borderRadius: 999, fontSize: 12 }}>€{m.priceHarness}</span>
            </div>
            <div style={{ width: "80%", height: 420, margin: "0 auto", borderRadius: 12, overflow: "hidden", background: "var(--vp-paper)" }}>
              <img src={m.heroImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
            </div>
            <div style={{ color: "var(--vp-paper)", fontSize: 14, opacity: .9 }}>{m.subtitle}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

function StoryModerna() {
  const { go } = useRoute();
  return (
    <section style={{ padding: "100px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", background: "var(--vp-cream-soft)", padding: 60, borderRadius: 20 }}>
        <div>
          <div className="vp-eyebrow">— De Madrid, con cariño</div>
          <h2 className="vp-display" style={{ fontSize: 80, color: "var(--vp-brown)", margin: "16px 0 0", lineHeight: .9 }}>Más que un<br/><span className="vp-italic" style={{ fontStyle: "italic" }}>accesorio</span>.</h2>
          <p style={{ fontSize: 16, color: "var(--vp-ink-soft)", marginTop: 24, lineHeight: 1.7 }}>Lucía buscaba accesorios para perros con estampados de autor y no los encontraba. Viena Pets nació de esa búsqueda.</p>
          <button className="vp-btn" style={{ marginTop: 24 }} onClick={() => go("/historia")}>Leer más</button>
        </div>
        <div style={{ width: "100%", height: 560, borderRadius: 16, overflow: "hidden", background: "var(--vp-cream-deep)" }}>
          <img src="assets/capri-conjunto.jpeg" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomePageModerna });
