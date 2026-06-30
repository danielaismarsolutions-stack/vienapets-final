import {
  LEGAL_NAME,
  LEGAL_NIF,
  LEGAL_ADDRESS,
  LEGAL_CONTACT_EMAIL,
} from "@/lib/legal-info";
import { LegalPage, H2, P, UL, LegalLink } from "@/components/legal/LegalUI";

// Condiciones de venta PROVISIONALES (Sprint 6). Conformes al RDL 1/2007
// (Texto Refundido de la Ley General para la Defensa de los Consumidores y
// Usuarios). Datos del vendedor desde lib/legal-info.js.

export const metadata = {
  title: "Condiciones de Venta — Viena Pets",
  description:
    "Términos y condiciones de venta de Viena Pets: compra, pagos, envíos, devoluciones y garantía.",
};

const LAST_UPDATED = "22 de junio de 2026";

export default function Page() {
  return (
    <LegalPage title="Condiciones de Venta" updated={LAST_UPDATED}>
      <P>
        Las presentes condiciones generales de venta regulan la relación entre{" "}
        {LEGAL_NAME} (en adelante, «Viena Pets») y las personas usuarias que
        realicen una compra a través de este sitio web. Al completar un pedido, la
        persona usuaria declara haber leído y aceptado estas condiciones.
      </P>

      <H2>1. Información sobre el vendedor</H2>
      <UL>
        <li>Vendedor: {LEGAL_NAME}</li>
        <li>NIF: {LEGAL_NIF}</li>
        <li>Domicilio: {LEGAL_ADDRESS}</li>
        <li>
          Contacto:{" "}
          <LegalLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</LegalLink>
        </li>
      </UL>

      <H2>2. Proceso de compra</H2>
      <P>El proceso para realizar un pedido es el siguiente:</P>
      <UL>
        <li>Selecciona los productos y su talla y añádelos al carrito.</li>
        <li>
          Revisa el carrito y continúa al pago. El pago se procesa a través de la
          pasarela segura de Stripe (Stripe Checkout).
        </li>
        <li>
          Tras confirmarse el pago, recibirás un email de confirmación con el
          número de pedido (formato VP-AAAA-XXXX) y el resumen de tu compra.
        </li>
      </UL>
      <P>
        El contrato de compraventa se entiende perfeccionado en el momento en que
        se confirma el pago. Viena Pets conservará constancia electrónica del
        pedido.
      </P>

      <H2>3. Precios</H2>
      <P>
        Todos los precios mostrados en la web se expresan en euros (€) e{" "}
        <strong>incluyen el IVA</strong> aplicable (21% en régimen general). Los
        gastos de envío, cuando correspondan, se indican de forma separada antes de
        finalizar la compra.
      </P>

      <H2>4. Métodos de pago</H2>
      <P>
        Los pagos se gestionan mediante Stripe Payments Europe, Ltd. Se aceptan los
        siguientes métodos, según disponibilidad en el momento del pago:
      </P>
      <UL>
        <li>Tarjeta de crédito o débito (Visa, Mastercard, American Express).</li>
        <li>Bizum.</li>
        <li>Apple Pay.</li>
        <li>Google Pay.</li>
      </UL>
      <P>
        Viena Pets no almacena los datos de tu tarjeta: son tratados directamente
        por Stripe bajo sus estándares de seguridad (PCI-DSS).
      </P>

      <H2>5. Envíos</H2>
      <P>
        Envíos a España peninsular mediante SEUR. Plazo orientativo: 3-5 días
        hábiles desde la confirmación del pago. Tarifa única: 5,90 €. Envío
        gratuito en pedidos superiores a 60 €. Recibirás un email con el número
        de seguimiento en cuanto tu pedido salga de nuestras instalaciones.
      </P>
      <P>
        Los plazos son orientativos y pueden variar por causas ajenas a Viena Pets
        (incidencias del transportista, periodos de alta demanda, etc.).
      </P>

      <H2>6. Derecho de desistimiento</H2>
      <P>
        Dispones de un plazo de <strong>30 días naturales</strong> desde la
        recepción del pedido para desistir de la compra, sin necesidad de
        justificación. Este plazo mejora voluntariamente el mínimo legal de 14 días
        previsto en el RDL 1/2007.
      </P>
      <P>
        Para ejercer el desistimiento, comunícalo por email a{" "}
        <LegalLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</LegalLink>{" "}
        indicando tu número de pedido. Los productos deben devolverse sin uso, en
        buen estado y con su embalaje original.
      </P>

      <H2>7. Devoluciones y cambios</H2>
      <UL>
        <li>
          Para iniciar una devolución, escribe a{" "}
          <LegalLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</LegalLink>{" "}
          con tu número de pedido.
        </li>
        <li>
          Los gastos de devolución corren a cargo de la persona usuaria, salvo que
          el producto sea defectuoso o no se corresponda con lo solicitado.
        </li>
        <li>
          Los conjuntos (sets) solo se admiten a devolución de forma completa, no
          por piezas sueltas.
        </li>
        <li>
          Los cambios de talla se gestionan como un nuevo envío, cuyo coste asume la
          persona usuaria.
        </li>
        <li>
          El reembolso se realizará mediante el mismo método de pago utilizado en la
          compra, en un plazo máximo de 14 días desde la recepción de la devolución.
        </li>
      </UL>

      <H2>8. Garantía legal</H2>
      <P>
        Todos los productos cuentan con la garantía legal de conformidad de{" "}
        <strong>3 años</strong> desde la entrega, conforme al RDL 1/2007. La
        garantía cubre los defectos o faltas de conformidad existentes en el
        momento de la entrega.
      </P>
      <P>
        Quedan excluidos de la garantía el desgaste derivado del uso normal del
        producto, así como los daños ocasionados por un uso indebido, negligente o
        contrario a las indicaciones de cuidado.
      </P>

      <H2>9. Reclamaciones</H2>
      <P>
        Puedes dirigir cualquier reclamación a{" "}
        <LegalLink href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</LegalLink>.
        Disponemos de hojas de reclamaciones a disposición de los consumidores, que
        podemos facilitarte a petición.
      </P>

      <H2>10. Resolución alternativa de litigios</H2>
      <P>
        Conforme al Reglamento (UE) 524/2013, la Comisión Europea pone a
        disposición de los consumidores una plataforma de resolución de litigios en
        línea, accesible en{" "}
        <LegalLink href="https://ec.europa.eu/consumers/odr" external>
          https://ec.europa.eu/consumers/odr
        </LegalLink>
        .
      </P>

      <H2>11. Legislación aplicable</H2>
      <P>
        Las presentes condiciones se rigen por la legislación española. Para la
        resolución de controversias serán competentes los Juzgados y Tribunales
        correspondientes, sin perjuicio de los derechos reconocidos legalmente a las
        personas consumidoras.
      </P>
    </LegalPage>
  );
}
