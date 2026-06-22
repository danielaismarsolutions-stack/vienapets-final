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
 * @param {'confirmation'|'shipment'} opts.emailType
 * @param {Object} opts.order        Fila de orders.
 * @param {{subject:string, html:string}} opts.template
 * @returns {Promise<{status:'sent'|'failed'|'skipped', messageId?:string, reason?:string, error?:string}>}
 */
async function claimAndSend({ orderId, emailType, order, template }) {
  const supabase = getServiceSupabase();

  if (!order.customer_email) {
    console.warn(`[emails] Pedido ${orderId} sin customer_email; no se envía ${emailType}.`);
    return { status: "skipped", reason: "no_email" };
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
      to: { email: order.customer_email, name: order.customer_name || undefined },
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
    return await claimAndSend({ orderId, emailType: "confirmation", order, template });
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
    return await claimAndSend({ orderId, emailType: "shipment", order, template });
  } catch (err) {
    const msg = String(err?.message || err);
    console.error(`[emails] Error inesperado en envío ${orderId}: ${msg}`);
    return { status: "failed", error: msg };
  }
}
