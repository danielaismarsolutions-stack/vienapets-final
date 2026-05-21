"use client";

import { useEffect, useMemo, useState } from "react";
import { useRoute } from "@/components/shared/useRoute";
import { useCart } from "@/components/shared/CartProvider";
import { VP_MODELS } from "@/lib/data";

const CAT_URL_TO_KEY = { conjuntos: "conjunto", arneses: "arnes", correas: "correa", portabolsas: "bolsa", accesorios: "bolsa" };

export function ShopPage() {
  const { go, route } = useRoute();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("featured");

  // Leer ?cat= de la URL al montar y cada vez que cambia. Mantiene la lógica
  // del legacy que parsea desde el string completo de la ruta.
  useEffect(() => {
    try {
      const r = route || "";
      const qIdx = r.indexOf("?");
      if (qIdx === -1) { setFilter("all"); return; }
      const params = new URLSearchParams(r.slice(qIdx + 1));
      const cat = params.get("cat");
      if (cat && CAT_URL_TO_KEY[cat]) setFilter(CAT_URL_TO_KEY[cat]);
      else setFilter("all");
    } catch (e) {}
  }, [route]);

  // Expandir: conjunto + arnés + correa + portabolsas de cada modelo
  const products = useMemo(() => {
    const out = [];
    VP_MODELS.forEach((m) => {
      const harnessImg = m.harnessImg || m.heroImg;
      const leashImg = m.leashImg || m.heroImg;
      const bagImg = m.bagImg || m.heroImg;
      const setPriceRaw = m.priceHarness + m.priceLeash + m.priceBag;
      const setPrice = Math.round(setPriceRaw * 0.9 * 100) / 100;
      out.push({ id: `${m.id}-set`,     modelId: m.id, type: "Conjunto completo", name: `Conjunto ${m.name}`, price: setPrice,        model: m, category: "conjunto", cartCategory: "conjunto", img: m.heroImg, fit: "contain" });
      out.push({ id: `${m.id}-harness`, modelId: m.id, type: "Arnés",             name: `Arnés ${m.name}`,    price: m.priceHarness,  model: m, category: "arnes",    cartCategory: "harness",  img: harnessImg, fit: "contain" });
      out.push({ id: `${m.id}-leash`,   modelId: m.id, type: "Correa",            name: `Correa ${m.name}`,   price: m.priceLeash,    model: m, category: "correa",   cartCategory: "leash",    img: leashImg,   fit: "contain" });
      out.push({ id: `${m.id}-bag`,     modelId: m.id, type: "Portabolsas",       name: `Portabolsas ${m.name}`, price: m.priceBag,   model: m, category: "bolsa",     cartCategory: "bag",      img: bagImg,     fit: "contain" });
    });
    return out;
  }, []);

  const filtered = useMemo(() => {
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
  const [hover, setHover] = useState(false);
  const { add } = useCart();
  const productImg = product.img || product.model.heroImg;
  return (
    <article onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer" }}>
      <div onClick={onClick} style={{ position: "relative", width: "100%", aspectRatio: "4/5", overflow: "hidden", background: "var(--vp-cream-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={productImg} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: 16, transform: hover ? "scale(1.04)" : "scale(1)", transition: "transform .7s ease" }} />
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
