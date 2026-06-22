import { LegalPage, H2, P, UL, LegalLink, LegalTable } from "@/components/legal/LegalUI";

// Política de cookies PROVISIONAL (Sprint 6). Describe el uso real actual (solo
// técnicas) y deja constancia de la infraestructura de consentimiento (Consent
// Mode v2) preparada para futuras herramientas de analítica/marketing.

export const metadata = {
  title: "Política de Cookies — Viena Pets",
  description:
    "Información sobre el uso de cookies en Viena Pets y cómo gestionar tu consentimiento.",
};

const LAST_UPDATED = "22 de junio de 2026";

export default function Page() {
  return (
    <LegalPage title="Política de Cookies" updated={LAST_UPDATED}>
      <H2>1. Qué son las cookies</H2>
      <P>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en
        tu dispositivo cuando los visitas. Sirven para que la web funcione, para
        recordar tus preferencias y, en su caso, para analizar el uso del sitio.
        Junto a las cookies, las webs pueden usar tecnologías similares como el
        almacenamiento local del navegador (localStorage).
      </P>

      <H2>2. Tipos de cookies</H2>
      <UL>
        <li>
          <strong>Técnicas o esenciales</strong>: imprescindibles para el
          funcionamiento del sitio (por ejemplo, gestionar tu sesión o recordar el
          contenido del carrito). Están <strong>siempre activas</strong> y no
          requieren consentimiento, conforme al artículo 22.2 de la LSSI-CE.
        </li>
        <li>
          <strong>Analíticas</strong>: permiten medir y analizar el uso del sitio de
          forma agregada para mejorarlo. Requieren tu <strong>consentimiento</strong>.
        </li>
        <li>
          <strong>De marketing</strong>: permiten mostrar contenido o publicidad
          relevante y medir su eficacia. Requieren tu <strong>consentimiento</strong>.
        </li>
      </UL>

      <H2>3. Cookies que utilizamos actualmente</H2>
      <P>
        A día de hoy, Viena Pets solo utiliza almacenamiento técnico necesario para
        el funcionamiento de la tienda. No hay cookies de analítica ni de marketing
        activas.
      </P>
      <LegalTable
        head={["Nombre", "Tipo", "Finalidad", "Duración"]}
        rows={[
          ["vienapets-cart-v1", "Técnica (localStorage)", "Recordar los productos del carrito entre visitas.", "Persistente hasta que se vacíe o borres los datos del navegador."],
          ["vienapets-consent-v1", "Técnica (localStorage)", "Recordar tu elección sobre cookies para no volver a preguntar.", "Persistente hasta que la modifiques o borres los datos del navegador."],
        ]}
      />
      <P>
        Nota: el carrito y la preferencia de cookies se guardan mediante
        <em> localStorage</em>, que técnicamente no es una cookie pero cumple una
        función equivalente; lo incluimos aquí por transparencia.
      </P>

      <H2>4. Cookies de terceros</H2>
      <P>
        Tenemos preparada la infraestructura de consentimiento (Google Consent Mode
        v2) para una futura integración de <strong>Google Analytics</strong>. Cuando
        esa herramienta se active, actualizaremos esta política con el detalle de las
        cookies de terceros, sus finalidades y duraciones, y solo se cargarán si das
        tu consentimiento.
      </P>

      <H2>5. Cómo gestionar tu consentimiento</H2>
      <P>
        En tu primera visita te mostramos un banner para que aceptes, rechaces o
        personalices las cookies no esenciales. Puedes cambiar tu elección en
        cualquier momento desde el botón{" "}
        <strong>«Preferencias de cookies»</strong> disponible en el pie de página.
        Mientras no des tu consentimiento, las cookies analíticas y de marketing
        permanecen desactivadas por defecto.
      </P>

      <H2>6. Cómo borrar las cookies en tu navegador</H2>
      <P>
        También puedes gestionar o eliminar las cookies directamente desde la
        configuración de tu navegador. Aquí tienes las instrucciones oficiales:
      </P>
      <UL>
        <li>
          <LegalLink href="https://support.google.com/chrome/answer/95647" external>Google Chrome</LegalLink>
        </li>
        <li>
          <LegalLink href="https://support.mozilla.org/es/kb/Borrar-cookies" external>Mozilla Firefox</LegalLink>
        </li>
        <li>
          <LegalLink href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" external>Safari</LegalLink>
        </li>
        <li>
          <LegalLink href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" external>Microsoft Edge</LegalLink>
        </li>
      </UL>
      <P>
        Ten en cuenta que, si desactivas las cookies técnicas, algunas funciones del
        sitio (como el carrito) podrían no funcionar correctamente.
      </P>

      <H2>7. Más información</H2>
      <P>
        Para más detalles sobre el tratamiento de tus datos personales, consulta
        nuestra <LegalLink href="/privacidad">Política de Privacidad</LegalLink>.
      </P>
    </LegalPage>
  );
}
