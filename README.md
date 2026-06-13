# Viena Pets

Tienda online de **Viena Pets** — arneses, correas y portabolsas de diseño de autor diseñados en España, en ediciones limitadas. Tres modelos: Capri, Peachy, Daisy.

Stack: **Next.js 14** (App Router) · JavaScript · CSS modules + tokens · Supabase (Sprint 2) · Stripe Checkout (Sprint 3) · Webhook + persistencia de pedidos (Sprint 4) · Vercel.

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
  `/exito` muestra el pedido y vacía el carrito. Envío plano
  **5,90 €**, gratis a partir de **60 €**.
- **Sprint 4 — Post-pago: webhook, persistencia, stock, facturas** ✅ completado.
  Tablas `orders` y `order_items` (RLS sin acceso público, sólo `service_role`)
  + numeración correlativa **VP-2026-XXXX** (secuencia + `generate_order_number()`).
  El endpoint **`/api/webhook`** recibe los eventos de Stripe, **verifica la
  firma** (`STRIPE_WEBHOOK_SECRET`) sobre el cuerpo crudo y, al confirmarse el
  pago, persiste el pedido y **descuenta el stock real de forma atómica** vía la
  RPC transaccional `process_paid_order`. Es **idempotente**: un *resend* del
  mismo evento no duplica el pedido ni vuelve a descontar inventario. Cada pago
  genera una **factura PDF automática** (Stripe Invoicing). `/exito` consulta el
  pedido en Supabase por `session_id` y muestra el correlativo.
  Fuera de alcance: emails transaccionales (Sprint 5+), tracking/envío, refunds.

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
#   STRIPE_WEBHOOK_SECRET=whsec_...    # Sprint 4: firma de /api/webhook (server)
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
│   ├── exito/page.jsx            # Confirmación post-pago (lee el pedido de Supabase)
│   ├── api/checkout/route.js         # Crea la sesión de Stripe Checkout (+ invoice_creation)
│   ├── api/checkout/order/route.js   # Consulta el pedido persistido por session_id
│   ├── api/webhook/route.js          # Recibe eventos Stripe: persiste pedido + stock
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
4. Tras pagar vuelves a `/exito`, que consulta el pedido en Supabase por
   `session_id`, muestra el **número correlativo VP-2026-XXXX** y **vacía el
   carrito**. Si el webhook aún no lo ha procesado, reintenta cada 3 s (máx 30 s).
5. Puedes comprobar la sesión completada en el **Dashboard de Stripe** (test
   mode) → Payments / Checkout sessions, y la **factura PDF** en Invoices.

> El envío es 5,90 € y pasa a **gratis** automáticamente cuando el subtotal
> llega a 60 €. Los cupones se habilitan con `allow_promotion_codes`: Lucía los
> crea en el Dashboard de Stripe.

---

## Flujo de un pedido (Sprint 4)

El ciclo completo de una compra, de extremo a extremo:

1. **Carrito → Checkout.** El cliente revisa la cesta y pulsa *Pagar con Stripe*.
   `POST /api/checkout` revalida stock y precios en servidor (nunca se fía del
   cliente), calcula el envío y crea una **sesión de Stripe Checkout hosted** con
   `automatic_tax`, recogida de dirección (ES) e **`invoice_creation` activado**
   (genera factura PDF automática con los datos fiscales de Lucía).
2. **Pago en Stripe.** El cliente paga en la página hosted de Stripe. Stripe
   redirige a `/exito?session_id=cs_...`.
3. **Webhook (fuente de verdad).** Stripe envía `checkout.session.completed` a
   **`POST /api/webhook`**. El endpoint:
   - Lee el **cuerpo crudo** y **verifica la firma** con `STRIPE_WEBHOOK_SECRET`.
     Sin firma válida no procesa nada.
   - Sólo si `payment_status === 'paid'`, recupera los `line_items`, los **mapea
     a variantes por `stripe_price_id`** y llama a la RPC `process_paid_order`.
   - La RPC, en **una sola transacción**: hace `INSERT … ON CONFLICT
     (stripe_session_id) DO NOTHING` como **primera** operación (guarda de
     idempotencia); si no devuelve `id`, el pedido ya existía y retorna sin tocar
     nada. Si lo crea, asigna **`order_number` (VP-2026-XXXX)**, inserta los
     `order_items` y **descuenta el stock atómicamente** (`UPDATE … WHERE
     stock >= quantity`). Si el stock es insuficiente (oversell en carrera),
     **registra un aviso y NO revierte**: el pago ya está hecho y Lucía lo
     gestiona manualmente desde Supabase Studio.
   - Pagos asíncronos: `async_payment_succeeded` se trata igual; `async_payment_failed`
     persiste el pedido con `status='payment_failed'` para que Lucía lo vea.
4. **Confirmación.** `/exito` llama a `GET /api/checkout/order?session_id=…`
   (que usa `service_role`, las tablas de pedidos no tienen acceso público) y
   muestra el correlativo, el email y el total. Reintenta si el webhook aún no
   ha persistido (latencia normal).
5. **Factura.** Stripe genera y envía la **factura PDF** automáticamente. Visible
   en Dashboard → Invoices.

**Idempotencia:** reenviar el mismo evento (Dashboard → Webhooks → *Resend*) no
duplica el pedido ni descuenta stock dos veces; el `INSERT … ON CONFLICT DO
NOTHING` inicial corta el flujo antes de tocar items o inventario.

### Verificación en producción (runbook)

Tras desplegar la rama, smoke test end-to-end (test mode):

1. Compra real con `4242 4242 4242 4242` (caducidad futura, CVC cualquiera).
2. **Vercel → Logs**: el webhook responde `200` y loguea `Pedido creado VP-2026-0001`.
3. **Supabase Studio**: `orders` tiene la fila con `VP-2026-0001`; `order_items`
   las líneas; `variants.stock` decrementado en las cantidades compradas.
4. **Stripe Dashboard → Invoices**: factura generada para esa sesión.
5. **`/exito`**: muestra `VP-2026-0001`, email y total.
6. **Idempotencia**: Dashboard → Webhooks → endpoint → el evento → *Resend*.
   Verifica que NO se crea un segundo pedido ni se descuenta stock de nuevo.

> La lógica de base de datos (alta de pedido, decremento atómico, idempotencia,
> oversell y `payment_failed`) está verificada ejecutando `process_paid_order`
> directamente contra la base de datos; ver el commit de verificación de Sprint 4.

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
