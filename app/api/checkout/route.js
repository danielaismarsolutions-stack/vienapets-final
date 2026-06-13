// POST /api/checkout
// Crea una sesión de Stripe Checkout (hosted) a partir de los items del carrito.
//
// Seguridad (CLAUDE.md §6, §8): el cliente sólo envía variantId + cantidad. El
// servidor revalida contra Supabase (service_role) la existencia de la variante,
// que tenga stripe_price_id, que el producto esté activo y que haya stock
// disponible (stock - stock_reserved). El precio y el envío se calculan aquí,
// nunca se confía en el importe del cliente.
//
// Fuera de alcance (Sprint 4): webhook, descuento de stock, persistencia del
// pedido. Aquí sólo se valida y se crea la sesión.
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { shippingCents } from "@/lib/cart/shipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "La cesta está vacía." }, { status: 400 });
  }

  // Normaliza: agrupa cantidades por variantId y descarta entradas inválidas.
  const qtyByVariant = new Map();
  for (const it of items) {
    const id = it?.variantId;
    const qty = Math.floor(Number(it?.qty ?? it?.quantity ?? 0));
    if (!id || !Number.isFinite(qty) || qty < 1) {
      return NextResponse.json({ error: "Item de carrito inválido." }, { status: 400 });
    }
    qtyByVariant.set(id, (qtyByVariant.get(id) || 0) + qty);
  }
  const variantIds = [...qtyByVariant.keys()];

  const supabase = getServiceSupabase();
  const { data: variants, error } = await supabase
    .from("variants")
    .select("id, sku, size, stripe_price_id, stock, stock_reserved, product:products(name, active, price_cents)")
    .in("id", variantIds);
  if (error) {
    return NextResponse.json({ error: "No se pudo validar la cesta." }, { status: 500 });
  }

  const byId = new Map((variants || []).map((v) => [v.id, v]));
  const line_items = [];
  let subtotal_cents = 0;

  for (const variantId of variantIds) {
    const v = byId.get(variantId);
    const qty = qtyByVariant.get(variantId);
    if (!v) {
      return NextResponse.json({ error: "Un producto de tu cesta ya no está disponible." }, { status: 400 });
    }
    if (!v.product?.active) {
      return NextResponse.json({ error: `"${v.product?.name ?? "Producto"}" ya no está disponible.` }, { status: 400 });
    }
    if (!v.stripe_price_id) {
      return NextResponse.json({ error: `"${v.product?.name ?? "Producto"}" no está listo para la venta.` }, { status: 409 });
    }
    const available = Math.max(0, (v.stock ?? 0) - (v.stock_reserved ?? 0));
    if (available < qty) {
      return NextResponse.json(
        { error: `Stock insuficiente de "${v.product?.name}"${v.size ? ` (talla ${v.size})` : ""}. Quedan ${available}.` },
        { status: 409 }
      );
    }
    line_items.push({ price: v.stripe_price_id, quantity: qty });
    subtotal_cents += (v.product?.price_cents ?? 0) * qty;
  }

  // Envío calculado en servidor: gratis a partir de 60 €, si no plano 5,90 €.
  const shipping_cents = shippingCents(subtotal_cents, true);

  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      locale: "es",
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["ES"] },
      phone_number_collection: { enabled: true },
      invoice_creation: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipping_cents === 0 ? "Envío gratuito" : "Envío estándar",
            fixed_amount: { amount: shipping_cents, currency: "eur" },
            tax_behavior: "inclusive",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      success_url: `${SITE_URL}/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/carrito`,
      metadata: {
        // Resumen para depuración (Sprint 4 usará el webhook para el pedido real).
        cart_summary: JSON.stringify(
          variantIds.map((id) => ({ v: id, q: qtyByVariant.get(id) }))
        ).slice(0, 490),
      },
    });
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 502 });
  }
}
