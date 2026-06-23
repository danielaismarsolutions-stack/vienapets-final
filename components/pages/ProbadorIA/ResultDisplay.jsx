"use client";

import { useEffect, useRef, useState } from "react";

export function ResultDisplay({ imageBase64, modelo, productPrice, productSlug, onRetry }) {
  const canvasRef = useRef(null);
  const [watermarkedDataUrl, setWatermarkedDataUrl] = useState(null);
  const modelLabel = modelo
    ? modelo.charAt(0).toUpperCase() + modelo.slice(1)
    : "";

  // Pintar imagen + watermark en canvas
  useEffect(() => {
    if (!imageBase64) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      // Watermark
      const fontSize = Math.max(14, Math.round(img.width * 0.018));
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText("vienapets.com", canvas.width - 20, canvas.height - 20);
      setWatermarkedDataUrl(canvas.toDataURL("image/png"));
    };
    img.src = `data:image/png;base64,${imageBase64}`;
  }, [imageBase64]);

  const priceFormatted = productPrice != null
    ? (productPrice / 100).toFixed(2).replace(".", ",") + " €"
    : null;

  const handleShare = async () => {
    if (!watermarkedDataUrl) return;
    try {
      const blob = await (await fetch(watermarkedDataUrl)).blob();
      const file = new File([blob], `vienapets-${modelo}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Arnés VienaPets ${modelLabel} en mi perro`,
          url: "https://vienapets.com",
        });
        return;
      }
    } catch {
      // fallback a descarga si share falla
    }
    // Fallback: descarga directa
    const a = document.createElement("a");
    a.href = watermarkedDataUrl;
    a.download = `vienapets-${modelo}.png`;
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Canvas oculto para watermark */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Imagen con watermark */}
      <div style={{ position: "relative", background: "var(--vp-cream-soft)" }}>
        {watermarkedDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={watermarkedDataUrl}
            alt={`Visualización IA de tu perro con arnés ${modelLabel}`}
            style={{ width: "100%", display: "block" }}
          />
        ) : (
          <div style={{
            aspectRatio: "4/5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--vp-ink-muted)",
            fontSize: 13,
          }}>
            Preparando imagen…
          </div>
        )}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Primario: comprar */}
        {productSlug && (
          <a
            href={`/producto/${productSlug}`}
            className="vp-btn olive full"
            style={{ textAlign: "center", display: "flex", justifyContent: "center" }}
          >
            Comprar arnés {modelLabel}{priceFormatted ? ` – ${priceFormatted}` : ""} →
          </a>
        )}

        {/* Secundario: compartir / descargar */}
        {watermarkedDataUrl && (
          <button
            onClick={handleShare}
            className="vp-btn ghost full"
          >
            Compartir en Instagram
          </button>
        )}

        {/* Terciario: probar con otra foto */}
        <button
          onClick={onRetry}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--vp-brown)",
            textDecoration: "underline",
            textDecorationColor: "rgba(74,46,28,.4)",
            padding: "8px 0",
            textAlign: "center",
          }}
        >
          Probar con otra foto
        </button>
      </div>
    </div>
  );
}
