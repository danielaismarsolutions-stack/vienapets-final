import {
  LEGAL_NAME,
  LEGAL_NIF,
  LEGAL_ADDRESS,
  LEGAL_CONTACT_EMAIL,
} from "@/lib/legal-info";
import { LegalPage, H2, P, UL, LegalLink } from "@/components/legal/LegalUI";

// Política de privacidad PROVISIONAL (Sprint 5, ampliada en Sprint 6).
// Pendiente de revisión legal definitiva. Datos del responsable desde
// lib/legal-info.js. Conforme al RGPD (Reglamento UE 2016/679) y la LOPDGDD.

export const metadata = {
  title: "Política de Privacidad — Viena Pets",
  description:
    "Información sobre el tratamiento de datos personales en Viena Pets conforme al RGPD.",
};

const LAST_UPDATED = "22 de junio de 2026";

export default function Page() {
  return (
    <LegalPage title="Política de Privacidad" updated={LAST_UPDATED}>
      <H2>1. Responsable del tratamiento</H2>
      <P>El responsable del tratamiento de tus datos personales es:</P>
      <UL>
        <li>Nombre: {LEGAL_NAME}</li>
        <li>NIF: {LEGAL_NIF}</li>
        <li>Dirección: {LEGAL_ADDRESS}</li>
        <li>
          Email de contacto:{" "}
          <LegalLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</LegalLink>
        </li>
      </UL>

      <H2>2. Qué datos recogemos</H2>
      <P>Recogemos los datos personales que nos facilitas voluntariamente cuando:</P>
      <UL>
        <li>
          Realizas un pedido en nuestra web: nombre, apellidos, email, teléfono,
          dirección de envío y facturación.
        </li>
        <li>
          Te comunicas con nosotros por email: tu email y el contenido del mensaje.
        </li>
        <li>
          Navegas por nuestra web: datos técnicos (dirección IP, navegador, sistema
          operativo) y datos de comportamiento (páginas visitadas, productos
          vistos).
        </li>
      </UL>
      <P>
        No recogemos datos especialmente protegidos (salud, ideología, orientación
        sexual, etc.).
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
        <li>Mejorar nuestra web y servicios mediante análisis agregado de uso.</li>
      </UL>
      <P>
        No usamos tus datos para perfilado comercial ni decisiones automatizadas con
        efectos jurídicos.
      </P>

      <H2>4. Base legal del tratamiento</H2>
      <P>Tratamos tus datos en base a:</P>
      <UL>
        <li>Ejecución del contrato de compraventa (cuando realizas un pedido).</li>
        <li>Cumplimiento de obligaciones legales (facturación, garantías).</li>
        <li>Tu consentimiento (cuando aceptas cookies de analítica).</li>
        <li>Interés legítimo (en la seguridad de la web y prevención de fraude).</li>
      </UL>

      <H2>5. Con quién compartimos tus datos</H2>
      <P>
        Para poder ofrecerte el servicio, compartimos algunos datos con proveedores
        tecnológicos que actúan como encargados del tratamiento bajo nuestra
        supervisión, en virtud del correspondiente contrato de encargo (art. 28
        RGPD):
      </P>
      <UL>
        <li>
          <strong>SmartFlow Labs</strong> (España): operador técnico del sitio web.
          Presta servicios de desarrollo, mantenimiento y operación de la tienda en
          nombre del responsable. Para la prestación de algunos servicios puede
          recurrir a sub-encargados, que operan bajo su supervisión y con las mismas
          garantías contractuales; en particular:
          <UL>
            <li>
              <strong>Brevo (Sendinblue SAS, Francia)</strong>: envío de emails
              transaccionales (confirmación de pedido y notificación de envío), como
              sub-encargado bajo SmartFlow Labs.
            </li>
          </UL>
        </li>
        <li>
          <strong>Stripe Payments Europe, Ltd.</strong> (Irlanda): procesamiento de
          pagos.
        </li>
        <li>
          <strong>Supabase Inc.</strong> (EE.UU., con servidores en la UE):
          almacenamiento de pedidos y catálogo. Transferencia internacional cubierta
          por Cláusulas Contractuales Tipo.
        </li>
        <li>
          <strong>Vercel Inc.</strong> (EE.UU.): hosting de la web. Transferencia
          internacional cubierta por Cláusulas Contractuales Tipo.
        </li>
      </UL>
      <P>
        Estos proveedores tienen contratos firmados que garantizan el cumplimiento
        del RGPD. No vendemos ni cedemos tus datos a terceros con fines comerciales.
      </P>

      <H2>6. Cuánto tiempo conservamos tus datos</H2>
      <UL>
        <li>
          Datos de pedidos: 5 años desde la última operación, por obligación fiscal
          y mercantil.
        </li>
        <li>
          Datos de comunicaciones: hasta 1 año después del último contacto, salvo que
          sea necesario conservarlos por reclamación.
        </li>
        <li>Datos de navegación anónimos: hasta 14 meses (Google Analytics estándar).</li>
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
        <li>Retirada del consentimiento: revocar consentimientos que nos diste.</li>
      </UL>
      <P>
        Puedes ejercer estos derechos escribiendo a{" "}
        <LegalLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</LegalLink>{" "}
        indicando qué derecho quieres ejercer y adjuntando copia de tu DNI.
      </P>
      <P>
        Si consideras que no hemos atendido bien tu solicitud, puedes presentar
        reclamación ante la Agencia Española de Protección de Datos (
        <LegalLink href="https://www.aepd.es" external>www.aepd.es</LegalLink>).
      </P>

      <H2>8. Cookies</H2>
      <P>
        Nuestra web utiliza cookies y tecnologías similares. Distinguimos dos
        categorías:
      </P>
      <UL>
        <li>
          <strong>Cookies técnicas o esenciales</strong>: necesarias para el
          funcionamiento del sitio (por ejemplo, mantener tu sesión o el carrito).
          No requieren consentimiento.
        </li>
        <li>
          <strong>Cookies analíticas y de marketing</strong>: nos ayudan a entender
          el uso del sitio y, en su caso, a mostrar contenido relevante. Solo se
          activan <strong>con tu consentimiento</strong>, que puedes dar, rechazar o
          cambiar en cualquier momento desde el botón «Preferencias de cookies» del
          pie de página.
        </li>
      </UL>
      <P>
        Actualmente no tenemos herramientas de analítica o marketing activas; la
        infraestructura de consentimiento está preparada para cuando se integren.
        Encontrarás el detalle completo en nuestra{" "}
        <LegalLink href="/cookies">Política de Cookies</LegalLink>.
      </P>

      <H2>9. Cambios en esta política</H2>
      <P>
        Podemos actualizar esta política para adaptarla a cambios legales o de
        nuestros servicios. Te notificaremos cualquier cambio sustancial por email o
        en la web.
      </P>
    </LegalPage>
  );
}
