-- =====================================================================
-- Sprint 2 — Seed inicial del catálogo
-- 12 products + 21 variants. Precios en céntimos con IVA incluido.
--
-- Idempotencia: este script falla si ya hay datos (por UNIQUE en slug/sku).
-- Para re-seedear desde cero:
--   TRUNCATE public.products, public.variants RESTART IDENTITY CASCADE;
-- =====================================================================

-- ---- products --------------------------------------------------------------
insert into public.products (slug, name, model, category, description, price_cents, images) values
  -- CAPRI -------------------------------------------------------------------
  ('arnes-capri',       'Arnés Capri',        'capri', 'arnes',
   'Inspirado en las sombrillas de la costa mediterránea. Rayas de autor sobre fondo claro, ribete cobre cálido y herrajes marrones.',
   3295,
   '["/assets/capri-arnes.jpeg","/assets/capri-correa.jpeg","/assets/capri-portabolsa.jpeg","/assets/herrajes-capri.png"]'::jsonb),

  ('correa-capri',      'Correa Capri',       'capri', 'correa',
   'Inspirado en las sombrillas de la costa mediterránea. Rayas de autor sobre fondo claro, ribete cobre cálido y herrajes marrones.',
   2195,
   '["/assets/capri-correa.jpeg","/assets/capri-arnes.jpeg","/assets/capri-portabolsa.jpeg","/assets/herrajes-capri.png"]'::jsonb),

  ('portabolsas-capri', 'Portabolsas Capri',  'capri', 'portabolsas',
   'Inspirado en las sombrillas de la costa mediterránea. Rayas de autor sobre fondo claro, ribete cobre cálido y herrajes marrones.',
   1095,
   '["/assets/capri-portabolsa.jpeg","/assets/capri-arnes.jpeg","/assets/capri-correa.jpeg","/assets/herrajes-capri.png"]'::jsonb),

  ('conjunto-capri',    'Conjunto Capri',     'capri', 'conjunto',
   'El conjunto completo de la edición. Precio especial al llevar las tres piezas a juego.',
   6395,
   '["/assets/capri-conjunto.jpeg","/assets/capri-arnes.jpeg","/assets/capri-correa.jpeg","/assets/capri-portabolsa.jpeg"]'::jsonb),

  -- PEACHY ------------------------------------------------------------------
  ('arnes-peachy',       'Arnés Peachy',        'peachy', 'arnes',
   'Un estampado original de soles: optimismo en su forma más pura. Rosa chicle con contraste naranja y herrajes marrones.',
   3295,
   '["/assets/peachy-arnes.jpeg","/assets/peachy-correa.jpeg","/assets/peachy-portabolsa.png","/assets/herrajes-peachy.png"]'::jsonb),

  ('correa-peachy',      'Correa Peachy',       'peachy', 'correa',
   'Un estampado original de soles: optimismo en su forma más pura. Rosa chicle con contraste naranja y herrajes marrones.',
   2195,
   '["/assets/peachy-correa.jpeg","/assets/peachy-arnes.jpeg","/assets/peachy-portabolsa.png","/assets/herrajes-peachy.png"]'::jsonb),

  ('portabolsas-peachy', 'Portabolsas Peachy',  'peachy', 'portabolsas',
   'Un estampado original de soles: optimismo en su forma más pura. Rosa chicle con contraste naranja y herrajes marrones.',
   1095,
   '["/assets/peachy-portabolsa.png","/assets/peachy-arnes.jpeg","/assets/peachy-correa.jpeg","/assets/herrajes-peachy.png"]'::jsonb),

  ('conjunto-peachy',    'Conjunto Peachy',     'peachy', 'conjunto',
   'El conjunto completo de la edición. Precio especial al llevar las tres piezas a juego.',
   6395,
   '["/assets/peachy-conjunto.jpeg","/assets/peachy-arnes.jpeg","/assets/peachy-correa.jpeg","/assets/peachy-portabolsa.png"]'::jsonb),

  -- DAISY -------------------------------------------------------------------
  ('arnes-daisy',       'Arnés Daisy',        'daisy', 'arnes',
   'Un clásico renovado. Topos chocolate sobre un amarillo crema suave — evocación de los años 60 con la calidad de hoy.',
   3295,
   '["/assets/daisy-arnes.jpeg","/assets/daisy-correa.jpeg","/assets/daisy-portabolsa.png","/assets/herrajes-daisy.png"]'::jsonb),

  ('correa-daisy',      'Correa Daisy',       'daisy', 'correa',
   'Un clásico renovado. Topos chocolate sobre un amarillo crema suave — evocación de los años 60 con la calidad de hoy.',
   2195,
   '["/assets/daisy-correa.jpeg","/assets/daisy-arnes.jpeg","/assets/daisy-portabolsa.png","/assets/herrajes-daisy.png"]'::jsonb),

  ('portabolsas-daisy', 'Portabolsas Daisy',  'daisy', 'portabolsas',
   'Un clásico renovado. Topos chocolate sobre un amarillo crema suave — evocación de los años 60 con la calidad de hoy.',
   1095,
   '["/assets/daisy-portabolsa.png","/assets/daisy-arnes.jpeg","/assets/daisy-correa.jpeg","/assets/herrajes-daisy.png"]'::jsonb),

  ('conjunto-daisy',    'Conjunto Daisy',     'daisy', 'conjunto',
   'El conjunto completo de la edición. Precio especial al llevar las tres piezas a juego.',
   6395,
   '["/assets/daisy-conjunto.jpeg","/assets/daisy-arnes.jpeg","/assets/daisy-correa.jpeg","/assets/daisy-portabolsa.png"]'::jsonb);

-- ---- variants ------------------------------------------------------------
-- Arneses → 4 tallas cada uno (12 variants).
insert into public.variants (product_id, size, sku, stock, stock_reserved)
select p.id, t.size, 'ARN-' || upper(p.model) || '-' || t.size, 10, 1
from public.products p
cross join (values ('XS'),('S'),('M'),('L')) as t(size)
where p.category = 'arnes';

-- Correas → talla única (3 variants).
insert into public.variants (product_id, size, sku, stock, stock_reserved)
select p.id, null, 'COR-' || upper(p.model), 10, 1
from public.products p
where p.category = 'correa';

-- Portabolsas → talla única (3 variants).
insert into public.variants (product_id, size, sku, stock, stock_reserved)
select p.id, null, 'POR-' || upper(p.model), 10, 1
from public.products p
where p.category = 'portabolsas';

-- Conjuntos → SKU del bundle con stock propio (3 variants).
insert into public.variants (product_id, size, sku, stock, stock_reserved)
select p.id, null, 'CONJ-' || upper(p.model), 10, 1
from public.products p
where p.category = 'conjunto';
