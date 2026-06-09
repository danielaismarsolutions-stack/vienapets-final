// Mapa slug → imágenes de producto. Fuente de verdad para fichas cuando
// la columna images de Supabase no tiene rutas /images/productos/.
// Las rutas apuntan a public/images/productos/ (webp).
//
// Orden de galería: recorte estudio principal → ángulos extra estudio → lifestyle perro.
// Alt text: "{Pieza} Viena Pets {Modelo} de {estampado}" (CLAUDE.md §2 y brief visual).

export const PRODUCT_IMAGES = {
  // ─── DAISY (lunares chocolate sobre mantequilla) ──────────────────────────

  "arnes-daisy": {
    main:    "/images/productos/daisy-arnes.webp",
    mainAlt: "Arnés Viena Pets Daisy de lunares chocolate sobre mantequilla",
    gallery: [
      { src: "/images/productos/daisy-arnes-2.webp",     alt: "Arnés Viena Pets Daisy de lunares chocolate sobre mantequilla, ángulo lateral" },
      { src: "/images/productos/daisy-main.webp",         alt: "Cavalier con arnés Daisy de lunares en el parque" },
      { src: "/images/productos/daisy-sentado.webp",      alt: "Cavalier sentado con arnés Daisy de lunares en el césped" },
    ],
  },
  "correa-daisy": {
    main:    "/images/productos/daisy-correa.webp",
    mainAlt: "Correa Viena Pets Daisy de lunares chocolate sobre mantequilla",
    gallery: [
      { src: "/images/productos/daisy-correa-2.webp",    alt: "Correa Viena Pets Daisy de lunares chocolate sobre mantequilla, detalle" },
      { src: "/images/productos/daisy-lifestyle-1.webp", alt: "Paseo con cavalier, correa y portabolsas Daisy de lunares" },
      { src: "/images/productos/daisy-lifestyle-2.webp", alt: "Cavalier en el césped con correa y portabolsas Daisy de lunares" },
    ],
  },
  "portabolsas-daisy": {
    main:    "/images/productos/daisy-portabolsas.webp",
    mainAlt: "Portabolsas Viena Pets Daisy de lunares chocolate sobre mantequilla",
    gallery: [
      { src: "/images/productos/daisy-portabolsas-2.webp", alt: "Portabolsas Viena Pets Daisy de lunares, ángulo posterior" },
      { src: "/images/productos/daisy-lifestyle-1.webp",   alt: "Paseo con cavalier, correa y portabolsas Daisy de lunares" },
      { src: "/images/productos/daisy-accion.webp",        alt: "Cavalier de pie apoyado en su dueña con arnés Daisy de lunares" },
    ],
  },
  "conjunto-daisy": {
    main:    "/images/productos/daisy-conjunto.webp",
    mainAlt: "Conjunto Viena Pets Daisy de lunares chocolate sobre mantequilla",
    gallery: [
      { src: "/images/productos/daisy-conjunto-2.webp",  alt: "Conjunto Viena Pets Daisy de lunares, ángulo lateral" },
      { src: "/images/productos/daisy-conjunto-3.webp",  alt: "Conjunto Viena Pets Daisy de lunares, vista completa" },
      { src: "/images/productos/daisy-lifestyle-1.webp", alt: "Paseo con cavalier usando el conjunto Daisy de lunares" },
    ],
  },

  // ─── CAPRI (rayas cobre y rosa empolvado) ─────────────────────────────────

  "arnes-capri": {
    main:    "/images/productos/capri-arnes.webp",
    mainAlt: "Arnés Viena Pets Capri de rayas cobre y rosa empolvado",
    gallery: [
      { src: "/images/productos/capri-arnes-2.webp",    alt: "Arnés Viena Pets Capri de rayas cobre y rosa empolvado, ángulo lateral" },
      { src: "/images/productos/capri-main.webp",        alt: "Dálmata sentado al sol con arnés Capri de rayas" },
      { src: "/images/productos/capri-lifestyle.webp",   alt: "Dálmata tumbado en un parque de Madrid con arnés Capri de rayas" },
    ],
  },
  "correa-capri": {
    main:    "/images/productos/capri-correa.webp",
    mainAlt: "Correa Viena Pets Capri de rayas cobre y rosa empolvado",
    gallery: [
      { src: "/images/productos/capri-lateral.webp",    alt: "Vista lateral del arnés Capri de rayas en un dálmata" },
      { src: "/images/productos/capri-detalle.webp",    alt: "Detalle del arnés Capri de rayas con etiqueta de piel Viena Pets" },
      { src: "/images/productos/capri-lifestyle.webp",  alt: "Dálmata tumbado en un parque de Madrid con arnés Capri de rayas" },
    ],
  },
  "portabolsas-capri": {
    main:    "/images/productos/capri-portabolsas.webp",
    mainAlt: "Portabolsas Viena Pets Capri de rayas cobre y rosa empolvado",
    gallery: [
      { src: "/images/productos/capri-portabolsas-2.webp", alt: "Portabolsas Viena Pets Capri de rayas, ángulo posterior" },
      { src: "/images/productos/capri-main.webp",           alt: "Dálmata sentado al sol con arnés Capri de rayas" },
      { src: "/images/productos/capri-detalle.webp",        alt: "Detalle del arnés Capri de rayas con etiqueta de piel Viena Pets" },
    ],
  },
  "conjunto-capri": {
    main:    "/images/productos/capri-conjunto.webp",
    mainAlt: "Conjunto Viena Pets Capri de rayas cobre y rosa empolvado",
    gallery: [
      { src: "/images/productos/capri-conjunto-2.webp",  alt: "Conjunto Viena Pets Capri de rayas, ángulo lateral" },
      { src: "/images/productos/capri-main.webp",         alt: "Dálmata sentado al sol con arnés Capri de rayas" },
      { src: "/images/productos/capri-lifestyle.webp",    alt: "Dálmata tumbado en un parque de Madrid con arnés Capri de rayas" },
    ],
  },

  // ─── PEACHY (soles naranja sobre rosa chicle) ─────────────────────────────

  "arnes-peachy": {
    main:    "/images/productos/peachy-arnes.webp",
    mainAlt: "Arnés Viena Pets Peachy de soles naranja sobre rosa chicle",
    gallery: [
      { src: "/images/productos/peachy-arnes-2.webp",   alt: "Arnés Viena Pets Peachy de soles naranja sobre rosa chicle, ángulo lateral" },
      { src: "/images/productos/peachy-arnes-3.webp",   alt: "Arnés Viena Pets Peachy de soles naranja sobre rosa chicle, detalle hebilla" },
      { src: "/images/productos/peachy-main.webp",       alt: "Galgo tumbado en el césped con arnés Peachy de soles" },
    ],
  },
  "correa-peachy": {
    main:    "/images/productos/peachy-correa.webp",
    mainAlt: "Correa Viena Pets Peachy de soles naranja sobre rosa chicle",
    gallery: [
      { src: "/images/productos/peachy-detalle.webp",   alt: "Detalle del arnés y la correa Peachy de soles Viena Pets" },
      { src: "/images/productos/peachy-marca.webp",     alt: "Primer plano del arnés Peachy con la etiqueta de piel Viena Pets" },
      { src: "/images/productos/peachy-lifestyle.webp", alt: "Galgo descansando bajo un árbol con arnés Peachy de soles" },
    ],
  },
  "portabolsas-peachy": {
    main:    "/images/productos/peachy-portabolsas.webp",
    mainAlt: "Portabolsas Viena Pets Peachy de soles naranja sobre rosa chicle",
    gallery: [
      { src: "/images/productos/peachy-portabolsas-2.webp", alt: "Portabolsas Viena Pets Peachy de soles, ángulo posterior" },
      { src: "/images/productos/peachy-main.webp",           alt: "Galgo tumbado en el césped con arnés Peachy de soles" },
      { src: "/images/productos/peachy-lifestyle.webp",      alt: "Galgo descansando bajo un árbol con arnés Peachy de soles" },
    ],
  },
  "conjunto-peachy": {
    main:    "/images/productos/peachy-conjunto.webp",
    mainAlt: "Conjunto Viena Pets Peachy de soles naranja sobre rosa chicle",
    gallery: [
      { src: "/images/productos/peachy-conjunto-2.webp",  alt: "Conjunto Viena Pets Peachy de soles, ángulo lateral" },
      { src: "/images/productos/peachy-conjunto-3.webp",  alt: "Conjunto Viena Pets Peachy de soles, vista completa" },
      { src: "/images/productos/peachy-lifestyle.webp",   alt: "Galgo descansando bajo un árbol con arnés Peachy de soles" },
    ],
  },
};

// Imágenes editoriales para secciones de la home y página de marca.
export const EDITORIAL_IMAGES = {
  grupoDuo1:        { src: "/images/editorial/grupo-duo-1.webp",        alt: "Dálmata y galgo juntos con arneses Viena Pets Capri y Peachy" },
  grupoDuo3:        { src: "/images/editorial/grupo-duo-3.webp",        alt: "Galgo y dálmata en un parque de Madrid con arneses Capri y Peachy" },
  grupoPortabolsas: { src: "/images/editorial/grupo-portabolsas.webp",  alt: "Dos portabolsas Viena Pets, Capri y Peachy, colgando de las correas" },
  grupoDuo2:        { src: "/images/editorial/grupo-duo-2.webp",        alt: "Galgo y dálmata de espaldas con arneses Viena Pets coordinados" },
};

// Imágenes de estudio por categoría (para tarjetas de sección en tienda/home).
// Se elige el estampado más vistoso por tipo.
export const CATEGORY_IMAGES = {
  conjunto:    { src: "/images/productos/daisy-conjunto.webp",    alt: "Conjunto Viena Pets Daisy de lunares chocolate" },
  arnes:       { src: "/images/productos/capri-arnes.webp",       alt: "Arnés Viena Pets Capri de rayas cobre y rosa" },
  correa:      { src: "/images/productos/peachy-correa.webp",     alt: "Correa Viena Pets Peachy de soles naranja sobre rosa" },
  portabolsas: { src: "/images/productos/daisy-portabolsas.webp", alt: "Portabolsas Viena Pets Daisy de lunares chocolate" },
};
