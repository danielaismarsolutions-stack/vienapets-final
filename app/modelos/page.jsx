import { ModelsPage } from "@/components/pages/ModelsPage";
import { getModelsView } from "@/lib/queries/products";

export const revalidate = 60;

export default async function Page() {
  const models = await getModelsView();
  return <ModelsPage models={models} />;
}
