"use client";

import { Icon } from "./Icon";
import { useRoute } from "./useRoute";
import { LEGAL_NAME, LEGAL_NIF } from "@/lib/legal-info";
import { CookiePreferencesButton } from "@/components/CookiePreferencesButton";

export function Footer() {
  const { go } = useRoute();
  return (
    <footer style={{ background: "var(--vp-cream-soft)", color: "var(--vp-ink)", padding: "80px 40px 32px", marginTop: 80 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 60 }}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-viena-pets-oficial.png" alt="Viena Pets" style={{ height: 110, width: "auto", objectFit: "contain", display: "block", marginBottom: 24 }} />
          <p style={{ color: "var(--vp-ink-soft)", fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
            Arneses, correas y accesorios para perros. Diseños exclusivos diseñados en España, en ediciones limitadas.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 24, color: "var(--vp-brown)" }}>
            <Icon.Instagram style={{ width: 20, height: 20, cursor: "pointer" }} />
          </div>
        </div>

        <FooterCol title="Tienda" links={[
          { label: "Todos los arneses", to: "/tienda" },
          { label: "Modelo Capri", to: "/producto/capri" },
          { label: "Modelo Peachy", to: "/producto/peachy" },
          { label: "Modelo Daisy", to: "/producto/daisy" },
          { label: "Correas", to: "/tienda" },
        ]} go={go} />

        <FooterCol title="Marca" links={[
          { label: "Historia", to: "/historia" },
          { label: "Modelos", to: "/modelos" },
          { label: "Guía de tallas", to: "/guia-de-tallas" },
          { label: "Probador IA", to: "/probador" },
        ]} go={go} />

        <div>
          <div className="vp-eyebrow" style={{ marginBottom: 16 }}>Newsletter</div>
          <p style={{ fontSize: 13, color: "var(--vp-ink-soft)", lineHeight: 1.6, marginBottom: 16 }}>Historias, paseos y primeras miradas a cada colección.</p>
          <div style={{ display: "flex", borderBottom: "1px solid var(--vp-brown)" }}>
            <input placeholder="tu correo" style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "10px 0", fontSize: 13, color: "var(--vp-ink)" }} />
            <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--vp-brown)" }}>
              <Icon.Arrow style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "60px auto 0", paddingTop: 32, borderTop: "1px solid rgba(74,46,28,.15)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--vp-ink-muted)", letterSpacing: "0.1em", textTransform: "uppercase", flexWrap: "wrap", gap: 16 }}>
        <div>© 2026 {LEGAL_NAME} · NIF {LEGAL_NIF}</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span style={legalLinkStyle} onClick={() => go("/aviso-legal")}>Aviso legal</span>
          <span style={legalLinkStyle} onClick={() => go("/privacidad")}>Política de privacidad</span>
          <span style={legalLinkStyle} onClick={() => go("/condiciones")}>Condiciones de venta</span>
          <span style={legalLinkStyle} onClick={() => go("/cookies")}>Política de cookies</span>
          <CookiePreferencesButton style={legalLinkStyle} />
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ ...legalLinkStyle, color: "inherit", textDecoration: "none" }}>Resolución de litigios (ODR)</a>
        </div>
      </div>
    </footer>
  );
}

const legalLinkStyle = {
  cursor: "pointer",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  fontSize: 11,
};

function FooterCol({ title, links, go }) {
  return (
    <div>
      <div className="vp-eyebrow" style={{ marginBottom: 16 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map((l) => (
          <li key={l.label}>
            <a onClick={() => go(l.to)} style={{ cursor: "pointer", fontSize: 14, color: "var(--vp-ink-soft)", fontFamily: "var(--font-body)" }}>{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
