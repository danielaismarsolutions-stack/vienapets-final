"use client";

import { Icon } from "@/components/shared/Icon";
import { useRoute } from "@/components/shared/useRoute";

export function ModelsPage({ models = [] }) {
  const { go } = useRoute();
  return (
    <div style={{ padding: "40px 40px 80px" }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ marginBottom: 48, borderBottom: "1px solid rgba(74,46,28,.2)", paddingBottom: 32 }}>
          <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Modelos</div>
          <h1 className="vp-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", color: "var(--vp-brown)", margin: 0, lineHeight: .95 }}>Capri <span className="vp-italic" style={{ fontStyle: "italic" }}>·</span> Peachy <span className="vp-italic" style={{ fontStyle: "italic" }}>·</span> Daisy</h1>
        </div>
        {models.map((m, i) => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1.1fr 1fr" : "1fr 1.1fr", gap: 80, alignItems: "center", padding: "80px 0", borderBottom: "1px solid rgba(74,46,28,.12)" }}>
            <div style={{ order: i % 2 === 0 ? 0 : 1, width: "100%", height: 520, overflow: "hidden", background: "var(--vp-cream-soft)" }}>
              <img src={m.heroImg} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
            </div>
            <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
              <div className="vp-eyebrow" style={{ marginBottom: 14, color: "var(--vp-ink-muted)" }}>Modelo 0{i + 1} / 03</div>
              <h2 className="vp-display" style={{ fontSize: 88, color: "var(--vp-brown)", margin: 0, lineHeight: .9 }}>{m.name}</h2>
              <p style={{ fontSize: 17, color: "var(--vp-ink-soft)", lineHeight: 1.7, marginTop: 24, maxWidth: 480 }}>{m.description}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <div style={{ width: 40, height: 40, background: m.hex.primary }} />
                <div style={{ width: 40, height: 40, background: m.hex.secondary }} />
              </div>
              <button className="vp-btn" style={{ marginTop: 32 }} onClick={() => go(`/producto/${m.slugs?.conjunto ?? m.slugs?.arnes ?? m.id}`)}>Descubrir {m.name} <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
