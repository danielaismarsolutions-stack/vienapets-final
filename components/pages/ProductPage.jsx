"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import { useCart } from "@/components/shared/CartProvider";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { useTilt } from "@/lib/useTilt";
import { VP_SIZES, VP_HARDWARE } from "@/lib/data";
import SizeGuide from "@/components/shared/SizeGuide";
import { SizeGuideTable } from "@/components/shared/SizeGuideTable";
import { PRODUCT_IMAGES } from "@/scripts/product-images";
import { LQIP_CREAM } from "@/lib/lqip";

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
  const isMobile = useIsMobile();
  const meta = product.meta ?? {};
  const isArnes = product.category === "arnes";
  const isConjunto = product.category === "conjunto";
  // Arnés y Conjunto eligen talla. En el conjunto la talla es la del arnés:
  // determina de qué arnés del modelo se descontará stock al comprar.
  const needsSize = isArnes || isConjunto;

  // Estado: índice de imagen + variante seleccionada.
  const [img, setImg] = useState(0);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const { ref: tiltRef, onMouseMove: tiltMove, onMouseLeave: tiltLeave } = useTilt(7);

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

  // Disponibilidad por talla. Arnés: stock de su propia variante. Conjunto:
  // unidades de set que se pueden formar con los componentes (arnés talla +
  // correa + portabolsas), que llega como product.conjunto_sizes desde el server.
  const availableBySize = useMemo(() => {
    const m = new Map();
    if (isArnes) {
      for (const s of ALL_SIZES) m.set(s, (variantBySize.get(s)?.in_stock === true));
    } else if (isConjunto) {
      const sizes = product.conjunto_sizes ?? {};
      for (const s of ALL_SIZES) m.set(s, (sizes[s] ?? 0) > 0);
    }
    return m;
  }, [isArnes, isConjunto, variantBySize, product.conjunto_sizes]);

  const initialSize = useMemo(() => {
    if (!needsSize) return null;
    const inStock = ALL_SIZES.find((s) => availableBySize.get(s));
    return inStock ?? "M";
  }, [needsSize, availableBySize]);

  const [size, setSize] = useState(initialSize);
  // El conjunto se vende con el SKU del bundle (variante talla única = null),
  // que aporta el precio y el stripe_price_id; el stock se descuenta luego de
  // los componentes. El arnés usa la variante de la talla elegida.
  const currentVariant = isArnes ? variantBySize.get(size) : variantBySize.get(null);
  const canBuy = isConjunto
    ? (availableBySize.get(size) === true && !!currentVariant)
    : currentVariant?.in_stock === true;

  // Fuente de verdad: Supabase (product.images). Fallback: PRODUCT_IMAGES map.
  // Si Supabase sólo tiene 1 imagen, completamos con la galería del map.
  const images = useMemo(() => {
    const supaImgs = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [];
    const mapEntry = PRODUCT_IMAGES[product.slug];
    if (supaImgs.length >= 2) {
      // Para conjuntos: garantizar que la foto producto-puro (sobre fondo crema)
      // sea siempre la primera imagen de la galería.
      // TODO: solución definitiva → añadir {modelo}-conjunto.webp como primera
      // entrada del array images[] en Supabase para cada producto de categoría conjunto.
      if (product.category === "conjunto" && mapEntry?.main) {
        const productPura = mapEntry.main;
        if (supaImgs[0] !== productPura) {
          const rest = supaImgs.filter((s) => s !== productPura);
          return [productPura, ...rest].slice(0, 4);
        }
      }
      return supaImgs;
    }
    if (mapEntry) {
      const main = supaImgs[0] ?? mapEntry.main;
      return [main, ...mapEntry.gallery.map((g) => g.src)].filter(Boolean);
    }
    return supaImgs.length > 0 ? supaImgs : [meta.heroImg].filter(Boolean);
  }, [product.images, product.slug, product.category, meta.heroImg]);

  const heroImg = images[img] ?? images[0] ?? null;

  // Alt text para la imagen activa (de PRODUCT_IMAGES si disponible)
  const heroAlt = useMemo(() => {
    const mapEntry = PRODUCT_IMAGES[product.slug];
    if (!mapEntry) return product.name;
    if (img === 0) return mapEntry.mainAlt ?? product.name;
    return mapEntry.gallery[img - 1]?.alt ?? product.name;
  }, [product.slug, product.name, img]);

  const typeLabel = TYPE_LABEL[product.category] ?? "";
  const cartCategory = CART_CATEGORY[product.category] ?? product.category;
  const swatch = meta.hex?.primary ?? "#816754";

  const handleAdd = () => {
    if (!canBuy || !currentVariant) return;
    add({
      // variantId es la identidad de línea y lo que el checkout valida en Supabase.
      variantId: currentVariant.id,
      modelId: product.model,
      slug: product.slug,
      name: product.name,
      type: typeLabel,
      price: product.price_eur, // EUR para presentación
      price_cents: product.price_cents, // céntimos para el cálculo del pedido
      img: heroImg,
      swatch,
      // size: talla mostrada en la cesta (arnés y conjunto).
      size: needsSize ? size : null,
      // harnessSize: talla del arnés del conjunto; viaja hasta el webhook para
      // descontar el arnés correcto del modelo. null para productos sueltos.
      harnessSize: isConjunto ? size : null,
      category: cartCategory,
      sku: currentVariant.sku ?? null,
    });
  };

  return (
    <div style={{ padding: isMobile ? "16px 20px 60px" : "24px 40px 80px" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)", marginBottom: 24 }}>
          <a onClick={() => go("/")} style={{ cursor: "pointer" }}>Inicio</a> · <a onClick={() => go("/tienda")} style={{ cursor: "pointer" }}>Tienda</a> · <span style={{ color: "var(--vp-brown)" }}>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 28 : 80 }}>
          <div>
            {/* Imagen principal — 4:5, recorte de estudio con contain + tilt 3D */}
            <div
              ref={tiltRef}
              onMouseMove={isMobile ? undefined : tiltMove}
              onMouseLeave={isMobile ? undefined : tiltLeave}
              style={{
                width: "100%", aspectRatio: "4/5",
                background: "var(--vp-cream)",
                overflow: "hidden", position: "relative", borderRadius: 2,
                boxShadow: "0 4px 24px rgba(42,29,18,.07)",
                willChange: "transform",
              }}
            >
              {heroImg && (
                <div key={heroImg} style={{ position: "absolute", inset: 0, animation: "vpImgFade .35s ease" }}>
                  <Image
                    fill
                    src={heroImg}
                    alt={heroAlt}
                    style={{
                      objectFit: "contain",
                      inset: "2%",
                      filter: "drop-shadow(0 14px 22px rgba(70,50,30,.18)) drop-shadow(0 4px 6px rgba(70,50,30,.12))",
                      animation: "vpFloat 4s ease-in-out infinite",
                    }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    placeholder="blur"
                    blurDataURL={LQIP_CREAM}
                  />
                </div>
              )}
              <div style={{ position: "absolute", top: 16, left: 16, background: "var(--vp-paper)", padding: "6px 12px", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", zIndex: 1 }}>
                {typeLabel}
              </div>
            </div>

            {/* Tira de miniaturas — 1:1 */}
            {images.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`, gap: 8, marginTop: 10 }}>
                {images.slice(0, 4).map((src, i) => {
                  const thumbAlt = (() => {
                    const mapEntry = PRODUCT_IMAGES[product.slug];
                    if (!mapEntry) return product.name;
                    if (i === 0) return mapEntry.mainAlt ?? product.name;
                    return mapEntry.gallery[i - 1]?.alt ?? product.name;
                  })();
                  return (
                    <button
                      key={src + i}
                      onClick={() => setImg(i)}
                      style={{
                        aspectRatio: "1/1",
                        padding: 0,
                        position: "relative",
                        overflow: "hidden",
                        background: "var(--vp-cream)",
                        border: img === i ? "2px solid var(--vp-brown)" : "2px solid transparent",
                        opacity: img === i ? 1 : .7,
                        cursor: "pointer",
                        transition: "all .2s ease",
                        borderRadius: 2,
                      }}
                    >
                      <Image
                        fill
                        src={src}
                        alt={thumbAlt}
                        loading="lazy"
                        style={{ objectFit: "contain", inset: "2%" }}
                        sizes="15vw"
                        placeholder="blur"
                        blurDataURL={LQIP_CREAM}
                      />
                    </button>
                  );
                })}
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

            {needsSize && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <span className="vp-eyebrow">{isConjunto ? "Talla del arnés" : "Talla"} · {size ?? "—"}</span>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <a onClick={openSizeModal} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-brown)", color: "var(--vp-brown)", cursor: "pointer" }}>Guía de tallas</a>
                    <a onClick={() => go("/guia-de-tallas")} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-brown)", color: "var(--vp-brown)", cursor: "pointer" }}>Ver completa</a>
                    <a onClick={() => go("/probador")} style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", borderBottom: "1px solid var(--vp-olive-deep)", color: "var(--vp-olive-deep)", cursor: "pointer" }}>✦ Probador IA</a>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {ALL_SIZES.map((s) => {
                    const out = !availableBySize.get(s);
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

            {!needsSize && currentVariant && !canBuy && (
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

            {product.category === "conjunto" && (
              <SizeGuideTable variant="product" />
            )}

            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, fontSize: 12, color: "var(--vp-ink-soft)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon.Truck style={{ width: 16, height: 16, color: "var(--vp-brown)" }}/>Envío gratis desde 60 €</div>
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

        {product.model && <DetallesSection model={product.model} modelName={product.name} />}
      </div>

      {sizeModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={closeSizeModal} style={{ position: "absolute", inset: 0, background: "rgba(42,29,18,.55)", backdropFilter: "blur(3px)" }} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-modal-heading"
            style={{ position: "relative", background: "var(--vp-paper)", maxWidth: 760, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "clamp(20px, 4vw, 44px)" }}
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

function DetallesSection({ model, modelName }) {
  const mainSrc = `/images/productos/${model}-detalle.webp`;
  const fallbackSrc = `/images/productos/${model}-main.webp`;
  const [src, setSrc] = useState(mainSrc);

  return (
    <section style={{ padding: "80px 32px", textAlign: "center", maxWidth: 880, margin: "0 auto" }}>
      <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#A89684", marginBottom: 24 }}>— Detalles</p>
      <h2 className="vp-display" style={{ fontFamily: "var(--vp-serif)", fontSize: "clamp(32px, 5vw, 48px)", color: "var(--vp-brown)", marginBottom: 16, lineHeight: 1.05 }}>
        Herrajes en marrón mate
      </h2>
      <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--vp-brown)", maxWidth: "48ch", margin: "0 auto 48px" }}>
        Acabado cobre cálido en cada pieza, coherente con la paleta del modelo.
      </p>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", background: "var(--vp-cream)" }}>
        <Image
          src={src}
          alt={`Detalle de herrajes ${modelName}`}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          style={{ objectFit: "cover", objectPosition: "center" }}
          loading="lazy"
          onError={() => setSrc(fallbackSrc)}
        />
      </div>
    </section>
  );
}

