"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useRoute } from "./useRoute";
import { useCart } from "./CartProvider";

export function Navbar() {
  const { go, route } = useRoute();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const onHome = route === "/";
  const transparent = onHome && !scrolled;

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: transparent ? "transparent" : "var(--vp-cream)",
      borderBottom: transparent ? "1px solid transparent" : "1px solid rgba(74,46,28,.12)",
      transition: "background .3s ease, border-color .3s ease",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "20px 40px", maxWidth: 1600, margin: "0 auto", gap: 24 }}>
        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <NavLink onClick={() => go("/tienda")} active={route.startsWith("/tienda")}>Tienda</NavLink>
          <NavLink onClick={() => go("/modelos")} active={route.startsWith("/modelos")}>Modelos</NavLink>
          <NavLink onClick={() => go("/historia")} active={route === "/historia"}>Historia</NavLink>
          <NavLink onClick={() => go("/cuidado")} active={route === "/cuidado"}>Cuidado</NavLink>
        </nav>

        <div style={{ textAlign: "center", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => go("/")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-viena-pets-oficial.png" alt="Viena Pets" style={{ height: 64, width: "auto", objectFit: "contain", display: "block", filter: "drop-shadow(0 1px 2px rgba(74,46,28,.06))" }} />
        </div>

        <div style={{ display: "flex", gap: 18, justifyContent: "flex-end", alignItems: "center", color: "var(--vp-brown)" }}>
          <Icon.Search style={{ width: 18, height: 18, cursor: "pointer" }} />
          <Icon.Heart style={{ width: 18, height: 18, cursor: "pointer" }} />
          <Icon.User style={{ width: 18, height: 18, cursor: "pointer" }} />
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setOpen(true)}>
            <Icon.Bag style={{ width: 18, height: 18 }} />
            {count > 0 && (
              <span style={{ position: "absolute", top: -6, right: -8, background: "var(--vp-brown)", color: "var(--vp-paper)", borderRadius: 999, fontSize: 9, width: 16, height: 16, display: "grid", placeItems: "center", fontWeight: 600 }}>{count}</span>
            )}
          </div>
        </div>
      </div>
    </header>
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
