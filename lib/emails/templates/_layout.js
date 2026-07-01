// Piezas compartidas de los emails transaccionales (Sprint 5).
//
// Reglas de compatibilidad con clientes de correo (muy estrictas):
//  - Estilos SIEMPRE inline. Nada de <style> ni clases externas.
//  - Maquetación con <table>, no fl/grid (Outlook no los entiende).
//  - Fuentes SAFE: Georgia (titulares serif), Arial/Helvetica (texto). Las
//    Google Fonts del sitio (Cormorant/Jost) no cargan en email.
//  - Ancho máximo 600px, contenedor centrado.
//
// Paleta (CLAUDE.md §3): marrón cálido #816754 como color de marca, fondos
// crema. Nada de verdes.

import {
  LEGAL_NAME,
  LEGAL_NIF,
  LEGAL_ADDRESS,
  LEGAL_CONTACT_EMAIL,
  PRIVACY_URL,
} from "@/lib/legal-info";

// --- Paleta de marca para email --------------------------------------------
export const COLORS = {
  brand: "#816754", // marrón cálido suave (CLAUDE.md §3, primary)
  brandDark: "#5C4A3A",
  ink: "#2A1D12",
  inkSoft: "#4A3828",
  inkMuted: "#8A7355",
  pageBg: "#F2E9DC", // cream
  cardBg: "#FBF6ED", // paper
  cardBgSoft: "#EAE0D0", // cream-soft
  border: "#E2D4BE", // cream-deep
  white: "#FEFBF4",
};

export const FONT_SERIF = "Georgia, 'Times New Roman', serif";
export const FONT_BODY = "Arial, Helvetica, sans-serif";

// URL pública del sitio (assets, enlaces). Fallback al dominio de Vercel.
export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://vienapets-final.vercel.app";
  return url.replace(/\/$/, "");
}

// Convierte una ruta de asset ("/assets/x.jpeg") en URL absoluta para email.
export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Precio en céntimos → "45,00 €" (formato español, IVA ya incluido).
export function formatPrice(cents) {
  if (cents == null || Number.isNaN(cents)) return "—";
  const eur = (cents / 100).toFixed(2).replace(".", ",");
  return `${eur} €`;
}

// Escape mínimo de HTML para datos que vienen del cliente (nombre, dirección).
export function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Formatea la dirección de envío (jsonb de Stripe) en líneas HTML escapadas.
export function formatShippingAddress(shipping) {
  if (!shipping) return "";
  const name = shipping.name || "";
  const a = shipping.address || {};
  const lines = [
    name,
    a.line1,
    a.line2,
    [a.postal_code, a.city].filter(Boolean).join(" "),
    a.state,
    a.country,
  ].filter(Boolean);
  return lines.map((l) => escapeHtml(l)).join("<br>");
}

// Cabecera con el logo de VienaPets centrado.
export function emailHeader() {
  const logo = assetUrl("/assets/logo-viena-pets-oficial.png");
  return `
  <tr>
    <td align="center" style="padding: 32px 24px 16px;">
      <img src="${logo}" alt="Viena Pets" width="150" style="display:block; width:150px; max-width:60%; height:auto;" />
    </td>
  </tr>`;
}

// Footer legal obligatorio (CLAUDE.md §9): aviso RGPD breve + link política de
// privacidad + datos fiscales y dirección postal del responsable.
export function emailFooter() {
  const privacy = `${getSiteUrl()}${PRIVACY_URL}`;
  return `
  <tr>
    <td style="padding: 28px 32px 36px; border-top: 1px solid ${COLORS.border};">
      <p style="margin:0 0 10px; font-family:${FONT_BODY}; font-size:12px; line-height:1.6; color:${COLORS.inkMuted};">
        Recibes este email porque has realizado un pedido en Viena Pets. Tratamos
        tus datos para gestionar tu compra conforme al RGPD. Puedes consultar cómo
        lo hacemos y ejercer tus derechos en nuestra
        <a href="${privacy}" style="color:${COLORS.brand}; text-decoration:underline;">Política de Privacidad</a>
        o escribiéndonos a
        <a href="mailto:${LEGAL_CONTACT_EMAIL}" style="color:${COLORS.brand}; text-decoration:underline;">${LEGAL_CONTACT_EMAIL}</a>.
      </p>
      <p style="margin:0; font-family:${FONT_BODY}; font-size:11px; line-height:1.6; color:${COLORS.inkMuted};">
        ${escapeHtml(LEGAL_NAME)} · NIF ${escapeHtml(LEGAL_NIF)} · ${escapeHtml(LEGAL_ADDRESS)}<br>
        © ${new Date().getFullYear()} Viena Pets · Diseños exclusivos diseñados en España
      </p>
    </td>
  </tr>`;
}

/**
 * Envuelve el contenido del email en el "shell" estándar: fondo crema, tabla
 * centrada de 600px, cabecera con logo y footer legal.
 *
 * @param {Object} opts
 * @param {string} opts.previewText  Texto de preview (oculto, lo muestran Gmail/Apple Mail).
 * @param {string} opts.bodyHtml     Filas <tr> del cuerpo.
 * @param {string} [opts.footerHtml] Filas <tr> del footer. Por defecto el footer
 *   legal de cliente (emailFooter). Los emails internos pasan uno sobrio: el
 *   aviso RGPD al consumidor no aplica a un correo operativo del equipo.
 */
export function emailShell({ previewText = "", bodyHtml = "", footerHtml = null }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Viena Pets</title>
</head>
<body style="margin:0; padding:0; background-color:${COLORS.pageBg}; -webkit-text-size-adjust:100%;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; height:0; width:0;">${escapeHtml(previewText)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLORS.pageBg};">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:${COLORS.cardBg}; border:1px solid ${COLORS.border}; border-radius:8px; overflow:hidden;">
          ${emailHeader()}
          ${bodyHtml}
          ${footerHtml == null ? emailFooter() : footerHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Botón CTA (tabla, compatible Outlook).
export function ctaButton({ href, label }) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 8px 0;">
    <tr>
      <td align="center" bgcolor="${COLORS.brand}" style="border-radius:6px;">
        <a href="${href}" style="display:inline-block; padding:13px 28px; font-family:${FONT_BODY}; font-size:14px; font-weight:bold; color:${COLORS.white}; text-decoration:none; border-radius:6px;">${label}</a>
      </td>
    </tr>
  </table>`;
}
