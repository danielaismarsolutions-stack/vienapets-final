"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import { useCart } from "@/components/shared/CartProvider";
import { VP_MODELS, VP_SIZES, VP_LEASH_SIZE, VP_HARDWARE } from "@/lib/data";

export function ProductPage({ modelId }) {
  const { go } = useRoute();
  const model = VP_MODELS.find((m) => m.id === modelId) || VP_MODELS[0];
  const [size, setSize] = useState("M");
  const [type, setType] = useState("harness");
  const [img, setImg] = useState(0);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const { add } = useCart();

  const gallery = [
    { src: model.harnessImg || model.heroImg, label: "Arnés" },
    { src: model.leashImg || model.heroImg, label: "Correa" },
    { src: model.bagImg || model.heroImg, label: "Portabolsas" },
    { src: model.partsImg, label: "Herrajes" },
  ];

  const priceMap = { harness: model.priceHarness, leash: model.priceLeash, bag: model.priceBag };
  const typeLabel = { harness: "Arnés", leash: "Correa", bag: "Portabolsas" };
  const typeImgMap = { harness: model.harnessImg || model.heroImg, leash: model.leashImg || model.heroImg, bag: model.bagImg || model.heroImg };
  const typeCategory = { harness: "harness", leash: "leash", bag: "bag" };

  const handleAdd = () => {
    add({
      modelId: model.id, name: `${typeLabel[type]} ${model.name}`, type: typeLabel[type],
      price: priceMap[type], img: typeImgMap[type], swatch: model.hex.primary,
      size: type === "harness" ? size : null,
      category: typeCategory[type],
    });
  };

  return (
    <div style={{ padding: "24px 40px 80px" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginBottom: 24 }}>
          <a onClick={() => go("/")} style={{ cursor: "pointer" }}>Inicio</a> · <a onClick={() => go("/tienda")} style={{ cursor: "pointer" }}>Tienda</a> · <span style={{ color: "var(--vp-brown)" }}>Modelo {model.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <div style={{ width: "100%", aspectRatio: "4/5", background: "var(--vp-cream-soft)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={gallery[img].src} alt={gallery[img].label} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: 24 }} />
              <div style={{ position: "absolute", top: 16, left: 16, background: "var(--vp-paper)", padding: "6px 12px", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)" }}>
                {gallery[img].label}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 12 }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setImg(i)} style={{ aspectRatio: "1/1", padding: 0, backgroundImage: `url(${g.src})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: "var(--vp-cream-soft)", border: img === i ? "1px solid var(--vp-brown)" : "1px solid transparent", opacity: img === i ? 1 : .7, cursor: "pointer", transition: "all .2s ease" }} />
              ))}
            </div>
          </div>

          <div style={{ paddingTop: 10 }}>
            <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Colección SS26 · Diseño de autor</div>
            <h1 className="vp-display" style={{ fontSize: 64, color: "var(--vp-brown)", margin: 0, lineHeight: 1.05, paddingBottom: 4 }}>
              Modelo <span className="vp-italic" style={{ fontStyle: "italic" }}>{model.name}</span>
            </h1>
            <div style={{ fontSize: 15, color: "var(--vp-ink-muted)", marginTop: 14 }}>{model.subtitle}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24 }}>
              <span className="vp-serif" style={{ fontSize: 28, color: "var(--vp-brown)" }}>€{priceMap[type]}</span>
              <span style={{ color: "var(--vp-ink-muted)", fontSize: 13 }}>IVA incluido</span>
            </div>

            <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 28 }}>{model.description}</p>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {model.pantones.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--vp-cream-soft)", padding: "8px 12px" }}>
                  <div style={{ width: 20, height: 20, background: i === 0 ? model.hex.primary : model.hex.secondary, border: "1px solid rgba(74,46,28,.2)" }} />
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: ".15em", color: "var(--vp-ink-muted)" }}>PANTONE®</div>
                    <div style={{ fontSize: 11, color: "var(--vp-brown)", fontWeight: 500 }}>{p}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(74,46,28,.15)", margin: "36px 0 28px" }} />

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span className="vp-eyebrow">Pieza</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { k: "harness", l: "Arnés", p: model.priceHarness },
                  { k: "leash", l: "Correa", p: model.priceLeash },
                  { k: "bag", l: "Bolsita", p: model.priceBag },
                ].map((o) => (
                  <button key={o.k} onClick={() => setType(o.k)} style={{
                    padding: "14px 10px", background: type === o.k ? "var(--vp-brown)" : "var(--vp-paper)",
                    color: type === o.k ? "var(--vp-paper)" : "var(--vp-brown)",
                    border: `1px solid ${type === o.k ? "var(--vp-brown)" : "rgba(74,46,28,.25)"}`,
                    cursor: "pointer", transition: "all .2s ease",
                  }}>
                    <div className="vp-serif" style={{ fontSize: 16 }}>{o.l}</div>
                    <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>€{o.p}</div>
                  </button>
                ))}
              </div>
            </div>

            {type === "harness" && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span className="vp-eyebrow">Talla · {size}</span>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <a onClick={() => setSizeModalOpen(true)} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-brown)", color: "var(--vp-brown)", cursor: "pointer" }}>Guía de tallas</a>
                    <a onClick={() => go("/guia-de-tallas")} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-brown)", color: "var(--vp-brown)", cursor: "pointer" }}>Ver completa</a>
                    <a onClick={() => go("/probador")} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-olive-deep)", color: "var(--vp-olive-deep)", cursor: "pointer" }}>✦ Probador IA</a>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {VP_SIZES.map((s) => (
                    <button key={s.size} onClick={() => setSize(s.size)} style={{
                      padding: "16px 0", background: size === s.size ? "var(--vp-brown)" : "transparent",
                      color: size === s.size ? "var(--vp-paper)" : "var(--vp-brown)",
                      border: "1px solid var(--vp-brown)", cursor: "pointer",
                      fontSize: 13, fontWeight: 500, letterSpacing: ".1em",
                    }}>{s.size}</button>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: 14, background: "var(--vp-cream-soft)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 12 }}>
                  <div><span style={{ color: "var(--vp-ink-muted)" }}>Ancho cinta</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find((s) => s.size === size).webbing}</b></div>
                  <div><span style={{ color: "var(--vp-ink-muted)" }}>Cuello</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find((s) => s.size === size).neck}</b></div>
                  <div><span style={{ color: "var(--vp-ink-muted)" }}>Pecho</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find((s) => s.size === size).chest}</b></div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button className="vp-btn full" onClick={handleAdd}>Añadir a la cesta · €{priceMap[type]}</button>
              <button className="vp-btn ghost" style={{ flexShrink: 0 }} aria-label="wish">
                <Icon.Heart style={{ width: 14, height: 14 }} />
              </button>
            </div>

            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, fontSize: 12, color: "var(--vp-ink-soft)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon.Truck style={{ width: 16, height: 16, color: "var(--vp-brown)" }}/>Envío desde 45 €</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon.Leaf style={{ width: 16, height: 16, color: "var(--vp-brown)" }}/>Diseñado en España</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon.Check style={{ width: 16, height: 16, color: "var(--vp-brown)" }}/>15 días dev.</div>
            </div>

            <div style={{ marginTop: 36 }}>
              {[
                { k: "hardware", t: "Herrajes", c: (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, color: "var(--vp-ink-soft)" }}>
                    {VP_HARDWARE.map((h, i) => (<div key={i}><b style={{ color: "var(--vp-brown)" }}>{h.es}</b> · {h.note}</div>))}
                  </div>
                )},
                { k: "care", t: "Cuidado y mantenimiento", c: (
                  <div style={{ display: "grid", gap: 14, fontSize: 13, color: "var(--vp-ink-soft)", lineHeight: 1.7 }}>
                    <div><b style={{ color: "var(--vp-brown)" }}>Limpieza.</b> Lavado a mano con agua fría y jabón neutro. No usar secadora. Secar a la sombra extendido.</div>
                    <div><b style={{ color: "var(--vp-brown)" }}>Almacenamiento.</b> Guardar en lugar seco. Evitar humedad prolongada y luz directa intensa.</div>
                    <div><b style={{ color: "var(--vp-brown)" }}>Uso adecuado.</b> Elige siempre la talla recomendada y supervisa al perro durante el paseo.</div>
                  </div>
                )},
                { k: "warranty", t: "Garantía y limitaciones de uso", c: (
                  <div style={{ display: "grid", gap: 12, fontSize: 13, color: "var(--vp-ink-soft)", lineHeight: 1.7 }}>
                    <p style={{ margin: 0 }}>Todos nuestros productos están cubiertos por la garantía legal europea de <b style={{ color: "var(--vp-brown)" }}>3 años</b> desde la fecha de entrega, conforme al RDL 1/2007 y la Directiva (UE) 2019/771.</p>
                    <p style={{ margin: 0 }}><b style={{ color: "var(--vp-brown)" }}>No están cubiertos por garantía:</b> los daños derivados de mordeduras del propio perro, la exposición prolongada al agua salada o clorada, los tirones desproporcionados, ni el uso del producto en un perro fuera de la talla recomendada.</p>
                  </div>
                )},
              ].map((a) => (
                <ProductAccordion key={a.k} title={a.t}>{a.c}</ProductAccordion>
              ))}
            </div>
          </div>
        </div>

        <RelatedSet model={model} />
        <PartsDiagram model={model} />
      </div>

      {sizeModalOpen && <SizeGuideModal onClose={() => setSizeModalOpen(false)} onProbador={() => { setSizeModalOpen(false); go("/probador"); }} />}
    </div>
  );
}

function ProductAccordion({ title, children }) {
  const [o, setO] = useState(false);
  return (
    <div style={{ borderTop: "1px solid rgba(74,46,28,.15)" }}>
      <button onClick={() => setO(!o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", background: "none", border: "none", cursor: "pointer" }}>
        <span className="vp-eyebrow">{title}</span>
        <Icon.Plus style={{ width: 16, height: 16, color: "var(--vp-brown)", transform: o ? "rotate(45deg)" : "none", transition: "transform .3s ease" }} />
      </button>
      <div style={{ maxHeight: o ? 400 : 0, overflow: "hidden", transition: "max-height .4s ease" }}>
        <div style={{ paddingBottom: 18 }}>{children}</div>
      </div>
    </div>
  );
}

function RelatedSet({ model }) {
  const { add } = useCart();
  const total = model.priceHarness + model.priceLeash + model.priceBag;
  const bundle = Math.round(total * 0.9 * 100) / 100;
  const saved = Math.round((total - bundle) * 100) / 100;
  const harnessImg = model.harnessImg || model.heroImg;
  const leashImg = model.leashImg || model.heroImg;
  const bagImg = model.bagImg || model.heroImg;
  const addAll = () => {
    [
      { k: "harness", n: "Arnés", p: model.priceHarness, s: "M", img: harnessImg, cat: "harness" },
      { k: "leash", n: "Correa", p: model.priceLeash, s: null, img: leashImg, cat: "leash" },
      { k: "bag", n: "Portabolsas", p: model.priceBag, s: null, img: bagImg, cat: "bag" },
    ].forEach((o) => {
      add({ modelId: model.id, name: `${o.n} ${model.name}`, type: o.n, price: o.p, img: o.img, swatch: model.hex.primary, size: o.s, category: o.cat });
    });
  };
  return (
    <section style={{ marginTop: 100, padding: "60px 40px", background: "var(--vp-cream-soft)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Conjunto completo</div>
          <h3 className="vp-display" style={{ fontSize: 52, color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
            Lleva el set <span className="vp-italic" style={{ fontStyle: "italic" }}>{model.name}</span><br/>y ahorra un 10%.
          </h3>
          <p style={{ fontSize: 14, color: "var(--vp-ink-soft)", marginTop: 20, lineHeight: 1.65, maxWidth: 420 }}>Arnés, correa a juego y portabolsas. Todos coordinados y listos para cualquier paseo. El descuento se aplica automáticamente al carrito.</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 24 }}>
            <span className="vp-serif" style={{ fontSize: 32, color: "var(--vp-brown)" }}>€{bundle.toFixed(2)}</span>
            <span style={{ fontSize: 14, color: "var(--vp-ink-muted)", textDecoration: "line-through" }}>€{total.toFixed(2)}</span>
            <span style={{ fontSize: 12, color: "var(--vp-olive-deep)", letterSpacing: ".18em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Ahorras €{saved.toFixed(2)}</span>
          </div>
          <button className="vp-btn" style={{ marginTop: 24 }} onClick={addAll}>Añadir el set <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { t: "Arnés", img: harnessImg },
            { t: "Correa", img: leashImg },
            { t: "Portabolsas", img: bagImg },
          ].map((p, i) => (
            <div key={i} style={{ width: "100%", aspectRatio: "4/5", backgroundImage: `url(${p.img})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: "var(--vp-paper)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 10, left: 10, background: "var(--vp-paper)", padding: "4px 10px", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)" }}>{p.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartsDiagram({ model }) {
  return (
    <section style={{ marginTop: 100, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      <div style={{ position: "relative", width: "100%", height: 520, background: "var(--vp-cream-soft)", overflow: "hidden" }}>
        <img src={model.partsImg} alt={`Herrajes ${model.name}`} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
      </div>
      <div>
        <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Piezas y herrajes</div>
        <h3 className="vp-display" style={{ fontSize: 52, color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
          Cada pieza,<br/>en su sitio.
        </h3>
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }}>
          {VP_HARDWARE.map((h, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 16, alignItems: "center", paddingBottom: 16, borderBottom: "1px solid rgba(74,46,28,.12)" }}>
              <div style={{ color: "var(--vp-brown)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: ".1em" }}>0{i + 1}</span>
              </div>
              <div>
                <div className="vp-serif" style={{ fontSize: 18, color: "var(--vp-brown)" }}>{h.es}</div>
                <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 2 }}>{h.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SizeGuideModal({ onClose, onProbador }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(42,29,18,.55)", backdropFilter: "blur(3px)" }} />
      <div style={{ position: "relative", background: "var(--vp-paper)", maxWidth: 760, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "40px 44px" }}>
        <button onClick={onClose} aria-label="Cerrar" style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", cursor: "pointer", color: "var(--vp-brown)" }}>
          <Icon.Close style={{ width: 22, height: 22 }} />
        </button>
        <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Guía de tallas</div>
        <h3 className="vp-display" style={{ fontSize: 36, color: "var(--vp-brown)", margin: "0 0 28px", lineHeight: 1 }}>
          Encuentra su talla <span className="vp-italic" style={{ fontStyle: "italic" }}>exacta</span>.
        </h3>

        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--vp-brown)" }}>
              {["Talla", "Ancho cinta", "Cuello", "Pecho"].map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VP_SIZES.map((s) => (
              <tr key={s.size} style={{ borderBottom: "1px solid rgba(74,46,28,.12)" }}>
                <td style={{ padding: "16px 14px" }}><span className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)" }}>{s.size}</span></td>
                <td style={{ padding: "16px 14px", fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.webbing}</td>
                <td style={{ padding: "16px 14px", fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.neck}</td>
                <td style={{ padding: "16px 14px", fontSize: 14, color: "var(--vp-ink-soft)" }}>{s.chest}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 24, padding: 16, background: "var(--vp-cream-soft)", fontSize: 13, color: "var(--vp-ink-soft)", lineHeight: 1.65 }}>
          <b style={{ color: "var(--vp-brown)" }}>Correa:</b> talla única — ancho de cinta {VP_LEASH_SIZE.webbing}, longitud total {VP_LEASH_SIZE.length}.<br/>
          <b style={{ color: "var(--vp-brown)" }}>Portabolsas:</b> talla única.
        </div>

        <div style={{ marginTop: 24, padding: 16, background: "var(--vp-olive-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 14, color: "var(--vp-brown)" }}>
            <b>¿Prefieres probarlo virtualmente?</b><br/>
            <span style={{ fontSize: 13, color: "var(--vp-ink-soft)" }}>Sube una foto de tu perro y comprueba cómo le queda.</span>
          </div>
          <button className="vp-btn olive" onClick={onProbador}>✦ Probador IA →</button>
        </div>
      </div>
    </div>
  );
}
