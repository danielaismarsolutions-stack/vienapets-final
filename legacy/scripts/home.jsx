// Viena Pets — Home page
const { useState: _useStateH, useEffect: _useEffectH, useRef: _useRefH } = React;

function HomePage({ heroModelId, heroStyle, paletteMode }) {
  const { go } = useRoute();
  const model = VP_MODELS.find(m => m.id === heroModelId) || VP_MODELS[0];

  return (
    <>
      <Hero model={model} heroStyle={heroStyle} />

      {/* ============================================
          FILA DE CATEGORÍAS (5 iconos navegables, SVG premium)
         ============================================ */}
      <CategoryRow go={go} />

      {/* ============================================
          PROMO PACK 10% (oferta lanzamiento)
         ============================================ */}
      <PromoPackSection />


      {/* ============================================
          BLOQUE PROBADOR IA (mockup visual)
         ============================================ */}
      <ProbadorBlock />

      <ValueProps />
      <ModelsSection />
      <StorySection />
      <MaterialsSection modelId={heroModelId} />
      <TestimonialsSection />
      <FAQSection />
      <InstagramStrip />
    </>
  );
}

// ---------- BLOQUE PROBADOR IA (en home) ----------
function ProbadorBlock() {
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

// ---------- HERO ----------
function Hero({ model, heroStyle }) {
  const { go } = useRoute();

  if (heroStyle === "mosaic") {
    return <HeroMosaic />;
  }

  // SINGLE hero: foto editorial a la derecha + bloque editorial-comercial a la izquierda
  return (
    <section style={{
      position: "relative",
      padding: "60px 40px 80px",
      overflow: "hidden",
      background: "var(--vp-cream)",
    }}>
      <div style={{
        maxWidth: 1500,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: 80,
        alignItems: "center",
      }}>
        {/* COLUMNA IZQUIERDA — texto + 3 CTAs directos */}
        <div style={{ paddingLeft: 20 }}>
          {/* Wordmark premium en mini formato */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <img src="assets/logo-viena-pets-oficial.png" alt="" style={{ height: 28, width: "auto", opacity: .9 }} />
            <span style={{ height: 1, flex: 1, maxWidth: 80, background: "var(--vp-olive-deep)", opacity: .35 }}></span>
            <span className="vp-eyebrow" style={{ color: "var(--vp-olive-deep)", fontSize: 10 }}>SS26 · Madrid</span>
          </div>

          <h1 className="vp-display" style={{
            fontSize: "clamp(48px, 6vw, 84px)",
            color: "var(--vp-brown)",
            lineHeight: 1,
            margin: "0 0 28px 0",
            letterSpacing: "-0.02em",
          }}>
            Diseño de autor<br/>
            para tu <span className="vp-italic" style={{ color: "var(--vp-olive-deep)" }}>mejor amigo</span>.
          </h1>

          <p style={{
            fontSize: 17,
            color: "var(--vp-ink-soft)",
            lineHeight: 1.7,
            maxWidth: 480,
            margin: "0 0 40px 0",
          }}>
            Arneses, correas y portabolsas con diseños exclusivos firmados por Lucía.
            Diseñados en España, en ediciones limitadas.
          </p>

          {/* CTAs directos: 4 categorías + Probador IA (destacado) */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            <button className="vp-btn olive" onClick={() => go("/tienda?cat=conjuntos")}>
              Conjuntos
            </button>
            <button className="vp-btn olive ghost" onClick={() => go("/tienda?cat=arneses")}>
              Arneses
            </button>
            <button className="vp-btn olive ghost" onClick={() => go("/tienda?cat=correas")}>
              Correas
            </button>
            <button className="vp-btn olive ghost" onClick={() => go("/tienda?cat=portabolsas")}>
              Portabolsas
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36, flexWrap: "wrap" }}>
            <button
              className="vp-btn"
              onClick={() => go("/probador")}
              style={{
                position: "relative",
                background: "var(--vp-brown)",
                color: "var(--vp-paper)",
                borderColor: "var(--vp-brown)",
                paddingRight: 22,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1, marginRight: 2 }}>✦</span>
              Probador IA
              <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1, marginLeft: 4 }}>→</span>
              <span style={{
                position: "absolute",
                top: -8,
                right: -10,
                background: "var(--vp-olive-deep)",
                color: "var(--vp-paper)",
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                padding: "3px 7px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                borderRadius: 2,
                lineHeight: 1,
              }}>
                Nuevo
              </span>
            </button>
            <span style={{
              fontSize: 12,
              color: "var(--vp-ink-muted)",
              letterSpacing: ".04em",
              maxWidth: 260,
              lineHeight: 1.45,
            }}>
              Sube una foto de tu perro y descubre cómo le queda cada modelo.
            </span>
          </div>

          {/* Trust signals discretos */}
          <div style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            fontSize: 12,
            color: "var(--vp-ink-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            <span>✓ Envío gratuito desde 45 €</span>
            <span>✓ Diseñado en España</span>
            <span>✓ 15 días de devolución</span>
          </div>
        </div>

        {/* COLUMNA DERECHA — foto editorial con tratamiento premium */}
        <div style={{ position: "relative" }}>
          <div style={{
            width: "100%",
            aspectRatio: "4/5",
            borderRadius: "var(--radius-arch)",
            background: "url(assets/hero-dalmata.png) center/contain no-repeat, var(--vp-cream-deep)",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 30px 80px rgba(42,29,18,.12)",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(74,46,28,.10) 100%)",
            }} />
          </div>

          {/* Sello editorial premium con monograma */}
          <div style={{
            position: "absolute",
            left: -40,
            bottom: 40,
            background: "var(--vp-paper)",
            padding: "22px 26px 22px 22px",
            borderRadius: 2,
            boxShadow: "0 24px 60px rgba(42,29,18,.16)",
            maxWidth: 320,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 16,
            alignItems: "center",
            borderTop: "3px solid var(--vp-olive)",
          }}>
            <img src="assets/monograma-viena.png" alt="" style={{ width: 56, height: 56, objectFit: "contain", display: "block" }} />
            <div>
              <div className="vp-eyebrow" style={{ fontSize: 9, marginBottom: 6, color: "var(--vp-olive-deep)", letterSpacing: ".28em" }}>
                Edición SS26
              </div>
              <div className="vp-serif" style={{
                fontSize: 15,
                color: "var(--vp-brown)",
                lineHeight: 1.35,
                fontStyle: "italic",
              }}>
                Diseño de autor · Edición SS26
              </div>
            </div>
          </div>

          {/* Watermark editorial sutil */}
          <div style={{
            position: "absolute",
            top: -8,
            right: 8,
            fontFamily: "var(--font-display)",
            fontSize: 11,
            letterSpacing: ".42em",
            textTransform: "uppercase",
            color: "var(--vp-brown)",
            opacity: .55,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}>
            MADRID
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMosaic() {
  const { go } = useRoute();
  return (
    <section style={{ padding: "30px 40px 60px" }}>
      <div style={{ maxWidth: 1600, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 16, alignItems: "stretch" }}>
        {/* Title spans cols */}
        <div style={{ gridColumn: "1 / 3", padding: "60px 20px 40px" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 28 }}>— Primavera / Verano 2026</div>
          <h1 className="vp-display" style={{ fontSize: "clamp(72px, 9vw, 156px)", color: "var(--vp-brown)", margin: 0, lineHeight: 0.88 }}>
            Un paseo,<br/>
            <span style={{ fontStyle: "italic" }}>una</span> ceremonia.
          </h1>
        </div>

        <div style={{ gridRow: "1 / 3", height: 680, borderRadius: "280px 280px 4px 4px", overflow: "hidden", background: "var(--vp-cream-deep)" }}>
          <img src="assets/hero-dalmata.png" alt="Viena" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
        </div>

        <div style={{ height: 260 }}><ModelSwatch model={VP_MODELS[0]} style={{ width: "100%", height: "100%", display: "block" }} /></div>
        <div style={{ height: 260 }}><ModelSwatch model={VP_MODELS[1]} style={{ width: "100%", height: "100%", display: "block" }} /></div>

        <div style={{ background: "var(--vp-brown)", color: "var(--vp-paper)", padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: 260 }}>
          <div>
            <div className="vp-eyebrow" style={{ color: "var(--vp-paper)", fontSize: 10 }}>Tres modelos · Tres historias</div>
            <p className="vp-serif" style={{ fontSize: 22, marginTop: 14, lineHeight: 1.35 }}>Capri, Peachy y Daisy. Cada uno pensado para un perro que no se parece a ningún otro.</p>
          </div>
          <button className="vp-btn ghost" style={{ color: "var(--vp-paper)", borderColor: "var(--vp-paper)", alignSelf: "flex-start" }} onClick={() => go("/tienda")}>
            Ver colección <Icon.Arrow style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
      <Ticker />
    </section>
  );
}

function Ticker() {
  const items = ["Diseños exclusivos firmados", "✶", "Diseñado en España", "✶", "Edición limitada · SS26", "✶", "Envío gratuito desde 45 €", "✶"];
  const row = [...items, ...items, ...items];
  return (
    <div style={{ marginTop: 80, borderTop: "1px solid rgba(74,46,28,.2)", borderBottom: "1px solid rgba(74,46,28,.2)", padding: "16px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 48, animation: "vpTicker 40s linear infinite", whiteSpace: "nowrap" }}>
        {row.map((t, i) => (
          <span key={i} style={{ fontSize: 13, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--vp-brown)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ---------- VALUE PROPS ----------
function ValueProps() {
  const values = [
    { icon: Icon.Scissors, title: "Diseño de autor", text: "Cada estampado es una creación original de Lucía, fundadora de la marca." },
    { icon: Icon.Leaf,     title: "Edición limitada", text: "Series cortas y numeradas. Cuando se agotan, no se reeditan." },
    { icon: Icon.Truck,    title: "Envío gratuito", text: "Envío gratuito en pedidos desde 45 €. Preparamos cada pedido con mimo." },
    { icon: Icon.Heart,    title: "Ajuste a medida", text: "Cuatro tallas y múltiples puntos de ajuste para cada perro." },
  ];
  return (
    <section style={{ padding: "100px 40px 40px", background: "var(--vp-cream)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40 }}>
        {values.map((v, i) => (
          <div key={i} style={{ borderLeft: "1px solid rgba(74,46,28,.2)", paddingLeft: 24 }}>
            <v.icon style={{ width: 28, height: 28, color: "var(--vp-brown)", marginBottom: 16 }} />
            <div className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)", marginBottom: 8 }}>{v.title}</div>
            <div style={{ fontSize: 13, color: "var(--vp-ink-soft)", lineHeight: 1.6 }}>{v.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- MODELS SECTION ----------
function ModelsSection() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px 40px" : "140px 40px 80px", position: "relative" }}>
      <div style={{
        maxWidth: 1400,
        margin: isMobile ? "0 auto 40px" : "0 auto 80px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "end",
        gap: isMobile ? 24 : 0,
      }}>
        <div>
          <div className="vp-eyebrow" style={{ marginBottom: 20 }}>— Colección SS26</div>
          <h2 className="vp-display" style={{ fontSize: "clamp(40px, 5.5vw, 92px)", color: "var(--vp-brown)", margin: 0, lineHeight: 1, maxWidth: 720 }}>
            Tres estampados,<br/><span className="vp-italic" style={{ fontStyle: "italic" }}>una firma</span>.
          </h2>
        </div>
        <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.65, maxWidth: 360, paddingBottom: 10 }}>
          Tres estampados originales firmados por Lucía. Cada modelo es una pieza de autor: un diseño exclusivo que no encontrarás en ninguna otra marca.
        </p>
      </div>

      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
        gap: isMobile ? 32 : 40,
      }}>
        {VP_MODELS.map((m, i) => (
          <ModelCard key={m.id} model={m} index={i + 1} onClick={() => go(`/producto/${m.id}`)} />
        ))}
      </div>
    </section>
  );
}

function ModelCard({ model, index, onClick }) {
  const [hover, setHover] = _useStateH(false);
  return (
    <article onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", overflow: "hidden", background: "var(--vp-cream-soft)" }}>
        <img src={model.heroImg} alt={model.name} style={{
          width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block",
          transform: hover ? "scale(1.03)" : "scale(1)",
          transition: "transform .8s cubic-bezier(.2,.7,.2,1)",
          opacity: hover ? 0 : 1,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          opacity: hover ? 1 : 0, transition: "opacity .5s ease",
        }}>
          <ModelSwatch model={model} style={{ width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ background: "var(--vp-paper)", padding: "14px 20px", borderRadius: 2 }}>
              <span className="vp-eyebrow">Ver modelo {model.name}</span>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 16, left: 16, fontSize: 11, color: "var(--vp-brown)", background: "var(--vp-paper)", padding: "4px 10px", letterSpacing: ".2em", textTransform: "uppercase" }}>0{index} / 03</div>
      </div>
      <div style={{ paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div className="vp-serif" style={{ fontSize: 28, color: "var(--vp-brown)", letterSpacing: ".01em" }}>Modelo <span className="vp-italic" style={{ fontStyle: "italic" }}>{model.name}</span></div>
          <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 4, letterSpacing: ".08em" }}>{model.subtitle}</div>
        </div>
        <div className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>€{model.priceHarness}</div>
      </div>
    </article>
  );
}

// ---------- STORY ----------
function StorySection() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "140px 40px", background: "var(--vp-cream-soft)", marginTop: isMobile ? 0 : 60 }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr",
        gap: isMobile ? 40 : 80,
        alignItems: "center",
      }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: "100%", height: isMobile ? 380 : 520, borderRadius: 2, overflow: "hidden", background: "var(--vp-cream-soft)" }}>
            <img src="assets/capri-conjunto.jpeg" alt="Estampado Capri" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
          </div>
          <div style={{ position: "absolute", right: isMobile ? 16 : -40, bottom: isMobile ? -24 : -40, background: "var(--vp-brown)", color: "var(--vp-paper)", padding: isMobile ? "20px 24px" : "28px 32px", maxWidth: 220 }}>
            <div className="vp-display" style={{ fontSize: isMobile ? 40 : 56, lineHeight: .9 }}>SS26</div>
            <div style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", marginTop: 8, opacity: .85 }}>Nueva colección · diseño de autor</div>
          </div>
        </div>
        <div>
          <div className="vp-eyebrow" style={{ marginBottom: 22 }}>— El estudio</div>
          <h2 className="vp-display" style={{ fontSize: "clamp(48px, 5vw, 86px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
            Cada pieza, <span className="vp-italic" style={{ fontStyle: "italic" }}>un dibujo</span>.
          </h2>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18, fontSize: 16, color: "var(--vp-ink-soft)", lineHeight: 1.75, maxWidth: 520 }}>
            <p>Lucía Larrondobuno buscaba algo que no existía: accesorios para perros con estampados de autor, pensados como moda. No lo encontró, así que lo creó.</p>
            <p>Viena Pets nace como una marca de diseño de autor: cada colección empieza con un estampado original de Lucía y se produce en ediciones limitadas. Cuidado en el detalle, exclusividad en el resultado.</p>
          </div>
          <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
            <div>
              <div className="vp-display" style={{ fontSize: 48, color: "var(--vp-brown)", lineHeight: 1 }}>03</div>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 6 }}>Modelos · edición limitada</div>
            </div>
            <div>
              <div className="vp-display" style={{ fontSize: 48, color: "var(--vp-brown)", lineHeight: 1 }}>SS26</div>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 6 }}>Colección de temporada</div>
            </div>
            <div>
              <div className="vp-display" style={{ fontSize: 48, color: "var(--vp-brown)", lineHeight: 1 }}>0</div>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 6 }}>Plástico en envíos</div>
            </div>
          </div>
          <button className="vp-btn" style={{ marginTop: 40 }} onClick={() => go("/historia")}>Conoce a Lucía <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
        </div>
      </div>
    </section>
  );
}

// ---------- MATERIALS ----------
// (MATERIAL_IMG_BY_MODEL / MATERIAL_POS / MaterialVisual removed: MaterialsSection now reads m.materialsImg directly from VP_MODELS.)

function MaterialsSection({ modelId = "capri" }) {
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
          {VP_MODELS.map((m, i) => (
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

        {/* Authorship strip */}
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
              "No diseño accesorios. Diseño piezas para perros que tienen estilo propio."
            </div>
            <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginTop: 12 }}>— Lucía L. Buno, fundadora</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MaterialVisual() { return null; /* deprecated — kept as no-op to preserve any stray references */ }

function HardwareIcon({ kind }) {
  const stroke = "var(--vp-brown)";
  const sz = 44;
  switch (kind) {
    case 0: // D ring
      return <svg viewBox="0 0 48 48" style={{ width: sz, height: sz }}><path d="M14 10 H30 A16 16 0 0 1 30 38 H14 Z" fill="none" stroke={stroke} strokeWidth="3"/></svg>;
    case 1: // O ring
      return <svg viewBox="0 0 48 48" style={{ width: sz, height: sz }}><circle cx="24" cy="24" r="14" fill="none" stroke={stroke} strokeWidth="3"/></svg>;
    case 2: // slider
      return <svg viewBox="0 0 48 48" style={{ width: sz, height: sz }}><rect x="8" y="16" width="32" height="16" fill="none" stroke={stroke} strokeWidth="3"/><line x1="24" y1="16" x2="24" y2="32" stroke={stroke} strokeWidth="3"/></svg>;
    case 3: // snap hook
      return <svg viewBox="0 0 48 48" style={{ width: sz, height: sz }}><rect x="18" y="8" width="12" height="10" fill="none" stroke={stroke} strokeWidth="3"/><path d="M24 18 C 24 26, 14 28, 14 36 C 14 42, 34 42, 34 36 C 34 28, 24 26, 24 18" fill="none" stroke={stroke} strokeWidth="3"/></svg>;
    case 4: // rect ring
      return <svg viewBox="0 0 48 48" style={{ width: sz, height: sz }}><rect x="8" y="16" width="32" height="16" fill="none" stroke={stroke} strokeWidth="3"/></svg>;
  }
}

// ---------- TESTIMONIALS ----------
function TestimonialsSection() {
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

      {/* Decorative paws */}
      <Icon.Paw style={{ position: "absolute", top: 50, left: 40, width: 44, height: 44, color: "var(--vp-paper)", opacity: .07 }} />
      <Icon.Paw style={{ position: "absolute", bottom: 80, right: 60, width: 60, height: 60, color: "var(--vp-paper)", opacity: .07 }} />
      <Icon.Paw style={{ position: "absolute", top: 120, right: 120, width: 32, height: 32, color: "var(--vp-paper)", opacity: .08 }} />
    </section>
  );
}

// ---------- FAQ ----------
function FAQSection() {
  const [open, setOpen] = _useStateH(0);
  const isMobile = useIsMobile();
  return (
    <section style={{ padding: isMobile ? "80px 20px" : "140px 40px" }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr",
        gap: isMobile ? 32 : 80,
      }}>
        <div style={isMobile ? {} : { position: "sticky", top: 120, alignSelf: "start" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 22 }}>— Preguntas</div>
          <h2 className="vp-display" style={{ fontSize: "clamp(36px, 4.5vw, 72px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
            Lo que suelen<br/>
            <span className="vp-italic" style={{ fontStyle: "italic" }}>preguntarnos</span>.
          </h2>
          <p style={{ fontSize: 14, color: "var(--vp-ink-soft)", marginTop: 20, lineHeight: 1.65 }}>
            ¿Tienes una duda concreta? <a style={{ borderBottom: "1px solid", cursor: "pointer" }}>Escríbenos</a>.
          </p>
        </div>
        <div>
          {VP_FAQ.map((f, i) => (
            <div key={i} style={{ borderTop: "1px solid rgba(74,46,28,.2)", padding: "24px 0" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", gap: 16 }}>
                <span className="vp-serif" style={{ fontSize: isMobile ? 18 : 22, color: "var(--vp-brown)", lineHeight: 1.3 }}>{f.q}</span>
                <span style={{ width: 24, height: 24, display: "grid", placeItems: "center", color: "var(--vp-brown)", transition: "transform .3s ease", transform: open === i ? "rotate(45deg)" : "rotate(0)", flexShrink: 0 }}>
                  <Icon.Plus style={{ width: 20, height: 20 }} />
                </span>
              </button>
              <div style={{ maxHeight: open === i ? 500 : 0, overflow: "hidden", transition: "max-height .4s ease" }}>
                <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 14, marginBottom: 0 }}>{f.a}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(74,46,28,.2)" }} />
        </div>
      </div>
    </section>
  );
}

// ---------- INSTAGRAM STRIP ----------
function InstagramStrip() {
  const igUrl = "https://www.instagram.com/vienapets/";
  return (
    <section style={{ padding: "0 40px 80px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center", marginBottom: 48 }}>
        <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Instagram</div>
        <h3 className="vp-display" style={{ fontSize: 48, color: "var(--vp-brown)", margin: 0 }}>
          Síguenos en <a href={igUrl} target="_blank" rel="noopener noreferrer" className="vp-italic" style={{ fontStyle: "italic", borderBottom: "1px solid var(--vp-brown)", cursor: "pointer" }}>@vienapets</a>
        </h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, maxWidth: 1400, margin: "0 auto" }}>
        {[
          "assets/modelo-capri.png",
          "assets/modelo-peachy.png",
          "assets/modelo-daisy.png",
          "assets/hero-dalmata.png",
          "assets/materiales-capri-verde.png",
          "assets/materiales-peachy.png",
        ].map((src, i) => (
          <a key={i} href={igUrl} target="_blank" rel="noopener noreferrer" style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "var(--vp-cream-soft)", cursor: "pointer" }}>
            <img src={src} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", transition: "transform .6s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} />
          </a>
        ))}
      </div>
    </section>
  );
}

// ============================================
// CategoryRow — 5 iconos SVG premium, navegan a tienda con filtro
// ============================================
function CategoryRow({ go }) {
  const cats = [
    { label: "Conjuntos", to: "/tienda?cat=conjuntos", icon: "set" },
    { label: "Arneses", to: "/tienda?cat=arneses", icon: "harness" },
    { label: "Correas", to: "/tienda?cat=correas", icon: "leash" },
    { label: "Portabolsas", to: "/tienda?cat=portabolsas", icon: "bag" },
    { label: "Probador IA", to: "/probador", icon: "ai", isNew: true },
  ];
  return (
    <section style={{
      padding: "70px 40px 56px",
      background: "var(--vp-paper)",
      borderTop: "1px solid rgba(74,46,28,.06)",
      borderBottom: "1px solid rgba(74,46,28,.06)",
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 24,
      }}>
        {cats.map((cat) => (
          <CategoryTile key={cat.label} cat={cat} onClick={() => go(cat.to)} />
        ))}
      </div>
    </section>
  );
}

function CategoryTile({ cat, onClick }) {
  const [hover, setHover] = React.useState(false);
  const stroke = cat.isNew ? "var(--vp-copper-deep)" : "var(--vp-brown)";
  const bg = cat.isNew ? "var(--vp-olive-soft)" : "transparent";
  const ring = hover ? "var(--vp-copper)" : "rgba(74,46,28,.12)";
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        textAlign: "center",
        padding: "28px 16px 22px",
        borderRadius: 6,
        background: bg,
        border: `1px solid ${ring}`,
        transition: "transform .35s cubic-bezier(.2,.7,.2,1), border-color .25s ease, background .25s ease",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        position: "relative",
      }}>
      <div style={{
        width: 64, height: 64,
        margin: "0 auto 16px",
        display: "grid", placeItems: "center",
        borderRadius: "50%",
        background: cat.isNew ? "var(--vp-paper)" : "var(--vp-cream-soft)",
        border: `1px solid ${cat.isNew ? "var(--vp-copper)" : "rgba(74,46,28,.15)"}`,
      }}>
        <CategoryIcon kind={cat.icon} stroke={stroke} />
      </div>
      <div className="vp-eyebrow" style={{
        color: stroke,
        letterSpacing: "0.22em",
        fontSize: 11,
      }}>
        {cat.label}
        {cat.isNew && <span className="vp-badge-new">Nuevo</span>}
      </div>
    </div>
  );
}

function CategoryIcon({ kind, stroke }) {
  const s = { stroke, fill: "none", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "set") {
    // Tres piezas en composición — arnés + correa + bolsita
    return (
      <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        {/* arnés mini */}
        <path d="M5 11 q3 -3 6 0 q2 -1 4 0 q3 -3 6 0 v3 q-3 1 -6 0 q-2 1 -4 0 q-3 1 -6 0 z" {...s} />
        {/* correa */}
        <path d="M9 18 q5 2 10 0 q3 -1 6 1" {...s} />
        {/* bolsita */}
        <rect x="22" y="20" width="6" height="5" rx="1" {...s} />
        <path d="M23.5 20 v-1 a1.5 1.5 0 0 1 3 0 v1" {...s} />
      </svg>
    );
  }
  if (kind === "harness") {
    return (
      <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 10 q4 -4 10 -4 q6 0 10 4 v4 q-2 2 -5 2 q-2 -1 -5 0 q-3 -1 -5 0 q-3 0 -5 -2 z" {...s} />
        <circle cx="11" cy="12" r="0.8" fill={stroke} />
        <circle cx="16" cy="11" r="0.8" fill={stroke} />
        <circle cx="21" cy="12" r="0.8" fill={stroke} />
        <path d="M14 18 v6 M18 18 v6" {...s} />
        <rect x="13" y="23" width="6" height="3" rx="0.6" {...s} />
      </svg>
    );
  }
  if (kind === "leash") {
    return (
      <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        {/* mosquetón */}
        <path d="M5 16 a3 3 0 0 1 3 -3 h2 v6 h-2 a3 3 0 0 1 -3 -3 z" {...s} />
        <path d="M10 14.5 h2" {...s} />
        {/* correa serpenteante */}
        <path d="M12 16 q3 -4 7 -2 q4 2 7 -2 q1 -1 1 -2" {...s} />
        {/* loop final */}
        <circle cx="26" cy="9" r="2" {...s} />
      </svg>
    );
  }
  if (kind === "bag") {
    return (
      <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="11" width="18" height="13" rx="2" {...s} />
        <circle cx="15" cy="17" r="3" {...s} />
        <path d="M15 17 v0.01" {...s} strokeWidth="2" />
        {/* clip */}
        <path d="M24 14 q4 0 4 4 q0 4 -4 4" {...s} />
        <circle cx="28" cy="18" r="0.8" fill={stroke} />
      </svg>
    );
  }
  // ai sparkle
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 5 l1.6 5.4 L23 12 l-5.4 1.6 L16 19 l-1.6 -5.4 L9 12 l5.4 -1.6 z" {...s} />
      <path d="M24 20 l0.7 2.3 L27 23 l-2.3 0.7 L24 26 l-0.7 -2.3 L21 23 l2.3 -0.7 z" {...s} />
      <path d="M7 22 l0.5 1.5 L9 24 l-1.5 0.5 L7 26 l-0.5 -1.5 L5 24 l1.5 -0.5 z" {...s} />
    </svg>
  );
}

// ---------- PROMO PACK SECTION ----------
function PromoPackSection() {
  const { go } = useRoute();
  return (
    <section style={{ padding: "100px 40px", background: "var(--vp-cream-soft)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80, alignItems: "center", marginBottom: 56 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 16, color: "var(--vp-olive-deep)" }}>— Oferta de lanzamiento</div>
            <h2 className="vp-display" style={{ fontSize: "clamp(40px, 5vw, 80px)", color: "var(--vp-brown)", margin: 0, lineHeight: 1 }}>
              Lleva el conjunto<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>completo</span>.
            </h2>
          </div>
          <p style={{ fontSize: 17, color: "var(--vp-ink-soft)", lineHeight: 1.7, alignSelf: "center", maxWidth: 520 }}>
            Arnés, correa y portabolsas a juego. Combina el set completo de cualquier modelo y aplicamos un <b style={{ color: "var(--vp-olive-deep)" }}>10% de descuento</b> automáticamente al carrito.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {VP_MODELS.map((m) => {
            const totalRaw = m.priceHarness + m.priceLeash + m.priceBag;
            const totalDiscounted = Math.round(totalRaw * 0.9 * 100) / 100;
            return (
              <article key={m.id} onClick={() => go(`/producto/${m.id}`)} style={{ cursor: "pointer", background: "var(--vp-paper)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ aspectRatio: "4/5", background: "var(--vp-cream)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <img src={m.heroImg} alt={`Conjunto ${m.name}`} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: 16 }} />
                  <div style={{ position: "absolute", top: 12, right: 12, background: "var(--vp-olive)", color: "var(--vp-paper)", padding: "5px 10px", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>−10%</div>
                </div>
                <div>
                  <div className="vp-serif" style={{ fontSize: 24, color: "var(--vp-brown)" }}>Conjunto <span className="vp-italic" style={{ fontStyle: "italic" }}>{m.name}</span></div>
                  <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 4, letterSpacing: ".08em" }}>Arnés + correa + portabolsas</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 12 }}>
                    <span className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)" }}>€{totalDiscounted.toFixed(2)}</span>
                    <span style={{ fontSize: 13, color: "var(--vp-ink-muted)", textDecoration: "line-through" }}>€{totalRaw.toFixed(2)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="vp-btn olive" onClick={() => go("/tienda?cat=conjuntos")}>
            Ver todos los conjuntos <Icon.Arrow style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HomePage, PromoPackSection });
