"use client";

import Image from "next/image";

export function InstagramStrip() {
  const igUrl = "https://www.instagram.com/vienapets/";

  // 6 tiles uniformes según brief visual — 4:5 vertical
  const imgs = [
    { src: "/images/productos/daisy-lifestyle-1.webp", alt: "Paseo con cavalier, correa y portabolsas Daisy de lunares", pos: "center 40%" },
    { src: "/images/productos/daisy-accion.webp",      alt: "Cavalier de pie apoyado en su dueña con arnés Daisy",       pos: "center 30%" },
    { src: "/images/productos/peachy-lifestyle.webp",  alt: "Galgo descansando bajo un árbol con arnés Peachy de soles", pos: "center 25%" },
    { src: "/images/productos/capri-lifestyle.webp",   alt: "Dálmata tumbado en un parque de Madrid con arnés Capri",    pos: "center 35%" },
    { src: "/images/editorial/grupo-duo-2.webp",       alt: "Galgo y dálmata de espaldas con arneses Viena Pets coordinados", pos: "center 20%" },
    { src: "/images/editorial/grupo-portabolsas.webp", alt: "Portabolsas Viena Pets Capri y Peachy colgando de las correas", pos: "center center" },
  ];

  return (
    <section style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "0 clamp(20px, 3vw, 40px)", maxWidth: 1400, margin: "0 auto", textAlign: "center", marginBottom: 36 }}>
        <div className="vp-eyebrow" style={{ marginBottom: 16 }}>— Instagram</div>
        <h3 className="vp-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", color: "var(--vp-brown)", margin: 0 }}>
          Síguenos en{" "}
          <a href={igUrl} target="_blank" rel="noopener noreferrer" className="vp-italic" style={{ fontStyle: "italic", borderBottom: "1px solid var(--vp-brown)", cursor: "pointer" }}>
            @vienapets
          </a>
        </h3>
      </div>

      {/* Desktop: 6 columnas fijas. Mobile: scroll horizontal con tiles fijos */}
      <div style={{
        display: "flex",
        gap: 4,
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        padding: "0 clamp(20px, 3vw, 40px)",
      }}>
        {imgs.map((img, i) => (
          <a
            key={i}
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "relative",
              flexShrink: 0,
              // Desktop: fill 6 equal cols. Mobile: ~70vw tiles for scroll
              width: "clamp(200px, calc((100vw - 80px - 20px) / 6), 260px)",
              aspectRatio: "4 / 5",
              overflow: "hidden",
              background: "var(--vp-cream-soft)",
              borderRadius: 2,
              scrollSnapAlign: "start",
              boxShadow: "0 2px 12px rgba(42,29,18,.06)",
            }}
            className="vp-ig-tile"
          >
            <Image
              fill
              src={img.src}
              alt={img.alt}
              loading="lazy"
              style={{
                objectFit: "cover",
                objectPosition: img.pos,
                transition: "transform .6s ease",
              }}
              sizes="(max-width: 768px) 70vw, 17vw"
              className="vp-ig-img"
            />
          </a>
        ))}
      </div>

      <style>{`
        .vp-ig-tile:hover .vp-ig-img { transform: scale(1.06); }
        /* Ocultar scrollbar en Webkit */
        div:has(.vp-ig-tile)::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
