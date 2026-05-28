"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";
import { useCart } from "@/components/shared/CartProvider";

export function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { go } = useRoute();
  const [step, setStep] = useState(0);
  const total = subtotal;

  if (items.length === 0) {
    return (
      <div style={{ padding: "120px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Checkout</div>
          <h1 className="vp-display" style={{ fontSize: 56, color: "var(--vp-brown)", margin: 0 }}>Tu cesta está vacía.</h1>
          <button className="vp-btn" style={{ marginTop: 32 }} onClick={() => go("/tienda")}>Descubrir la tienda</button>
        </div>
      </div>
    );
  }

  const steps = ["Contacto", "Envío", "Pago"];

  return (
    <div style={{ padding: "24px 40px 80px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 className="vp-display" style={{ fontSize: 56, color: "var(--vp-brown)", margin: 0 }}>Tu pedido</h1>
          <a onClick={() => go("/tienda")} style={{ cursor: "pointer", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--vp-brown)", borderBottom: "1px solid" }}>← Seguir comprando</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 60 }}>
          <div>
            <div style={{ display: "flex", gap: 0, marginBottom: 40, borderBottom: "1px solid rgba(74,46,28,.2)" }}>
              {steps.map((s, i) => (
                <button key={s} onClick={() => setStep(i)} style={{
                  padding: "16px 24px", background: "transparent", border: "none",
                  borderBottom: step === i ? "2px solid var(--vp-brown)" : "2px solid transparent",
                  color: step === i ? "var(--vp-brown)" : "var(--vp-ink-muted)",
                  marginBottom: -1, cursor: "pointer",
                  fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase",
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", marginRight: 10 }}>0{i + 1}</span>{s}
                </button>
              ))}
            </div>

            {step === 0 && <CheckoutContact onNext={() => setStep(1)} />}
            {step === 1 && <CheckoutShipping onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step === 2 && <CheckoutPayment onBack={() => setStep(1)} total={total} />}
          </div>

          <aside style={{ background: "var(--vp-cream-soft)", padding: 32, alignSelf: "start", position: "sticky", top: 100 }}>
            <div className="vp-eyebrow" style={{ marginBottom: 20 }}>Resumen</div>
            {items.map((it) => (
              <div key={it.key} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(74,46,28,.1)" }}>
                <div style={{ width: 56, height: 56, background: it.swatch, backgroundImage: `url(${it.img})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", position: "relative" }}>
                  <span style={{ position: "absolute", top: -6, right: -6, background: "var(--vp-brown)", color: "var(--vp-paper)", borderRadius: 999, width: 20, height: 20, display: "grid", placeItems: "center", fontSize: 10 }}>{it.qty}</span>
                </div>
                <div>
                  <div className="vp-serif" style={{ fontSize: 15, color: "var(--vp-brown)" }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: "var(--vp-ink-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>{it.type}{it.size ? ` · ${it.size}` : ""}</div>
                </div>
                <div className="vp-serif" style={{ fontSize: 14, color: "var(--vp-brown)" }}>€{(it.price * it.qty).toFixed(2)}</div>
              </div>
            ))}
            <div style={{ marginTop: 20, fontSize: 13, color: "var(--vp-ink-soft)" }}>
              <Row l="Subtotal" r={`€${subtotal.toFixed(2)}`} />
              <Row l="Envío" r={<span style={{ fontSize: 12 }}>Se calcula en el siguiente paso</span>} />
              <div style={{ height: 1, background: "rgba(74,46,28,.2)", margin: "14px 0" }} />
              <Row l={<span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>Total</span>} r={<span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>€{total.toFixed(2)}</span>} />
            </div>
            <div style={{ marginTop: 20, padding: 12, background: "var(--vp-paper)", fontSize: 12, color: "var(--vp-ink-soft)", display: "flex", gap: 10, alignItems: "center" }}>
              <Icon.Truck style={{ width: 18, height: 18, color: "var(--vp-brown)" }} />
              Envío gratuito a partir de 45 €
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ l, r }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>{l}</span><span>{r}</span></div>;
}

function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 20 }}>
      <span className="vp-eyebrow" style={{ display: "block", marginBottom: 8 }}>{label}</span>
      <input {...props} style={{ width: "100%", padding: "14px 0", border: "none", borderBottom: "1px solid rgba(74,46,28,.3)", background: "transparent", outline: "none", fontSize: 15, color: "var(--vp-ink)" }} />
    </label>
  );
}

function CheckoutContact({ onNext }) {
  return (
    <div>
      <Field label="Correo electrónico" placeholder="lucia@viena.pets" type="email" />
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--vp-ink-soft)", marginBottom: 30 }}>
        <input type="checkbox" /> Quiero recibir novedades y ediciones limitadas
      </label>
      <button className="vp-btn" onClick={onNext}>Continuar <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
    </div>
  );
}

function CheckoutShipping({ onNext, onBack }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Field label="Nombre" placeholder="Lucía" />
        <Field label="Apellidos" placeholder="Larrondobuno" />
      </div>
      <Field label="Dirección" placeholder="Calle, número, piso" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <Field label="Ciudad" placeholder="Madrid" />
        <Field label="Código postal" placeholder="28003" />
        <Field label="Teléfono" placeholder="+34 ..." />
      </div>
      <div style={{ marginTop: 12, marginBottom: 28 }}>
        <span className="vp-eyebrow" style={{ display: "block", marginBottom: 12 }}>Método de envío</span>
        {[
          { l: "Estándar", p: "Gratis desde 45 € · €5,90" },
          { l: "Punto de recogida", p: "€3,90" },
        ].map((o, i) => (
          <label key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 16px", border: "1px solid rgba(74,46,28,.2)", marginBottom: 8, cursor: "pointer" }}>
            <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input type="radio" name="ship" defaultChecked={i === 0} />
              <span>{o.l}</span>
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--vp-brown)" }}>{o.p}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button className="vp-btn ghost" onClick={onBack}><Icon.ArrowLeft style={{ width: 14, height: 14 }} /> Atrás</button>
        <button className="vp-btn" onClick={onNext}>Ir al pago <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
      </div>
    </div>
  );
}

function CheckoutPayment({ onBack, total }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {["Tarjeta", "PayPal", "Bizum"].map((m, i) => (
          <button key={m} style={{ padding: "14px 0", border: "1px solid var(--vp-brown)", background: i === 0 ? "var(--vp-brown)" : "transparent", color: i === 0 ? "var(--vp-paper)" : "var(--vp-brown)", cursor: "pointer", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase" }}>{m}</button>
        ))}
      </div>
      <Field label="Número de tarjeta" placeholder="4242 4242 4242 4242" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <Field label="Caducidad" placeholder="MM/AA" />
        <Field label="CVC" placeholder="123" />
        <Field label="Código postal" placeholder="28003" />
      </div>
      <div style={{ padding: "14px 16px", background: "var(--vp-cream-soft)", fontSize: 12, color: "var(--vp-ink-soft)", marginBottom: 24, display: "flex", gap: 10 }}>
        <Icon.Check style={{ width: 18, height: 18, color: "var(--vp-brown)" }} />
        Pago encriptado end-to-end. No guardamos datos de tarjeta.
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button className="vp-btn ghost" onClick={onBack}><Icon.ArrowLeft style={{ width: 14, height: 14 }} /> Atrás</button>
        {/* Sprint 3: conectar a Stripe */}
        <button className="vp-btn" disabled>
          Pagar €{total.toFixed(2)} <Icon.Arrow style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}
