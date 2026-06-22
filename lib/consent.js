// Lógica de consentimiento de cookies + Google Consent Mode v2 (Sprint 6).
//
// IMPORTANTE: aquí NO se carga Google Analytics ni ningún script de terceros.
// Solo se prepara la infraestructura de consentimiento: el estado se guarda en
// localStorage y se comunica a Google vía la cola estándar de Consent Mode v2
// (dataLayer / gtag). Cuando en un sprint posterior se añada GA, recogerá este
// estado automáticamente sin tocar este archivo.

export const CONSENT_KEY = "vienapets-consent-v1";

// Categorías no esenciales gestionables por el usuario. Las "esenciales"
// (técnicas) están siempre activas y no se almacenan aquí.
export const DEFAULT_CONSENT = { analytics: false, marketing: false };

// Garantiza la cola de Consent Mode v2 (dataLayer + función gtag). Es el snippet
// estándar de Google y NO descarga gtag.js: solo encola comandos para cuando GA
// exista. Idempotente.
export function ensureGtag() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function () { window.dataLayer.push(arguments); };
  }
}

// Estado por defecto ANTES de cualquier elección: todo denegado (Consent Mode v2
// estándar). Debe ejecutarse en cada carga, antes de aplicar la elección guardada.
export function setDefaultConsent() {
  if (typeof window === "undefined") return;
  ensureGtag();
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
}

// Traduce nuestras categorías a los señales de Consent Mode v2 y envía un
// 'update'. Las llamadas se encolan en dataLayer aunque GA aún no exista.
export function applyConsent(consent) {
  if (typeof window === "undefined") return;
  ensureGtag();
  window.gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
}

// Lee la elección guardada. Devuelve null si el usuario aún no ha decidido.
export function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      timestamp: parsed.timestamp || null,
    };
  } catch {
    return null;
  }
}

// Persiste la elección y la aplica a Consent Mode v2.
export function saveConsent(consent) {
  if (typeof window === "undefined") return;
  const payload = {
    analytics: !!consent.analytics,
    marketing: !!consent.marketing,
    timestamp: Date.now(),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  } catch {
    // localStorage no disponible (modo privado estricto): aplicamos igualmente
    // el consentimiento en memoria para esta sesión.
  }
  applyConsent(payload);
}

// Evento para reabrir el panel de preferencias desde cualquier punto (footer).
export const OPEN_PREFERENCES_EVENT = "vienapets:open-cookie-preferences";

export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
