// Email 2 — Notificación de envío (Sprint 5).
// Se dispara cuando Lucía marca el pedido como 'shipped' en Supabase Studio y
// rellena carrier + tracking_number (vía Database Webhook → /api/internal/
// order-shipped). Tono cálido pero conciso. CERO "atelier/artesanal/handmade".

import {
  COLORS,
  FONT_SERIF,
  FONT_BODY,
  emailShell,
  ctaButton,
  escapeHtml,
  getSiteUrl,
} from "./_layout.js";

// URL de seguimiento por transportista conocido. Si no lo reconocemos,
// devolvemos null y mostramos sólo el número (sin enlace).
function trackingUrl(carrier, tracking) {
  if (!carrier || !tracking) return null;
  const code = encodeURIComponent(String(tracking).trim());
  const key = String(carrier).toLowerCase().replace(/\s+/g, "");

  if (key.includes("seur")) return `https://www.seur.com/livetracking/?segOnlineIdentificador=${code}`;
  if (key.includes("correosexpress") || key.includes("correos-express"))
    return `https://www.correosexpress.com/web/correosexpress/herramientas/seguimiento-envios?n=${code}`;
  if (key.includes("correos")) return `https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=${code}`;
  if (key.includes("gls")) return `https://www.gls-spain.es/es/seguimiento-envios/?match=${code}`;
  if (key.includes("mrw")) return `https://www.mrw.es/seguimiento_envios/MRW_seguimiento_envios.asp?enviosguia=${code}`;
  if (key.includes("dhl")) return `https://www.dhl.com/es-es/home/seguimiento.html?tracking-id=${code}`;
  if (key.includes("ups")) return `https://www.ups.com/track?tracknum=${code}`;
  if (key.includes("nacex")) return `https://www.nacex.es/seguimientoDetalle.do?codigoNumeral=${code}`;
  return null;
}

/**
 * Construye el email de notificación de envío.
 * @param {Object} params
 * @param {Object} params.order     Fila de orders (order_number, customer_name).
 * @param {string} params.tracking  Número de seguimiento.
 * @param {string} params.carrier   Transportista (SEUR, Correos, GLS...).
 * @returns {{subject:string, html:string}}
 */
export function shipmentEmail({ order, tracking, carrier }) {
  const orderNumber = order.order_number || "tu pedido";
  const name = order.customer_name
    ? String(order.customer_name).trim().split(/\s+/)[0]
    : null;
  const greeting = name ? `Hola ${escapeHtml(name)}` : "Hola";

  const url = trackingUrl(carrier, tracking);
  const trackingBlock = url
    ? `<a href="${url}" style="color:${COLORS.brand}; font-weight:bold; text-decoration:underline;">${escapeHtml(tracking)}</a>`
    : `<strong style="color:${COLORS.ink};">${escapeHtml(tracking)}</strong>`;

  // CTA: información pública del sitio (aún no hay cuenta de cliente).
  const ctaHref = url || `${getSiteUrl()}/`;
  const ctaLabel = url ? "Seguir mi envío" : "Visitar Viena Pets";

  const body = `
  <tr>
    <td style="padding: 8px 32px 0;">
      <h1 style="margin:0 0 8px; font-family:${FONT_SERIF}; font-size:26px; font-weight:normal; color:${COLORS.ink};">${greeting},</h1>
      <p style="margin:0; font-family:${FONT_BODY}; font-size:16px; line-height:1.6; color:${COLORS.inkSoft};">
        Tu pedido <strong style="color:${COLORS.brand};">${escapeHtml(orderNumber)}</strong> está en camino. 🐾
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding: 22px 32px 0;">
      <div style="background-color:${COLORS.cardBgSoft}; border-radius:8px; padding:20px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:${FONT_BODY}; font-size:13px; color:${COLORS.inkMuted}; padding-bottom:4px;">Transportista</td>
            <td align="right" style="font-family:${FONT_BODY}; font-size:14px; color:${COLORS.ink}; font-weight:bold;">${escapeHtml(carrier)}</td>
          </tr>
          <tr>
            <td style="font-family:${FONT_BODY}; font-size:13px; color:${COLORS.inkMuted}; padding-top:10px;">Nº de seguimiento</td>
            <td align="right" style="font-family:${FONT_BODY}; font-size:14px; padding-top:10px;">${trackingBlock}</td>
          </tr>
        </table>
      </div>
    </td>
  </tr>

  <tr>
    <td style="padding: 22px 32px 0;">
      <p style="margin:0; font-family:${FONT_BODY}; font-size:15px; line-height:1.65; color:${COLORS.inkSoft};">
        Recibirás tu pedido en <strong>2-4 días hábiles</strong> (España peninsular). Te recomendamos
        guardar este email por si quieres consultar el estado del envío.
      </p>
    </td>
  </tr>

  <tr>
    <td align="center" style="padding: 26px 32px 8px;">
      ${ctaButton({ href: ctaHref, label: ctaLabel })}
    </td>
  </tr>

  <tr>
    <td style="padding: 0 32px 28px;"></td>
  </tr>`;

  return {
    subject: `Tu pedido ${orderNumber} está en camino · Viena Pets`,
    html: emailShell({
      previewText: `Tu pedido ${orderNumber} ya ha salido. Sigue tu envío con ${carrier}.`,
      bodyHtml: body,
    }),
  };
}
