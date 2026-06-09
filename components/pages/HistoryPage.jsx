"use client";

import Image from "next/image";
import { useRoute } from "@/components/shared/useRoute";
import { useIsMobile } from "@/components/shared/useIsMobile";
import { LQIP_CREAM } from "@/lib/lqip";

export function HistoryPage() {
  useRoute();
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "24px 20px 60px" : "40px 40px 80px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 80, alignItems: "center", marginBottom: isMobile ? 48 : 120 }}>
          <div>
            <div className="vp-eyebrow" style={{ marginBottom: 14 }}>— Nuestra historia</div>
            <h1 className="vp-display" style={{ fontSize: isMobile ? "clamp(48px, 13vw, 72px)" : "clamp(60px, 7vw, 120px)", color: "var(--vp-brown)", margin: 0, lineHeight: .9 }}>
              La marca<br/>
              <span className="vp-italic" style={{ fontStyle: "italic" }}>Viena Pets</span>.
            </h1>
          </div>
          {/* Foto editorial duo en arco — object-position ajustado para ver los dos perros */}
          <div style={{ width: "100%", height: isMobile ? 280 : 560, borderRadius: "300px 300px 4px 4px", overflow: "hidden", background: "var(--vp-cream-deep)", position: "relative" }}>
            <Image
              fill
              src="/images/editorial/grupo-duo-1.webp"
              alt="Dálmata y galgo juntos con arneses Viena Pets Capri y Peachy"
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
              sizes={isMobile ? "100vw" : "50vw"}
              priority
              placeholder="blur"
              blurDataURL={LQIP_CREAM}
            />
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, fontSize: isMobile ? 16 : 18, color: "var(--vp-ink-soft)", lineHeight: 1.8, fontFamily: "var(--font-serif)", fontWeight: 300 }}>
          <p>Viena Pets nace de una idea simple: accesorios para perros con diseño de autor, pensados como pieza de moda y no como producto de tienda genérica.</p>
          <p>Cada colección parte de un estampado original que da forma al tejido, los herrajes y el patronaje. Diseñada en Madrid y producida en ediciones limitadas, porque la exclusividad es parte del valor.</p>
        </div>
      </div>
    </div>
  );
}
