"use client";

import { Icon } from "./Icon";
import { useCart } from "./CartProvider";
import { useRoute } from "./useRoute";
import { QtyStepper } from "./QtyStepper";

export function CartDrawer() {
  const { items, open, setOpen, updateQty, remove, subtotal } = useCart();
  const { go } = useRoute();
  return (
    <>
      {/* backdrop */}
      <div style={{
        position: "fixed", inset: 0, background: "rgba(42,29,18,.35)", backdropFilter: "blur(2px)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity .3s ease", zIndex: 90,
      }} onClick={() => setOpen(false)} />
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 440, maxWidth: "92vw",
        background: "var(--vp-cream)", zIndex: 100,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .4s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(42,29,18,.15)",
      }}>
        <div style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(74,46,28,.15)" }}>
          <div className="vp-eyebrow">Tu cesta · {items.length} {items.length === 1 ? "pieza" : "piezas"}</div>
          <Icon.Close style={{ width: 20, height: 20, cursor: "pointer", color: "var(--vp-brown)" }} onClick={() => setOpen(false)} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 28px" }}>
          {items.length === 0 ? (
            <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--vp-ink-muted)" }}>
              <Icon.Bag style={{ width: 48, height: 48, margin: "0 auto 24px", color: "var(--vp-brown)", opacity: .4 }} />
              <div className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)", marginBottom: 10 }}>Tu cesta está vacía</div>
              <p style={{ fontSize: 14 }}>Empieza a explorar nuestros modelos favoritos.</p>
              <button className="vp-btn" style={{ marginTop: 24 }} onClick={() => { setOpen(false); go("/tienda"); }}>Ver la tienda</button>
            </div>
          ) : items.map((it) => (
            <div key={it.key} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, padding: "20px 0", borderBottom: "1px solid rgba(74,46,28,.1)" }}>
              <div style={{ width: 80, height: 80, background: it.swatch, backgroundImage: `url(${it.img})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
              <div>
                <div className="vp-serif" style={{ fontSize: 18, color: "var(--vp-brown)" }}>{it.name}</div>
                <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: ".1em" }}>{it.type}{it.size ? ` · Talla ${it.size}` : ""}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                  <QtyStepper qty={it.qty} onChange={(q) => updateQty(it.key, q)} />
                  <span style={{ fontSize: 11, color: "var(--vp-ink-muted)", textDecoration: "underline", cursor: "pointer" }} onClick={() => remove(it.key)}>Eliminar</span>
                </div>
              </div>
              <div className="vp-serif" style={{ fontSize: 16, color: "var(--vp-brown)" }}>€{(it.price * it.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "20px 28px 28px", borderTop: "1px solid rgba(74,46,28,.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, fontSize: 13, color: "var(--vp-ink-muted)" }}>
              <span>Envío</span><span style={{ fontSize: 12 }}>Se calcula en el siguiente paso</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>Total</span>
              <span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>€{subtotal.toFixed(2)}</span>
            </div>
            <button className="vp-btn full" onClick={() => { setOpen(false); go("/checkout"); }}>Finalizar compra <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
          </div>
        )}
      </aside>
    </>
  );
}
