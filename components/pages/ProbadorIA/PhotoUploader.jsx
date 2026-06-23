"use client";

import { useEffect, useRef, useState } from "react";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function PhotoUploader({ email, modelo, remainingUses, onGenerateOk, onQuotaExhausted, onGenerateError }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Revocar URL al desmontar o al cambiar archivo
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFileError(null);

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFileError("Formato no admitido. Usa PNG, JPG o WEBP.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setFileError("La foto supera los 10 MB. Elige una imagen más pequeña.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setFile(selected);
  };

  const handleGenerate = async () => {
    if (!file || generating) return;
    setGenerating(true);
    setFileError(null);

    try {
      // Convertir a base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // incluye prefijo data:...
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/functions/v1/probador-generate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${anonKey}`,
          "apikey": anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, modelo, image_base64: base64 }),
      });

      const data = await res.json();

      if (res.status === 429 || data?.error === "cuota_agotada") {
        onQuotaExhausted("Has agotado tus 3 visualizaciones disponibles para este email.");
        return;
      }

      if (!res.ok || !data?.image_base64) {
        onGenerateError("No hemos podido generar la imagen. Inténtalo de nuevo con otra foto. Si el problema persiste, escríbenos.");
        return;
      }

      onGenerateOk({ imageBase64: data.image_base64, remainingUses: data.remaining_uses });
    } catch {
      onGenerateError("No hemos podido generar la imagen. Inténtalo de nuevo con otra foto. Si el problema persiste, escríbenos.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Contador de usos */}
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: 12,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: remainingUses <= 1 ? "var(--vp-olive-deep)" : "var(--vp-ink-muted)",
        fontWeight: 500,
      }}>
        {remainingUses === 1
          ? "Te queda 1 prueba"
          : `Te quedan ${remainingUses} pruebas`}
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Zona de drop / preview */}
      {previewUrl ? (
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Vista previa de tu foto"
            style={{
              width: "100%",
              aspectRatio: "4/5",
              objectFit: "contain",
              objectPosition: "center",
              background: "var(--vp-cream-soft)",
              display: "block",
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={generating}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(251,246,237,.9)",
              border: "1px solid rgba(74,46,28,.2)",
              padding: "6px 12px",
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              color: "var(--vp-brown)",
            }}
          >
            Cambiar foto
          </button>
        </div>
      ) : (
        <div
          onClick={() => !generating && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && !generating && fileInputRef.current?.click()}
          style={{
            border: "2px dashed var(--vp-olive-muted)",
            borderRadius: 0,
            padding: "60px 30px",
            textAlign: "center",
            cursor: generating ? "not-allowed" : "pointer",
            background: "var(--vp-paper)",
            transition: "border-color .2s ease, background .2s ease",
          }}
          onMouseEnter={e => {
            if (generating) return;
            e.currentTarget.style.borderColor = "var(--vp-olive)";
            e.currentTarget.style.background = "var(--vp-olive-soft)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--vp-olive-muted)";
            e.currentTarget.style.background = "var(--vp-paper)";
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16, color: "var(--vp-olive-deep)" }}>📷</div>
          <div className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)", marginBottom: 8 }}>
            Haz clic para elegir una imagen
          </div>
          <div style={{ fontSize: 13, color: "var(--vp-ink-muted)" }}>
            Formatos: PNG, JPG, WEBP · Máx. 10 MB
          </div>
        </div>
      )}

      {/* Error de validación de archivo */}
      {fileError && (
        <div style={{
          padding: "10px 14px",
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          color: "#B91C1C",
          fontSize: 13,
        }}>
          {fileError}
        </div>
      )}

      {/* Loading state */}
      {generating && (
        <div style={{
          padding: "14px 16px",
          background: "var(--vp-cream-soft)",
          fontSize: 13,
          color: "var(--vp-ink-soft)",
          lineHeight: 1.6,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}>
          <span style={{ display: "inline-block", animation: "vp-spin 1s linear infinite", fontSize: 18 }}>⟳</span>
          Generando visualización… esto puede tardar hasta 30 segundos
        </div>
      )}

      {/* Botón generar */}
      {file && !generating && (
        <button
          onClick={handleGenerate}
          className="vp-btn olive full"
        >
          Generar visualización →
        </button>
      )}

      <style>{`
        @keyframes vp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
