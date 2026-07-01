-- =====================================================================
-- Email operativo interno — amplía el CHECK de order_emails.email_type
--
-- La tabla order_emails (003) limitaba email_type a ('confirmation','shipment')
-- mediante un CHECK. El email operativo interno que se envía al equipo tras
-- cada pedido pagado necesita un tercer tipo, 'internal-notification', para
-- reutilizar la MISMA guarda de idempotencia (UNIQUE(order_id, email_type)):
-- así un resend del webhook de Stripe no reenvía el aviso a Lucía.
--
-- Sin esta migración, el INSERT de idempotencia con 'internal-notification'
-- fallaría con check_violation (23514) y el email nunca se registraría ni se
-- enviaría. Cambio retrocompatible: sólo añade un valor permitido.
-- =====================================================================

alter table public.order_emails
  drop constraint if exists order_emails_email_type_check;

alter table public.order_emails
  add constraint order_emails_email_type_check
  check (email_type in ('confirmation', 'shipment', 'internal-notification'));
