"use client";

// Checkout simplificado (Sprint 3): Stripe Checkout es hosted (CLAUDE.md §8,
// prohibido Stripe Elements). No recogemos dirección ni datos de tarjeta aquí
// —los pide Stripe—. Mostramos el resumen y un botón que crea la sesión en
// /api/checkout y redirige a Stripe.
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import { useCart } from "@/components/shared/CartProvider";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { getStripeClient } from "@/lib/stripe/client";

const eur = (cents) => `€${(cents / 100).toFixed(2)}`;

export function CheckoutPage() {
  const { items, subtotal_cents, shipping_cents, total_cents } = useCart();
  const { go } = useRoute();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (items.length === 0) {
    return (
      <div style={{ padding: "120px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Checkout</div>
          <h1 className="vp-display" style={{ fontSize: isMobile ? 40 : 56, color: "var(--vp-brown)", margin: 0 }}>Tu cesta está vacía.</h1>
          <button className="vp-btn" style={{ marginTop: 32 }} onClick={() => go("/tienda")}>Descubrir la tienda</button>
        </div>
      </div>
    );
  }

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((it) => ({
            variantId: it.variantId,
            qty: it.qty,
            harnessSize: it.harnessSize ?? null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "No se pudo iniciar el pago. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      // Fallback: redirigir mediante el singleton de Stripe.js usando el sessionId.
      const stripe = await getStripeClient();
      const { error: redirectError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (redirectError) {
        setError(redirectError.message || "No se pudo abrir el pago.");
        setLoading(false);
      }
    } catch {
      setError("No se pudo conectar con el pago. Revisa tu conexión.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: isMobile ? "16px 20px 60px" : "24px 40px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
          <h1 className="vp-display" style={{ fontSize: isMobile ? 40 : 56, color: "var(--vp-brown)", margin: 0 }}>Finalizar compra</h1>
          <a onClick={() => go("/carrito")} style={{ cursor: "pointer", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", borderBottom: "1px solid" }}>← Volver a la cesta</a>
        </div>

        <div style={{ background: "var(--vp-cream-soft)", padding: isMobile ? 20 : 32 }}>
          <div className="vp-eyebrow" style={{ marginBottom: 20 }}>Resumen del pedido</div>
          {items.map((it) => {
            const lineCents = (it.price_cents ?? Math.round((it.price ?? 0) * 100)) * it.qty;
            return (
              <div key={it.key} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(74,46,28,.1)" }}>
                <div style={{ width: 56, height: 56, background: it.swatch, backgroundImage: `url(${it.img})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", position: "relative" }}>
                  <span style={{ position: "absolute", top: -6, right: -6, background: "var(--vp-brown)", color: "var(--vp-paper)", borderRadius: 999, width: 20, height: 20, display: "grid", placeItems: "center", fontSize: 10 }}>{it.qty}</span>
                </div>
                <div>
                  <div className="vp-serif" style={{ fontSize: 15, color: "var(--vp-brown)" }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: "var(--vp-ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>{it.type}{it.size ? ` · ${it.size}` : ""}</div>
                </div>
                <div className="vp-serif" style={{ fontSize: 14, color: "var(--vp-brown)", whiteSpace: "nowrap" }}>{eur(lineCents)}</div>
              </div>
            );
          })}

          <div style={{ marginTop: 20, fontSize: 14, color: "var(--vp-ink-soft)" }}>
            <Row l="Subtotal" r={eur(subtotal_cents)} />
            <Row l="Envío" r={shipping_cents === 0 ? <span style={{ color: "var(--vp-brown)" }}>Gratis</span> : eur(shipping_cents)} />
            <div style={{ height: 1, background: "rgba(74,46,28,.2)", margin: "14px 0" }} />
            <Row
              l={<span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>Total</span>}
              r={<span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>{eur(total_cents)}</span>}
            />
            <div style={{ fontSize: 11, color: "var(--vp-ink-muted)", marginTop: 4 }}>IVA incluido. La dirección de envío se solicita en el siguiente paso.</div>
          </div>

          {error && (
            <div role="alert" style={{ marginTop: 20, padding: "12px 14px", background: "var(--vp-paper)", border: "1px solid rgba(160,60,40,.35)", color: "#8a3b2c", fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            className="vp-btn full"
            style={{ marginTop: 24, ...(loading ? { opacity: 0.6, cursor: "wait" } : {}) }}
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Redirigiendo a pago seguro…" : <>Pagar con Stripe · {eur(total_cents)} <Icon.Arrow style={{ width: 14, height: 14 }} /></>}
          </button>

          <div style={{ marginTop: 16, fontSize: 12, color: "var(--vp-ink-soft)", display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <Icon.Check style={{ width: 16, height: 16, color: "var(--vp-brown)" }} />
            Pago seguro gestionado por Stripe. No almacenamos datos de tarjeta.
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ l, r }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}><span>{l}</span><span>{r}</span></div>;
}
