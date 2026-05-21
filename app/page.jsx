export default function Home() {
  return (
    <main style={{ padding: 40, minHeight: "60vh" }}>
      <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Sprint 1</div>
      <h1 className="vp-display" style={{ fontSize: 56, color: "var(--vp-brown)", margin: 0, lineHeight: 0.95 }}>
        Viena Pets
      </h1>
      <p style={{ marginTop: 16, color: "var(--vp-ink-soft)", maxWidth: 520, lineHeight: 1.6 }}>
        Placeholder. Migración estructural a Next.js en curso. Los bloques del home
        se añaden en el Paso 5.
      </p>
      <div style={{ marginTop: 24 }}>
        <button className="vp-btn">Botón de prueba</button>
      </div>
    </main>
  );
}
