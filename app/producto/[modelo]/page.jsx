import { notFound } from "next/navigation";
import { ProductPage } from "@/components/pages/ProductPage";
import { getProductWithVariants } from "@/lib/queries/products";

// Stock en tiempo real: la ficha se renderiza dinámicamente en cada visita.
// Antes usaba ISR (revalidate=60), que servía hasta 60 s de stock obsoleto y
// permitía añadir a la cesta una talla de conjunto ya agotada (derivada del
// stock de sus componentes); el error solo aparecía al pagar. Render dinámico
// para que el selector refleje siempre la disponibilidad real.
//
// Nota: se retiró generateStaticParams. En Next 14 ese hook fuerza el prerender
// estático de la ruta y prevalece sobre force-dynamic/revalidate, lo que volvería
// a congelar el stock. Para una ruta dinámica no aporta nada: los slugs válidos
// se resuelven en cada request y los inexistentes caen en notFound().
export const dynamic = "force-dynamic";

// Conservamos el segmento `[modelo]` (Sprint 1) pero ahora contiene el slug
// del producto (p. ej. "arnes-capri", "conjunto-daisy"). Renombrar la carpeta
// rompería los enlaces ya migrados; mejor mantenerlo.
export default async function Page({ params }) {
  const product = await getProductWithVariants(params.modelo);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
