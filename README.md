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
- **Sprint 3 — Carrito y Stripe Checkout** ✅ completado.
  Catálogo sincronizado a Stripe (12 products + 21 prices, test mode) con
  `scripts/sync-products-to-stripe.js`. Carrito persistente con `variantId` y
  precios en céntimos. `/carrito` y `/checkout` enchufados al store. El botón
  "Pagar con Stripe" crea una sesión de **Stripe Checkout hosted** (vía
  `/api/checkout`, con validación de stock en servidor, `automatic_tax`,
  cupones y recogida de dirección España) y redirige a Stripe. Al volver,
  `/exito` verifica el pago contra Stripe y vacía el carrito. Envío plano
  **5,90 €**, gratis a partir de **60 €**.
- **Sprint 4 — Post-pago** (siguiente): webhook de Stripe + descuento de stock
  + tablas `orders` / `order_items` + email de confirmación / factura.

---

## Cómo arrancar en local

Requiere Node 22+ y npm 10+.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de variables locales
cp .env.local.example .env.local
# Rellena las variables de Supabase (proyecto Dublin eu-west-1):
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
#   SUPABASE_SERVICE_ROLE_KEY=...      # solo server-side, nunca al cliente
# y las de Stripe (Sprint 3, test mode):
#   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
#   STRIPE_SECRET_KEY=sk_test_...      # solo server-side, nunca al cliente
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000   # usado en success/cancel URLs

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
│   ├── carrito/page.jsx          # Cesta (revisión antes de pagar)
│   ├── checkout/page.jsx         # Resumen + "Pagar con Stripe" (Checkout hosted)
│   ├── exito/page.jsx            # Confirmación post-pago (verifica con Stripe)
│   ├── api/checkout/route.js         # Crea la sesión de Stripe Checkout
│   ├── api/checkout/verify/route.js  # Verifica el pago de una sesión
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
│   ├── stripe/                   # server.js (SDK con secret key), client.js
│   │                             # (loadStripe singleton para el navegador)
│   ├── cart/shipping.js          # Reglas de envío (gratis ≥60€) cliente+servidor
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
- **Carrito:** `CartProvider` con persistencia en `localStorage`. Desde Sprint 3 la clave es `vienapets-cart-v1` y cada línea guarda `variantId` + `price_cents` (necesarios para el checkout); los importes se calculan en céntimos.
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

## Sincronizar el catálogo a Stripe (Sprint 3)

Cuando se añaden o editan productos/variantes en Supabase hay que reflejarlos
en Stripe (crear sus `Product` y `Price`). El script es **idempotente**: si la
fila ya tiene `stripe_product_id` / `stripe_price_id` no duplica, sólo actualiza.

```bash
# Requiere STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL,
# SUPABASE_SERVICE_ROLE_KEY y NEXT_PUBLIC_SITE_URL en el entorno.
node scripts/sync-products-to-stripe.js
```

Crea cada `Price` con `tax_behavior=inclusive` (el precio ya lleva IVA) y guarda
los IDs de vuelta en Supabase. Las imágenes se incluyen *best-effort*: si la URL
pública no responde, el producto se crea sin imagen (no bloquea).

---

## Cómo probar el checkout (Sprint 3)

1. `npm run dev` y abre la tienda. Añade productos a la cesta y ve a `/carrito`.
2. Pulsa **Tramitar pedido** → `/checkout` → **Pagar con Stripe**. Te redirige a
   Stripe Checkout (hosted).
3. Paga con la **tarjeta de prueba** de Stripe (test mode):
   - Nº tarjeta: **4242 4242 4242 4242**
   - Caducidad: cualquier fecha futura (ej. `12/34`)
   - CVC: cualquier 3 dígitos (ej. `123`)
   - Dirección/código postal: cualquiera (España)
4. Tras pagar vuelves a `/exito`, que verifica el pago con Stripe, muestra el
   número de pedido y **vacía el carrito**.
5. Puedes comprobar la sesión completada en el **Dashboard de Stripe** (test
   mode) → Payments / Checkout sessions.

> El envío es 5,90 € y pasa a **gratis** automáticamente cuando el subtotal
> llega a 60 €. Los cupones se habilitan con `allow_promotion_codes`: Lucía los
> crea en el Dashboard de Stripe.

> **Aún no implementado (Sprint 4):** webhook, descuento de stock, persistencia
> del pedido en Supabase y email/factura. En este sprint el pago es real (test
> mode) pero no descuenta inventario.

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
- ✅ Checkout real con Stripe Checkout hosted (Sprint 3) — nunca Stripe Elements.
- ✅ Precios siempre con IVA incluido en presentación.
- ✅ Paleta marrón cálida (`#816754` / `--vp-brown` `#4A2E1C`). Verde olivo descartado.
- ✅ Todo el copy en español, tono cálido pero profesional.
