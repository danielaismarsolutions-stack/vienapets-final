// POST /api/webhook
// Receptor de eventos de Stripe (CLAUDE.md §6, Sprint 4). Es la ÚNICA pieza
// que persiste pedidos y descuenta stock real, y sólo lo hace tras un pago
// confirmado por Stripe (nunca antes, nunca desde el cliente).
//
// Seguridad y robustez:
//  - Verifica la firma con STRIPE_WEBHOOK_SECRET sobre el cuerpo CRUDO (texto
//    sin parsear). Sin firma válida no se procesa nada.
//  - Idempotente: la RPC process_paid_order hace INSERT ... ON CONFLICT
//    (stripe_session_id) DO NOTHING como PRIMERA operación. Un resend del
//    mismo evento no duplica el pedido ni vuelve a descontar stock.
//  - El decremento de stock es atómico (WHERE stock >= quantity) dentro de la
//    misma transacción que el alta del pedido.
//
// Next 14 App Router: runtime nodejs (el SDK de Stripe no corre en edge) y
// force-dynamic para no cachear. El cuerpo se lee con req.text().
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { getServiceSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const stripe = getStripe();

  // --- Verificación de firma sobre el cuerpo crudo --------------------
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET no definido");
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] Firma inválida:", err.message);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  console.log(`[webhook] Evento recibido: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        // Tarjeta normal: completed llega ya 'paid'. Métodos asíncronos
        // (p. ej. SEPA): completed llega 'unpaid' y luego async_payment_succeeded.
        if (session.payment_status !== "paid") {
          console.log(`[webhook] Sesión ${session.id} aún no pagada (${session.payment_status}); se ignora.`);
          return NextResponse.json({ received: true });
        }
        await persistPaidOrder(stripe, session);
        return NextResponse.json({ received: true });
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        await persistFailedOrder(session);
        return NextResponse.json({ received: true });
      }

      default:
        console.log(`[webhook] Evento no manejado: ${event.type}`);
        return NextResponse.json({ received: true });
    }
  } catch (err) {
    // Devolvemos 500 para que Stripe reintente. La idempotencia de la RPC
    // garantiza que un reintento tras un éxito parcial no duplica nada.
    console.error(`[webhook] Error procesando ${event.type}:`, err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Alta de pedido pagado: mapea line_items → variantes y llama a la RPC
// transaccional que inserta orders + order_items y descuenta stock.
async function persistPaidOrder(stripe, session) {
  // Recuperamos los line_items con el price expandido (no vienen en el evento).
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price"],
  });
  const lineItems = full.line_items?.data ?? [];

  const items = await mapLineItemsToVariants(lineItems);

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.rpc("process_paid_order", {
    p_session_id: full.id,
    p_payment_intent_id: full.payment_intent ?? null,
    p_customer_email: full.customer_details?.email ?? null,
    p_customer_name: full.customer_details?.name ?? null,
    p_shipping_address: extractShipping(full),
    p_subtotal_cents: full.amount_subtotal ?? null,
    p_shipping_cents: full.total_details?.amount_shipping ?? full.shipping_cost?.amount_total ?? 0,
    p_total_cents: full.amount_total ?? null,
    p_status: "paid",
    p_items: items,
  });

  if (error) {
    // Propaga para que el handler devuelva 500 y Stripe reintente.
    throw new Error(`RPC process_paid_order falló: ${error.message}`);
  }

  if (!data?.created) {
    console.log(`[webhook] Pedido ya existente para ${full.id}; idempotencia OK, no se duplica.`);
    return;
  }

  console.log(`[webhook] Pedido creado ${data.order_number} (${data.order_id}) para sesión ${full.id}.`);
  const warnings = data.stock_warnings ?? [];
  if (warnings.length > 0) {
    console.warn(
      `[webhook] AVISO stock en ${data.order_number}: ${JSON.stringify(warnings)}. ` +
        "El pago está hecho; NO se revierte. Revisar manualmente en Supabase Studio."
    );
  }
}

// Pago asíncrono fallido: registramos el pedido como 'payment_failed' para que
// Lucía lo vea. Sin items ni descuento de stock (la RPC lo omite por status).
async function persistFailedOrder(session) {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.rpc("process_paid_order", {
    p_session_id: session.id,
    p_payment_intent_id: session.payment_intent ?? null,
    p_customer_email: session.customer_details?.email ?? null,
    p_customer_name: session.customer_details?.name ?? null,
    p_shipping_address: extractShipping(session),
    p_subtotal_cents: session.amount_subtotal ?? null,
    p_shipping_cents: session.total_details?.amount_shipping ?? session.shipping_cost?.amount_total ?? 0,
    p_total_cents: session.amount_total ?? null,
    p_status: "payment_failed",
    p_items: [],
  });

  if (error) throw new Error(`RPC process_paid_order (failed) falló: ${error.message}`);
  if (data?.created) {
    console.log(`[webhook] Pago fallido registrado ${data.order_number} para sesión ${session.id}.`);
  } else {
    console.log(`[webhook] Sesión fallida ${session.id} ya registrada; no se duplica.`);
  }
}

// Mapea cada line_item de Stripe a su variante en Supabase por stripe_price_id
// (acordado en Paso 1: no se toca el flujo de precios). Devuelve el array que
// consume la RPC: {variant_id, product_name, size, price_cents, quantity}.
async function mapLineItemsToVariants(lineItems) {
  const priceIds = [
    ...new Set(lineItems.map((li) => li.price?.id).filter(Boolean)),
  ];
  if (priceIds.length === 0) return [];

  const supabase = getServiceSupabase();
  const { data: variants, error } = await supabase
    .from("variants")
    .select("id, size, stripe_price_id, product:products(name, price_cents)")
    .in("stripe_price_id", priceIds);

  if (error) {
    throw new Error(`No se pudieron mapear variantes: ${error.message}`);
  }

  const byPrice = new Map((variants || []).map((v) => [v.stripe_price_id, v]));

  return lineItems.map((li) => {
    const v = byPrice.get(li.price?.id);
    if (!v) {
      // No debería ocurrir (todo price proviene del catálogo). Lo registramos
      // y guardamos el item sin variant_id: el pedido conserva el histórico,
      // pero no se descuenta stock de algo que no identificamos.
      console.warn(`[webhook] price_id ${li.price?.id} sin variante asociada en Supabase.`);
      return {
        variant_id: null,
        product_name: li.description ?? "Producto",
        size: null,
        price_cents: li.price?.unit_amount ?? null,
        quantity: li.quantity ?? 1,
      };
    }
    return {
      variant_id: v.id,
      product_name: v.product?.name ?? li.description ?? "Producto",
      size: v.size ?? null,
      price_cents: v.product?.price_cents ?? li.price?.unit_amount ?? null,
      quantity: li.quantity ?? 1,
    };
  });
}

// Normaliza la dirección de envío de la sesión a un jsonb estable. Stripe ha
// movido el campo entre versiones (shipping_details / collected_information),
// así que comprobamos ambos.
function extractShipping(session) {
  const s = session.shipping_details ?? session.collected_information?.shipping_details ?? null;
  if (s) return { name: s.name ?? null, address: s.address ?? null };
  // Fallback: dirección de facturación.
  const c = session.customer_details ?? null;
  if (c?.address) return { name: c.name ?? null, address: c.address };
  return null;
}
