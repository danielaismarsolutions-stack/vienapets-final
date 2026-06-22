"use client";

import { openCookiePreferences } from "@/lib/consent";

// Botón que reabre el panel de preferencias de cookies (Sprint 6). Se coloca en
// el footer. Dispara OPEN_PREFERENCES_EVENT, que escucha <CookieBanner>.
// Acepta `style` para integrarse con la tipografía/colores del footer.
export function CookiePreferencesButton({ style }) {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        font: "inherit",
        color: "inherit",
        letterSpacing: "inherit",
        textTransform: "inherit",
        ...style,
      }}
    >
      Preferencias de cookies
    </button>
  );
}
