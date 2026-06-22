// POST /api/internal/order-shipped
//
// Disparador del email de NOTIFICACIÓN DE ENVÍO (Sprint 5). No hay panel admin
// propio (CLAUDE.md §8): Lucía marca el pedido como 'shipped' y rellena
// carrier + tracking_number desde Supabase Studio. Un Database Webhook de
// Supabase (UPDATE en orders con status='shipped') llama a esta ruta.
//
// Configuración del webhook en Supabase: ver README (paso manual del usuario).
//
// Seguridad: cabecera compartida x-webhook-secret == SUPABASE_WEBHOOK_SECRET.
// Sin secreto válido no se procesa nada (mismo patrón que la firma de Stripe).
//
// Idempotencia y robustez delegadas en sendShipmentNotification:
//   - si falta carrier/tracking → se ignora (Lucía no ha terminado de rellenar),
//   - si ya existe email_type='shipment' para el pedido → no se reenvía,
//   - el envío nunca lanza.
import { NextResponse } from "next/server";
import { sendShipmentNotification } from "@/lib/emails/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

export async function POST(req) {
  // --- Verificación del secreto compartido ----------------------------
  if (!WEBHOOK_SECRET) {
    console.error("[order-shipped] SUPABASE_WEBHOOK_SECRET no definido");
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 500 });
  }
  const provided = req.headers.get("x-webhook-secret");
  if (!provided || provided !== WEBHOOK_SECRET) {
    console.warn("[order-shipped] Secreto inválido o ausente; petición rechazada.");
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // --- Payload del Database Webhook de Supabase -----------------------
  // Forma: { type: 'UPDATE', table, schema, record, old_record }.
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const record = payload?.record;
  if (!record?.id) {
    console.warn("[order-shipped] Payload sin record.id; se ignora.");
    return NextResponse.json({ received: true });
  }

  // Sólo nos interesa el estado 'shipped'. El filtro del webhook ya debería
  // garantizarlo, pero lo comprobamos por defensa en profundidad.
  if (record.status !== "shipped") {
    console.log(`[order-shipped] Pedido ${record.id} con status='${record.status}'; se ignora.`);
    return NextResponse.json({ received: true });
  }

  console.log(`[order-shipped] Disparo envío para pedido ${record.id} (${record.order_number ?? "?"}).`);

  // El email no debe romper la respuesta al webhook: sendShipmentNotification
  // no lanza y es idempotente. Respondemos 200 salvo error de infraestructura.
  const result = await sendShipmentNotification(record.id);
  console.log(`[order-shipped] Email envío ${record.id}: ${result.status}` +
    (result.reason ? ` (${result.reason})` : "") +
    (result.error ? ` — ${result.error}` : ""));

  return NextResponse.json({ received: true, email: result.status });
}
