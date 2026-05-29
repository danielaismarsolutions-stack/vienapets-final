// Viena Pets — constantes estáticas de UI no migradas a Supabase.
// VP_MODELS vivía aquí en Sprint 1; en Sprint 2 se sustituyó por
// getModelsView() (lib/queries/products.js) + MODEL_META (lib/model-meta.js).

export const VP_SIZES = [
  { size: "XS", webbing: "2 cm", neck: "29–36 cm", chest: "36–48 cm" },
  { size: "S",  webbing: "2 cm", neck: "35–44 cm", chest: "41–54 cm" },
  { size: "M",  webbing: "2 cm", neck: "39–51 cm", chest: "46–61 cm" },
  { size: "L",  webbing: "2 cm", neck: "42–56 cm", chest: "57–83 cm" },
];

export const VP_LEASH_SIZE = { webbing: "2 cm", length: "152 cm" };

// VP_MATERIALS: vacío intencionalmente. El discurso de marca se centra en
// exclusividad de diseño, no en calidad de materiales (CLAUDE.md §2).
export const VP_MATERIALS = [];

export const VP_HARDWARE = [
  { es: "Anilla D", en: "D-ring", note: "Para enganche de correa" },
  { es: "Anilla redonda", en: "O-ring", note: "Punto de ajuste frontal" },
  { es: "Regulador", en: "Slider / adjuster", note: "Ajuste de cuello y pecho" },
  { es: "Mosquetón", en: "Snap hook", note: "Giro 360° antienredos" },
  { es: "Hebilla rectangular", en: "Rectangular ring", note: "Distribución de carga" },
];

// VP_TESTIMONIALS: vacío hasta que existan reseñas verificadas tras el primer
// drop (Directiva Ómnibus — no inventar reseñas).
export const VP_TESTIMONIALS = [];

export const VP_FAQ = [
  { q: "¿Cómo elijo la talla correcta?", a: "Mide el contorno del pecho de tu perro justo detrás de las patas delanteras y el cuello en su punto más ancho. Si quedas entre dos tallas, te recomendamos la mayor por comodidad." },
  { q: "¿Los arneses son ajustables?", a: "Sí. Cada arnés tiene cuatro puntos de ajuste (cuello y pecho a ambos lados) para adaptarse al 100% a tu perro." },
  { q: "¿Cómo se limpian?", a: "Lavado a mano con agua fría y jabón neutro. No usar secadora. Secar a la sombra extendido." },
  { q: "¿Hacéis envíos a toda Europa?", a: "Realizamos envíos a toda España. Para envíos a otros países de la UE, contáctanos por email y gestionamos el pedido manualmente." },
  { q: "¿Puedo devolver un producto?", a: "Tienes 15 días desde la recepción para devolver cualquier pieza sin estrenar. Los gastos de envío de la devolución corren a cargo del cliente, salvo en caso de producto defectuoso. El reembolso se realiza al método de pago original una vez recibida y revisada la pieza." },
  { q: "¿De dónde viene el nombre Viena?", a: "Viena es el nombre que Lucía eligió para su marca: evoca elegancia, detalle y un punto romántico atemporal." },
];
