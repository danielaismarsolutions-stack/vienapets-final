// Viena Pets — shared data
const VP_MODELS = [
  {
    id: "capri",
    name: "Capri",
    subtitle: "Rayas cobre + rosa empolvado",
    description: "Inspirado en las sombrillas de la costa mediterránea. Rayas de autor sobre fondo claro, ribete cobre cálido y herrajes mate.",
    priceHarness: 58,
    priceLeash: 32,
    priceBag: 18,
    pantones: ["7510 C", "706 XGC"],
    colors: { primary: "var(--capri-green)", secondary: "var(--capri-pink)", deep: "var(--capri-green-deep)" },
    hex: { primary: "#B0844A", secondary: "#F0D4DC" },
    heroImg: "assets/capri-conjunto.jpeg",
    harnessImg: "assets/capri-arnes.jpeg",
    leashImg: "assets/capri-correa.jpeg",
    bagImg: "assets/capri-portabolsa.jpeg",
    materialsImg: "assets/materiales-capri-verde.jpeg",
    partsImg: "assets/herrajes-capri.png",
    moodImg: "assets/materiales-capri-verde.jpeg",
  },
  {
    id: "peachy",
    name: "Peachy",
    subtitle: "Soles naranja sobre rosa chicle",
    description: "Un estampado original de soles: optimismo en su forma más pura. Rosa chicle con contraste naranja y herrajes dorados.",
    priceHarness: 62,
    priceLeash: 34,
    priceBag: 20,
    pantones: ["1895 C", "1645 C"],
    colors: { primary: "var(--peachy-pink)", secondary: "var(--peachy-orange)", deep: "#C94E28" },
    hex: { primary: "#F2A9C4", secondary: "#E8653E" },
    heroImg: "assets/peachy-conjunto.jpeg",
    harnessImg: "assets/peachy-arnes.jpeg",
    leashImg: "assets/peachy-correa.jpeg",
    bagImg: "assets/peachy-portabolsa.png",
    materialsImg: "assets/materiales-peachy.jpeg",
    partsImg: "assets/herrajes-peachy.png",
    moodImg: "assets/materiales-peachy.jpeg",
  },
  {
    id: "daisy",
    name: "Daisy",
    subtitle: "Topos chocolate sobre mantequilla",
    description: "Un clásico renovado. Topos chocolate sobre un amarillo crema suave — evocación de los años 60 con la calidad de hoy.",
    priceHarness: 58,
    priceLeash: 32,
    priceBag: 18,
    pantones: ["7401 C", "4705 C"],
    colors: { primary: "var(--daisy-yellow)", secondary: "var(--daisy-brown)", deep: "#3D2513" },
    hex: { primary: "#F2E2A8", secondary: "#5C3A1E" },
    heroImg: "assets/daisy-conjunto.jpeg",
    harnessImg: "assets/daisy-arnes.jpeg",
    leashImg: "assets/daisy-correa.jpeg",
    bagImg: "assets/daisy-portabolsa.png",
    materialsImg: "assets/materiales-daisy.jpeg",
    partsImg: "assets/herrajes-daisy.png",
    moodImg: "assets/materiales-daisy.jpeg",
  },
];

const VP_SIZES = [
  { size: "XS", webbing: "2 cm", neck: "29–36 cm", chest: "36–48 cm" },
  { size: "S",  webbing: "2 cm", neck: "35–44 cm", chest: "41–54 cm" },
  { size: "M",  webbing: "2 cm", neck: "39–51 cm", chest: "46–61 cm" },
  { size: "L",  webbing: "2 cm", neck: "42–56 cm", chest: "57–83 cm" },
];

const VP_LEASH_SIZE = { webbing: "2 cm", length: "152 cm" };

// VP_MATERIALS: eliminado intencionalmente. El discurso de marca se centra en exclusividad de diseño, no en calidad de materiales.
const VP_MATERIALS = [];

const VP_HARDWARE = [
  { es: "Anilla D", en: "D-ring", note: "Para enganche de correa" },
  { es: "Anilla redonda", en: "O-ring", note: "Punto de ajuste frontal" },
  { es: "Regulador", en: "Slider / adjuster", note: "Ajuste de cuello y pecho" },
  { es: "Mosquetón", en: "Snap hook", note: "Giro 360° antienredos" },
  { es: "Hebilla rectangular", en: "Rectangular ring", note: "Distribución de carga" },
];

// VP_TESTIMONIALS: vacío hasta que existan reseñas verificadas tras el primer drop (Directiva Ómnibus).
const VP_TESTIMONIALS = [];

const VP_FAQ = [
  { q: "¿Cómo elijo la talla correcta?", a: "Mide el contorno del pecho de tu perro justo detrás de las patas delanteras y el cuello en su punto más ancho. Si quedas entre dos tallas, te recomendamos la mayor por comodidad." },
  { q: "¿Los arneses son ajustables?", a: "Sí. Cada arnés tiene cuatro puntos de ajuste (cuello y pecho a ambos lados) para adaptarse al 100% a tu perro." },
  { q: "¿Cómo se limpian?", a: "Lavado a mano con agua fría y jabón neutro. No usar secadora. Secar a la sombra extendido." },
  { q: "¿Hacéis envíos a toda Europa?", a: "Realizamos envíos a toda España. Para envíos a otros países de la UE, contáctanos por email y gestionamos el pedido manualmente." },
  { q: "¿Puedo devolver un producto?", a: "Tienes 15 días desde la recepción para devolver cualquier pieza sin estrenar. Los gastos de envío de la devolución corren a cargo del cliente, salvo en caso de producto defectuoso. El reembolso se realiza al método de pago original una vez recibida y revisada la pieza." },
  { q: "¿De dónde viene el nombre Viena?", a: "Viena es el nombre que Lucía eligió para su marca: evoca elegancia, detalle y un punto romántico atemporal." },
];

window.VP_MODELS = VP_MODELS;
window.VP_SIZES = VP_SIZES;
window.VP_LEASH_SIZE = VP_LEASH_SIZE;
window.VP_MATERIALS = VP_MATERIALS;
window.VP_HARDWARE = VP_HARDWARE;
window.VP_TESTIMONIALS = VP_TESTIMONIALS;
window.VP_FAQ = VP_FAQ;
