// POST /api/checkout
// Crea una sesión de Stripe Checkout (hosted) a partir de los items del carrito.
//
// Seguridad (CLAUDE.md §6, §8): el cliente sólo envía variantId + cantidad
// (+ harnessSize en los conjuntos). El servidor revalida contra Supabase
// (service_role) la existencia de la variante, que tenga stripe_price_id, que
// el producto esté activo y que haya stock disponible (stock - stock_reserved).
// El precio y el envío se calculan aquí, nunca se confía en el importe del cliente.
//
// Conjuntos: se venden con el SKU del bundle (precio especial) pero NO tienen
// stock propio. Su disponibilidad y su descuento derivan de tres componentes del
// mismo modelo: arnés (de la talla elegida) + correa + portabolsas. Aquí se valida
// que esos componentes tengan stock y se escribe un manifiesto compacto
// (modelo:talla:cantidad) en la metadata de la sesión para que el webhook sepa
// qué arnés descontar (Stripe no puede transportar la talla en una line item de
// precio fijo).
//
// El descuento real de stock y la persistencia del pedido ocurren EXCLUSIVAMENTE
// en el webhook (checkout.session.completed), de forma atómica. La validación de
// aquí es una guarda de UX: la verdad transaccional es el WHERE stock >= qty de
// la RPC.
import { NextResponse } from "next/server";
import { getStripe, priceIdOf } from "@/lib/stripe/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { shippingCents } from "@/lib/cart/shipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const VALID_SIZES = ["XS", "S", "M", "L"];
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "La cesta está vacía." }, { status: 400 });
  }

  // Normaliza agrupando por (variantId, harnessSize): los conjuntos comparten el
  // mismo variantId del bundle, así que la talla del arnés separa las líneas.
  const entriesByKey = new Map();
  for (const it of items) {
    const id = it?.variantId;
    const qty = Math.floor(Number(it?.qty ?? it?.quantity ?? 0));
    const harnessSize = typeof it?.harnessSize === "string" ? it.harnessSize : null;
    if (!id || !Number.isFinite(qty) || qty < 1) {
      return NextResponse.json({ error: "Item de carrito inválido." }, { status: 400 });
    }
    const key = id + (harnessSize ? `::${harnessSize}` : "");
    if (!entriesByKey.has(key)) entriesByKey.set(key, { variantId: id, harnessSize, qty: 0 });
    entriesByKey.get(key).qty += qty;
  }
  const entries = [...entriesByKey.values()];
  const variantIds = [...new Set(entries.map((e) => e.variantId))];

  const supabase = getServiceSupabase();
  const { data: variants, error } = await supabase
    .from("variants")
    .select("id, sku, size, stripe_price_id, stripe_price_id_live, stock, stock_reserved, product:products(name, active, price_cents, category, model)")
    .in("id", variantIds);
  if (error) {
    return NextResponse.json({ error: "No se pudo validar la cesta." }, { status: 500 });
  }

  const byId = new Map((variants || []).map((v) => [v.id, v]));

  // Validación básica de cada entrada + recogida de modelos de conjunto.
  const conjModels = new Set();
  for (const e of entries) {
    const v = byId.get(e.variantId);
    if (!v) {
      return NextResponse.json({ error: "Un producto de tu cesta ya no está disponible." }, { status: 400 });
    }
    if (!v.product?.active) {
      return NextResponse.json({ error: `"${v.product?.name ?? "Producto"}" ya no está disponible.` }, { status: 400 });
    }
    if (!priceIdOf(v)) {
      return NextResponse.json({ error: `"${v.product?.name ?? "Producto"}" no está listo para la venta.` }, { status: 409 });
    }
    if (v.product?.category === "conjunto") {
      if (!VALID_SIZES.includes(e.harnessSize)) {
        return NextResponse.json({ error: `Selecciona una talla de arnés para "${v.product?.name}".` }, { status: 400 });
      }
      conjModels.add(v.product.model);
    }
  }

  // Demanda agregada por VARIANTE física (la que realmente descuenta el webhook).
  // Un mismo SKU puede recibir demanda de varias fuentes en la misma cesta: p. ej.
  // una correa Capri suelta y la correa incluida en un Conjunto Capri descuentan
  // ambas de COR-CAPRI. Validamos la SUMA contra el disponible (stock - reserved)
  // para impedir el oversell que antes solo afloraba en el webhook tras el pago.
  const demandByVariant = new Map(); // variantId -> unidades pedidas
  const availByVariant = new Map();  // variantId -> disponible
  const labelByVariant = new Map();  // variantId -> etiqueta legible para el error
  const addDemand = (variantId, qty) =>
    demandByVariant.set(variantId, (demandByVariant.get(variantId) || 0) + qty);

  // Disponibilidad y etiqueta de los productos sueltos (ya traídos en `byId`).
  for (const v of byId.values()) {
    availByVariant.set(v.id, Math.max(0, (v.stock ?? 0) - (v.stock_reserved ?? 0)));
    labelByVariant.set(v.id, `${v.product?.name ?? "Producto"}${v.size ? ` (talla ${v.size})` : ""}`);
  }

  // Componentes de los conjuntos presentes: modelo/talla → variante física (id),
  // con su disponible y etiqueta, igual que reconstruye el webhook al descontar.
  const harnessByKey = new Map(); // `${model}:${size}` -> variantId
  const leashByModel = new Map(); // model -> variantId
  const bagByModel = new Map();   // model -> variantId
  if (conjModels.size > 0) {
    const { data: comps, error: compErr } = await supabase
      .from("products")
      .select("model, category, variants(id, size, stock, stock_reserved)")
      .eq("active", true)
      .in("model", [...conjModels])
      .in("category", ["arnes", "correa", "portabolsas"]);
    if (compErr) {
      return NextResponse.json({ error: "No se pudo validar la cesta." }, { status: 500 });
    }
    for (const p of comps || []) {
      for (const cv of p.variants || []) {
        availByVariant.set(cv.id, Math.max(0, (cv.stock ?? 0) - (cv.stock_reserved ?? 0)));
        if (p.category === "arnes") {
          if (cv.size) {
            harnessByKey.set(`${p.model}:${cv.size}`, cv.id);
            labelByVariant.set(cv.id, `Arnés ${cap(p.model)} (talla ${cv.size})`);
          }
        } else if (p.category === "correa") {
          leashByModel.set(p.model, cv.id);
          labelByVariant.set(cv.id, `Correa ${cap(p.model)}`);
        } else if (p.category === "portabolsas") {
          bagByModel.set(p.model, cv.id);
          labelByVariant.set(cv.id, `Portabolsas ${cap(p.model)}`);
        }
      }
    }
  }

  // Acumula demanda: los productos sueltos sobre su propia variante; los conjuntos
  // sobre sus tres componentes (arnés de la talla + correa + portabolsas del modelo).
  for (const e of entries) {
    const v = byId.get(e.variantId);
    if (v.product?.category === "conjunto") {
      const m = v.product.model;
      const targets = [
        { id: harnessByKey.get(`${m}:${e.harnessSize}`), label: `Arnés ${cap(m)} (talla ${e.harnessSize})` },
        { id: leashByModel.get(m), label: `Correa ${cap(m)}` },
        { id: bagByModel.get(m), label: `Portabolsas ${cap(m)}` },
      ];
      for (const t of targets) {
        if (!t.id) {
          // Falta un componente activo en el catálogo: el conjunto no se puede formar.
          return NextResponse.json(
            { error: `No se puede completar el conjunto ${cap(m)}: falta ${t.label}.` },
            { status: 409 }
          );
        }
        addDemand(t.id, e.qty);
      }
    } else {
      addDemand(e.variantId, e.qty);
    }
  }

  // Validación única: ninguna variante puede tener demanda total > disponible.
  for (const [variantId, need] of demandByVariant) {
    const avail = availByVariant.get(variantId) ?? 0;
    if (need > avail) {
      const label = labelByVariant.get(variantId) ?? "un producto de tu cesta";
      return NextResponse.json(
        { error: `Stock insuficiente de ${label}. Disponibles: ${avail}, en tu cesta: ${need}.` },
        { status: 409 }
      );
    }
  }

  // Line items (mezclados por price: Stripe rechaza el mismo price repetido) +
  // subtotal + manifiesto de conjuntos. El stock ya se validó arriba de forma
  // agregada por variante física (sueltos + componentes de conjuntos).
  const qtyByPrice = new Map();
  let subtotal_cents = 0;
  const conjManifestParts = [];
  for (const e of entries) {
    const v = byId.get(e.variantId);
    if (v.product?.category === "conjunto") {
      conjManifestParts.push(`${v.product.model}:${e.harnessSize}:${e.qty}`);
    }
    const priceId = priceIdOf(v);
    qtyByPrice.set(priceId, (qtyByPrice.get(priceId) || 0) + e.qty);
    subtotal_cents += (v.product?.price_cents ?? 0) * e.qty;
  }
  const line_items = [...qtyByPrice].map(([price, quantity]) => ({ price, quantity }));
  const conjManifest = conjManifestParts.join(",");

  // Envío calculado en servidor: gratis a partir de 60 €, si no plano 5,90 €.
  const shipping_cents = shippingCents(subtotal_cents, true);

  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      locale: "es",
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["ES"] },
      phone_number_collection: { enabled: true },
      // Stripe Invoicing: cada pago genera una factura PDF automática con los
      // datos fiscales de Lucía (configurados en el Dashboard de Stripe).
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "Pedido VienaPets",
          footer: "Gracias por tu compra en VienaPets. Diseños exclusivos diseñados en España.",
          metadata: { source: "vienapets-web" },
        },
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipping_cents === 0 ? "Envío gratuito" : "Envío estándar",
            fixed_amount: { amount: shipping_cents, currency: "eur" },
            tax_behavior: "inclusive",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      success_url: `${SITE_URL}/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/carrito`,
      metadata: {
        // Resumen para depuración. El pedido real lo persiste el webhook.
        cart_summary: JSON.stringify(
          entries.map((e) => ({ v: e.variantId, q: e.qty, ...(e.harnessSize ? { s: e.harnessSize } : {}) }))
        ).slice(0, 490),
        // Manifiesto de conjuntos (modelo:talla:cantidad,...): el webhook lo lee
        // para descontar los componentes (arnés de la talla + correa + portabolsas).
        // Compacto a propósito para no superar el límite de 500 chars de Stripe.
        ...(conjManifest ? { conj: conjManifest.slice(0, 490) } : {}),
      },
    });
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    // Log server-side para diagnosticar (no se expone al cliente). Las causas
    // típicas: price_id de otro modo (test/live), Stripe Tax sin dirección de
    // origen, o invoice_creation sin datos fiscales en el Dashboard.
    console.error("[checkout] stripe.checkout.sessions.create falló:", err?.type, err?.code, err?.message);
    return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 502 });
  }
}
