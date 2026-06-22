"use client";

import { useEffect, useState } from "react";
import {
  setDefaultConsent,
  applyConsent,
  readConsent,
  saveConsent,
  OPEN_PREFERENCES_EVENT,
} from "@/lib/consent";

// Banner de consentimiento de cookies con Google Consent Mode v2 (Sprint 6).
//
// - Discreto, en la parte inferior. NO bloquea el uso del sitio ni oscurece el
//   fondo (no es un modal con backdrop).
// - En la primera visita ofrece "Aceptar todo", "Rechazar todo" y "Personalizar".
// - "Personalizar" despliega toggles por categoría (esenciales forzadas ON).
// - Guarda la elección en localStorage ('vienapets-consent-v1') y la comunica a
//   Consent Mode v2. NO carga Google Analytics (solo deja la infra lista).
// - Se puede reabrir desde el botón "Preferencias de cookies" del footer, que
//   dispara OPEN_PREFERENCES_EVENT.

const BROWN = "var(--vp-brown)";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Arranque: fija el estado por defecto (todo denegado) y, si ya hay una
  // elección guardada, la aplica sin mostrar el banner. Si no, lo muestra.
  useEffect(() => {
    setDefaultConsent();
    const saved = readConsent();
    if (saved) {
      applyConsent(saved);
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
    } else {
      setVisible(true);
    }
  }, []);

  // Permite reabrir el panel desde el footer ("Preferencias de cookies").
  useEffect(() => {
    const onOpen = () => {
      const saved = readConsent();
      setAnalytics(saved?.analytics ?? false);
      setMarketing(saved?.marketing ?? false);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
  }, []);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    setCustomizing(false);
  };

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true });
    close();
  };
  const rejectAll = () => {
    saveConsent({ analytics: false, marketing: false });
    close();
  };
  const saveCustom = () => {
    saveConsent({ analytics, marketing });
    close();
  };

  return (
    <div
      role="dialog"
      aria-label="Preferencias de cookies"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 1000,
        maxWidth: 760,
        margin: "0 auto",
        background: "var(--vp-paper)",
        border: `1px solid ${BROWN}`,
        borderRadius: 10,
        boxShadow: "0 10px 40px rgba(74,46,28,.18)",
        padding: "20px 22px",
        fontFamily: "var(--font-body)",
        color: "var(--vp-ink-soft)",
      }}
    >
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--vp-ink)", marginBottom: 8 }}>
        Cookies en Viena Pets
      </div>

      <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: "0 0 14px" }}>
        Usamos cookies técnicas necesarias para que la web funcione y, con tu
        permiso, cookies analíticas y de marketing. Puedes aceptarlas, rechazarlas
        o elegir cuáles permites. Consulta nuestra{" "}
        <a href="/cookies" style={linkStyle}>Política de Cookies</a>.
      </p>

      {customizing && (
        <div style={{ borderTop: "1px solid var(--vp-cream-deep)", paddingTop: 14, marginBottom: 14 }}>
          <ToggleRow
            title="Esenciales"
            desc="Necesarias para el funcionamiento del sitio (sesión, carrito). Siempre activas."
            checked
            forced
          />
          <ToggleRow
            title="Analíticas"
            desc="Nos ayudan a entender cómo se usa la web para mejorarla."
            checked={analytics}
            onChange={() => setAnalytics((v) => !v)}
          />
          <ToggleRow
            title="Marketing"
            desc="Permiten mostrar contenido relevante y medir su eficacia."
            checked={marketing}
            onChange={() => setMarketing((v) => !v)}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
        {!customizing && (
          <button style={btnGhost} onClick={() => setCustomizing(true)}>
            Personalizar
          </button>
        )}
        <button style={btnGhost} onClick={rejectAll}>
          Rechazar todo
        </button>
        {customizing ? (
          <button style={btnPrimary} onClick={saveCustom}>
            Guardar preferencias
          </button>
        ) : (
          <button style={btnPrimary} onClick={acceptAll}>
            Aceptar todo
          </button>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ title, desc, checked, onChange, forced = false }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "8px 0" }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={forced}
        onClick={onChange}
        style={{
          flex: "0 0 auto",
          width: 40,
          height: 22,
          borderRadius: 999,
          border: "none",
          cursor: forced ? "not-allowed" : "pointer",
          background: checked ? BROWN : "var(--vp-sand)",
          position: "relative",
          transition: "background .2s ease",
          opacity: forced ? 0.7 : 1,
          marginTop: 2,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--vp-paper)",
            transition: "left .2s ease",
          }}
        />
      </button>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--vp-ink)" }}>{title}</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--vp-ink-muted)" }}>{desc}</div>
      </div>
    </div>
  );
}

const linkStyle = { color: BROWN, borderBottom: `1px solid ${BROWN}`, textDecoration: "none" };

const btnBase = {
  fontFamily: "var(--font-body)",
  fontSize: 13,
  letterSpacing: "0.04em",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer",
  border: `1px solid ${BROWN}`,
};
const btnGhost = { ...btnBase, background: "transparent", color: BROWN };
const btnPrimary = { ...btnBase, background: BROWN, color: "var(--vp-paper)" };
