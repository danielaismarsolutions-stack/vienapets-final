import { Hero } from "./Hero";
import { CategoryRow } from "./CategoryRow";
import { PromoPackSection } from "./PromoPackSection";
import { ProbadorBlock } from "./ProbadorBlock";
import { ValueProps } from "./ValueProps";
import { ModelsSection } from "./ModelsSection";
import { StorySection } from "./StorySection";
import { MaterialsSection } from "./MaterialsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { InstagramStrip } from "./InstagramStrip";
import { SizeGuideTable } from "@/components/shared/SizeGuideTable";

// Composer del home. Variante "boutique" del legacy (única que se migra).
// Recibe `models` desde el Server Component padre (app/page.jsx) que los
// consulta en Supabase. heroStyle: "single" | "mosaic".
export function HomePage({ models = [], heroModelId = "capri", heroStyle = "single" }) {
  const heroModel = models.find((m) => m.id === heroModelId) || models[0] || null;

  return (
    <>
      <Hero model={heroModel} models={models} heroStyle={heroStyle} />
      {/* CategoryRow eliminado — la nav de categorías del hero es el único acceso */}
      <PromoPackSection models={models} />
      <SizeGuideTable variant="conjuntos" />
      <ProbadorBlock />
      <SizeGuideTable variant="probador" />
      <ValueProps />
      <ModelsSection models={models} />
      <StorySection />
      <MaterialsSection models={models} />
      <TestimonialsSection />
      <FAQSection />
      <InstagramStrip />
    </>
  );
}
