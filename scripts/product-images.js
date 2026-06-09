// Mapa slug → imágenes de producto. Fuente de verdad para fichas cuando
// la columna images de Supabase no tiene rutas /images/productos/.
// Las rutas apuntan a public/images/productos/ (webp).
// Alt texts conforme al brief visual (CLAUDE.md §2 — narrativa correcta).

export const PRODUCT_IMAGES = {
  "arnes-daisy": {
    main: "/images/productos/daisy-main.webp",
    mainAlt: "Cavalier sentado en un parque con arnés Viena Pets Daisy de lunares marrones sobre amarillo",
    gallery: [
      { src: "/images/productos/daisy-sentado.webp", alt: "Cavalier mirando hacia arriba con arnés Daisy de lunares en el césped" },
      { src: "/images/productos/daisy-detalle.webp", alt: "Detalle del arnés y la correa Daisy de lunares Viena Pets" },
      { src: "/images/productos/daisy-marca.webp",   alt: "Primer plano del arnés Daisy con la etiqueta de piel Viena Pets" },
    ],
  },
  "correa-daisy": {
    main: "/images/productos/daisy-lifestyle-1.webp",
    mainAlt: "Paseo con cavalier, correa y portabolsas Daisy de lunares",
    gallery: [
      { src: "/images/productos/daisy-lifestyle-2.webp", alt: "Cavalier en el césped con correa y portabolsas Daisy" },
      { src: "/images/productos/daisy-detalle.webp",     alt: "Detalle del arnés y la correa Daisy de lunares Viena Pets" },
      { src: "/images/productos/daisy-marca.webp",       alt: "Primer plano del arnés Daisy con la etiqueta de piel Viena Pets" },
    ],
  },
  "portabolsas-daisy": {
    main: "/images/productos/daisy-lifestyle-2.webp",
    mainAlt: "Cavalier en el césped con correa y portabolsas Daisy",
    gallery: [
      { src: "/images/productos/daisy-lifestyle-1.webp", alt: "Paseo con cavalier, correa y portabolsas Daisy de lunares" },
      { src: "/images/productos/daisy-accion.webp",      alt: "Cavalier de pie apoyado en su dueña con arnés Daisy" },
      { src: "/images/productos/daisy-detalle.webp",     alt: "Detalle del arnés y la correa Daisy de lunares Viena Pets" },
    ],
  },
  "conjunto-daisy": {
    main: "/images/productos/daisy-main.webp",
    mainAlt: "Cavalier sentado en un parque con arnés Viena Pets Daisy de lunares marrones sobre amarillo",
    gallery: [
      { src: "/images/productos/daisy-lifestyle-1.webp", alt: "Paseo con cavalier, correa y portabolsas Daisy de lunares" },
      { src: "/images/productos/daisy-lifestyle-2.webp", alt: "Cavalier en el césped con correa y portabolsas Daisy" },
      { src: "/images/productos/daisy-accion.webp",      alt: "Cavalier de pie apoyado en su dueña con arnés Daisy" },
    ],
  },

  "arnes-capri": {
    main: "/images/productos/capri-main.webp",
    mainAlt: "Dálmata sentado al sol con arnés Viena Pets Capri de rayas verdes y rosas",
    gallery: [
      { src: "/images/productos/capri-detalle.webp",  alt: "Detalle del arnés Capri de rayas con etiqueta de piel Viena Pets" },
      { src: "/images/productos/capri-lateral.webp",  alt: "Vista lateral del arnés Capri de rayas en un dálmata" },
      { src: "/images/productos/capri-lifestyle.webp", alt: "Dálmata tumbado en un parque de Madrid con arnés Capri de rayas" },
    ],
  },
  "correa-capri": {
    main: "/images/productos/capri-lifestyle.webp",
    mainAlt: "Dálmata tumbado en un parque de Madrid con arnés Capri de rayas",
    gallery: [
      { src: "/images/productos/capri-lateral.webp",  alt: "Vista lateral del arnés Capri de rayas en un dálmata" },
      { src: "/images/productos/capri-detalle.webp",  alt: "Detalle del arnés Capri de rayas con etiqueta de piel Viena Pets" },
      { src: "/images/productos/capri-main.webp",     alt: "Dálmata sentado al sol con arnés Viena Pets Capri de rayas verdes y rosas" },
    ],
  },
  "portabolsas-capri": {
    main: "/images/productos/capri-lifestyle.webp",
    mainAlt: "Dálmata tumbado en un parque de Madrid con arnés Capri de rayas",
    gallery: [
      { src: "/images/productos/capri-main.webp",    alt: "Dálmata sentado al sol con arnés Viena Pets Capri de rayas verdes y rosas" },
      { src: "/images/productos/capri-detalle.webp", alt: "Detalle del arnés Capri de rayas con etiqueta de piel Viena Pets" },
      { src: "/images/productos/capri-lateral.webp", alt: "Vista lateral del arnés Capri de rayas en un dálmata" },
    ],
  },
  "conjunto-capri": {
    main: "/images/productos/capri-main.webp",
    mainAlt: "Dálmata sentado al sol con arnés Viena Pets Capri de rayas verdes y rosas",
    gallery: [
      { src: "/images/productos/capri-detalle.webp",  alt: "Detalle del arnés Capri de rayas con etiqueta de piel Viena Pets" },
      { src: "/images/productos/capri-lateral.webp",  alt: "Vista lateral del arnés Capri de rayas en un dálmata" },
      { src: "/images/productos/capri-lifestyle.webp", alt: "Dálmata tumbado en un parque de Madrid con arnés Capri de rayas" },
    ],
  },

  "arnes-peachy": {
    main: "/images/productos/peachy-main.webp",
    mainAlt: "Galgo tumbado en el césped con arnés Viena Pets Peachy de soles rosa y naranja",
    gallery: [
      { src: "/images/productos/peachy-detalle.webp",  alt: "Detalle del arnés y la correa Peachy de soles Viena Pets" },
      { src: "/images/productos/peachy-marca.webp",    alt: "Primer plano del arnés Peachy con la etiqueta de piel Viena Pets" },
      { src: "/images/productos/peachy-lifestyle.webp", alt: "Galgo descansando bajo un árbol con arnés Peachy de soles" },
    ],
  },
  "correa-peachy": {
    main: "/images/productos/peachy-lifestyle.webp",
    mainAlt: "Galgo descansando bajo un árbol con arnés Peachy de soles",
    gallery: [
      { src: "/images/productos/peachy-detalle.webp", alt: "Detalle del arnés y la correa Peachy de soles Viena Pets" },
      { src: "/images/productos/peachy-marca.webp",   alt: "Primer plano del arnés Peachy con la etiqueta de piel Viena Pets" },
      { src: "/images/productos/peachy-main.webp",    alt: "Galgo tumbado en el césped con arnés Viena Pets Peachy de soles rosa y naranja" },
    ],
  },
  "portabolsas-peachy": {
    main: "/images/productos/peachy-lifestyle.webp",
    mainAlt: "Galgo descansando bajo un árbol con arnés Peachy de soles",
    gallery: [
      { src: "/images/productos/peachy-main.webp",   alt: "Galgo tumbado en el césped con arnés Viena Pets Peachy de soles rosa y naranja" },
      { src: "/images/productos/peachy-detalle.webp", alt: "Detalle del arnés y la correa Peachy de soles Viena Pets" },
      { src: "/images/productos/peachy-marca.webp",  alt: "Primer plano del arnés Peachy con la etiqueta de piel Viena Pets" },
    ],
  },
  "conjunto-peachy": {
    main: "/images/productos/peachy-main.webp",
    mainAlt: "Galgo tumbado en el césped con arnés Viena Pets Peachy de soles rosa y naranja",
    gallery: [
      { src: "/images/productos/peachy-detalle.webp",  alt: "Detalle del arnés y la correa Peachy de soles Viena Pets" },
      { src: "/images/productos/peachy-marca.webp",    alt: "Primer plano del arnés Peachy con la etiqueta de piel Viena Pets" },
      { src: "/images/productos/peachy-lifestyle.webp", alt: "Galgo descansando bajo un árbol con arnés Peachy de soles" },
    ],
  },
};

// Imágenes editoriales para secciones de la home y página de marca.
export const EDITORIAL_IMAGES = {
  // Hero secundario / Marca
  grupoDuo1:        { src: "/images/editorial/grupo-duo-1.webp",        alt: "Dálmata y galgo juntos con arneses Viena Pets Capri y Peachy" },
  grupoDuo3:        { src: "/images/editorial/grupo-duo-3.webp",        alt: "Galgo y dálmata en un parque de Madrid con arneses Capri y Peachy" },
  // Conjuntos / Portabolsas
  grupoPortabolsas: { src: "/images/editorial/grupo-portabolsas.webp",  alt: "Dos portabolsas Viena Pets, Capri y Peachy, colgando de las correas" },
  // Instagram strip (mix productos + editorial)
  grupoDuo2:        { src: "/images/editorial/grupo-duo-2.webp",        alt: "Galgo y dálmata de espaldas con arneses Viena Pets coordinados" },
};
