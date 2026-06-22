import {
  LEGAL_NAME,
  LEGAL_NIF,
  LEGAL_ADDRESS,
  LEGAL_CONTACT_EMAIL,
} from "@/lib/legal-info";
import { LegalPage, H2, P, UL, LegalLink } from "@/components/legal/LegalUI";

// Aviso legal PROVISIONAL (Sprint 6). Contenido conforme a la LSSI-CE (Ley
// 34/2002). Datos del titular desde lib/legal-info.js (fuente única).

export const metadata = {
  title: "Aviso Legal — Viena Pets",
  description:
    "Información legal del titular de Viena Pets conforme a la LSSI-CE (Ley 34/2002).",
};

const LAST_UPDATED = "22 de junio de 2026";

export default function Page() {
  return (
    <LegalPage title="Aviso Legal" updated={LAST_UPDATED}>
      <P>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de
        Servicios de la Sociedad de la Información y de Comercio Electrónico
        (LSSI-CE), se ponen a disposición de los usuarios los siguientes datos
        identificativos del titular de este sitio web.
      </P>

      <H2>1. Identificación del titular</H2>
      <UL>
        <li>Titular: {LEGAL_NAME}</li>
        <li>NIF: {LEGAL_NIF}</li>
        <li>Domicilio: {LEGAL_ADDRESS}</li>
        <li>
          Correo electrónico de contacto:{" "}
          <LegalLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</LegalLink>
        </li>
        <li>Sitio web: vienapets.com</li>
      </UL>

      <H2>2. Actividad</H2>
      <P>
        Viena Pets es una tienda online dedicada a la venta de accesorios de
        diseño para perros —arneses, correas y portabolsas— con diseños
        exclusivos producidos en colaboración con proveedores seleccionados. Los
        productos se comercializan de forma individual o en conjuntos.
      </P>

      <H2>3. Inscripción registral</H2>
      <P>
        La actividad se ejerce en régimen de trabajadora autónoma con NIF. No
        requiere inscripción en el Registro Mercantil.
      </P>

      <H2>4. Propiedad intelectual e industrial</H2>
      <P>
        Todos los contenidos de este sitio web —incluyendo, a título enunciativo,
        diseños, estampados, textos, fotografías, logotipos, marca, gráficos e
        interfaz— son titularidad de {LEGAL_NAME} o de terceros que han autorizado
        su uso, y están protegidos por la normativa de propiedad intelectual e
        industrial.
      </P>
      <P>
        Queda prohibida su reproducción, distribución, comunicación pública,
        transformación o cualquier otra forma de explotación, total o parcial, sin
        la autorización expresa y por escrito del titular. En particular, queda
        prohibida la copia o imitación de los diseños y estampados originales de la
        marca.
      </P>

      <H2>5. Condiciones de uso</H2>
      <P>
        El usuario se compromete a hacer un uso adecuado de los contenidos y
        servicios del sitio y a no emplearlos para actividades ilícitas, contrarias
        a la buena fe o que puedan dañar, inutilizar o sobrecargar el sitio, o
        impedir su normal utilización por otros usuarios.
      </P>

      <H2>6. Limitación de responsabilidad</H2>
      <P>
        El titular no se hace responsable de los daños o perjuicios que pudieran
        derivarse de errores u omisiones en los contenidos, de la falta de
        disponibilidad del sitio o de la transmisión de virus o programas
        maliciosos, pese a haber adoptado las medidas tecnológicas necesarias para
        evitarlo.
      </P>
      <P>
        El sitio puede contener enlaces a páginas de terceros. El titular no asume
        responsabilidad alguna sobre el contenido, las políticas o las prácticas de
        dichos sitios externos.
      </P>

      <H2>7. Protección de datos y cookies</H2>
      <P>
        El tratamiento de los datos personales de los usuarios se rige por nuestra{" "}
        <LegalLink href="/privacidad">Política de Privacidad</LegalLink>. El uso de
        cookies se detalla en la{" "}
        <LegalLink href="/cookies">Política de Cookies</LegalLink>.
      </P>

      <H2>8. Legislación aplicable y jurisdicción</H2>
      <P>
        Este aviso legal se rige por la legislación española. Para la resolución de
        cualquier controversia derivada del acceso o uso de este sitio web, las
        partes se someten a los Juzgados y Tribunales españoles que resulten
        competentes conforme a la normativa aplicable, sin perjuicio de los
        derechos que asisten a los consumidores.
      </P>
    </LegalPage>
  );
}
