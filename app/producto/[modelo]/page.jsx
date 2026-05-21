import { notFound } from "next/navigation";
import { ProductPage } from "@/components/pages/ProductPage";
import { getAllProductSlugs, getProductWithVariants } from "@/lib/queries/products";

export const revalidate = 60;

// Conservamos el segmento `[modelo]` (Sprint 1) pero ahora contiene el slug
// del producto (p. ej. "arnes-capri", "conjunto-daisy"). Renombrar la carpeta
// rompería los enlaces ya migrados; mejor mantenerlo.
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ modelo: slug }));
}

export default async function Page({ params }) {
  const product = await getProductWithVariants(params.modelo);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
