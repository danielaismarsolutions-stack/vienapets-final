// Email 1 — Confirmación de pedido (Sprint 5).
// Se dispara desde el webhook de Stripe (checkout.session.completed) tras crear
// el pedido. Tono cálido pero profesional; CERO "atelier/artesanal/handmade"
// (CLAUDE.md §2).

import {
  COLORS,
  FONT_SERIF,
  FONT_BODY,
  emailShell,
  ctaButton,
  formatPrice,
  escapeHtml,
  assetUrl,
  formatShippingAddress,
  getSiteUrl,
} from "./_layout.js";

// Primer nombre, para un saludo cercano. Si no hay nombre, saludo genérico.
function firstName(name) {
  if (!name) return null;
  return String(name).trim().split(/\s+/)[0];
}

// Fila de un item del pedido: miniatura + nombre/talla/cantidad + precio.
function itemRow(item) {
  const img = assetUrl(item.image);
  const thumb = img
    ? `<img src="${img}" alt="${escapeHtml(item.name)}" width="60" height="60" style="display:block; width:60px; height:60px; border-radius:6px; object-fit:cover; border:1px solid ${COLORS.border};" />`
    : `<div style="width:60px; height:60px; border-radius:6px; background-color:${COLORS.cardBgSoft};"></div>`;

  const sizeLabel = item.size ? `Talla ${escapeHtml(item.size)} · ` : "";
  const qty = item.quantity || 1;
  const lineTotal = item.price_cents != null ? item.price_cents * qty : null;

  return `
  <tr>
    <td style="padding: 12px 0; border-bottom:1px solid ${COLORS.border};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="60" valign="top" style="width:60px;">${thumb}</td>
          <td valign="top" style="padding-left:14px; font-family:${FONT_BODY}; font-size:14px; color:${COLORS.ink};">
            <div style="font-weight:bold; color:${COLORS.ink};">${escapeHtml(item.name)}</div>
            <div style="font-size:12px; color:${COLORS.inkMuted}; padding-top:3px;">${sizeLabel}Cantidad: ${qty}</div>
          </td>
          <td valign="top" align="right" style="font-family:${FONT_BODY}; font-size:14px; color:${COLORS.ink}; white-space:nowrap; font-weight:bold;">
            ${formatPrice(lineTotal)}
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

// Fila de total (subtotal / envío / total).
function totalRow(label, value, { strong = false } = {}) {
  const weight = strong ? "bold" : "normal";
  const size = strong ? "16px" : "14px";
  const color = strong ? COLORS.ink : COLORS.inkSoft;
  return `
  <tr>
    <td style="font-family:${FONT_BODY}; font-size:${size}; color:${color}; padding:4px 0; font-weight:${weight};">${label}</td>
    <td align="right" style="font-family:${FONT_BODY}; font-size:${size}; color:${color}; padding:4px 0; font-weight:${weight}; white-space:nowrap;">${value}</td>
  </tr>`;
}

/**
 * Construye el email de confirmación.
 * @param {Object} params
 * @param {Object} params.order  Fila de orders (order_number, customer_name,
 *                               shipping_address, subtotal/shipping/total_cents).
 * @param {Array}  params.items  [{ name, size, quantity, price_cents, image, slug }]
 * @returns {{subject:string, html:string}}
 */
export function confirmationEmail({ order, items = [] }) {
  const orderNumber = order.order_number || "tu pedido";
  const name = firstName(order.customer_name);
  const greeting = name ? `Hola ${escapeHtml(name)}` : "Hola";

  const itemsHtml = items.map(itemRow).join("");

  const shippingHtml = formatShippingAddress(order.shipping_address);

  // CTA secundario: enlace al primer producto del pedido para "seguir
  // descubriendo". Si no tenemos slug (variant_id null), enlazamos a la tienda.
  const firstSlug = items.find((i) => i.slug)?.slug;
  const ctaHref = firstSlug
    ? `${getSiteUrl()}/producto/${firstSlug}`
    : `${getSiteUrl()}/tienda`;

  const subtotal = order.subtotal_cents;
  const shipping = order.shipping_cents;
  const total = order.total_cents;

  const body = `
  <tr>
    <td style="padding: 8px 32px 0;">
      <h1 style="margin:0 0 6px; font-family:${FONT_SERIF}; font-size:26px; font-weight:normal; color:${COLORS.ink};">${greeting},</h1>
      <p style="margin:0 0 4px; font-family:${FONT_BODY}; font-size:15px; line-height:1.6; color:${COLORS.inkSoft};">
        Hemos recibido tu pedido <strong style="color:${COLORS.brand};">${escapeHtml(orderNumber)}</strong>. ¡Gracias por confiar en Viena Pets!
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding: 20px 32px 0;">
      <div style="font-family:${FONT_BODY}; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:${COLORS.inkMuted}; padding-bottom:6px;">Resumen del pedido</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsHtml}
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding: 14px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${totalRow("Subtotal (IVA incl.)", formatPrice(subtotal))}
        ${totalRow("Envío", shipping ? formatPrice(shipping) : "Gratis")}
        <tr><td colspan="2" style="border-top:1px solid ${COLORS.border}; padding-top:6px;"></td></tr>
        ${totalRow("Total", formatPrice(total), { strong: true })}
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding: 22px 32px 0;">
      <div style="font-family:${FONT_BODY}; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:${COLORS.inkMuted}; padding-bottom:6px;">Dirección de envío</div>
      <p style="margin:0; font-family:${FONT_BODY}; font-size:14px; line-height:1.6; color:${COLORS.inkSoft};">
        ${shippingHtml || "—"}
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding: 22px 32px 0;">
      <div style="background-color:${COLORS.cardBgSoft}; border-radius:8px; padding:18px 20px;">
        <div style="font-family:${FONT_SERIF}; font-size:17px; color:${COLORS.ink}; padding-bottom:6px;">Próximos pasos</div>
        <p style="margin:0; font-family:${FONT_BODY}; font-size:14px; line-height:1.65; color:${COLORS.inkSoft};">
          Tu pedido se prepara con cariño en los próximos días hábiles. En cuanto salga
          hacia tu dirección te enviaremos un email con el número de seguimiento para que
          puedas seguirlo en todo momento.
        </p>
      </div>
    </td>
  </tr>

  <tr>
    <td align="center" style="padding: 26px 32px 8px;">
      ${ctaButton({ href: ctaHref, label: "Seguir descubriendo" })}
    </td>
  </tr>

  <tr>
    <td style="padding: 0 32px 28px;"></td>
  </tr>`;

  return {
    subject: `Hemos recibido tu pedido ${orderNumber} · Viena Pets`,
    html: emailShell({
      previewText: `Gracias por tu compra. Tu pedido ${orderNumber} está confirmado.`,
      bodyHtml: body,
    }),
  };
}
