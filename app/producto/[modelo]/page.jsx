import { ProductPage } from "@/components/pages/ProductPage";
import { VP_MODELS } from "@/lib/data";

export function generateStaticParams() {
  return VP_MODELS.map((m) => ({ modelo: m.id }));
}

export default function Page({ params }) {
  return <ProductPage modelId={params.modelo} />;
}
