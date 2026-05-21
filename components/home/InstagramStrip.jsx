"use client";

export function InstagramStrip() {
  const igUrl = "https://www.instagram.com/vienapets/";
  return (
    <section style={{ padding: "0 40px 80px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center", marginBottom: 48 }}>
        <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Instagram</div>
        <h3 className="vp-display" style={{ fontSize: 48, color: "var(--vp-brown)", margin: 0 }}>
          Síguenos en <a href={igUrl} target="_blank" rel="noopener noreferrer" className="vp-italic" style={{ fontStyle: "italic", borderBottom: "1px solid var(--vp-brown)", cursor: "pointer" }}>@vienapets</a>
        </h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, maxWidth: 1400, margin: "0 auto" }}>
        {[
          "/assets/modelo-capri.png",
          "/assets/modelo-peachy.png",
          "/assets/modelo-daisy.png",
          "/assets/hero-dalmata.png",
          "/assets/materiales-capri-verde.png",
          "/assets/materiales-peachy.png",
        ].map((src, i) => (
          <a key={i} href={igUrl} target="_blank" rel="noopener noreferrer" style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "var(--vp-cream-soft)", cursor: "pointer" }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", transition: "transform .6s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} />
          </a>
        ))}
      </div>
    </section>
  );
}
