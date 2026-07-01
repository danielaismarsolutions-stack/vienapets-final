import "server-only";

// Cliente de la API transaccional de Brevo (Sprint 5).
//
// SOLO server-side: importa `server-only`, de modo que el build falla si
// alguien lo arrastra a un Client Component. La BREVO_API_KEY nunca debe llegar
// al navegador (CLAUDE.md §8, regla del Sprint 5).
//
// Sin SDK: usamos `fetch` nativo contra el endpoint REST (CLAUDE.md §7 — no
// añadir dependencias innecesarias).
//
// Docs: https://developers.brevo.com/reference/sendtransacemail

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

// Lectura perezosa de la config: así un import del módulo no revienta en build
// si las env aún no están, sólo al intentar enviar de verdad.
function getConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "VienaPets";
  const replyTo = process.env.BREVO_REPLY_TO_EMAIL || null;

  if (!apiKey) throw new Error("BREVO_API_KEY no definido");
  if (!senderEmail) throw new Error("BREVO_SENDER_EMAIL no definido");

  return { apiKey, senderEmail, senderName, replyTo };
}

/**
 * Envía un email transaccional vía Brevo.
 *
 * @param {Object}  opts
 * @param {string|{email:string,name?:string}|Array<string|{email:string,name?:string}>} opts.to
 *   Destinatario(s). Un string, un objeto {email,name} o un array de ambos
 *   (varios TO, p. ej. el email operativo interno al equipo).
 * @param {string}  opts.subject       Asunto.
 * @param {string}  opts.htmlContent   HTML completo (estilos inline).
 * @param {Object} [opts.params]       Variables opcionales (no usamos plantillas
 *                                      de Brevo; el HTML ya viene resuelto).
 * @param {string} [opts.textContent]  Versión texto plano opcional.
 * @returns {Promise<string>} messageId devuelto por Brevo.
 */
export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
  params,
  textContent,
}) {
  const { apiKey, senderEmail, senderName, replyTo } = getConfig();

  if (!to) throw new Error("sendTransactionalEmail: falta 'to'");
  if (!subject) throw new Error("sendTransactionalEmail: falta 'subject'");
  if (!htmlContent) throw new Error("sendTransactionalEmail: falta 'htmlContent'");

  // Normalizamos a la forma que espera Brevo: array de objetos {email, name}.
  // Acepta string, objeto o array (varios TO para el aviso interno al equipo).
  const normalizeRecipient = (r) =>
    typeof r === "string" ? { email: r } : { email: r.email, name: r.name };
  const recipients = (Array.isArray(to) ? to : [to]).map(normalizeRecipient);
  if (recipients.length === 0 || recipients.some((r) => !r.email)) {
    throw new Error("sendTransactionalEmail: destinatario(s) 'to' inválido(s)");
  }

  const payload = {
    sender: { email: senderEmail, name: senderName },
    to: recipients,
    subject,
    htmlContent,
  };
  if (replyTo) payload.replyTo = { email: replyTo };
  if (textContent) payload.textContent = textContent;
  if (params) payload.params = params;

  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Respuesta no-JSON: la dejamos en 'text' para el mensaje de error.
  }

  if (!res.ok) {
    const detail = data?.message || text || `HTTP ${res.status}`;
    throw new Error(`Brevo respondió ${res.status}: ${detail}`);
  }

  const messageId = data?.messageId;
  if (!messageId) {
    throw new Error("Brevo no devolvió messageId en la respuesta.");
  }
  return messageId;
}
