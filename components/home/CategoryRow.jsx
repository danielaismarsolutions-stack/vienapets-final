"use client";

import Image from "next/image";
import { useState } from "react";
import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { useTilt } from "@/lib/useTilt";
import { CATEGORY_IMAGES } from "@/scripts/product-images";
import { LQIP_CREAM } from "@/lib/lqip";

const CATS = [
  { label: "Conjuntos",    to: "/tienda?cat=conjuntos",    imgKey: "conjunto" },
  { label: "Arneses",      to: "/tienda?cat=arneses",      imgKey: "arnes" },
  { label: "Correas",      to: "/tienda?cat=correas",      imgKey: "correa" },
  { label: "Portabolsas",  to: "/tienda?cat=portabolsas",  imgKey: "portabolsas" },
  { label: "Probador IA",  to: "/probador",                imgKey: null, isNew: true },
];

export function CategoryRow() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? "40px 20px 32px" : "70px 40px 56px",
      background: "var(--vp-paper)",
      borderTop: "1px solid rgba(74,46,28,.06)",
      borderBottom: "1px solid rgba(74,46,28,.06)",
    }}>
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
        gap: isMobile ? 12 : 24,
      }}>
        {CATS.map((cat) => (
          <CategoryTile key={cat.label} cat={cat} onClick={() => go(cat.to)} />
        ))}
      </div>
    </section>
  );
}

function CategoryTile({ cat, onClick }) {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  const { ref, onMouseMove, onMouseLeave } = useTilt(7);
  const stroke = cat.isNew ? "var(--vp-copper-deep)" : "var(--vp-brown)";
  const bg = cat.isNew ? "var(--vp-olive-soft)" : "var(--vp-cream-soft)";
  const ring = hover ? "var(--vp-copper)" : "rgba(74,46,28,.12)";
  const imgData = cat.imgKey ? CATEGORY_IMAGES[cat.imgKey] : null;

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); if (!isMobile) onMouseLeave(); }}
      onMouseMove={isMobile ? undefined : onMouseMove}
      style={{
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 6,
        background: bg,
        border: `1px solid ${ring}`,
        transition: "border-color .25s ease",
        willChange: "transform",
        overflow: "hidden",
      }}
    >
      {/* Imagen de categoría (solo para no-IA) */}
      {imgData ? (
        <div style={{ position: "relative", width: "100%", aspectRatio: "4/5" }}>
          <Image
            fill
            src={imgData.src}
            alt={imgData.alt}
            loading="lazy"
            sizes="(max-width: 768px) 50vw, 20vw"
            style={{
              objectFit: "contain",
              inset: "8%",
              filter: hover
                ? "drop-shadow(0 16px 24px rgba(70,50,30,.22)) drop-shadow(0 4px 8px rgba(70,50,30,.14))"
                : "drop-shadow(0 8px 14px rgba(70,50,30,.14)) drop-shadow(0 2px 4px rgba(70,50,30,.08))",
              transition: "filter .4s ease",
              animation: "vpFloat 4s ease-in-out infinite",
            }}
            placeholder="blur"
            blurDataURL={LQIP_CREAM}
          />
        </div>
      ) : (
        /* Probador IA: placeholder visual sin imagen de producto */
        <div style={{ width: "100%", aspectRatio: "4/5", display: "grid", placeItems: "center" }}>
          <span style={{ fontSize: 40, opacity: 0.35 }}>✦</span>
        </div>
      )}

      {/* Etiqueta de categoría */}
      <div style={{ padding: "16px 16px 20px", width: "100%" }}>
        <div className="vp-eyebrow" style={{ color: stroke, letterSpacing: "0.22em", fontSize: 12 }}>
          {cat.label}
          {cat.isNew && <span className="vp-badge-new">Nuevo</span>}
        </div>
      </div>
    </div>
  );
}
