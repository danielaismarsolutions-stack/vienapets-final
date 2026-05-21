// Viena Pets — Shop, Product, Checkout pages
const { useState: _useS, useEffect: _useE, useMemo: _useM } = React;

// ---------- SHOP (catálogo) ----------
const _CAT_URL_TO_KEY = { conjuntos: "conjunto", arneses: "arnes", correas: "correa", portabolsas: "bolsa", accesorios: "bolsa" };

function ShopPage() {
  const { go, route } = useRoute();
  const [filter, setFilter] = _useS("all");
  const [sort, setSort] = _useS("featured");

  // Leer ?cat= de la URL al montar y aplicar filtro
  _useE(() => {
    try {
      const r = route || "";
      const qIdx = r.indexOf("?");
      if (qIdx === -1) { setFilter("all"); return; }
      const params = new URLSearchParams(r.slice(qIdx + 1));
      const cat = params.get("cat");
      if (cat && _CAT_URL_TO_KEY[cat]) setFilter(_CAT_URL_TO_KEY[cat]);
      else setFilter("all");
    } catch (e) {}
  }, [route]);

  // Expandir: conjunto + arnés + correa + portabolsas de cada modelo
  const products = _useM(() => {
    const out = [];
    VP_MODELS.forEach((m) => {
      const harnessImg = m.harnessImg || m.heroImg;
      const leashImg = m.leashImg || m.heroImg;
      const bagImg = m.bagImg || m.heroImg;
      const setPriceRaw = m.priceHarness + m.priceLeash + m.priceBag;
      const setPrice = Math.round(setPriceRaw * 0.9 * 100) / 100; // 10% descuento bundle
      out.push({ id: `${m.id}-set`,     modelId: m.id, type: "Conjunto completo", name: `Conjunto ${m.name}`, price: setPrice,        model: m, category: "conjunto", cartCategory: "conjunto", img: m.heroImg, fit: "contain" });
      out.push({ id: `${m.id}-harness`, modelId: m.id, type: "Arnés",             name: `Arnés ${m.name}`,    price: m.priceHarness,  model: m, category: "arnes",    cartCategory: "harness",  img: harnessImg, fit: "contain" });
      out.push({ id: `${m.id}-leash`,   modelId: m.id, type: "Correa",            name: `Correa ${m.name}`,   price: m.priceLeash,    model: m, category: "correa",   cartCategory: "leash",    img: leashImg,   fit: "contain" });
      out.push({ id: `${m.id}-bag`,     modelId: m.id, type: "Portabolsas",       name: `Portabolsas ${m.name}`, price: m.priceBag,   model: m, category: "bolsa",     cartCategory: "bag",      img: bagImg,     fit: "contain" });
    });
    return out;
  }, []);

  const filtered = _useM(() => {
    let r = filter === "all" ? products : products.filter((p) => p.category === filter);
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [filter, sort, products]);

  return (
    <div style={{ padding: "40px 40px 80px" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48, borderBottom: "1px solid rgba(74,46,28,.2)", paddingBottom: 32 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Tienda</div>
            <h1 className="vp-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
              Toda la <span className="vp-italic" style={{ fontStyle: "italic" }}>colección</span>
            </h1>
          </div>
          <div style={{ fontSize: 13, color: "var(--vp-ink-muted)" }}>{filtered.length} piezas</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[
              { k: "all", l: "Todo" },
              { k: "conjunto", l: "Conjuntos" },
              { k: "arnes", l: "Arneses" },
              { k: "correa", l: "Correas" },
              { k: "bolsa", l: "Portabolsas" },
            ].map((f) => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{
                padding: "10px 20px", background: filter === f.k ? "var(--vp-brown)" : "transparent",
                color: filter === f.k ? "var(--vp-paper)" : "var(--vp-brown)",
                border: "1px solid var(--vp-brown)", cursor: "pointer",
                fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase",
                transition: "all .25s ease",
              }}>{f.l}</button>
            ))}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: "10px 16px", background: "transparent", border: "1px solid rgba(74,46,28,.3)", fontSize: 12, letterSpacing: ".1em", color: "var(--vp-brown)", cursor: "pointer" }}>
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {filtered.map((p) => (
            <ShopCard key={p.id} product={p} onClick={() => go(`/producto/${p.modelId}`)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopCard({ product, onClick }) {
  const [hover, setHover] = _useS(false);
  const { add } = useCart();
  const productImg = product.img || product.model.heroImg;
  return (
    <article onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer" }}>
      <div onClick={onClick} style={{ position: "relative", width: "100%", aspectRatio: "4/5", overflow: "hidden", background: "var(--vp-cream-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={productImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: 16, transform: hover ? "scale(1.04)" : "scale(1)", transition: "transform .7s ease" }} />
        {product.category !== "arnes" && <div style={{ position: "absolute", top: 12, right: 12, background: "var(--vp-paper)", padding: "4px 10px", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", zIndex: 2 }}>{product.category === "correa" ? "Correa" : "Bolsita"}</div>}
        <div style={{
          position: "absolute", left: 12, right: 12, bottom: 12,
          opacity: hover ? 1 : 0, transform: `translateY(${hover ? 0 : 6}px)`,
          transition: "all .3s ease",
        }}>
          <button onClick={(e) => { e.stopPropagation(); add({ modelId: product.modelId, name: product.name, type: product.type, price: product.price, img: productImg, swatch: product.model.hex.primary, size: product.cartCategory === "harness" ? "M" : null, category: product.cartCategory }); }} className="vp-btn full small" style={{ background: "var(--vp-paper)", color: "var(--vp-brown)", border: "1px solid var(--vp-brown)" }}>Añadir a la cesta</button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
        <div>
          <div className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>{product.name}</div>
          <div style={{ fontSize: 11, color: "var(--vp-ink-muted)", letterSpacing: ".12em", textTransform: "uppercase", marginTop: 2 }}>{product.type}</div>
        </div>
        <div className="vp-serif" style={{ fontSize: 18, color: "var(--vp-brown)" }}>€{product.price}</div>
      </div>
    </article>
  );
}

// ---------- PRODUCT ----------
function ProductPage({ modelId }) {
  const { go } = useRoute();
  const model = VP_MODELS.find(m => m.id === modelId) || VP_MODELS[0];
  const [size, setSize] = _useS("M");
  const [type, setType] = _useS("harness");
  const [img, setImg] = _useS(0);
  const [acc, setAcc] = _useS(new Set());
  const [sizeModalOpen, setSizeModalOpen] = _useS(false);
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
        {/* breadcrumb */}
        <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginBottom: 24 }}>
          <a onClick={() => go("/")} style={{ cursor: "pointer" }}>Inicio</a> · <a onClick={() => go("/tienda")} style={{ cursor: "pointer" }}>Tienda</a> · <span style={{ color: "var(--vp-brown)" }}>Modelo {model.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          {/* LEFT: gallery */}
          <div>
            <div style={{ width: "100%", aspectRatio: "4/5", background: "var(--vp-cream-soft)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={gallery[img].src} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: 24 }} />
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

          {/* RIGHT: details */}
          <div style={{ paddingTop: 10 }}>
            <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Colección SS26 · Diseño de autor</div>
            <h1 className="vp-display" style={{ fontSize: 64, color: "var(--vp-brown)", margin: 0, lineHeight: 1.05, paddingBottom: 4 }}>
              Modelo <span className="vp-italic" style={{ fontStyle: "italic" }}>{model.name}</span>
            </h1>
            <div style={{ fontSize: 15, color: "var(--vp-ink-muted)", marginTop: 14 }}>{model.subtitle}</div>

            {/* price */}
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24 }}>
              <span className="vp-serif" style={{ fontSize: 28, color: "var(--vp-brown)" }}>€{priceMap[type]}</span>
              <span style={{ color: "var(--vp-ink-muted)", fontSize: 13 }}>IVA incluido</span>
            </div>

            <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 28 }}>{model.description}</p>

            {/* Pantone chips */}
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

            {/* Type selector */}
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

            {/* Size selector (harness only) */}
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
                {/* size info */}
                <div style={{ marginTop: 12, padding: 14, background: "var(--vp-cream-soft)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 12 }}>
                  <div><span style={{ color: "var(--vp-ink-muted)" }}>Ancho cinta</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find(s => s.size === size).webbing}</b></div>
                  <div><span style={{ color: "var(--vp-ink-muted)" }}>Cuello</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find(s => s.size === size).neck}</b></div>
                  <div><span style={{ color: "var(--vp-ink-muted)" }}>Pecho</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find(s => s.size === size).chest}</b></div>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12 }}>
              <button className="vp-btn full" onClick={handleAdd}>Añadir a la cesta · €{priceMap[type]}</button>
              <button className="vp-btn ghost" style={{ flexShrink: 0 }} aria-label="wish">
                <Icon.Heart style={{ width: 14, height: 14 }} />
              </button>
            </div>

            {/* Perks */}
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, fontSize: 12, color: "var(--vp-ink-soft)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon.Truck style={{ width: 16, height: 16, color: "var(--vp-brown)" }}/>Envío desde 45 €</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon.Leaf style={{ width: 16, height: 16, color: "var(--vp-brown)" }}/>Diseñado en España</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon.Check style={{ width: 16, height: 16, color: "var(--vp-brown)" }}/>15 días dev.</div>
            </div>

            {/* Accordions */}
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
              ].map((a, i) => (
                <ProductAccordion key={a.k} title={a.t}>{a.c}</ProductAccordion>
              ))}
            </div>
          </div>
        </div>

        {/* "Conjunto completo" cross-sell */}
        <RelatedSet model={model} />

        {/* Parts diagram */}
        <PartsDiagram model={model} />
      </div>

      {/* Size guide modal */}
      {sizeModalOpen && <SizeGuideModal onClose={() => setSizeModalOpen(false)} onProbador={() => { setSizeModalOpen(false); go("/probador"); }} />}
    </div>
  );
}

function ProductAccordion({ title, children }) {
  const [o, setO] = _useS(false);
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
        <img src={model.partsImg} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
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

// ---------- CHECKOUT ----------
function CheckoutPage() {
  const { items, subtotal, packDiscount, totalAfterDiscount, clear } = useCart();
  const { go } = useRoute();
  const [step, setStep] = _useS(0);
  const [done, setDone] = _useS(false);
  const total = totalAfterDiscount;

  if (done) {
    return (
      <div style={{ padding: "120px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Icon.Check style={{ width: 64, height: 64, color: "var(--vp-brown)", margin: "0 auto 24px", border: "1px solid var(--vp-brown)", borderRadius: 999, padding: 16, boxSizing: "content-box" }} />
          <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Gracias</div>
          <h1 className="vp-display" style={{ fontSize: 72, color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>Tu pedido<br/><span className="vp-italic" style={{ fontStyle: "italic" }}>va en camino.</span></h1>
          <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", marginTop: 24, lineHeight: 1.65 }}>Hemos enviado los detalles a tu correo. Te agradecemos la confianza.</p>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--vp-brown)", marginTop: 24, letterSpacing: ".1em" }}>PEDIDO #VP-{Math.floor(Math.random() * 90000 + 10000)}</div>
          <button className="vp-btn" style={{ marginTop: 32 }} onClick={() => { clear(); go("/"); }}>Volver al inicio</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: "120px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Checkout</div>
          <h1 className="vp-display" style={{ fontSize: 56, color: "var(--vp-brown)", margin: 0 }}>Tu cesta está vacía.</h1>
          <button className="vp-btn" style={{ marginTop: 32 }} onClick={() => go("/tienda")}>Descubrir la tienda</button>
        </div>
      </div>
    );
  }

  const steps = ["Contacto", "Envío", "Pago"];

  return (
    <div style={{ padding: "24px 40px 80px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 className="vp-display" style={{ fontSize: 56, color: "var(--vp-brown)", margin: 0 }}>Tu pedido</h1>
          <a onClick={() => go("/tienda")} style={{ cursor: "pointer", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", borderBottom: "1px solid" }}>← Seguir comprando</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 60 }}>
          {/* Form */}
          <div>
            {/* Steps nav */}
            <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: "1px solid rgba(74,46,28,.2)" }}>
              {steps.map((s, i) => (
                <button key={s} onClick={() => setStep(i)} style={{
                  padding: "16px 24px", background: "transparent", border: "none",
                  borderBottom: step === i ? "2px solid var(--vp-brown)" : "2px solid transparent",
                  color: step === i ? "var(--vp-brown)" : "var(--vp-ink-muted)",
                  marginBottom: -1, cursor: "pointer",
                  fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", marginRight: 10 }}>0{i + 1}</span>{s}
                </button>
              ))}
            </div>

            {step === 0 && <CheckoutContact onNext={() => setStep(1)} />}
            {step === 1 && <CheckoutShipping onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step === 2 && <CheckoutPayment onPay={() => { setDone(true); }} onBack={() => setStep(1)} total={total} />}
          </div>

          {/* Summary */}
          <aside style={{ background: "var(--vp-cream-soft)", padding: 32, alignSelf: "start", position: "sticky", top: 100 }}>
            <div className="vp-eyebrow" style={{ marginBottom: 20 }}>Resumen</div>
            {items.map((it) => (
              <div key={it.key} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(74,46,28,.1)" }}>
                <div style={{ width: 56, height: 56, background: `${it.swatch}`, backgroundImage: `url(${it.img})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", position: "relative" }}>
                  <span style={{ position: "absolute", top: -6, right: -6, background: "var(--vp-brown)", color: "var(--vp-paper)", borderRadius: 999, width: 20, height: 20, display: "grid", placeItems: "center", fontSize: 10 }}>{it.qty}</span>
                </div>
                <div>
                  <div className="vp-serif" style={{ fontSize: 15, color: "var(--vp-brown)" }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: "var(--vp-ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>{it.type}{it.size ? ` · ${it.size}` : ""}</div>
                </div>
                <div className="vp-serif" style={{ fontSize: 14, color: "var(--vp-brown)" }}>€{(it.price * it.qty).toFixed(2)}</div>
              </div>
            ))}
            <div style={{ marginTop: 20, fontSize: 13, color: "var(--vp-ink-soft)" }}>
              <Row l="Subtotal" r={`€${subtotal.toFixed(2)}`} />
              {packDiscount > 0 && <Row l={<span style={{ color: "var(--vp-olive-deep)" }}>Descuento pack (-10%)</span>} r={<span style={{ color: "var(--vp-olive-deep)" }}>−€{packDiscount.toFixed(2)}</span>} />}
              <Row l="Envío" r={<span style={{ fontSize: 12 }}>Se calcula en el siguiente paso</span>} />
              <div style={{ height: 1, background: "rgba(74,46,28,.2)", margin: "14px 0" }} />
              <Row l={<span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>Total</span>} r={<span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>€{total.toFixed(2)}</span>} />
            </div>
            <div style={{ marginTop: 20, padding: 12, background: "var(--vp-paper)", fontSize: 12, color: "var(--vp-ink-soft)", display: "flex", gap: 10, alignItems: "center" }}>
              <Icon.Truck style={{ width: 18, height: 18, color: "var(--vp-brown)" }} />
              Envío gratuito a partir de 45 €
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ l, r }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>{l}</span><span>{r}</span></div>;
}

function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 20 }}>
      <span className="vp-eyebrow" style={{ display: "block", marginBottom: 8 }}>{label}</span>
      <input {...props} style={{ width: "100%", padding: "14px 0", border: "none", borderBottom: "1px solid rgba(74,46,28,.3)", background: "transparent", outline: "none", fontSize: 15, color: "var(--vp-ink)" }} />
    </label>
  );
}

function CheckoutContact({ onNext }) {
  return (
    <div>
      <Field label="Correo electrónico" placeholder="lucia@viena.pets" type="email" />
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--vp-ink-soft)", marginBottom: 30 }}>
        <input type="checkbox" /> Quiero recibir novedades y ediciones limitadas
      </label>
      <button className="vp-btn" onClick={onNext}>Continuar <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
    </div>
  );
}

function CheckoutShipping({ onNext, onBack }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Field label="Nombre" placeholder="Lucía" />
        <Field label="Apellidos" placeholder="Larrondobuno" />
      </div>
      <Field label="Dirección" placeholder="Calle, número, piso" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <Field label="Ciudad" placeholder="Madrid" />
        <Field label="Código postal" placeholder="28003" />
        <Field label="Teléfono" placeholder="+34 ..." />
      </div>
      {/* Shipping method */}
      <div style={{ marginTop: 12, marginBottom: 28 }}>
        <span className="vp-eyebrow" style={{ display: "block", marginBottom: 12 }}>Método de envío</span>
        {[
          { l: "Estándar", p: "Gratis desde 45 € · €5,90" },
          { l: "Punto de recogida", p: "€3,90" },
        ].map((o, i) => (
          <label key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", border: "1px solid rgba(74,46,28,.2)", marginBottom: 8, cursor: "pointer" }}>
            <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input type="radio" name="ship" defaultChecked={i === 0} />
              <span>{o.l}</span>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--vp-brown)" }}>{o.p}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button className="vp-btn ghost" onClick={onBack}><Icon.ArrowLeft style={{ width: 14, height: 14 }} /> Atrás</button>
        <button className="vp-btn" onClick={onNext}>Ir al pago <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
      </div>
    </div>
  );
}

function CheckoutPayment({ onPay, onBack, total }) {
  const [loading, setLoading] = _useS(false);
  const pay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onPay(); }, 1400);
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {["Tarjeta", "PayPal", "Bizum"].map((m, i) => (
          <button key={m} style={{ padding: "14px 0", border: "1px solid var(--vp-brown)", background: i === 0 ? "var(--vp-brown)" : "transparent", color: i === 0 ? "var(--vp-paper)" : "var(--vp-brown)", cursor: "pointer", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase" }}>{m}</button>
        ))}
      </div>
      <Field label="Número de tarjeta" placeholder="4242 4242 4242 4242" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <Field label="Caducidad" placeholder="MM/AA" />
        <Field label="CVC" placeholder="123" />
        <Field label="Código postal" placeholder="28003" />
      </div>
      <div style={{ padding: "14px 16px", background: "var(--vp-cream-soft)", fontSize: 12, color: "var(--vp-ink-soft)", marginBottom: 24, display: "flex", gap: 10 }}>
        <Icon.Check style={{ width: 18, height: 18, color: "var(--vp-brown)" }} />
        Pago encriptado end-to-end. No guardamos datos de tarjeta.
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button className="vp-btn ghost" onClick={onBack}><Icon.ArrowLeft style={{ width: 14, height: 14 }} /> Atrás</button>
        <button className="vp-btn" disabled={loading} onClick={pay}>{loading ? "Procesando..." : `Pagar €${total.toFixed(2)}`} {!loading && <Icon.Arrow style={{ width: 14, height: 14 }} />}</button>
      </div>
    </div>
  );
}

// ---------- HISTORY ----------
function HistoryPage() {
  const { go } = useRoute();
  return (
    <div style={{ padding: "40px 40px 80px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", marginBottom: 120 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Nuestra historia</div>
            <h1 className="vp-display" style={{ fontSize: "clamp(60px, 7vw, 120px)", color: "var(--vp-brown)", margin: 0, lineHeight: .9 }}>
              El estudio<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>de</span> Lucía.
            </h1>
          </div>
          <div style={{ width: "100%", height: 560, borderRadius: "300px 300px 4px 4px", overflow: "hidden", background: "var(--vp-cream-deep)" }}>
            <img src="assets/capri-conjunto.jpeg" alt="Estampado Capri" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, fontSize: 18, color: "var(--vp-ink-soft)", lineHeight: 1.8, fontFamily: "var(--font-serif)", fontWeight: 300 }}>
          <p>Lucía Larrondobuno fundó Viena Pets porque no encontraba lo que buscaba: accesorios para perros con un diseño cuidado, pensados como pieza de moda y no como producto de tienda genérica.</p>
          <p>El proceso empieza en papel. Cada colección parte de un estampado original — un dibujo que se traduce después a tejido, herrajes y patronística adaptada al cuerpo del perro. La intención manda en cada decisión.</p>
          <p>Hoy Viena Pets es una marca de diseño de autor con sede en Madrid. Cada colección se produce en ediciones limitadas — porque la exclusividad es parte del valor, y porque hacer las cosas con cuidado lleva tiempo.</p>
        </div>
      </div>
    </div>
  );
}

// ---------- MODELS INDEX ----------
function ModelsPage() {
  const { go } = useRoute();
  return (
    <div style={{ padding: "40px 40px 80px" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ marginBottom: 48, borderBottom: "1px solid rgba(74,46,28,.2)", paddingBottom: 32 }}>
          <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Modelos</div>
          <h1 className="vp-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>Capri <span className="vp-italic" style={{ fontStyle: "italic" }}>·</span> Peachy <span className="vp-italic" style={{ fontStyle: "italic" }}>·</span> Daisy</h1>
        </div>
        {VP_MODELS.map((m, i) => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1.1fr 1fr" : "1fr 1.1fr", gap: 80, alignItems: "center", padding: "80px 0", borderBottom: "1px solid rgba(74,46,28,.12)" }}>
            <div style={{ order: i % 2 === 0 ? 0 : 1, width: "100%", height: 520, overflow: "hidden", background: "var(--vp-cream-soft)" }}>
              <img src={m.heroImg} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
            </div>
            <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
              <div className="vp-eyebrow" style={{ marginBottom: 14, color: "var(--vp-ink-muted)" }}>Modelo 0{i + 1} / 03</div>
              <h2 className="vp-display" style={{ fontSize: 88, color: "var(--vp-brown)", margin: 0, lineHeight: .9 }}>{m.name}</h2>
              <p style={{ fontSize: 17, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 24, maxWidth: 480 }}>{m.description}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <div style={{ width: 40, height: 40, background: m.hex.primary }} />
                <div style={{ width: 40, height: 40, background: m.hex.secondary }} />
              </div>
              <button className="vp-btn" style={{ marginTop: 32 }} onClick={() => go(`/producto/${m.id}`)}>Descubrir {m.name} <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PÁGINA PROBADOR VIRTUAL (mockup, sin lógica IA real)
// ============================================
function ProbadorPage() {
  const { go } = useRoute();
  const [selectedModel, setSelectedModel] = _useS("capri");
  const [hasUpload, setHasUpload] = _useS(false);

  return (
    <div style={{ background: "var(--vp-cream)", minHeight: "100vh" }}>
      {/* Hero de la página */}
      <section style={{
        padding: "80px 40px 60px",
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

      {/* Zona de trabajo */}
      <section style={{
        padding: "80px 40px",
        maxWidth: 1200,
        margin: "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "start",
        }}>
          {/* Lado izquierdo — selector de modelo + upload */}
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

          {/* Lado derecho — preview del resultado */}
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

      {/* FAQ rápido */}
      <section style={{
        padding: "60px 40px 100px",
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

// ============================================
// PÁGINA GUÍA DE TALLAS (página propia)
// ============================================
function GuiaDeTallasPage() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "40px 20px 80px" : "40px 40px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* breadcrumb */}
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

        {/* Tabla de medidas */}
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

        {/* Notas */}
        <div style={{ padding: 20, background: "var(--vp-cream-soft)", fontSize: 14, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginBottom: 24 }}>
          <b style={{ color: "var(--vp-brown)" }}>Correa:</b> talla única — ancho de cinta {VP_LEASH_SIZE.webbing}, longitud total {VP_LEASH_SIZE.length}.<br/>
          <b style={{ color: "var(--vp-brown)" }}>Portabolsas:</b> talla única.
        </div>

        {/* CTA Probador IA */}
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

        {/* Volver a tienda */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <button className="vp-btn ghost" onClick={() => go("/tienda")}>Ir a la tienda →</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ShopPage, ProductPage, CheckoutPage, HistoryPage, ModelsPage, ProbadorPage, SizeGuideModal, GuiaDeTallasPage });
