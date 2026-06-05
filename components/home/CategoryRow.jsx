"use client";

import { useState } from "react";
import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";

export function CategoryRow() {
  const { go } = useRoute();
  const isMobile = useIsMobile();
  const cats = [
    { label: "Conjuntos", to: "/tienda?cat=conjuntos" },
    { label: "Arneses", to: "/tienda?cat=arneses" },
    { label: "Correas", to: "/tienda?cat=correas" },
    { label: "Portabolsas", to: "/tienda?cat=portabolsas" },
    { label: "Probador IA", to: "/probador", isNew: true },
  ];
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
        {cats.map((cat) => (
          <CategoryTile key={cat.label} cat={cat} onClick={() => go(cat.to)} />
        ))}
      </div>
    </section>
  );
}

function CategoryTile({ cat, onClick }) {
  const [hover, setHover] = useState(false);
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        borderRadius: 6,
        background: bg,
        border: `1px solid ${ring}`,
        transition: "transform .35s cubic-bezier(.2,.7,.2,1), border-color .25s ease, background .25s ease",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        position: "relative",
      }}>
      <div className="vp-eyebrow" style={{
        color: stroke,
        letterSpacing: "0.22em",
        fontSize: 12,
      }}>
        {cat.label}
        {cat.isNew && <span className="vp-badge-new">Nuevo</span>}
      </div>
    </div>
  );
}
