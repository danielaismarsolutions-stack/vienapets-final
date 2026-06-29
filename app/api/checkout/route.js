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
import { getStripe } from "@/lib/stripe/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { shippingCents } from "@/lib/cart/shipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const VALID_SIZES = ["XS", "S", "M", "L"];

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
    .select("id, sku, size, stripe_price_id, stock, stock_reserved, product:products(name, active, price_cents, category, model)")
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
    if (!v.stripe_price_id) {
      return NextResponse.json({ error: `"${v.product?.name ?? "Producto"}" no está listo para la venta.` }, { status: 409 });
    }
    if (v.product?.category === "conjunto") {
      if (!VALID_SIZES.includes(e.harnessSize)) {
        return NextResponse.json({ error: `Selecciona una talla de arnés para "${v.product?.name}".` }, { status: 400 });
      }
      conjModels.add(v.product.model);
    }
  }

  // Disponibilidad de los componentes para los modelos de conjunto presentes.
  const harnessAvail = new Map(); // `${model}:${size}` -> disponible
  const leashAvail = new Map();   // model -> disponible
  const bagAvail = new Map();     // model -> disponible
  if (conjModels.size > 0) {
    const { data: comps, error: compErr } = await supabase
      .from("products")
      .select("model, category, variants(size, stock, stock_reserved)")
      .eq("active", true)
      .in("model", [...conjModels])
      .in("category", ["arnes", "correa", "portabolsas"]);
    if (compErr) {
      return NextResponse.json({ error: "No se pudo validar la cesta." }, { status: 500 });
    }
    for (const p of comps || []) {
      for (const cv of p.variants || []) {
        const avail = Math.max(0, (cv.stock ?? 0) - (cv.stock_reserved ?? 0));
        if (p.category === "arnes") {
          if (cv.size) harnessAvail.set(`${p.model}:${cv.size}`, avail);
        } else if (p.category === "correa") {
          leashAvail.set(p.model, avail);
        } else if (p.category === "portabolsas") {
          bagAvail.set(p.model, avail);
        }
      }
    }
  }

  // Demanda agregada de componentes por los conjuntos del carrito (la correa y
  // el portabolsas son comunes a todas las tallas de un mismo modelo).
  const demandHarness = new Map();
  const demandLeash = new Map();
  const demandBag = new Map();
  for (const e of entries) {
    const v = byId.get(e.variantId);
    if (v.product?.category !== "conjunto") continue;
    const m = v.product.model;
    const hk = `${m}:${e.harnessSize}`;
    demandHarness.set(hk, (demandHarness.get(hk) || 0) + e.qty);
    demandLeash.set(m, (demandLeash.get(m) || 0) + e.qty);
    demandBag.set(m, (demandBag.get(m) || 0) + e.qty);
  }
  for (const [hk, need] of demandHarness) {
    if ((harnessAvail.get(hk) ?? 0) < need) {
      const [m, s] = hk.split(":");
      return NextResponse.json(
        { error: `Stock insuficiente para el conjunto ${m} (arnés talla ${s}).` },
        { status: 409 }
      );
    }
  }
  for (const [m, need] of demandLeash) {
    if ((leashAvail.get(m) ?? 0) < need) {
      return NextResponse.json({ error: `Stock insuficiente para el conjunto ${m} (correa).` }, { status: 409 });
    }
  }
  for (const [m, need] of demandBag) {
    if ((bagAvail.get(m) ?? 0) < need) {
      return NextResponse.json({ error: `Stock insuficiente para el conjunto ${m} (portabolsas).` }, { status: 409 });
    }
  }

  // Line items (mezclados por price: Stripe rechaza el mismo price repetido) +
  // subtotal + manifiesto de conjuntos. Los productos sueltos validan su propio
  // stock; los conjuntos ya se validaron por componentes arriba.
  const qtyByPrice = new Map();
  let subtotal_cents = 0;
  const conjManifestParts = [];
  for (const e of entries) {
    const v = byId.get(e.variantId);
    if (v.product?.category === "conjunto") {
      conjManifestParts.push(`${v.product.model}:${e.harnessSize}:${e.qty}`);
    } else {
      const available = Math.max(0, (v.stock ?? 0) - (v.stock_reserved ?? 0));
      if (available < e.qty) {
        return NextResponse.json(
          { error: `Stock insuficiente de "${v.product?.name}"${v.size ? ` (talla ${v.size})` : ""}. Quedan ${available}.` },
          { status: 409 }
        );
      }
    }
    qtyByPrice.set(v.stripe_price_id, (qtyByPrice.get(v.stripe_price_id) || 0) + e.qty);
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
    return NextResponse.json({ error: "No se pudo iniciar el pago." }, { status: 502 });
  }
}
