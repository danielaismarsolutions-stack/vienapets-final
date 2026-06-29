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
import { getStripe, priceIdOf, STRIPE_PRICE_COLUMN } from "@/lib/stripe/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/emails/send";

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

  // Manifiesto de conjuntos escrito por /api/checkout (modelo:talla:cantidad,...).
  // Stripe no transporta la talla en una line item de precio fijo, así que el
  // descuento de los componentes del conjunto se reconstruye desde aquí.
  const conjuntos = parseConjManifest(full.metadata?.conj);

  const items = await buildOrderItems(lineItems, conjuntos);

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

  // Email de confirmación (Sprint 5). El pedido ya está creado y es lo único
  // crítico: el envío del email es idempotente (UNIQUE en order_emails) y NUNCA
  // lanza, así que un fallo de Brevo no rompe el webhook ni provoca un reintento
  // de Stripe que duplicaría nada.
  const emailResult = await sendOrderConfirmation(data.order_id);
  console.log(`[webhook] Email confirmación ${data.order_number}: ${emailResult.status}` +
    (emailResult.reason ? ` (${emailResult.reason})` : "") +
    (emailResult.error ? ` — ${emailResult.error}` : ""));
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

// Parsea el manifiesto de conjuntos "modelo:talla:cantidad,..." a objetos
// {model, size, qty}. Tolerante a entradas vacías o malformadas.
function parseConjManifest(raw) {
  if (!raw) return [];
  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((part) => {
      const [model, size, qty] = part.split(":");
      return { model, size, qty: Math.max(1, parseInt(qty, 10) || 1) };
    })
    .filter((m) => m.model && m.size);
}

// Construye el array de items que consume la RPC process_paid_order. Cada item:
//   { variant_id, product_name, size, price_cents, quantity, stock_targets }
// stock_targets es la lista de variantes a descontar:
//   · Producto suelto → la propia variante.
//   · Conjunto        → arnés (talla elegida) + correa + portabolsas del modelo.
// Las líneas de conjunto se reconstruyen desde el manifiesto (la talla no viaja
// en Stripe), por eso se EXCLUYEN del mapeo por line_item para no duplicarlas.
async function buildOrderItems(lineItems, conjuntos) {
  const supabase = getServiceSupabase();
  const items = [];

  // --- 1) Productos sueltos: mapeo line_item → variante por stripe_price_id ---
  const priceIds = [...new Set(lineItems.map((li) => li.price?.id).filter(Boolean))];
  let byPrice = new Map();
  if (priceIds.length > 0) {
    // Los price IDs del evento provienen de la sesión de Checkout, que usa la
    // columna del modo activo (test/live). Mapeamos por esa misma columna.
    const { data: variants, error } = await supabase
      .from("variants")
      .select("id, size, stripe_price_id, stripe_price_id_live, product:products(name, price_cents, category)")
      .in(STRIPE_PRICE_COLUMN, priceIds);
    if (error) {
      throw new Error(`No se pudieron mapear variantes: ${error.message}`);
    }
    byPrice = new Map((variants || []).map((v) => [priceIdOf(v), v]));
  }

  for (const li of lineItems) {
    const v = byPrice.get(li.price?.id);
    const quantity = li.quantity ?? 1;
    if (!v) {
      // No debería ocurrir (todo price proviene del catálogo). Lo registramos
      // y guardamos el item sin variant_id ni descuento de stock.
      console.warn(`[webhook] price_id ${li.price?.id} sin variante asociada en Supabase.`);
      items.push({
        variant_id: null,
        product_name: li.description ?? "Producto",
        size: null,
        price_cents: li.price?.unit_amount ?? null,
        quantity,
        stock_targets: [],
      });
      continue;
    }
    // Los conjuntos se gestionan por manifiesto (descuento de componentes). Si
    // hay manifiesto, se omite aquí la línea del bundle para no duplicarla. Si
    // por algún motivo faltara (metadata perdida/truncada), NO se descarta: se
    // registra como item normal —descontará el stock del propio SKU del conjunto
    // como red de seguridad— para no perder el pedido del histórico.
    if (v.product?.category === "conjunto" && conjuntos.length > 0) continue;
    items.push({
      variant_id: v.id,
      product_name: v.product?.name ?? li.description ?? "Producto",
      size: v.size ?? null,
      price_cents: v.product?.price_cents ?? li.price?.unit_amount ?? null,
      quantity,
      stock_targets: [{ variant_id: v.id, quantity }],
    });
  }

  // --- 2) Conjuntos: order_item del bundle + descuento de los 3 componentes ---
  if (conjuntos.length > 0) {
    const models = [...new Set(conjuntos.map((m) => m.model))];
    const { data: prods, error } = await supabase
      .from("products")
      .select("id, name, model, category, price_cents, variants(id, size)")
      .eq("active", true)
      .in("model", models)
      .in("category", ["arnes", "correa", "portabolsas", "conjunto"]);
    if (error) {
      throw new Error(`No se pudieron resolver los componentes del conjunto: ${error.message}`);
    }

    const conjByModel = new Map();    // model -> {variantId, name, price_cents}
    const harnessByKey = new Map();   // `${model}:${size}` -> variantId
    const leashByModel = new Map();   // model -> variantId
    const bagByModel = new Map();     // model -> variantId
    for (const p of prods || []) {
      if (p.category === "conjunto") {
        const v = (p.variants || [])[0];
        conjByModel.set(p.model, { variantId: v?.id ?? null, name: p.name, price_cents: p.price_cents });
      } else if (p.category === "arnes") {
        for (const v of p.variants || []) {
          if (v.size) harnessByKey.set(`${p.model}:${v.size}`, v.id);
        }
      } else if (p.category === "correa") {
        leashByModel.set(p.model, (p.variants || [])[0]?.id ?? null);
      } else if (p.category === "portabolsas") {
        bagByModel.set(p.model, (p.variants || [])[0]?.id ?? null);
      }
    }

    for (const m of conjuntos) {
      const conj = conjByModel.get(m.model);
      const targets = [
        { variant_id: harnessByKey.get(`${m.model}:${m.size}`) ?? null, quantity: m.qty },
        { variant_id: leashByModel.get(m.model) ?? null, quantity: m.qty },
        { variant_id: bagByModel.get(m.model) ?? null, quantity: m.qty },
      ].filter((t) => t.variant_id);

      if (targets.length < 3) {
        // Falta algún componente en el catálogo: no podemos descontar todo. El
        // pago ya está hecho; registramos para revisión manual y continuamos.
        console.warn(
          `[webhook] Conjunto ${m.model} talla ${m.size}: sólo ${targets.length}/3 componentes resueltos. Revisar catálogo.`
        );
      }

      items.push({
        variant_id: conj?.variantId ?? null,
        product_name: conj?.name ?? `Conjunto ${m.model}`,
        size: m.size,
        price_cents: conj?.price_cents ?? null,
        quantity: m.qty,
        stock_targets: targets,
      });
    }
  }

  return items;
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
