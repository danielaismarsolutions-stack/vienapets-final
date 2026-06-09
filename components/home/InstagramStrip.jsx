"use client";

import { useIsMobile } from "@/components/shared/useIsMobile";

export function InstagramStrip() {
  const isMobile = useIsMobile();
  const igUrl = "https://www.instagram.com/vienapets/";
  const allImgs = [
    { src: "/images/productos/daisy-lifestyle-1.webp", alt: "Paseo con cavalier, correa y portabolsas Daisy de lunares" },
    { src: "/images/productos/daisy-accion.webp",      alt: "Cavalier de pie apoyado en su dueña con arnés Daisy" },
    { src: "/images/productos/peachy-lifestyle.webp",  alt: "Galgo descansando bajo un árbol con arnés Peachy de soles" },
    { src: "/images/productos/capri-lifestyle.webp",   alt: "Dálmata tumbado en un parque de Madrid con arnés Capri de rayas" },
    { src: "/images/editorial/grupo-duo-2.webp",       alt: "Galgo y dálmata de espaldas con arneses Viena Pets coordinados" },
    { src: "/images/productos/capri-main.webp",        alt: "Dálmata sentado al sol con arnés Viena Pets Capri de rayas verdes y rosas" },
  ];
  const imgs = isMobile ? allImgs.slice(0, 4) : allImgs;

  return (
    <section style={{ padding: isMobile ? "0 20px 60px" : "0 40px 80px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", textAlign: "center", marginBottom: 36 }}>
        <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Instagram</div>
        <h3 className="vp-display" style={{ fontSize: isMobile ? 32 : 48, color: "var(--vp-brown)", margin: 0 }}>
          Síguenos en <a href={igUrl} target="_blank" rel="noopener noreferrer" className="vp-italic" style={{ fontStyle: "italic", borderBottom: "1px solid var(--vp-brown)", cursor: "pointer" }}>@vienapets</a>
        </h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(6, 1fr)", gap: 4, maxWidth: 1400, margin: "0 auto" }}>
        {imgs.map((img, i) => (
          <a key={i} href={igUrl} target="_blank" rel="noopener noreferrer" style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "var(--vp-cream-soft)", cursor: "pointer" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform .6s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} />
          </a>
        ))}
      </div>
    </section>
  );
}
