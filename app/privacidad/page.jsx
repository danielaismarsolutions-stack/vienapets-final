import {
  LEGAL_NAME,
  LEGAL_NIF,
  LEGAL_ADDRESS,
  LEGAL_CONTACT_EMAIL,
} from "@/lib/legal-info";

// Política de privacidad PROVISIONAL (Sprint 5). Pendiente de revisión legal
// definitiva — el banner de aviso es deliberado y debe mantenerse hasta que
// Lucía valide el texto con asesoría. Lee los datos del responsable desde
// lib/legal-info.js (fuente única). El Navbar y el Footer los aporta el layout
// raíz, así que aquí sólo renderizamos el contenido.

export const metadata = {
  title: "Política de Privacidad — Viena Pets",
  description:
    "Información sobre el tratamiento de datos personales en Viena Pets conforme al RGPD.",
};

// Fecha de última actualización en formato legible en español.
const LAST_UPDATED = "22 de junio de 2026";

function ProvisionalBanner({ sober = false }) {
  return (
    <div
      style={{
        background: sober ? "var(--vp-cream-soft)" : "var(--vp-cream-deep)",
        border: "1px solid var(--vp-brown)",
        borderRadius: 6,
        padding: sober ? "16px 20px" : "18px 22px",
        margin: sober ? "48px 0 0" : "0 0 40px",
        fontSize: sober ? 13 : 14,
        lineHeight: 1.6,
        color: "var(--vp-ink-soft)",
        fontFamily: "var(--font-body)",
      }}
    >
      <strong style={{ color: "var(--vp-brown)" }}>⚠️ Documento provisional</strong>{" "}
      pendiente de revisión legal definitiva. Si tienes dudas sobre el tratamiento
      de tus datos, contáctanos en{" "}
      <a
        href={`mailto:${LEGAL_CONTACT_EMAIL}`}
        style={{ color: "var(--vp-brown)", borderBottom: "1px solid var(--vp-brown)" }}
      >
        {LEGAL_CONTACT_EMAIL}
      </a>
      .
    </div>
  );
}

function H2({ children }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 500,
        fontSize: 26,
        color: "var(--vp-brown)",
        margin: "48px 0 16px",
        letterSpacing: 0,
      }}
    >
      {children}
    </h2>
  );
}

function P({ children }) {
  return (
    <p
      style={{
        fontSize: 16,
        lineHeight: 1.8,
        color: "var(--vp-ink-soft)",
        margin: "0 0 16px",
      }}
    >
      {children}
    </p>
  );
}

function UL({ children }) {
  return (
    <ul
      style={{
        margin: "0 0 16px",
        paddingLeft: 22,
        fontSize: 16,
        lineHeight: 1.8,
        color: "var(--vp-ink-soft)",
      }}
    >
      {children}
    </ul>
  );
}

export default function Page() {
  return (
    <main
      style={{
        fontFamily: "var(--font-body)",
        background: "var(--vp-cream)",
        padding: "80px 24px 96px",
      }}
    >
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1
          className="vp-display"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 600,
            fontSize: 46,
            color: "var(--vp-ink)",
            margin: "0 0 28px",
          }}
        >
          Política de Privacidad
        </h1>

        <ProvisionalBanner />

        <P>
          <em style={{ color: "var(--vp-ink-muted)" }}>
            Última actualización: {LAST_UPDATED}
          </em>
        </P>

        <H2>1. Responsable del tratamiento</H2>
        <P>
          El responsable del tratamiento de tus datos personales es:
        </P>
        <UL>
          <li>Nombre: {LEGAL_NAME}</li>
          <li>NIF: {LEGAL_NIF}</li>
          <li>Dirección: {LEGAL_ADDRESS}</li>
          <li>
            Email de contacto:{" "}
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              style={{ color: "var(--vp-brown)", borderBottom: "1px solid var(--vp-brown)" }}
            >
              {LEGAL_CONTACT_EMAIL}
            </a>
          </li>
        </UL>

        <H2>2. Qué datos recogemos</H2>
        <P>
          Recogemos los datos personales que nos facilitas voluntariamente cuando:
        </P>
        <UL>
          <li>
            Realizas un pedido en nuestra web: nombre, apellidos, email, teléfono,
            dirección de envío y facturación.
          </li>
          <li>
            Te comunicas con nosotros por email: tu email y el contenido del
            mensaje.
          </li>
          <li>
            Navegas por nuestra web: datos técnicos (dirección IP, navegador,
            sistema operativo) y datos de comportamiento (páginas visitadas,
            productos vistos).
          </li>
        </UL>
        <P>
          No recogemos datos especialmente protegidos (salud, ideología,
          orientación sexual, etc.).
        </P>

        <H2>3. Para qué usamos tus datos</H2>
        <P>Tratamos tus datos para las siguientes finalidades:</P>
        <UL>
          <li>
            Gestionar tu pedido: procesar el cobro, preparar el envío, enviarte la
            factura y comunicaciones sobre tu compra.
          </li>
          <li>Atender consultas y dudas que nos plantees.</li>
          <li>
            Cumplir con nuestras obligaciones legales (contabilidad, fiscalidad,
            garantías).
          </li>
          <li>
            Mejorar nuestra web y servicios mediante análisis agregado de uso.
          </li>
        </UL>
        <P>
          No usamos tus datos para perfilado comercial ni decisiones automatizadas
          con efectos jurídicos.
        </P>

        <H2>4. Base legal del tratamiento</H2>
        <P>Tratamos tus datos en base a:</P>
        <UL>
          <li>Ejecución del contrato de compraventa (cuando realizas un pedido).</li>
          <li>Cumplimiento de obligaciones legales (facturación, garantías).</li>
          <li>Tu consentimiento (cuando aceptas cookies de analítica).</li>
          <li>
            Interés legítimo (en la seguridad de la web y prevención de fraude).
          </li>
        </UL>

        <H2>5. Con quién compartimos tus datos</H2>
        <P>
          Para poder ofrecerte el servicio, compartimos algunos datos con
          proveedores tecnológicos que actúan como encargados del tratamiento bajo
          nuestra supervisión:
        </P>
        <UL>
          <li>Stripe Payments Europe, Ltd. (Irlanda): procesamiento de pagos.</li>
          <li>
            Supabase Inc. (EE.UU., con servidores en UE): almacenamiento de pedidos
            y catálogo. Transferencia internacional cubierta por Cláusulas
            Contractuales Tipo.
          </li>
          <li>
            Vercel Inc. (EE.UU.): hosting de la web. Transferencia internacional
            cubierta por Cláusulas Contractuales Tipo.
          </li>
          <li>
            Brevo (Francia): envío de emails transaccionales (confirmación de
            pedido, envío).
          </li>
        </UL>
        <P>
          Estos proveedores tienen contratos firmados con nosotros que garantizan el
          cumplimiento del RGPD.
        </P>
        <P>No vendemos ni cedemos tus datos a terceros con fines comerciales.</P>

        <H2>6. Cuánto tiempo conservamos tus datos</H2>
        <UL>
          <li>
            Datos de pedidos: 5 años desde la última operación, por obligación
            fiscal y mercantil.
          </li>
          <li>
            Datos de comunicaciones: hasta 1 año después del último contacto, salvo
            que sea necesario conservarlos por reclamación.
          </li>
          <li>
            Datos de navegación anónimos: hasta 14 meses (Google Analytics
            estándar).
          </li>
        </UL>
        <P>Pasado este plazo, los datos se eliminan o anonimizan.</P>

        <H2>7. Tus derechos</H2>
        <P>Tienes los siguientes derechos sobre tus datos:</P>
        <UL>
          <li>Acceso: saber qué datos tenemos tuyos.</li>
          <li>Rectificación: corregir datos incorrectos.</li>
          <li>Supresión: que eliminemos tus datos.</li>
          <li>Oposición: oponerte al tratamiento.</li>
          <li>Limitación: que restrinjamos el uso de tus datos.</li>
          <li>Portabilidad: recibir tus datos en formato estructurado.</li>
          <li>
            Retirada del consentimiento: revocar consentimientos que nos diste.
          </li>
        </UL>
        <P>
          Puedes ejercer estos derechos escribiendo a{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            style={{ color: "var(--vp-brown)", borderBottom: "1px solid var(--vp-brown)" }}
          >
            {LEGAL_CONTACT_EMAIL}
          </a>{" "}
          indicando qué derecho quieres ejercer y adjuntando copia de tu DNI.
        </P>
        <P>
          Si consideras que no hemos atendido bien tu solicitud, puedes presentar
          reclamación ante la Agencia Española de Protección de Datos (
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--vp-brown)", borderBottom: "1px solid var(--vp-brown)" }}
          >
            www.aepd.es
          </a>
          ).
        </P>

        <H2>8. Cookies</H2>
        <P>
          Nuestra web utiliza cookies técnicas (necesarias para el funcionamiento) y
          analíticas (con tu consentimiento). Para más información, próximamente
          publicaremos nuestra Política de Cookies detallada.
        </P>

        <H2>9. Cambios en esta política</H2>
        <P>
          Podemos actualizar esta política para adaptarla a cambios legales o de
          nuestros servicios. Te notificaremos cualquier cambio sustancial por email
          o en la web.
        </P>

        <ProvisionalBanner sober />
      </article>
    </main>
  );
}
