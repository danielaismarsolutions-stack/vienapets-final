-- =====================================================================
-- Sprint 2 — Catálogo: products + variants
-- Conforme a CLAUDE.md §6.
-- =====================================================================

-- ---- products --------------------------------------------------------
create table if not exists public.products (
  id                 uuid        primary key default gen_random_uuid(),
  slug               text        not null unique,
  name               text        not null,
  model              text        check (model in ('capri','peachy','daisy')),
  category           text        not null check (category in ('arnes','correa','portabolsas','conjunto')),
  description        text,
  price_cents        integer     not null check (price_cents >= 0),
  stripe_product_id  text,
  images             jsonb       not null default '[]'::jsonb,
  active             boolean     not null default true,
  created_at         timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_model_idx    on public.products (model);
create index if not exists products_active_idx   on public.products (active);

-- ---- variants --------------------------------------------------------
create table if not exists public.variants (
  id              uuid    primary key default gen_random_uuid(),
  product_id      uuid    not null references public.products(id) on delete cascade,
  size            text    check (size is null or size in ('XS','S','M','L')),
  sku             text    not null unique,
  stripe_price_id text,
  stock           integer not null default 0 check (stock >= 0),
  stock_reserved  integer not null default 0 check (stock_reserved >= 0),
  -- Stock reservado para garantías/devoluciones (CLAUDE.md §6) nunca supera el total.
  check (stock_reserved <= stock)
);

create index if not exists variants_product_id_idx on public.variants (product_id);

-- ---- RLS -------------------------------------------------------------
-- Lectura pública (cliente final).
-- Escritura SOLO service_role (Lucía via Supabase Studio).
alter table public.products enable row level security;
alter table public.variants enable row level security;

create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (active = true);

create policy "variants_public_read"
  on public.variants
  for select
  to anon, authenticated
  using (true);
