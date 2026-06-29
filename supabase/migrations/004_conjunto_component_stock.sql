-- =====================================================================
-- Conjuntos — descuento de stock por componentes
--
-- Un Conjunto (categoría 'conjunto') se vende como un único SKU con precio
-- de bundle, pero NO tiene stock propio: su disponibilidad y su descuento
-- derivan de sus tres componentes del mismo modelo:
--   · arnés de la talla elegida
--   · correa (talla única)
--   · portabolsas / estuche (talla única)
--
-- Para soportarlo de forma genérica y atómica, cada elemento de p_items
-- puede traer ahora un array opcional `stock_targets`:
--   [{ "variant_id": <uuid>, "quantity": <int> }, ...]
-- Si viene, se descuenta de ESAS variantes (los componentes del conjunto).
-- Si no viene, se mantiene el comportamiento anterior: se descuenta de la
-- propia `variant_id` del item por su `quantity` (productos sueltos).
--
-- El order_item sigue guardando el snapshot apuntando a la variante "vendida"
-- (la del conjunto), así que el histórico del pedido se lee natural
-- ("Conjunto Capri · talla M") aunque el stock se mueva en los componentes.
--
-- Todo ocurre en la misma transacción que el alta del pedido: idempotencia
-- (ON CONFLICT sobre stripe_session_id) + decremento atómico
-- (UPDATE ... WHERE stock >= quantity). CREATE OR REPLACE conserva los GRANT
-- existentes; reafirmamos los REVOKE al final por seguridad.
-- =====================================================================

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
  v_targets      jsonb;
  v_target       jsonb;
  v_t_variant    uuid;
  v_t_qty        integer;
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

      -- Snapshot del pedido: apunta a la variante vendida (la del conjunto en
      -- el caso de un bundle), preservando nombre/talla/precio del momento.
      insert into public.order_items (
        order_id, variant_id, product_name_snapshot,
        size_snapshot, price_cents_snapshot, quantity
      ) values (
        v_order_id, v_variant_id, v_item->>'product_name',
        v_item->>'size', (v_item->>'price_cents')::integer, greatest(v_quantity, 1)
      );

      -- Destinos del decremento: stock_targets explícitos (componentes del
      -- conjunto) o, en su defecto, la propia variante del item (producto suelto).
      if jsonb_typeof(v_item->'stock_targets') = 'array'
         and jsonb_array_length(v_item->'stock_targets') > 0 then
        v_targets := v_item->'stock_targets';
      elsif v_variant_id is not null and v_quantity > 0 then
        v_targets := jsonb_build_array(
          jsonb_build_object('variant_id', v_variant_id, 'quantity', v_quantity)
        );
      else
        v_targets := '[]'::jsonb;
      end if;

      for v_target in select * from jsonb_array_elements(v_targets)
      loop
        v_t_variant := nullif(v_target->>'variant_id', '')::uuid;
        v_t_qty     := coalesce((v_target->>'quantity')::integer, 0);
        if v_t_variant is not null and v_t_qty > 0 then
          begin
            update public.variants
               set stock = stock - v_t_qty
             where id = v_t_variant
               and stock >= v_t_qty;
            get diagnostics v_updated = row_count;
            if v_updated = 0 then
              -- Stock insuficiente (carrera de oversell): el pago YA está hecho,
              -- NO se revierte. Se registra aviso para gestión manual (CLAUDE.md §6).
              v_warnings := v_warnings || jsonb_build_object(
                'variant_id', v_t_variant, 'quantity', v_t_qty, 'reason', 'insufficient_stock'
              );
            end if;
          exception when others then
            -- p.ej. violación del check stock_reserved <= stock.
            v_warnings := v_warnings || jsonb_build_object(
              'variant_id', v_t_variant, 'quantity', v_t_qty, 'reason', sqlerrm
            );
          end;
        end if;
      end loop;
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

-- La RPC no debe ser invocable por roles públicos (reafirmado tras el replace).
revoke all on function public.process_paid_order(
  text, text, text, text, jsonb, integer, integer, integer, text, jsonb
) from public, anon, authenticated;
