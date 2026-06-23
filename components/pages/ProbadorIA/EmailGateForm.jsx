"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailGateForm({ modelo, onGateOk, onQuotaExhausted, isLoading }) {
  const [email, setEmail] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [serviceConsent, setServiceConsent] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emailValid = EMAIL_RE.test(email);
  const canSubmit = emailValid && ageConfirmed && serviceConsent && !submitting && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(`${supabaseUrl}/functions/v1/probador-email-gate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${anonKey}`,
          "apikey": anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          modelo,
          age_confirmed: true,
          service_consent: true,
          newsletter_consent: newsletterConsent,
          marketing_image_consent: marketingConsent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const messages = {
          email_invalido: "El email no tiene un formato válido.",
          modelo_invalido: "Modelo no reconocido. Recarga la página.",
          consentimientos_obligatorios_faltan: "Debes aceptar las condiciones obligatorias.",
          db_error: "Error interno. Inténtalo de nuevo.",
          server_error: "Error del servidor. Inténtalo de nuevo.",
        };
        setError(messages[data?.error] ?? "No hemos podido verificar tu email. Inténtalo de nuevo.");
        return;
      }

      if (data.remaining_uses === 0) {
        onQuotaExhausted("Has agotado tus 3 visualizaciones disponibles para este email.");
        return;
      }

      onGateOk({ email, remainingUses: data.remaining_uses });
    } catch {
      setError("Error de conexión. Comprueba tu red e inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Email */}
      <div>
        <label style={{
          display: "block",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--vp-brown)",
          marginBottom: 8,
          fontWeight: 500,
        }}>
          Tu email
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="hola@ejemplo.com"
          disabled={submitting || isLoading}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: `1px solid ${emailValid || email === "" ? "rgba(74,46,28,.25)" : "var(--vp-olive)"}`,
            background: "var(--vp-paper)",
            fontSize: 15,
            outline: "none",
            borderRadius: 0,
            fontFamily: "var(--font-body)",
            color: "var(--vp-ink)",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Checkboxes */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Checkbox 1 — OBLIGATORIO: edad */}
        <CheckboxField
          checked={ageConfirmed}
          onChange={setAgeConfirmed}
          disabled={submitting || isLoading}
          required
        >
          Confirmo que soy mayor de 14 años
        </CheckboxField>

        {/* Checkbox 2 — OBLIGATORIO: servicio + privacidad */}
        <CheckboxField
          checked={serviceConsent}
          onChange={setServiceConsent}
          disabled={submitting || isLoading}
          required
        >
          Acepto los{" "}
          <a href="/condiciones" style={{ color: "var(--vp-olive-deep)", textDecoration: "underline" }}>
            términos del servicio
          </a>{" "}
          y el tratamiento de mi imagen y la de mi mascota por Google (EE.UU.) bajo Cláusulas Contractuales Tipo,
          conforme a la{" "}
          <a href="/privacidad" style={{ color: "var(--vp-olive-deep)", textDecoration: "underline" }}>
            política de privacidad
          </a>
        </CheckboxField>

        {/* Checkbox 3 — OPCIONAL: newsletter */}
        <CheckboxField
          checked={newsletterConsent}
          onChange={setNewsletterConsent}
          disabled={submitting || isLoading}
        >
          Quiero recibir novedades, consejos y ofertas de VienaPets por email (puedo darme de baja en cualquier momento)
        </CheckboxField>

        {/* Checkbox 4 — OPCIONAL: uso marketing imagen */}
        <CheckboxField
          checked={marketingConsent}
          onChange={setMarketingConsent}
          disabled={submitting || isLoading}
        >
          Autorizo a VienaPets a usar la imagen generada en redes sociales y comunicaciones de marca, sin asociar datos personales
        </CheckboxField>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: "12px 16px",
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          color: "#B91C1C",
          fontSize: 13,
          lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      {/* Botón */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="vp-btn olive full"
        style={{
          opacity: canSubmit ? 1 : 0.45,
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "opacity 0.2s ease",
        }}
      >
        {submitting ? "Verificando…" : "Continuar →"}
      </button>
    </div>
  );
}

function CheckboxField({ checked, onChange, disabled, required, children }) {
  return (
    <label style={{
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        style={{
          marginTop: 3,
          flexShrink: 0,
          width: 16,
          height: 16,
          accentColor: "var(--vp-olive)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      <span style={{
        fontSize: 13,
        color: "var(--vp-ink-soft)",
        lineHeight: 1.55,
      }}>
        {required && (
          <span style={{ color: "var(--vp-olive-deep)", marginRight: 4, fontWeight: 600 }}>*</span>
        )}
        {children}
      </span>
    </label>
  );
}
