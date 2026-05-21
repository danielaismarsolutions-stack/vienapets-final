# CLAUDE.md — Reglas permanentes del proyecto VienaPets

Este archivo contiene las reglas inmutables del proyecto. Léelo al inicio de cada sesión y respétalo en cada cambio.

---

## 1. Contexto del proyecto

**VienaPets** es una marca española de accesorios de diseño para perros: arneses, correas y portabolsas. Tres modelos: **Capri**, **Peachy** y **Daisy**. Los productos se venden individualmente o en **Conjuntos** (sets).

**Cliente:** Lucía Larrondobuno (fundadora). Es autónoma con NIF, IVA general 21%.

**Modelo de negocio:** B2C, ventas en España peninsular inicialmente. Primer drop: mid-junio 2026.

---

## 2. POSICIONAMIENTO DE MARCA — CRÍTICO

**Esto es legal, no estético.** Cualquier desviación es un riesgo de publicidad engañosa (Directiva Ómnibus).

### Lenguaje PROHIBIDO en todo el código, copy, alt-text, metadatos, comentarios:
- ❌ "Artesanal" / "artisanal" / "handmade" / "hecho a mano"
- ❌ "Atelier" / "taller"
- ❌ Cualquier narrativa de heritage, tradición familiar, o producción manual
- ❌ Cualquier referencia al dálmata "Viena" como narrativa de origen histórico

### Narrativa correcta:
- ✅ "Diseños exclusivos diseñados en España, producidos con proveedores seleccionados"
- ✅ "Diseños de autor"
- ✅ Énfasis en **exclusividad del diseño**, no en proceso de fabricación

Si encuentras texto existente con lenguaje prohibido, **señálalo y reemplázalo**.

---

## 3. Sistema de diseño — DECISIONES CERRADAS

### Color
- **Primary:** marrón cálido suave `#816754`
- **Verde olivo:** ❌ DESCARTADO. Si encuentras tonos verdes en código antiguo, reemplazar por la paleta marrón cálida.
- Paleta general: tonos marrones suaves, cálidos. Sin verdes.

### Logo
- Usar **PNG** (no SVG)
- Nunca añadir la palabra "ATELIER" al logo

### Tipografía y tokens
- Mantener `styles/tokens.css` del legacy como fuente de verdad de variables CSS
- En Next.js, importar tokens globalmente en `app/globals.css`

### Categorías (5 confirmadas)
1. Conjuntos
2. Arneses
3. Correas
4. Portabolsas
5. Probador IA (con badge "Nuevo")

### Hero CTAs
- Arneses / Correas / Portabolsas

---

## 4. Stack técnico — FIJO

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** JavaScript (no TypeScript, para mantener simplicidad)
- **Estilos:** CSS modules + variables CSS de `tokens.css`. **NO usar Tailwind.**
- **Base de datos:** Supabase (PostgreSQL, región Frankfurt EU)
- **Pasarela de pago:** Stripe Checkout (hosted, no Elements)
- **Facturación:** Stripe Tax + Stripe Invoicing automático
- **Email transaccional:** Brevo (a integrar en sprint posterior)
- **Hosting:** Vercel
- **Dominio:** Hostinger (DNS apuntado a Vercel)
- **Auth admin:** Supabase Auth + RLS (no panel propio, Lucía usa Supabase Studio)
- **Cliente:** carrito persistente en localStorage, no requiere registro de usuario (checkout invitado)

---

## 5. Estructura del repositorio

```
vienapets/
├── app/                      # Next.js App Router
│   ├── layout.jsx            # Layout raíz
│   ├── page.jsx              # Home
│   ├── globals.css           # Importa tokens
│   ├── [category]/page.jsx   # Páginas de categoría
│   ├── producto/[slug]/page.jsx
│   ├── carrito/page.jsx
│   ├── checkout/page.jsx
│   ├── exito/page.jsx
│   └── api/
│       ├── checkout/route.js     # Crea sesión Stripe
│       └── webhook/route.js      # Recibe eventos Stripe
├── components/               # Componentes React reutilizables
│   ├── shared/               # Header, Footer, etc. (migración de shared.jsx)
│   ├── home/                 # Bloques del home (migración de home.jsx)
│   ├── product/
│   └── cart/
├── lib/
│   ├── supabase.js           # Cliente Supabase
│   ├── stripe.js             # Cliente Stripe (server-side)
│   └── cart.js               # Lógica de carrito (localStorage)
├── public/
│   └── assets/               # Imágenes copiadas de legacy/assets/
├── styles/
│   └── tokens.css            # Copiado de legacy/styles/tokens.css
├── legacy/                   # SOLO REFERENCIA — no modificar, no importar de aquí
└── CLAUDE.md
```

**Reglas:**
- `legacy/` es **solo referencia de consulta**. No se importa nada desde ahí en tiempo de ejecución.
- Cualquier asset que necesite el sitio se copia de `legacy/assets/` a `public/assets/`.
- Cualquier estilo que necesite el sitio se migra de `legacy/styles/` a `styles/`.

---

## 6. Modelo de datos en Supabase

### Tabla `products`
```sql
- id (uuid, pk)
- slug (text, unique)         -- ej: "arnes-capri", "conjunto-daisy"
- name (text)                  -- ej: "Arnés Capri"
- model (text)                 -- "capri" | "peachy" | "daisy" | null para conjuntos
- category (text)              -- "arnes" | "correa" | "portabolsas" | "conjunto"
- description (text)
- price_cents (integer)        -- precio CON IVA incluido, en céntimos
- stripe_product_id (text)     -- ID en Stripe
- images (jsonb)               -- array de rutas /assets/...
- active (boolean, default true)
- created_at (timestamptz)
```

### Tabla `variants`
```sql
- id (uuid, pk)
- product_id (uuid, fk products)
- size (text)                  -- "XS" | "S" | "M" | "L" | null para sin variante
- sku (text, unique)           -- ej: "ARN-CAPRI-M"
- stripe_price_id (text)       -- ID del Price en Stripe
- stock (integer, default 0)
- stock_reserved (integer, default 0)  -- 10% reserva para garantías
```

### Tabla `orders`
```sql
- id (uuid, pk)
- stripe_session_id (text, unique)
- stripe_payment_intent_id (text)
- customer_email (text)
- customer_name (text)
- shipping_address (jsonb)
- subtotal_cents (integer)
- shipping_cents (integer)
- total_cents (integer)
- status (text)                -- "pending" | "paid" | "shipped" | "delivered" | "refunded"
- tracking_number (text)
- carrier (text)
- created_at (timestamptz)
- shipped_at (timestamptz)
```

### Tabla `order_items`
```sql
- id (uuid, pk)
- order_id (uuid, fk orders)
- variant_id (uuid, fk variants)
- product_name_snapshot (text) -- nombre en el momento de la compra
- size_snapshot (text)
- price_cents_snapshot (integer)
- quantity (integer)
```

### Reglas de stock
- Stock visible al cliente = `stock - stock_reserved`
- Descuento de stock ocurre **solo en el webhook de Stripe** (evento `checkout.session.completed`), no antes
- Si Stripe webhook falla, hay riesgo de overselling — implementar reintentos y alerta

### RLS (Row Level Security)
- `products` y `variants`: lectura pública (anon), escritura solo service_role
- `orders` y `order_items`: lectura y escritura solo service_role (no exponer al cliente)

---

## 7. Convenciones de código

- **Componentes React:** PascalCase, un componente por archivo (`ProductCard.jsx`)
- **Helpers:** camelCase (`formatPrice.js`)
- **Rutas API:** snake_case si hace falta separar palabras
- **Precios en BBDD:** siempre en **céntimos como integer**. Nunca decimales. Conversión a EUR solo en presentación.
- **Texto visible al usuario:** español, sin tecnicismos. Tono cálido pero profesional.
- **Comentarios:** en español. Especialmente importantes en decisiones de negocio (por qué se hace algo).
- **NO instalar dependencias innecesarias.** Si no es estrictamente necesaria, no se añade. Cada paquete es deuda futura.

---

## 8. Prohibiciones técnicas

- ❌ **NO usar Tailwind, shadcn/ui, ni ninguna librería de UI.** Estilos con CSS modules + tokens.
- ❌ **NO instalar ORMs (Prisma, Drizzle).** Cliente Supabase directo.
- ❌ **NO exponer `SUPABASE_SERVICE_ROLE_KEY` en el cliente.** Solo en API routes.
- ❌ **NO usar Stripe Elements.** Solo Stripe Checkout hosted.
- ❌ **NO crear panel `/admin` personalizado.** Lucía usa Supabase Studio + Stripe Dashboard.
- ❌ **NO añadir auth de usuarios finales.** Checkout solo como invitado.
- ❌ **NO commitear `.env.local`.** Verifica `.gitignore` en cada PR.
- ❌ **NO desplegar a producción** sin que el sprint actual esté validado en local.

---

## 9. Cumplimiento legal — NO NEGOCIABLE

- Precios mostrados al cliente: siempre **con IVA incluido** (Ley General Defensa Consumidores)
- Footer obligatorio: aviso legal, política de privacidad, política de cookies, condiciones de venta, ODR link
- Cookies: consentimiento previo Google Analytics (Consent Mode v2)
- RGPD: política de privacidad debe listar todos los encargados de tratamiento (Supabase, Stripe, Vercel, Brevo, etc.)
- Reseñas (cuando se implementen): publicar todas las verificadas, no filtrar (Directiva Ómnibus)
- Devoluciones: 30 días desde recepción, gastos de devolución a cargo del cliente excepto defectuoso
- Garantía: 3 años legal EU (RDL 1/2007)

---

## 10. Workflow esperado

### Al inicio de cada sesión
1. Leer este archivo entero
2. Confirmar en qué sprint estamos (preguntar al usuario si no está claro)
3. Listar los cambios planeados ANTES de tocar código
4. Esperar confirmación

### Durante el trabajo
- Trabajar en pequeños incrementos
- Probar localmente con `npm run dev` después de cada cambio significativo
- NO hacer commits automáticamente — el usuario decide cuándo commitear

### Al cerrar una sesión
- Resumir qué se hizo
- Listar qué falta para cerrar el sprint
- Sugerir el siguiente paso

---

## 11. Lo que NO está en este sprint todavía

Estas funcionalidades existen en la visión del proyecto pero **NO se implementan ahora**:

- Probador IA (`/probador`) — solo mockup, no funcional aún
- AI Fitter en home — solo bloque visual
- Sistema de reseñas
- Email marketing (campañas Brevo)
- B2B
- Múltiples idiomas
- Multi-país (solo España peninsular inicialmente)

Si el usuario pide implementar algo de esta lista, **avisar** que estaba fuera del scope y confirmar antes de añadir.
