"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import { useCart } from "@/components/shared/CartProvider";
import { VP_SIZES, VP_HARDWARE } from "@/lib/data";
import SizeGuide from "@/components/shared/SizeGuide";

const TYPE_LABEL = {
  arnes: "Arnés",
  correa: "Correa",
  portabolsas: "Portabolsas",
  conjunto: "Conjunto completo",
};

const CART_CATEGORY = {
  arnes: "harness",
  correa: "leash",
  portabolsas: "bag",
  conjunto: "conjunto",
};

const ALL_SIZES = ["XS", "S", "M", "L"];

export function ProductPage({ product }) {
  const { go } = useRoute();
  const { add } = useCart();
  const meta = product.meta ?? {};
  const isArnes = product.category === "arnes";

  // Estado: índice de imagen + variante seleccionada.
  const [img, setImg] = useState(0);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  // Refs para gestión de foco del modal de tallas.
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);

  // Abre el modal guardando el elemento que tenía el foco.
  const openSizeModal = () => {
    prevFocusRef.current = document.activeElement;
    setSizeModalOpen(true);
  };

  // Cierra el modal y devuelve el foco al disparador original.
  const closeSizeModal = () => {
    setSizeModalOpen(false);
    prevFocusRef.current?.focus();
    prevFocusRef.current = null;
  };

  // Mueve el foco al botón de cierre al abrir el modal.
  useEffect(() => {
    if (sizeModalOpen) {
      requestAnimationFrame(() => closeBtnRef.current?.focus());
    }
  }, [sizeModalOpen]);

  // Cierra el modal con Escape.
  useEffect(() => {
    if (!sizeModalOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") closeSizeModal(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [sizeModalOpen]);

  const variantBySize = useMemo(() => {
    const m = new Map();
    for (const v of (product.variants ?? [])) m.set(v.size ?? null, v);
    return m;
  }, [product.variants]);

  const initialSize = useMemo(() => {
    if (!isArnes) return null;
    const inStock = ALL_SIZES.find((s) => variantBySize.get(s)?.in_stock);
    return inStock ?? "M";
  }, [isArnes, variantBySize]);

  const [size, setSize] = useState(initialSize);
  const currentVariant = isArnes ? variantBySize.get(size) : variantBySize.get(null);
  const canBuy = currentVariant?.in_stock === true;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [meta.heroImg].filter(Boolean);
  const heroImg = images[img] ?? images[0] ?? null;

  const typeLabel = TYPE_LABEL[product.category] ?? "";
  const cartCategory = CART_CATEGORY[product.category] ?? product.category;
  const swatch = meta.hex?.primary ?? "#816754";

  const handleAdd = () => {
    if (!canBuy) return;
    add({
      modelId: product.model,
      slug: product.slug,
      name: product.name,
      type: typeLabel,
      price: product.price_eur,
      img: heroImg,
      swatch,
      size: isArnes ? size : null,
      category: cartCategory,
      sku: currentVariant?.sku ?? null,
    });
  };

  return (
    <div style={{ padding: "24px 40px 80px" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginBottom: 24 }}>
          <a onClick={() => go("/")} style={{ cursor: "pointer" }}>Inicio</a> · <a onClick={() => go("/tienda")} style={{ cursor: "pointer" }}>Tienda</a> · <span style={{ color: "var(--vp-brown)" }}>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div>
            <div style={{ width: "100%", aspectRatio: "4/5", background: "var(--vp-cream-soft)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {heroImg && <img src={heroImg} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block", padding: 24 }} />}
              <div style={{ position: "absolute", top: 16, left: 16, background: "var(--vp-paper)", padding: "6px 12px", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)" }}>
                {typeLabel}
              </div>
            </div>
            {images.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`, gap: 12, marginTop: 12 }}>
                {images.slice(0, 4).map((src, i) => (
                  <button key={src + i} onClick={() => setImg(i)} style={{ aspectRatio: "1/1", padding: 0, backgroundImage: `url(${src})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundColor: "var(--vp-cream-soft)", border: img === i ? "1px solid var(--vp-brown)" : "1px solid transparent", opacity: img === i ? 1 : .7, cursor: "pointer", transition: "all .2s ease" }} />
                ))}
              </div>
            )}
          </div>

          <div style={{ paddingTop: 10 }}>
            <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Edición limitada · Diseño de autor</div>
            <h1 className="vp-display" style={{ fontSize: 64, color: "var(--vp-brown)", margin: 0, lineHeight: 1.05, paddingBottom: 4 }}>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>{product.name}</span>
            </h1>
            {meta.subtitle && <div style={{ fontSize: 15, color: "var(--vp-ink-muted)", marginTop: 14 }}>{meta.subtitle}</div>}

            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24 }}>
              <span className="vp-serif" style={{ fontSize: 28, color: "var(--vp-brown)" }}>€{product.price_eur}</span>
              <span style={{ color: "var(--vp-ink-muted)", fontSize: 13 }}>IVA incluido</span>
            </div>

            <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 28 }}>{product.description}</p>

            {meta.pantones?.length > 0 && (
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                {meta.pantones.map((p, i) => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--vp-cream-soft)", padding: "8px 12px" }}>
                    <div style={{ width: 20, height: 20, background: i === 0 ? meta.hex.primary : meta.hex.secondary, border: "1px solid rgba(74,46,28,.2)" }} />
                    <div>
                      <div style={{ fontSize: 9, letterSpacing: ".15em", color: "var(--vp-ink-muted)" }}>PANTONE®</div>
                      <div style={{ fontSize: 11, color: "var(--vp-brown)", fontWeight: 500 }}>{p}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ height: 1, background: "rgba(74,46,28,.15)", margin: "36px 0 28px" }} />

            {isArnes && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span className="vp-eyebrow">Talla · {size ?? "—"}</span>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <a onClick={openSizeModal} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-brown)", color: "var(--vp-brown)", cursor: "pointer" }}>Guía de tallas</a>
                    <a onClick={() => go("/guia-de-tallas")} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-brown)", color: "var(--vp-brown)", cursor: "pointer" }}>Ver completa</a>
                    <a onClick={() => go("/probador")} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-olive-deep)", color: "var(--vp-olive-deep)", cursor: "pointer" }}>✦ Probador IA</a>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {ALL_SIZES.map((s) => {
                    const v = variantBySize.get(s);
                    const out = !v || !v.in_stock;
                    const selected = size === s;
                    return (
                      <button
                        key={s}
                        onClick={() => !out && setSize(s)}
                        disabled={out}
                        title={out ? "Agotado" : undefined}
                        style={{
                          padding: "16px 0",
                          background: selected && !out ? "var(--vp-brown)" : "transparent",
                          color: out ? "var(--vp-ink-muted)" : selected ? "var(--vp-paper)" : "var(--vp-brown)",
                          border: "1px solid var(--vp-brown)",
                          cursor: out ? "not-allowed" : "pointer",
                          opacity: out ? .45 : 1,
                          fontSize: 13, fontWeight: 500, letterSpacing: ".1em",
                          textDecoration: out ? "line-through" : "none",
                          position: "relative",
                        }}
                      >
                        {s}
                        {out && <span style={{ display: "block", fontSize: 8, letterSpacing: ".18em", marginTop: 2, textDecoration: "none" }}>Agotado</span>}
                      </button>
                    );
                  })}
                </div>
                {size && VP_SIZES.find((s) => s.size === size) && (
                  <div style={{ marginTop: 12, padding: 14, background: "var(--vp-cream-soft)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 12 }}>
                    <div><span style={{ color: "var(--vp-ink-muted)" }}>Ancho cinta</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find((s) => s.size === size).webbing}</b></div>
                    <div><span style={{ color: "var(--vp-ink-muted)" }}>Cuello</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find((s) => s.size === size).neck}</b></div>
                    <div><span style={{ color: "var(--vp-ink-muted)" }}>Pecho</span><br/><b style={{ color: "var(--vp-brown)" }}>{VP_SIZES.find((s) => s.size === size).chest}</b></div>
                  </div>
                )}
              </div>
            )}

            {!isArnes && currentVariant && !canBuy && (
              <div style={{ marginBottom: 20, padding: "10px 14px", background: "var(--vp-cream-soft)", color: "var(--vp-brown)", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase" }}>
                Agotado temporalmente
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="vp-btn full"
                onClick={handleAdd}
                disabled={!canBuy}
                style={!canBuy ? { opacity: .5, cursor: "not-allowed" } : undefined}
              >
                {canBuy ? `Añadir a la cesta · €${product.price_eur}` : "Agotado"}
              </button>
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

        {meta.partsImg && <PartsDiagram partsImg={meta.partsImg} name={product.name} />}
      </div>

      {sizeModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={closeSizeModal} style={{ position: "absolute", inset: 0, background: "rgba(42,29,18,.55)", backdropFilter: "blur(3px)" }} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-modal-heading"
            style={{ position: "relative", background: "var(--vp-paper)", maxWidth: 760, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "40px 44px" }}
          >
            <button ref={closeBtnRef} onClick={closeSizeModal} aria-label="Cerrar" style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", cursor: "pointer", color: "var(--vp-brown)" }}>
              <Icon.Close style={{ width: 22, height: 22 }} />
            </button>
            <SizeGuide
              variant="modal"
              headingId="size-guide-modal-heading"
              onProbador={() => { closeSizeModal(); go("/probador"); }}
            />
          </div>
        </div>
      )}
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

function PartsDiagram({ partsImg, name }) {
  return (
    <section style={{ marginTop: 100, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
      <div style={{ position: "relative", width: "100%", height: 520, background: "var(--vp-cream-soft)", overflow: "hidden" }}>
        <img src={partsImg} alt={`Herrajes ${name}`} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
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

