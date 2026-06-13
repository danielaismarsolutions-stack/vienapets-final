-- =====================================================================
-- Sprint 4 — Pedidos: orders + order_items + numeración correlativa
-- Conforme a CLAUDE.md §6.
--
-- Persistencia del pedido tras un pago confirmado en Stripe. La escritura
-- ocurre EXCLUSIVAMENTE desde el webhook (service_role) en el evento
-- checkout.session.completed. RLS sin políticas públicas: ni anon ni
-- authenticated pueden leer/escribir; sólo service_role (que bypassa RLS).
-- =====================================================================

-- ---- Numeración correlativa VP-AAAA-NNNN ------------------------------
-- Secuencia global. Los huecos son aceptables (un resend de webhook que
-- choque en ON CONFLICT consume un valor): esto NO es el número de factura
-- legal —eso lo gestiona Stripe Invoicing—, sólo la referencia de pedido.
create sequence if not exists public.vp_order_seq start 1;

create or replace function public.generate_order_number()
returns text
language sql
volatile
set search_path = public
as $$
  select 'VP-' || extract(year from now())::int || '-'
       || lpad(nextval('public.vp_order_seq')::text, 4, '0');
$$;

-- ---- orders -----------------------------------------------------------
create table if not exists public.orders (
  id                       uuid        primary key default gen_random_uuid(),
  order_number             text        not null unique,   -- VP-2026-0001
  stripe_session_id        text        not null unique,   -- guarda de idempotencia
  stripe_payment_intent_id text,
  customer_email           text,
  customer_name            text,
  shipping_address         jsonb,
  subtotal_cents           integer     check (subtotal_cents is null or subtotal_cents >= 0),
  shipping_cents           integer     check (shipping_cents is null or shipping_cents >= 0),
  total_cents              integer     check (total_cents is null or total_cents >= 0),
  status                   text        not null default 'pending'
                                       check (status in (
                                         'pending','paid','payment_failed',
                                         'shipped','delivered','refunded'
                                       )),
  tracking_number          text,
  carrier                  text,
  created_at               timestamptz not null default now(),
  shipped_at               timestamptz
);

create index if not exists orders_status_idx       on public.orders (status);
create index if not exists orders_created_at_idx    on public.orders (created_at);

-- ---- order_items ------------------------------------------------------
-- variant_id con ON DELETE SET NULL: el histórico del pedido sobrevive
-- aunque la variante se borre del catálogo (los _snapshot lo preservan).
create table if not exists public.order_items (
  id                    uuid    primary key default gen_random_uuid(),
  order_id              uuid    not null references public.orders(id) on delete cascade,
  variant_id            uuid    references public.variants(id) on delete set null,
  product_name_snapshot text,
  size_snapshot         text,
  price_cents_snapshot  integer check (price_cents_snapshot is null or price_cents_snapshot >= 0),
  quantity              integer not null check (quantity > 0)
);

create index if not exists order_items_order_id_idx   on public.order_items (order_id);
create index if not exists order_items_variant_id_idx on public.order_items (variant_id);

-- ---- RPC transaccional: alta de pedido pagado -------------------------
-- Todo ocurre en UNA transacción (la del cuerpo de la función), atómica:
--   1) INSERT en orders con ON CONFLICT (stripe_session_id) DO NOTHING.
--      Es lo PRIMERO y la única guarda de idempotencia: si no devuelve id,
--      el pedido ya existe → se retorna {created:false} sin tocar items ni
--      stock (previene doble descuento en resends del webhook).
--   2) Sólo si se creó y status='paid': inserta order_items y decrementa
--      stock de cada variante de forma atómica (WHERE stock >= quantity).
--      Si el decremento no afecta filas (stock insuficiente) o viola el
--      check stock_reserved<=stock (oversell en carrera), se registra un
--      aviso y se continúa: el pago ya está hecho, NO se revierte; Lucía
--      lo gestiona manualmente (CLAUDE.md §6).
create or replace function public.process_paid_order(
  p_session_id        text,
  p_payment_intent_id text,
  p_customer_email    text,
  p_customer_name     text,
  p_shipping_address  jsonb,
  p_subtotal_cents    integer,
  p_shipping_cents    integer,
  p_total_cents       integer,
  p_status            text,
  p_items             jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id     uuid;
  v_order_number text;
  v_item         jsonb;
  v_variant_id   uuid;
  v_quantity     integer;
  v_updated      integer;
  v_warnings     jsonb := '[]'::jsonb;
begin
  -- (1) Guarda de idempotencia: INSERT ... ON CONFLICT DO NOTHING PRIMERO.
  insert into public.orders (
    order_number, stripe_session_id, stripe_payment_intent_id,
    customer_email, customer_name, shipping_address,
    subtotal_cents, shipping_cents, total_cents, status
  ) values (
    generate_order_number(), p_session_id, p_payment_intent_id,
    p_customer_email, p_customer_name, p_shipping_address,
    p_subtotal_cents, p_shipping_cents, p_total_cents, coalesce(p_status, 'pending')
  )
  on conflict (stripe_session_id) do nothing
  returning id, order_number into v_order_id, v_order_number;

  -- Pedido ya procesado: no tocar items ni stock.
  if v_order_id is null then
    return jsonb_build_object('created', false);
  end if;

  -- (2) Items + decremento de stock sólo para pedidos pagados.
  if coalesce(p_status, '') = 'paid' then
    for v_item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
    loop
      v_variant_id := nullif(v_item->>'variant_id', '')::uuid;
      v_quantity   := coalesce((v_item->>'quantity')::integer, 0);

      insert into public.order_items (
        order_id, variant_id, product_name_snapshot,
        size_snapshot, price_cents_snapshot, quantity
      ) values (
        v_order_id, v_variant_id, v_item->>'product_name',
        v_item->>'size', (v_item->>'price_cents')::integer, greatest(v_quantity, 1)
      );

      if v_variant_id is not null and v_quantity > 0 then
        begin
          update public.variants
             set stock = stock - v_quantity
           where id = v_variant_id
             and stock >= v_quantity;
          get diagnostics v_updated = row_count;
          if v_updated = 0 then
            v_warnings := v_warnings || jsonb_build_object(
              'variant_id', v_variant_id, 'quantity', v_quantity, 'reason', 'insufficient_stock'
            );
          end if;
        exception when others then
          -- p.ej. violación de check stock_reserved<=stock en oversell.
          v_warnings := v_warnings || jsonb_build_object(
            'variant_id', v_variant_id, 'quantity', v_quantity, 'reason', sqlerrm
          );
        end;
      end if;
    end loop;
  end if;

  return jsonb_build_object(
    'created',        true,
    'order_id',       v_order_id,
    'order_number',   v_order_number,
    'stock_warnings', v_warnings
  );
end;
$$;

-- ---- RLS --------------------------------------------------------------
-- Sin políticas: anon/authenticated quedan sin acceso. Sólo service_role
-- (webhook y RPCs server-side) opera, bypassando RLS (CLAUDE.md §6).
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- La RPC no debe ser invocable por roles públicos.
revoke all on function public.process_paid_order(
  text, text, text, text, jsonb, integer, integer, integer, text, jsonb
) from public, anon, authenticated;
revoke all on function public.generate_order_number() from public, anon, authenticated;
