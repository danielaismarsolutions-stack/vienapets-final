"use client";

import { Icon } from "./Icon";

export function QtyStepper({ qty, onChange }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(74,46,28,.3)", height: 30 }}>
      <button onClick={() => onChange(qty - 1)} style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", color: "var(--vp-brown)", display: "grid", placeItems: "center" }}>
        <Icon.Minus style={{ width: 12, height: 12 }} />
      </button>
      <span style={{ width: 28, textAlign: "center", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{qty}</span>
      <button onClick={() => onChange(qty + 1)} style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", color: "var(--vp-brown)", display: "grid", placeItems: "center" }}>
        <Icon.Plus style={{ width: 12, height: 12 }} />
      </button>
    </div>
  );
}
