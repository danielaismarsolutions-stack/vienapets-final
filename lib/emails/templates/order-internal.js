// Email operativo INTERNO — se dispara desde el webhook de Stripe
// (checkout.session.completed) tras crear el pedido y descontar stock, en
// paralelo al email de confirmación al cliente.
//
// NO lo ve el cliente. Va al equipo (lib/emails/constants.js) con todo lo
// necesario para preparar el envío: datos del cliente, dirección, piezas
// físicas a poner en la caja (los conjuntos se expanden a sus 3 componentes)
// y el stock restante de los SKUs afectados.
//
// Misma estética que los emails al cliente (paleta marrón #816754, HTML 100%
// inline, tablas) pero orientada a operaciones. CERO "atelier/artesanal/
// handmade" (CLAUDE.md §2).

import {
  COLORS,
  FONT_SERIF,
  FONT_BODY,
  emailShell,
  formatPrice,
  escapeHtml,
  formatShippingAddress,
} from "./_layout.js";

// Fecha/hora del pedido en formato español, zona peninsular. created_at es un
// timestamptz ISO; si falta, devolvemos "—".
function formatOrderDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return d.toLocaleString("es-ES", {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d.toISOString();
  }
}

// Etiqueta de sección (mayúsculas, tracking, tono operativo sobrio).
function sectionLabel(text) {
  return `<div style="font-family:${FONT_BODY}; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; color:${COLORS.inkMuted}; padding-bottom:8px;">${escapeHtml(text)}</div>`;
}

// Fila "etiqueta: valor" para las secciones de datos (Cliente).
function dataRow(label, value) {
  return `
  <tr>
    <td style="font-family:${FONT_BODY}; font-size:13px; color:${COLORS.inkMuted}; padding:2px 12px 2px 0; white-space:nowrap; vertical-align:top;">${escapeHtml(label)}</td>
    <td style="font-family:${FONT_BODY}; font-size:14px; color:${COLORS.ink}; padding:2px 0; vertical-align:top;">${value}</td>
  </tr>`;
}

// Celda de encabezado de tabla.
function th(text, align = "left") {
  return `<th align="${align}" style="font-family:${FONT_BODY}; font-size:11px; letter-spacing:0.05em; text-transform:uppercase; color:${COLORS.inkMuted}; font-weight:bold; padding:0 8px 8px 0; border-bottom:1px solid ${COLORS.border}; text-align:${align};">${escapeHtml(text)}</th>`;
}

// Celda de datos de tabla.
function td(html, align = "left", { muted = false, strong = false } = {}) {
  const color = muted ? COLORS.inkMuted : COLORS.ink;
  const weight = strong ? "bold" : "normal";
  return `<td align="${align}" style="font-family:${FONT_BODY}; font-size:13px; color:${color}; font-weight:${weight}; padding:8px 8px 8px 0; border-bottom:1px solid ${COLORS.border}; text-align:${align}; vertical-align:top;">${html}</td>`;
}

// SKU monoespaciado para que sea fácil de leer/copiar al preparar el pedido.
function skuTag(sku) {
  const value = sku ? escapeHtml(sku) : "—";
  return `<span style="font-family:'Courier New', monospace; font-size:12px; color:${COLORS.ink};">${value}</span>`;
}

// Badge de stock bajo / agotado.
function stockBadge(available) {
  if (available <= 0) {
    return `<span style="display:inline-block; background-color:#8A1C1C; color:#FFFFFF; font-family:${FONT_BODY}; font-size:10px; font-weight:bold; letter-spacing:0.04em; padding:2px 7px; border-radius:4px;">AGOTADO</span>`;
  }
  if (available <= 5) {
    return `<span style="display:inline-block; background-color:#B23B3B; color:#FFFFFF; font-family:${FONT_BODY}; font-size:10px; font-weight:bold; letter-spacing:0.04em; padding:2px 7px; border-radius:4px;">STOCK BAJO</span>`;
  }
  return "";
}

// Nombre + talla en una celda (talla sólo si aplica).
function nameWithSize(name, size) {
  const sizeLabel = size
    ? ` <span style="color:${COLORS.inkMuted};">· Talla ${escapeHtml(size)}</span>`
    : "";
  return `${escapeHtml(name || "Producto")}${sizeLabel}`;
}

/**
 * Construye el email operativo interno.
 *
 * @param {Object} params
 * @param {Object} params.order  Fila de orders (order_number, created_at,
 *   total_cents, customer_name, customer_email, shipping_address) + phone opcional.
 * @param {Array}  params.items  Items del pedido a preparar:
 *   [{ key, sku, name, size, quantity, category }]. Los conjuntos (category
 *   'conjunto') se expanden con componentsBreakdown.
 * @param {Array}  params.componentsBreakdown  Desglose físico de los conjuntos:
 *   [{ key, pieces: [{ sku, name, size, quantity }] }]. `key` casa con items[].key.
 * @param {Array}  params.stockAfter  Stock restante de los SKUs afectados:
 *   [{ sku, name, size, available }]. available = stock - stock_reserved.
 * @returns {{subject:string, html:string}}
 */
export function buildInternalOrderEmail({
  order,
  items = [],
  componentsBreakdown = [],
  stockAfter = [],
}) {
  const orderNumber = order?.order_number || "—";
  const customerName = order?.customer_name || "—";
  const dateTime = formatOrderDateTime(order?.created_at);

  // Índice key -> piezas físicas del conjunto.
  const piecesByKey = new Map(
    (componentsBreakdown || []).map((b) => [b.key, b.pieces || []])
  );

  // --- Productos a preparar + total de piezas físicas ---------------------
  let totalPhysicalPieces = 0;
  const productRows = [];
  for (const item of items) {
    const qty = item.quantity || 1;
    const isConjunto = item.category === "conjunto";
    const pieces = isConjunto ? piecesByKey.get(item.key) || [] : [];

    // Fila principal del producto.
    const mainName = isConjunto
      ? `${nameWithSize(item.name, item.size)} <span style="color:${COLORS.inkMuted};">(conjunto)</span>`
      : nameWithSize(item.name, item.size);
    productRows.push(`
      <tr>
        ${td(skuTag(item.sku))}
        ${td(mainName)}
        ${td(String(qty), "right", { strong: true })}
      </tr>`);

    if (isConjunto && pieces.length > 0) {
      // Sub-filas: las piezas físicas que hay que preparar del conjunto.
      for (const p of pieces) {
        const pQty = p.quantity || qty;
        totalPhysicalPieces += pQty;
        productRows.push(`
          <tr>
            ${td(`<span style="padding-left:14px;">↳ ${skuTag(p.sku)}</span>`, "left", { muted: true })}
            ${td(`<span style="color:${COLORS.inkMuted};">${nameWithSize(p.name, p.size)}</span>`)}
            ${td(String(pQty), "right", { muted: true })}
          </tr>`);
      }
    } else {
      // Producto suelto: cada unidad es una pieza física.
      totalPhysicalPieces += qty;
    }
  }

  const productsTable = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${th("SKU")}
        ${th("Producto")}
        ${th("Cant.", "right")}
      </tr>
      ${productRows.join("")}
      <tr>
        <td colspan="2" style="font-family:${FONT_BODY}; font-size:13px; font-weight:bold; color:${COLORS.ink}; padding:10px 8px 0 0;">Total de piezas físicas a preparar</td>
        <td align="right" style="font-family:${FONT_BODY}; font-size:16px; font-weight:bold; color:${COLORS.brand}; padding:10px 0 0 0;">${totalPhysicalPieces}</td>
      </tr>
    </table>`;

  // --- Stock actualizado tras el pedido ----------------------------------
  const stockRows = (stockAfter || [])
    .map((s) => {
      const available = Number.isFinite(s.available) ? s.available : 0;
      const badge = stockBadge(available);
      const isLow = available <= 5;
      const availColor = isLow ? "#8A1C1C" : COLORS.ink;
      return `
      <tr>
        ${td(skuTag(s.sku))}
        ${td(`<span style="color:${COLORS.inkMuted};">${nameWithSize(s.name, s.size)}</span>`)}
        <td align="right" style="font-family:${FONT_BODY}; font-size:14px; color:${availColor}; font-weight:bold; padding:8px 8px 8px 0; border-bottom:1px solid ${COLORS.border}; text-align:right; white-space:nowrap;">
          ${available}${badge ? ` &nbsp;${badge}` : ""}
        </td>
      </tr>`;
    })
    .join("");

  const stockTable = stockRows
    ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        ${th("SKU")}
        ${th("Producto")}
        ${th("Disponible", "right")}
      </tr>
      ${stockRows}
    </table>`
    : `<p style="margin:0; font-family:${FONT_BODY}; font-size:14px; color:${COLORS.inkMuted};">Sin SKUs afectados registrados.</p>`;

  // --- Cliente: teléfono nunca se omite (CLAUDE.md workflow del cliente) --
  const phoneValue = order?.phone
    ? escapeHtml(order.phone)
    : `<span style="color:${COLORS.inkMuted};">no proporcionado</span>`;

  const body = `
  <tr>
    <td style="padding: 8px 32px 0;">
      <h1 style="margin:0 0 4px; font-family:${FONT_SERIF}; font-size:24px; font-weight:normal; color:${COLORS.ink};">Nuevo pedido recibido</h1>
    </td>
  </tr>

  <tr>
    <td style="padding: 14px 32px 0;">
      <div style="background-color:${COLORS.cardBgSoft}; border-radius:8px; padding:18px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:${FONT_SERIF}; font-size:22px; color:${COLORS.brand}; font-weight:bold;">${escapeHtml(orderNumber)}</td>
            <td align="right" style="font-family:${FONT_BODY}; font-size:20px; color:${COLORS.ink}; font-weight:bold; white-space:nowrap;">${formatPrice(order?.total_cents)}</td>
          </tr>
          <tr>
            <td colspan="2" style="font-family:${FONT_BODY}; font-size:13px; color:${COLORS.inkSoft}; padding-top:6px;">${escapeHtml(dateTime)}</td>
          </tr>
        </table>
      </div>
    </td>
  </tr>

  <tr>
    <td style="padding: 24px 32px 0;">
      ${sectionLabel("Cliente")}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        ${dataRow("Nombre", escapeHtml(customerName))}
        ${dataRow("Email", order?.customer_email ? escapeHtml(order.customer_email) : "—")}
        ${dataRow("Teléfono", phoneValue)}
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding: 24px 32px 0;">
      ${sectionLabel("Dirección de envío")}
      <p style="margin:0; font-family:${FONT_BODY}; font-size:14px; line-height:1.6; color:${COLORS.ink};">
        ${formatShippingAddress(order?.shipping_address) || "—"}
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding: 26px 32px 0;">
      ${sectionLabel("Productos a preparar")}
      ${productsTable}
    </td>
  </tr>

  <tr>
    <td style="padding: 26px 32px 0;">
      ${sectionLabel("Stock actualizado tras este pedido")}
      ${stockTable}
    </td>
  </tr>

  <tr>
    <td style="padding: 26px 32px 0;">
      <div style="background-color:${COLORS.cardBgSoft}; border-radius:8px; padding:18px 20px;">
        <div style="font-family:${FONT_SERIF}; font-size:17px; color:${COLORS.ink}; padding-bottom:10px;">Siguientes pasos</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:${FONT_BODY}; font-size:14px; line-height:1.5; color:${COLORS.inkSoft};">
          <tr><td style="padding:3px 0;"><strong style="color:${COLORS.brand};">1.</strong> &nbsp;Prepara el pedido con las piezas indicadas arriba.</td></tr>
          <tr><td style="padding:3px 0;"><strong style="color:${COLORS.brand};">2.</strong> &nbsp;Genera la etiqueta SEUR con la dirección de envío.</td></tr>
          <tr><td style="padding:3px 0;"><strong style="color:${COLORS.brand};">3.</strong> &nbsp;Marca en Supabase Studio: <code style="font-family:'Courier New',monospace; background-color:${COLORS.cardBg}; padding:1px 4px; border-radius:3px;">status='shipped'</code>, <code style="font-family:'Courier New',monospace; background-color:${COLORS.cardBg}; padding:1px 4px; border-radius:3px;">tracking_number</code> y <code style="font-family:'Courier New',monospace; background-color:${COLORS.cardBg}; padding:1px 4px; border-radius:3px;">carrier='SEUR'</code>.</td></tr>
        </table>
      </div>
    </td>
  </tr>

  <tr>
    <td style="padding: 0 32px 24px;"></td>
  </tr>`;

  // Footer sobrio (no el legal de cliente): es un correo operativo del equipo.
  const footer = `
  <tr>
    <td style="padding: 24px 32px 32px; border-top: 1px solid ${COLORS.border};">
      <p style="margin:0; font-family:${FONT_BODY}; font-size:12px; color:${COLORS.inkMuted}; text-align:center; line-height:1.6;">
        Email operativo automático · VienaPets<br>
        No requiere respuesta, sí requiere acción humana.
      </p>
    </td>
  </tr>`;

  return {
    subject: `Nuevo pedido ${orderNumber} · ${customerName}`,
    html: emailShell({
      previewText: `Nuevo pedido ${orderNumber} de ${customerName} · ${totalPhysicalPieces} piezas a preparar`,
      bodyHtml: body,
      footerHtml: footer,
    }),
  };
}
