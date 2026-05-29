// Metadatos de diseño por modelo — NO viven en Supabase porque son constantes
// del sistema visual de la marca (CLAUDE.md §3), no datos editables por Lucía.
//
// Las queries de productos (lib/queries/products.js) enriquecen cada fila de
// `products` con estos metadatos vía `model`. Si el producto no tiene modelo
// (caso teórico), el enriquecimiento devuelve `null` para estos campos.

export const MODEL_META = {
  capri: {
    subtitle: "Rayas cobre + rosa empolvado",
    pantones: ["7510 C", "706 XGC"],
    hex: { primary: "#B0844A", secondary: "#F0D4DC" },
    heroImg: "/assets/capri-conjunto.jpeg",
    harnessImg: "/assets/capri-arnes.jpeg",
    leashImg: "/assets/capri-correa.jpeg",
    bagImg: "/assets/capri-portabolsa.jpeg",
    partsImg: "/assets/herrajes-capri.png",
    materialsImg: "/assets/materiales-capri-verde.jpeg",
    moodImg: "/assets/materiales-capri-verde.jpeg",
  },
  peachy: {
    subtitle: "Soles naranja sobre rosa chicle",
    pantones: ["1895 C", "1645 C"],
    hex: { primary: "#F2A9C4", secondary: "#E8653E" },
    heroImg: "/assets/peachy-conjunto.jpeg",
    harnessImg: "/assets/peachy-arnes.jpeg",
    leashImg: "/assets/peachy-correa.jpeg",
    bagImg: "/assets/peachy-portabolsa.png",
    partsImg: "/assets/herrajes-peachy.png",
    materialsImg: "/assets/materiales-peachy.jpeg",
    moodImg: "/assets/materiales-peachy.jpeg",
  },
  daisy: {
    subtitle: "Topos chocolate sobre mantequilla",
    pantones: ["7401 C", "4705 C"],
    hex: { primary: "#F2E2A8", secondary: "#5C3A1E" },
    heroImg: "/assets/daisy-conjunto.jpeg",
    harnessImg: "/assets/daisy-arnes.jpeg",
    leashImg: "/assets/daisy-correa.jpeg",
    bagImg: "/assets/daisy-portabolsa.png",
    partsImg: "/assets/herrajes-daisy.png",
    materialsImg: "/assets/materiales-daisy.jpeg",
    moodImg: "/assets/materiales-daisy.jpeg",
  },
};

export function getModelMeta(modelId) {
  if (!modelId) return null;
  return MODEL_META[modelId] ?? null;
}
