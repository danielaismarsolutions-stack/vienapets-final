"use client";

// Página /exito: el usuario vuelve aquí tras pagar en Stripe. Consultamos el
// pedido ya persistido por el webhook en Supabase (por session_id) y mostramos
// el número correlativo VP-2026-XXXX. Si el webhook aún no lo ha procesado
// (latencia normal), reintentamos cada 3 s hasta 30 s sin culpar al usuario:
// el pago ya está hecho.
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { useCart } from "@/components/shared/CartProvider";
import { useIsMobile } from "@/components/shared/useIsMobile";

const eur = (cents) => (typeof cents === "number" ? `€${(cents / 100).toFixed(2)}` : null);

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_MS = 30000;

export function ExitoPage() {
  const router = useRouter();
  const search = useSearchParams();
  const sessionId = search.get("session_id");
  const { clear } = useCart();
  const isMobile = useIsMobile();
  // status: "loading" (consultando) | "ok" (pedido encontrado) | "pending"
  // (pago recibido pero el webhook aún no ha persistido tras 30 s)
  const [state, setState] = useState({ status: "loading" });
  const ranRef = useRef(false);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return; // evita doble arranque en StrictMode
    ranRef.current = true;

    if (!sessionId) {
      router.replace("/carrito");
      return;
    }

    let cancelled = false;
    let timer = null;
    const startedAt = Date.now();

    const poll = async () => {
      try {
        const res = await fetch(`/api/checkout/order?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.found) {
          if (!clearedRef.current) {
            clear(); // vacía el carrito sólo al confirmar el pedido
            clearedRef.current = true;
          }
          setState({
            status: "ok",
            orderNumber: data.orderNumber,
            email: data.email,
            total: data.total,
          });
          return; // deja de reintentar
        }
      } catch {
        // Error transitorio de red: reintentamos mientras quede tiempo.
      }
      if (cancelled) return;

      if (Date.now() - startedAt >= POLL_MAX_MS) {
        // El pago se recibió (Stripe redirige aquí), pero el webhook tarda más
        // de lo normal. No mandamos al usuario al carrito.
        setState({ status: "pending" });
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (state.status === "loading") {
    return (
      <div style={{ padding: "140px 40px", textAlign: "center", color: "var(--vp-ink-muted)" }}>
        <div className="vp-eyebrow">Procesando tu pedido, esto puede tardar unos segundos…</div>
      </div>
    );
  }

  if (state.status === "pending") {
    return (
      <div style={{ padding: isMobile ? "80px 24px 100px" : "120px 40px 140px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Pago recibido</div>
          <h1 className="vp-display" style={{ fontSize: isMobile ? 36 : 48, color: "var(--vp-brown)", margin: 0, lineHeight: 1.05 }}>
            Estamos preparando tu pedido
          </h1>
          <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 24 }}>
            Hemos recibido tu pago correctamente. Tu número de pedido y la factura llegarán a tu
            correo en unos minutos. Si tienes cualquier duda, escríbenos.
          </p>
          <div style={{ marginTop: 40 }}>
            <button className="vp-btn" onClick={() => router.push("/tienda")}>Seguir comprando</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? "80px 24px 100px" : "120px 40px 140px", textAlign: "center" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: "var(--vp-brown)", display: "grid", placeItems: "center", margin: "0 auto 28px" }}>
          <Icon.Check style={{ width: 30, height: 30, color: "var(--vp-paper)" }} />
        </div>
        <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Pedido confirmado</div>
        <h1 className="vp-display" style={{ fontSize: isMobile ? 40 : 56, color: "var(--vp-brown)", margin: 0, lineHeight: 1.05 }}>
          ¡Gracias por tu compra!
        </h1>
        <p style={{ fontSize: 15, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 24 }}>
          Hemos recibido tu pago correctamente.
          {state.email ? <> Te enviaremos la confirmación y la factura a <b style={{ color: "var(--vp-brown)" }}>{state.email}</b>.</> : null}
        </p>

        <div style={{ marginTop: 32, padding: 20, background: "var(--vp-cream-soft)", display: "inline-block", textAlign: "left" }}>
          <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-ink-muted)" }}>Número de pedido</div>
          {/* Correlativo real persistido por el webhook (VP-2026-0001). */}
          <div className="vp-serif" style={{ fontSize: 18, color: "var(--vp-brown)", marginTop: 4 }}>{state.orderNumber}</div>
          {eur(state.total) && (
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--vp-ink-soft)" }}>
              Total: <b style={{ color: "var(--vp-brown)" }}>{eur(state.total)}</b> · IVA incluido
            </div>
          )}
        </div>

        <div style={{ marginTop: 40 }}>
          <button className="vp-btn" onClick={() => router.push("/tienda")}>Seguir comprando</button>
        </div>
      </div>
    </div>
  );
}
