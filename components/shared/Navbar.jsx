"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useRoute } from "./useRoute";
import { useCart } from "./CartProvider";
import { useIsMobile } from "./useIsMobile";

export function Navbar() {
  const { go, route } = useRoute();
  const { count, setOpen } = useCart();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Cierra el menú al navegar
  const nav = (path) => { setMenuOpen(false); go(path); };

  const onHome = route === "/";
  const transparent = onHome && !scrolled && !menuOpen;

  const links = [
    { label: "Tienda", path: "/tienda", active: route.startsWith("/tienda") },
    { label: "Modelos", path: "/modelos", active: route.startsWith("/modelos") },
    { label: "Historia", path: "/historia", active: route === "/historia" },
    { label: "Cuidado", path: "/cuidado", active: route === "/cuidado" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: transparent ? "transparent" : "var(--vp-cream)",
      borderBottom: transparent ? "1px solid transparent" : "1px solid rgba(74,46,28,.12)",
      transition: "background .3s ease, border-color .3s ease",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "auto 1fr auto" : "1fr auto 1fr", alignItems: "center", padding: isMobile ? "14px 20px" : "20px 40px", maxWidth: 1600, margin: "0 auto", gap: isMobile ? 12 : 24 }}>

        {isMobile ? (
          /* Mobile: hamburguesa izquierda */
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--vp-brown)", padding: 4, display: "flex", alignItems: "center" }}
          >
            {menuOpen
              ? <Icon.Close style={{ width: 22, height: 22 }} />
              : <HamburgerIcon />}
          </button>
        ) : (
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {links.map((l) => (
              <NavLink key={l.path} onClick={() => nav(l.path)} active={l.active}>{l.label}</NavLink>
            ))}
          </nav>
        )}

        <div style={{ textAlign: "center", cursor: "pointer", display: "flex", justifyContent: isMobile ? "center" : "center", alignItems: "center" }} onClick={() => nav("/")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-viena-pets-oficial.png" alt="Viena Pets" style={{ height: isMobile ? 44 : 64, width: "auto", objectFit: "contain", display: "block", filter: "drop-shadow(0 1px 2px rgba(74,46,28,.06))" }} />
        </div>

        <div style={{ display: "flex", gap: isMobile ? 12 : 18, justifyContent: "flex-end", alignItems: "center", color: "var(--vp-brown)" }}>
          {!isMobile && <Icon.Search style={{ width: 18, height: 18, cursor: "pointer" }} />}
          {!isMobile && <Icon.Heart style={{ width: 18, height: 18, cursor: "pointer" }} />}
          {!isMobile && <Icon.User style={{ width: 18, height: 18, cursor: "pointer" }} />}
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setOpen(true)}>
            <Icon.Bag style={{ width: 18, height: 18 }} />
            {count > 0 && (
              <span style={{ position: "absolute", top: -6, right: -8, background: "var(--vp-brown)", color: "var(--vp-paper)", borderRadius: 999, fontSize: 9, width: 16, height: 16, display: "grid", placeItems: "center", fontWeight: 600 }}>{count}</span>
            )}
          </div>
        </div>
      </div>

      {/* Panel de menú mobile */}
      {isMobile && menuOpen && (
        <nav style={{
          background: "var(--vp-cream)",
          borderTop: "1px solid rgba(74,46,28,.1)",
          padding: "20px 24px 28px",
          display: "flex", flexDirection: "column", gap: 0,
        }}>
          {links.map((l) => (
            <button key={l.path} onClick={() => nav(l.path)} style={{
              background: "none", border: "none", borderBottom: "1px solid rgba(74,46,28,.08)",
              padding: "16px 0", textAlign: "left", cursor: "pointer",
              fontSize: 13, letterSpacing: ".18em", textTransform: "uppercase",
              color: l.active ? "var(--vp-olive-deep)" : "var(--vp-brown)",
              fontWeight: l.active ? 500 : 400,
            }}>{l.label}</button>
          ))}
        </nav>
      )}
    </header>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function NavLink({ children, onClick, active }) {
  const activeColor = "var(--vp-olive-deep)";
  const baseColor = "var(--vp-brown)";
  return (
    <a onClick={onClick} style={{
      fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase",
      color: active ? activeColor : baseColor, cursor: "pointer", fontWeight: active ? 500 : 400,
      paddingBottom: 4,
      borderBottom: active ? `1px solid ${activeColor}` : "1px solid transparent",
      transition: "border-color .25s ease, color .25s ease",
    }} onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = activeColor}
       onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = active ? activeColor : "transparent"}>
      {children}
    </a>
  );
}
