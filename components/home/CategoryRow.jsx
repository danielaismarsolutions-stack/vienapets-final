"use client";

import { useState } from "react";
import { useRoute } from "@/components/shared/useRoute";

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
  const s = { stroke, fill: "none", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "set") {
    return (
      <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 11 q3 -3 6 0 q2 -1 4 0 q3 -3 6 0 v3 q-3 1 -6 0 q-2 1 -4 0 q-3 1 -6 0 z" {...s} />
        <path d="M9 18 q5 2 10 0 q3 -1 6 1" {...s} />
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
        <path d="M5 16 a3 3 0 0 1 3 -3 h2 v6 h-2 a3 3 0 0 1 -3 -3 z" {...s} />
        <path d="M10 14.5 h2" {...s} />
        <path d="M12 16 q3 -4 7 -2 q4 2 7 -2 q1 -1 1 -2" {...s} />
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
