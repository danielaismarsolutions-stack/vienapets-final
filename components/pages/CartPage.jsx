"use client";

// Página /carrito: revisión de la cesta antes del checkout. Lee del store
// (CartProvider) y muestra subtotal, envío (gratis ≥ 60 €) y total con la misma
// lógica que cobrará Stripe. "Tramitar pedido" lleva a /checkout.
import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import { useCart, FREE_SHIPPING_THRESHOLD_CENTS } from "@/components/shared/CartProvider";
import { QtyStepper } from "@/components/shared/QtyStepper";
import { useIsMobile } from "@/components/shared/useIsMobile";

const eur = (cents) => `€${(cents / 100).toFixed(2)}`;

export function CartPage() {
  const { items, updateQty, remove, subtotal_cents, shipping_cents, total_cents } = useCart();
  const { go } = useRoute();
  const isMobile = useIsMobile();

  if (items.length === 0) {
    return (
      <div style={{ padding: "120px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <Icon.Bag style={{ width: 48, height: 48, margin: "0 auto 24px", color: "var(--vp-brown)", opacity: 0.4 }} />
          <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Tu cesta</div>
          <h1 className="vp-display" style={{ fontSize: isMobile ? 40 : 56, color: "var(--vp-brown)", margin: 0 }}>Tu cesta está vacía.</h1>
          <button className="vp-btn" style={{ marginTop: 32 }} onClick={() => go("/tienda")}>Descubrir la tienda</button>
        </div>
      </div>
    );
  }

  const remainingForFree = FREE_SHIPPING_THRESHOLD_CENTS - subtotal_cents;

  return (
    <div style={{ padding: isMobile ? "16px 20px 60px" : "24px 40px 80px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
          <h1 className="vp-display" style={{ fontSize: isMobile ? 40 : 56, color: "var(--vp-brown)", margin: 0 }}>Tu cesta</h1>
          <a onClick={() => go("/tienda")} style={{ cursor: "pointer", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", borderBottom: "1px solid" }}>← Seguir comprando</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.5fr 1fr", gap: isMobile ? 40 : 60 }}>
          {/* Lista de items */}
          <div>
            {items.map((it) => {
              const lineCents = (it.price_cents ?? Math.round((it.price ?? 0) * 100)) * it.qty;
              return (
                <div key={it.key} style={{ display: "grid", gridTemplateColumns: `${isMobile ? 72 : 96}px 1fr auto`, gap: isMobile ? 14 : 20, padding: "22px 0", borderBottom: "1px solid rgba(74,46,28,.12)" }}>
                  <div style={{ width: isMobile ? 72 : 96, height: isMobile ? 72 : 96, background: it.swatch, backgroundImage: `url(${it.img})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
                  <div>
                    <div className="vp-serif" style={{ fontSize: isMobile ? 17 : 19, color: "var(--vp-brown)" }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 3, textTransform: "uppercase", letterSpacing: ".1em" }}>{it.type}{it.size ? ` · Talla ${it.size}` : ""}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
                      <QtyStepper qty={it.qty} onChange={(q) => updateQty(it.key, q)} />
                      <span style={{ fontSize: 11, color: "var(--vp-ink-muted)", textDecoration: "underline", cursor: "pointer" }} onClick={() => remove(it.key)}>Eliminar</span>
                    </div>
                  </div>
                  <div className="vp-serif" style={{ fontSize: 16, color: "var(--vp-brown)", whiteSpace: "nowrap" }}>{eur(lineCents)}</div>
                </div>
              );
            })}
          </div>

          {/* Resumen */}
          <aside style={{ background: "var(--vp-cream-soft)", padding: isMobile ? 20 : 32, alignSelf: "start", position: isMobile ? "static" : "sticky", top: 100 }}>
            <div className="vp-eyebrow" style={{ marginBottom: 20 }}>Resumen</div>
            <Row l="Subtotal" r={eur(subtotal_cents)} />
            <Row
              l="Envío"
              r={shipping_cents === 0 ? <span style={{ color: "var(--vp-brown)" }}>Gratis</span> : eur(shipping_cents)}
            />
            {shipping_cents > 0 && (
              <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--vp-paper)", fontSize: 12, color: "var(--vp-ink-soft)", display: "flex", gap: 10, alignItems: "center" }}>
                <Icon.Truck style={{ width: 16, height: 16, color: "var(--vp-brown)" }} />
                Te faltan {eur(remainingForFree)} para el envío gratuito (a partir de 60 €).
              </div>
            )}
            <div style={{ height: 1, background: "rgba(74,46,28,.2)", margin: "16px 0" }} />
            <Row
              l={<span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>Total</span>}
              r={<span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>{eur(total_cents)}</span>}
            />
            <div style={{ fontSize: 11, color: "var(--vp-ink-muted)", marginTop: 4 }}>IVA incluido</div>
            <button className="vp-btn full" style={{ marginTop: 22 }} onClick={() => go("/checkout")}>
              Tramitar pedido <Icon.Arrow style={{ width: 14, height: 14 }} />
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ l, r }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 14, color: "var(--vp-ink-soft)" }}>
      <span>{l}</span>
      <span>{r}</span>
    </div>
  );
}
