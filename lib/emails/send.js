import "server-only";

// Orquestación de envío de emails transaccionales (Sprint 5).
//
// Una sola pieza, reutilizada por el webhook de Stripe (confirmación) y por la
// ruta interna /api/internal/order-shipped (envío). Centraliza:
//   - carga del pedido + items (con imágenes/slug para miniaturas y CTA),
//   - IDEMPOTENCIA vía INSERT en order_emails con UNIQUE(order_id, email_type),
//   - envío vía Brevo y registro del resultado (messageId / error).
//
// Filosofía: el email NUNCA debe romper el flujo de negocio. Cualquier fallo se
// captura, se registra en order_emails (status='failed') y se devuelve un
// resultado; el caller decide (el webhook siempre responde 200).

import { getServiceSupabase } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/brevo/client";
import { confirmationEmail } from "@/lib/emails/templates/confirmation.js";
import { shipmentEmail } from "@/lib/emails/templates/shipment.js";
import { buildInternalOrderEmail } from "@/lib/emails/templates/order-internal.js";
import { INTERNAL_NOTIFICATION_RECIPIENTS } from "@/lib/emails/constants.js";

// Carga la fila completa del pedido.
async function loadOrder(supabase, orderId) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();
  if (error) throw new Error(`No se pudo cargar el pedido ${orderId}: ${error.message}`);
  return data;
}

// Carga los items del pedido y los normaliza al shape que esperan los templates
// (name, size, quantity, price_cents, image, slug). La imagen y el slug salen
// del producto a través de la variante; pueden faltar si variant_id es null.
async function loadItems(supabase, orderId) {
  const { data, error } = await supabase
    .from("order_items")
    .select(
      "product_name_snapshot, size_snapshot, price_cents_snapshot, quantity, " +
        "variant:variants(product:products(slug, images))"
    )
    .eq("order_id", orderId);
  if (error) throw new Error(`No se pudieron cargar los items de ${orderId}: ${error.message}`);

  return (data || []).map((row) => {
    const product = row.variant?.product || null;
    const images = Array.isArray(product?.images) ? product.images : [];
    return {
      name: row.product_name_snapshot || "Producto",
      size: row.size_snapshot || null,
      price_cents: row.price_cents_snapshot ?? null,
      quantity: row.quantity || 1,
      image: images[0] || null,
      slug: product?.slug || null,
    };
  });
}

/**
 * Núcleo: reclama el slot de idempotencia, construye el email y lo envía.
 *
 * @param {Object} opts
 * @param {string} opts.orderId
 * @param {'confirmation'|'shipment'|'internal-notification'} opts.emailType
 * @param {Object} opts.order        Fila de orders (para logging).
 * @param {Array<string|{email:string,name?:string}>} opts.recipients  Destinatario(s).
 * @param {{subject:string, html:string}} opts.template
 * @returns {Promise<{status:'sent'|'failed'|'skipped', messageId?:string, reason?:string, error?:string}>}
 */
async function claimAndSend({ orderId, emailType, order, recipients, template }) {
  const supabase = getServiceSupabase();

  // Normaliza y valida destinatarios: sin ninguno válido, no hay a quién enviar.
  const to = (recipients || []).filter((r) =>
    typeof r === "string" ? r : r && r.email
  );
  if (to.length === 0) {
    console.warn(`[emails] Pedido ${orderId} sin destinatarios válidos; no se envía ${emailType}.`);
    return { status: "skipped", reason: "no_recipients" };
  }

  // (1) Reclamar el slot de idempotencia. El INSERT choca contra
  // UNIQUE(order_id, email_type) si ya existe → abortamos sin reenviar.
  // Se inserta como 'failed' provisional ("envío en curso"); se promociona a
  // 'sent' sólo si Brevo responde OK.
  const { error: claimError } = await supabase.from("order_emails").insert({
    order_id: orderId,
    email_type: emailType,
    status: "failed",
    error_message: "envío en curso",
  });

  if (claimError) {
    // 23505 = unique_violation → ya se envió (o se intentó) este tipo de email.
    if (claimError.code === "23505") {
      console.log(`[emails] ${emailType} ya registrado para ${orderId}; idempotencia OK, no se reenvía.`);
      return { status: "skipped", reason: "already_exists" };
    }
    throw new Error(`No se pudo reclamar slot order_emails: ${claimError.message}`);
  }

  // (2) Enviar vía Brevo y registrar el resultado.
  try {
    const messageId = await sendTransactionalEmail({
      to,
      subject: template.subject,
      htmlContent: template.html,
    });

    await supabase
      .from("order_emails")
      .update({
        status: "sent",
        brevo_message_id: messageId,
        sent_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("order_id", orderId)
      .eq("email_type", emailType);

    console.log(`[emails] ${emailType} enviado para ${order.order_number} (${orderId}); messageId=${messageId}.`);
    return { status: "sent", messageId };
  } catch (err) {
    const msg = String(err?.message || err).slice(0, 500);
    await supabase
      .from("order_emails")
      .update({ status: "failed", error_message: msg })
      .eq("order_id", orderId)
      .eq("email_type", emailType);
    console.error(`[emails] FALLO enviando ${emailType} para ${orderId}: ${msg}`);
    return { status: "failed", error: msg };
  }
}

/**
 * Email de confirmación de pedido. Idempotente. No lanza: cualquier error se
 * captura y se devuelve, para no romper el webhook de Stripe.
 */
export async function sendOrderConfirmation(orderId) {
  try {
    const supabase = getServiceSupabase();
    const order = await loadOrder(supabase, orderId);
    const items = await loadItems(supabase, orderId);
    const template = confirmationEmail({ order, items });
    const recipients = order.customer_email
      ? [{ email: order.customer_email, name: order.customer_name || undefined }]
      : [];
    return await claimAndSend({ orderId, emailType: "confirmation", order, recipients, template });
  } catch (err) {
    const msg = String(err?.message || err);
    console.error(`[emails] Error inesperado en confirmación ${orderId}: ${msg}`);
    return { status: "failed", error: msg };
  }
}

/**
 * Email de notificación de envío. Requiere carrier + tracking_number en el
 * pedido; si faltan, no envía (Lucía aún no ha terminado de rellenar).
 * Idempotente. No lanza.
 */
export async function sendShipmentNotification(orderId) {
  try {
    const supabase = getServiceSupabase();
    const order = await loadOrder(supabase, orderId);

    if (!order.carrier || !order.tracking_number) {
      console.log(`[emails] Pedido ${orderId} sin carrier/tracking; se ignora envío (Lucía no ha terminado).`);
      return { status: "skipped", reason: "missing_tracking" };
    }

    const template = shipmentEmail({
      order,
      tracking: order.tracking_number,
      carrier: order.carrier,
    });
    const recipients = order.customer_email
      ? [{ email: order.customer_email, name: order.customer_name || undefined }]
      : [];
    return await claimAndSend({ orderId, emailType: "shipment", order, recipients, template });
  } catch (err) {
    const msg = String(err?.message || err);
    console.error(`[emails] Error inesperado en envío ${orderId}: ${msg}`);
    return { status: "failed", error: msg };
  }
}

// --- Email operativo interno ------------------------------------------------

// Disponible de una variante = stock - stock_reserved (misma definición que ve
// el cliente). Se lee DESPUÉS del decremento del webhook, así que refleja el
// stock ya actualizado por este pedido.
function availableOf(v) {
  return (v?.stock ?? 0) - (v?.stock_reserved ?? 0);
}

/**
 * Carga y prepara los datos operativos del pedido para el email interno:
 *   - items: líneas del pedido (con SKU y categoría),
 *   - componentsBreakdown: las 3 piezas físicas de cada conjunto,
 *   - stockAfter: disponible restante de los SKUs realmente afectados.
 *
 * Eficiencia: 2 queries fijas (items + componentes de los modelos de conjunto),
 * sin N+1.
 */
async function loadInternalOrderData(supabase, orderId) {
  // (1) Líneas del pedido con la variante vendida y su producto.
  const { data: rows, error } = await supabase
    .from("order_items")
    .select(
      "id, product_name_snapshot, size_snapshot, quantity, " +
        "variant:variants(id, sku, size, stock, stock_reserved, " +
        "product:products(name, model, category))"
    )
    .eq("order_id", orderId);
  if (error) throw new Error(`No se pudieron cargar los items de ${orderId}: ${error.message}`);

  const items = (rows || []).map((row) => {
    const product = row.variant?.product || null;
    return {
      key: row.id,
      sku: row.variant?.sku || null,
      name: row.product_name_snapshot || product?.name || "Producto",
      size: row.size_snapshot || null,
      quantity: row.quantity || 1,
      category: product?.category || null,
      model: product?.model || null,
      // Variante vendida (para stock de productos sueltos).
      variant: row.variant || null,
    };
  });

  // (2) Componentes físicos de los conjuntos del pedido. Un conjunto se prepara
  // con arnés de la talla + correa + portabolsas del mismo modelo (CLAUDE.md §6,
  // migración 004). Reconstruimos igual que el webhook al descontar stock.
  const conjuntoModels = [
    ...new Set(items.filter((i) => i.category === "conjunto" && i.model).map((i) => i.model)),
  ];

  const harnessByKey = new Map(); // `${model}:${size}` -> variante+nombre
  const leashByModel = new Map(); // model -> variante+nombre
  const bagByModel = new Map(); // model -> variante+nombre

  if (conjuntoModels.length > 0) {
    const { data: comps, error: compErr } = await supabase
      .from("products")
      .select("name, model, category, variants(id, sku, size, stock, stock_reserved)")
      .eq("active", true)
      .in("model", conjuntoModels)
      .in("category", ["arnes", "correa", "portabolsas"]);
    if (compErr) {
      throw new Error(`No se pudieron resolver componentes de conjunto: ${compErr.message}`);
    }
    for (const p of comps || []) {
      if (p.category === "arnes") {
        for (const v of p.variants || []) {
          if (v.size) harnessByKey.set(`${p.model}:${v.size}`, { ...v, name: p.name });
        }
      } else if (p.category === "correa") {
        const v = (p.variants || [])[0];
        if (v) leashByModel.set(p.model, { ...v, name: p.name });
      } else if (p.category === "portabolsas") {
        const v = (p.variants || [])[0];
        if (v) bagByModel.set(p.model, { ...v, name: p.name });
      }
    }
  }

  // (3) Desglose de piezas por conjunto + acumulación de variantes afectadas.
  const componentsBreakdown = [];
  const affected = new Map(); // variant_id -> {sku, name, size, stock, stock_reserved}

  const addAffected = (v, name, size) => {
    if (!v?.id) return;
    if (!affected.has(v.id)) {
      affected.set(v.id, {
        sku: v.sku || null,
        name,
        size: size ?? null,
        stock: v.stock,
        stock_reserved: v.stock_reserved,
      });
    }
  };

  for (const item of items) {
    if (item.category === "conjunto" && item.model) {
      const harness = harnessByKey.get(`${item.model}:${item.size}`);
      const leash = leashByModel.get(item.model);
      const bag = bagByModel.get(item.model);
      const pieces = [];
      for (const [v, size] of [
        [harness, item.size],
        [leash, null],
        [bag, null],
      ]) {
        if (!v) continue;
        pieces.push({ sku: v.sku || null, name: v.name, size, quantity: item.quantity });
        addAffected(v, v.name, size);
      }
      componentsBreakdown.push({ key: item.key, pieces });
    } else if (item.variant) {
      // Producto suelto: su propia variante es la afectada.
      addAffected(item.variant, item.name, item.size);
    }
  }

  const stockAfter = [...affected.values()].map((a) => ({
    sku: a.sku,
    name: a.name,
    size: a.size,
    available: availableOf(a),
  }));

  return { items, componentsBreakdown, stockAfter };
}

/**
 * Email operativo INTERNO al equipo (lib/emails/constants.js) tras un pedido
 * pagado. Se envía en paralelo al de confirmación al cliente y con la MISMA
 * guarda de idempotencia (order_emails, email_type='internal-notification').
 *
 * No lanza: cualquier error se captura y se devuelve, para no bloquear el 200
 * del webhook (el pedido ya existe; este correo es secundario).
 *
 * @param {string} orderId
 * @param {Object} [opts]
 * @param {string} [opts.phone]  Teléfono del cliente (Stripe no lo persiste en
 *   orders; el webhook lo pasa desde customer_details).
 */
export async function sendInternalOrderNotification(orderId, { phone } = {}) {
  try {
    const supabase = getServiceSupabase();
    const order = await loadOrder(supabase, orderId);
    order.phone = phone || null;

    const { items, componentsBreakdown, stockAfter } = await loadInternalOrderData(
      supabase,
      orderId
    );

    const template = buildInternalOrderEmail({
      order,
      items,
      componentsBreakdown,
      stockAfter,
    });

    return await claimAndSend({
      orderId,
      emailType: "internal-notification",
      order,
      recipients: INTERNAL_NOTIFICATION_RECIPIENTS,
      template,
    });
  } catch (err) {
    const msg = String(err?.message || err);
    console.error(`[emails] Error inesperado en aviso interno ${orderId}: ${msg}`);
    return { status: "failed", error: msg };
  }
}
