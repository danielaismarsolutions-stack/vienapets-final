import { VP_MODELS } from "@/lib/data";
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

// Composer del home. Variante "boutique" del legacy (única que se migra).
// heroStyle: "single" | "mosaic" (default: single).
export function HomePage({ heroModelId = "capri", heroStyle = "single" } = {}) {
  const model = VP_MODELS.find((m) => m.id === heroModelId) || VP_MODELS[0];

  return (
    <>
      <Hero model={model} heroStyle={heroStyle} />
      <CategoryRow />
      <PromoPackSection />
      <ProbadorBlock />
      <ValueProps />
      <ModelsSection />
      <StorySection />
      <MaterialsSection />
      <TestimonialsSection />
      <FAQSection />
      <InstagramStrip />
    </>
  );
}
