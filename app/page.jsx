import { HomePage } from "@/components/home/HomePage";
import { getModelsView } from "@/lib/queries/products";

// Sprint 2: el home pasa a leer de Supabase. revalidate=60 mantiene la cache
// fresca a los 60s sin renderizar siempre desde la BBDD.
export const revalidate = 60;

export default async function Page() {
  const models = await getModelsView();
  return <HomePage models={models} />;
}
