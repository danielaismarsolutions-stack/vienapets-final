// GET /api/checkout/order?session_id=cs_...
// Devuelve el pedido persistido (por el webhook) para una sesión de Checkout.
// La página /exito lo consulta tras volver de Stripe para mostrar el número
// correlativo VP-2026-XXXX.
//
// Usa service_role (las tablas orders/order_items no tienen acceso público,
// CLAUDE.md §6) y SÓLO expone campos no sensibles del pedido. El session_id de
// Stripe es de alta entropía y lo posee el comprador, así que actúa como token.
//
// Puede no existir aún si el webhook todavía no ha procesado el pago: en ese
// caso devolvemos { found: false } y la página reintenta.
import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "Falta session_id." }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("order_number, customer_email, total_cents, status")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error) {
    console.error("[order] Error consultando pedido:", error.message);
    return NextResponse.json({ error: "No se pudo consultar el pedido." }, { status: 500 });
  }

  if (!data) {
    // El webhook aún no lo ha persistido; la página reintenta.
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    orderNumber: data.order_number,
    email: data.customer_email,
    total: data.total_cents,
    status: data.status,
  });
}
