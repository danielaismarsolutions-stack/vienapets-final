"use client";

import { useState } from "react";
import { useRoute } from "@/components/shared/useRoute";
import { Icon } from "@/components/shared/Icon";

export function CategoryRow() {
  const { go } = useRoute();
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
  const map = {
    set: Icon.CategorySet,
    harness: Icon.CategoryHarness,
    leash: Icon.CategoryLeash,
    bag: Icon.CategoryBag,
    ai: Icon.CategoryAI,
  };
  const Cmp = map[kind];
  if (!Cmp) return null;
  return <Cmp style={{ color: stroke }} />;
}
