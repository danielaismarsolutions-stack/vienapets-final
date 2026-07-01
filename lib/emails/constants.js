import "server-only";

// Constantes de emails transaccionales.
//
// Destinatarios del email operativo INTERNO que se envía tras cada pedido
// pagado (evento checkout.session.completed). No lo ve el cliente: lleva la
// información para preparar y enviar el pedido, y el stock restante.
//
// Ambos van en TO (no BCC) a propósito: Lucía y el equipo deben verse
// mutuamente para coordinar los envíos.
//
// Un solo punto de verdad: si mañana cambian los destinatarios, basta con
// editar esta lista en un único commit.
export const INTERNAL_NOTIFICATION_RECIPIENTS = [
  "lucia@vienapets.com",
  "smartflowlabs.test@gmail.com",
];
