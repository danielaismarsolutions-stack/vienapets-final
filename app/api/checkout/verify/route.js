// POST /api/checkout/verify
// Confirma con Stripe que una sesión de Checkout se ha pagado. La página /exito
// la llama tras volver de Stripe para no fiarse del simple redirect.
//
// Sprint 3: sólo verifica. La persistencia del pedido y el descuento de stock
// llegan en Sprint 4 (webhook).
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  let sessionId;
  try {
    ({ sessionId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "Falta sessionId." }, { status: 400 });
  }

  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    return NextResponse.json({
      paid,
      orderId: session.id,
      email: session.customer_details?.email ?? null,
      amount_total: session.amount_total ?? null,
    });
  } catch {
    return NextResponse.json({ error: "No se pudo verificar el pago." }, { status: 502 });
  }
}
