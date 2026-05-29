import { ShopPage } from "@/components/pages/ShopPage";
import { getAllProducts, getProductsByCategory } from "@/lib/queries/products";

export const revalidate = 60;

// Mapeo de la categoría legible en URL (?cat=arneses) a la del esquema
// Supabase (products.category). Coincide con CategoryRow / hero CTAs.
const CAT_URL_TO_DB = {
  conjuntos: "conjunto",
  arneses: "arnes",
  correas: "correa",
  portabolsas: "portabolsas",
};

export default async function Page({ searchParams }) {
  const catParam = typeof searchParams?.cat === "string" ? searchParams.cat : null;
  const dbCategory = catParam ? CAT_URL_TO_DB[catParam] ?? null : null;
  const products = dbCategory
    ? await getProductsByCategory(dbCategory)
    : await getAllProducts();
  return <ShopPage products={products} initialCategory={dbCategory} />;
}
