"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useRoute } from "@/components/shared/useRoute";
import { useCart } from "@/components/shared/CartProvider";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { useTilt } from "@/lib/useTilt";
import { LQIP_CREAM } from "@/lib/lqip";

// La categoría llega desde el server (mapeada a la del esquema BBDD: arnes,
// correa, portabolsas, conjunto). El filtro de UI navega por URL para que el
// server vuelva a consultar — así el contador refleja siempre la BBDD.
const FILTERS = [
  { db: null,           urlCat: null,           label: "Todo" },
  { db: "conjunto",     urlCat: "conjuntos",    label: "Conjuntos" },
  { db: "arnes",        urlCat: "arneses",      label: "Arneses" },
  { db: "correa",       urlCat: "correas",      label: "Correas" },
  { db: "portabolsas",  urlCat: "portabolsas",  label: "Portabolsas" },
];

const TYPE_LABEL = {
  arnes: "Arnés",
  correa: "Correa",
  portabolsas: "Portabolsas",
  conjunto: "Conjunto completo",
};

// Categoría usada por el carrito (Sprint 1) — se mantiene la enum del legacy
// para no romper el flujo del CartProvider hasta Sprint 3.
const CART_CATEGORY = {
  arnes: "harness",
  correa: "leash",
  portabolsas: "bag",
  conjunto: "conjunto",
};

export function ShopPage({ products = [], initialCategory = null }) {
  const { go } = useRoute();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [sort, setSort] = useState("featured");

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === "price-asc") arr.sort((a, b) => a.price_eur - b.price_eur);
    if (sort === "price-desc") arr.sort((a, b) => b.price_eur - a.price_eur);
    return arr;
  }, [products, sort]);

  const setFilter = (urlCat) => {
    router.push(urlCat ? `/tienda?cat=${urlCat}` : "/tienda");
  };

  return (
    <div style={{ padding: isMobile ? "24px 20px 60px" : "40px 40px 80px" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 48, borderBottom: "1px solid rgba(74,46,28,.2)", paddingBottom: 32 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Tienda</div>
            <h1 className="vp-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>
              Toda la <span className="vp-italic" style={{ fontStyle: "italic" }}>colección</span>
            </h1>
          </div>
          <div style={{ fontSize: 13, color: "var(--vp-ink-muted)" }}>{sorted.length} piezas</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {FILTERS.map((f) => {
              const active = initialCategory === f.db;
              return (
                <button key={f.label} onClick={() => setFilter(f.urlCat)} style={{
                  padding: "10px 20px", background: active ? "var(--vp-brown)" : "transparent",
                  color: active ? "var(--vp-paper)" : "var(--vp-brown)",
                  border: "1px solid var(--vp-brown)", cursor: "pointer",
                  fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase",
                  transition: "all .25s ease",
                }}>{f.label}</button>
              );
            })}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: "10px 16px", background: "transparent", border: "1px solid rgba(74,46,28,.3)", fontSize: 12, letterSpacing: ".1em", color: "var(--vp-brown)", cursor: "pointer" }}>
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 20 : 40 }}>
          {sorted.map((p) => (
            <ShopCard
              key={p.id}
              product={p}
              onClick={() => p.in_stock !== false && go(`/producto/${p.slug}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ShopCard({ product, onClick }) {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  const { add } = useCart();
  const { ref, onMouseMove, onMouseLeave } = useTilt(8);
  const productImg = product.image || product.meta?.heroImg || null;
  const swatch = product.meta?.hex?.primary ?? "#816754";
  const typeLabel = TYPE_LABEL[product.category] ?? "";
  const cartCategory = CART_CATEGORY[product.category] ?? product.category;
  const agotado = product.in_stock === false;

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); if (!isMobile) onMouseLeave(); }}
      onMouseMove={isMobile ? undefined : onMouseMove}
      style={{ cursor: agotado ? "not-allowed" : "pointer", opacity: agotado ? .55 : 1 }}
    >
      <div
        ref={ref}
        onClick={onClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          background: "var(--vp-cream-soft)",
          borderRadius: 2,
          boxShadow: hover && !agotado
            ? "0 8px 32px rgba(42,29,18,.12)"
            : "0 2px 12px rgba(42,29,18,.06)",
          transition: "box-shadow .4s ease",
          willChange: "transform",
          overflow: "hidden",
        }}
      >
        {productImg && (
          <Image
            fill
            src={productImg}
            alt={product.name}
            loading="lazy"
            priority={false}
            style={{
              objectFit: "contain",
              inset: "2%",
              filter: hover && !agotado
                ? "drop-shadow(0 18px 28px rgba(70,50,30,.22)) drop-shadow(0 6px 10px rgba(70,50,30,.14))"
                : "drop-shadow(0 10px 18px rgba(70,50,30,.16)) drop-shadow(0 3px 6px rgba(70,50,30,.10))",
              transition: "filter .4s ease",
              animation: "vpFloat 4s ease-in-out infinite",
            }}
            sizes="(max-width: 768px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={LQIP_CREAM}
          />
        )}
        {agotado && (
          <div style={{ position: "absolute", top: 12, left: 12, background: "var(--vp-brown)", color: "var(--vp-paper)", padding: "5px 12px", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", zIndex: 3 }}>Agotado</div>
        )}
        {!agotado && product.category !== "arnes" && product.category !== "conjunto" && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "var(--vp-paper)", padding: "4px 10px", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", zIndex: 2 }}>{typeLabel}</div>
        )}
        {!agotado && (
          <div style={{
            position: "absolute", left: 12, right: 12, bottom: 12,
            opacity: hover ? 1 : 0, transform: `translateY(${hover ? 0 : 6}px)`,
            transition: "all .3s ease",
            zIndex: 3,
          }}>
            <button onClick={(e) => {
              e.stopPropagation();
              add({
                modelId: product.model,
                slug: product.slug,
                name: product.name,
                type: typeLabel,
                price: product.price_eur,
                img: productImg,
                swatch,
                size: product.category === "arnes" ? "M" : null,
                category: cartCategory,
              });
            }} className="vp-btn full small" style={{ background: "var(--vp-paper)", color: "var(--vp-brown)", border: "1px solid var(--vp-brown)" }}>Añadir a la cesta</button>
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
        <div>
          <div className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>{product.name}</div>
          <div style={{ fontSize: 11, color: "var(--vp-ink-muted)", letterSpacing: ".12em", textTransform: "uppercase", marginTop: 2 }}>{typeLabel}</div>
        </div>
        <div className="vp-serif" style={{ fontSize: 18, color: "var(--vp-brown)" }}>€{product.price_eur}</div>
      </div>
    </article>
  );
}
