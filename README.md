# Viena Pets

Tienda online de **Viena Pets** — arneses, correas y portabolsas de diseño de autor diseñados en España, en ediciones limitadas. Tres modelos: Capri, Peachy, Daisy.

Stack: **Next.js 14** (App Router) · JavaScript · CSS modules + tokens · Supabase (Sprint 2) · Stripe Checkout (Sprint 3) · Vercel.

---

## Estado del proyecto

- **Sprint 1 — Migración a Next.js** ✅ completado.
  Migración estructural del sitio (legacy de Claude AI Apps en `legacy/`) a Next.js 14 App Router. Sin comercio aún: carrito persistente en localStorage funcional para la UX, pero **sin pasarela de pago real**. El botón "Pagar" del checkout está `disabled` (a la espera del Sprint 3).
- **Sprint 2 — Catálogo dinámico Supabase** ✅ completado.
  Tablas `products` y `variants` con RLS de lectura pública. 12 productos
  + 21 variantes seeded. Home, `/tienda`, `/modelos` y `/producto/[slug]`
  consultan Supabase desde Server Components con `revalidate = 60`.
  Stock visible (stock − stock_reserved) y banner "Agotado" funcionando.
- **Sprint 3 — Stripe** (siguiente): Checkout hosted + webhook + descuento
  stock + tablas `orders` / `order_items`.

---

## Cómo arrancar en local

Requiere Node 22+ y npm 10+.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de variables locales
cp .env.local.example .env.local
# Rellena las 3 variables de Supabase (proyecto Dublin eu-west-1):
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
#   SUPABASE_SERVICE_ROLE_KEY=...      # solo server-side, nunca al cliente

# 3. Arrancar el dev server
npm run dev
```

Abre `http://localhost:3000`.

**Scripts disponibles:**
- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm start` — sirve el build de producción
- `npm run lint` — ESLint con `next/core-web-vitals`

---

## Estructura de carpetas

```
vienapets-final/
├── app/                          # Rutas (App Router)
│   ├── layout.jsx                # Shell global: fonts, providers, navbar, footer
│   ├── page.jsx                  # Home
│   ├── globals.css               # Importa tokens + keyframes + scrollbar
│   ├── icon.png                  # Favicon (servido automáticamente por Next)
│   ├── tienda/page.jsx           # Catálogo (replica legacy ?cat=)
│   ├── producto/[modelo]/page.jsx # Ficha de producto (capri | peachy | daisy)
│   ├── checkout/page.jsx         # Checkout (UI estática — botón Pagar disabled)
│   ├── historia/page.jsx
│   ├── modelos/page.jsx
│   ├── probador/page.jsx         # Mockup del probador IA
│   └── guia-de-tallas/page.jsx
├── components/
│   ├── shared/                   # Header, Footer, CartDrawer, Icon, hooks
│   ├── home/                     # Bloques del home (Hero, Models, FAQ, etc.)
│   └── pages/                    # Componentes de cada página
├── lib/
│   ├── data.js                   # VP_SIZES, VP_FAQ, VP_HARDWARE… (constantes
│   │                             # de UI no migradas a BBDD)
│   ├── model-meta.js             # MODEL_META: hex, pantones, subtitle,
│   │                             # partsImg, materialsImg (tokens del
│   │                             # sistema visual — no editables)
│   ├── supabase/                 # client.js (browser), public.js (server
│   │                             # anon), server.js (service_role)
│   └── queries/products.js       # getAllProducts, getProductsByCategory,
│                                 # getProductBySlug, getProductWithVariants,
│                                 # getAllProductSlugs, getModelsView
├── public/
│   └── assets/                   # Imágenes (copiadas desde legacy/assets/)
├── styles/
│   └── tokens.css                # Fuente de verdad de variables CSS
├── legacy/                       # Sitio original — SOLO REFERENCIA, no se importa
├── CLAUDE.md                     # Reglas permanentes del proyecto
├── .env.local.example            # Plantilla de variables de entorno
└── next.config.js
```

`legacy/` se conserva sin tocar. Nada en tiempo de ejecución importa desde ahí.

---

## Decisiones técnicas relevantes (Sprint 1)

- **Tipografías** (DM Serif Display, Cormorant Garamond, Jost, JetBrains Mono) cargadas vía `next/font/google` y enlazadas a las variables `--font-*-loaded` que `tokens.css` consume.
- **Router:** `useRoute()` (en `components/shared/useRoute.jsx`) es un adaptador sobre `next/navigation` que mantiene la API `{ route, go }` del legacy para no refactorizar los componentes migrados.
- **Carrito:** `CartProvider` con persistencia en `localStorage` (`vp_cart`), idéntico al legacy.
- **Suspense boundaries** alrededor de `Navbar`, `Footer`, `CartDrawer` y `{children}` — necesarios porque `useRoute` consume `useSearchParams`.

---

## Cómo edita Lucía el stock (Sprint 2)

Toda la edición del catálogo se hace desde **Supabase Studio** del proyecto
`vienapets` (región Dublin, eu-west-1). No hay panel `/admin` (CLAUDE.md §4):

1. Entra a [supabase.com](https://supabase.com) y abre el proyecto `vienapets`.
2. Menú lateral → **Table editor** → tabla `variants`.
3. Filtra por `sku` (ej. `ARN-CAPRI-M`) o por `product_id`.
4. Edita la columna **`stock`** y guarda. El "stock disponible" que ve el
   cliente es `stock − stock_reserved`. La columna `stock_reserved`
   (típicamente 1) protege un colchón para garantías / devoluciones y
   **no debe tocarse en operación normal**.
5. Para marcar una variante como agotada sin borrarla, pon `stock = 1` y
   `stock_reserved = 1` (disponible = 0). Para volver a venderla, sube
   `stock` al valor real.
6. Los cambios se ven en la web en **máximo 60 segundos** (revalidate de
   Next.js). Para forzar refresco inmediato durante pruebas: redeploy en
   Vercel.

Para añadir o editar **productos** (precio, descripción, imágenes,
publicación), misma ruta: Table editor → `products`. La columna `active`
controla la visibilidad en la tienda.

**Atajo:** descontar un producto de venta = `active = false`. La RLS
filtra automáticamente y desaparece de toda la web.

---

## Pendientes conocidos

- El `Navbar` enlaza a `/cuidado`, que aún no existe (404). Lo mismo ocurría en el legacy. Decidir en próximo sprint: crear página o quitar el link.
- Páginas legales reales (privacidad, términos, envíos) — el footer las lista como spans sin destino, igual que en el legacy. Pendiente para Sprint posterior.
- Migración a `next/image` para optimización de imágenes — fuera del scope de Sprint 1.

---

## Reglas del proyecto

Lee `CLAUDE.md` antes de tocar nada. Resumen crítico:

- ❌ **Sin lenguaje prohibido** (atelier, artesanal, handmade, taller, narrativa del dálmata Viena como origen).
- ❌ Sin Tailwind, sin shadcn, sin librerías de UI.
- ❌ Sin TypeScript.
- ❌ Sin botones "Comprar" reales hasta Sprint 3.
- ✅ Precios siempre con IVA incluido en presentación.
- ✅ Paleta marrón cálida (`#816754` / `--vp-brown` `#4A2E1C`). Verde olivo descartado.
- ✅ Todo el copy en español, tono cálido pero profesional.
