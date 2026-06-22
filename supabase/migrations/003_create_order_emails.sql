-- =====================================================================
-- Sprint 5 — Emails transaccionales: tabla de tracking order_emails
-- Conforme a CLAUDE.md §6 (modelo de datos / RLS) y al plan del Sprint 5.
--
-- Registra cada email transaccional enviado por pedido. Dos objetivos:
--   1) IDEMPOTENCIA: el constraint UNIQUE(order_id, email_type) garantiza que
--      sólo se envía UN email de cada tipo por pedido. Si el webhook de Stripe
--      se reintenta (o el Database Webhook de envío se dispara dos veces), el
--      segundo INSERT choca y se aborta el envío duplicado.
--   2) AUDITORÍA: guardamos el messageId de Brevo, el estado y el posible error
--      para diagnóstico desde Supabase Studio.
--
-- Escritura/lectura EXCLUSIVAMENTE service_role (webhook y rutas internas).
-- RLS habilitado y sin políticas públicas: anon/authenticated sin acceso.
-- =====================================================================

create table if not exists public.order_emails (
  id               uuid        primary key default gen_random_uuid(),
  order_id         uuid        not null references public.orders(id) on delete cascade,
  email_type       text        not null check (email_type in ('confirmation','shipment')),
  brevo_message_id text,
  sent_at          timestamptz,
  status           text        not null default 'sent' check (status in ('sent','failed')),
  error_message    text,
  created_at       timestamptz not null default now(),

  -- Guarda de idempotencia: un único email de cada tipo por pedido.
  constraint order_emails_order_type_unique unique (order_id, email_type)
);

create index if not exists order_emails_order_id_idx on public.order_emails (order_id);

-- ---- RLS --------------------------------------------------------------
-- Sin políticas: sólo service_role (que bypassa RLS) puede operar.
alter table public.order_emails enable row level security;
