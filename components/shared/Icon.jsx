// Iconos minimalistas (trazo fino). Migrado de legacy/scripts/shared.jsx.
// JSX puro sin estado: utilizable tanto desde server como client components.

export const Icon = {
  Search: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>),
  Bag: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>),
  Heart: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>),
  User: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>),
  Menu: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M4 8h16M4 16h16"/></svg>),
  Close: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>),
  Arrow: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  ArrowLeft: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>),
  Plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  Minus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M5 12h14"/></svg>),
  Check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="m5 12 5 5 9-10"/></svg>),
  Star: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 3 2.5 6 6.5.6-5 4.4 1.6 6.5L12 17l-5.6 3.5L8 14 3 9.6l6.5-.6L12 3Z"/></svg>),
  Instagram: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="7" r=".8" fill="currentColor"/></svg>),
  Paw: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><ellipse cx="6" cy="10" rx="1.8" ry="2.4"/><ellipse cx="10" cy="7" rx="1.8" ry="2.4"/><ellipse cx="14" cy="7" rx="1.8" ry="2.4"/><ellipse cx="18" cy="10" rx="1.8" ry="2.4"/><path d="M12 12c-3 0-5 2.2-5 4.8C7 19 8.5 20 12 20s5-1 5-3.2c0-2.6-2-4.8-5-4.8Z"/></svg>),
  Globe: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16"/></svg>),
  Truck: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>),
  Leaf: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14ZM5 19l8-8"/></svg>),
  Scissors: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}><circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="m8 9 12 9M8 15l12-9"/></svg>),

  // CategorySet: tres cápsulas verticales idénticas en fila + línea base → "tres piezas de una colección"
  CategorySet: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="8" y="9" width="4" height="13" rx="1.2"/>
      <rect x="14" y="9" width="4" height="13" rx="1.2"/>
      <rect x="20" y="9" width="4" height="13" rx="1.2"/>
      <path d="M7 24 L25 24"/>
    </svg>
  ),

  // CategoryHarness: arnés visto de frente — arco de cuello (arriba), arco de pecho (abajo), correas laterales y punto central D-ring
  CategoryHarness: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M11 12 Q16 8.5 21 12"/>
      <path d="M8 24 Q16 20.5 24 24"/>
      <path d="M11 12 L8 24 M21 12 L24 24"/>
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),

  // CategoryLeash: empuñadura (rect redondeado, arriba-izq) → curva elegante → D-ring mosquetón (abajo-dcha)
  CategoryLeash: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="5.5" y="5" width="3" height="6" rx="1.5"/>
      <path d="M7 11 Q14 16 21 21"/>
      <path d="M21 27 L21 21 Q26 21 26 24 Q26 27 21 27"/>
    </svg>
  ),

  // CategoryBag: cilindro vertical (dispensador) con anilla de sujeción en la parte superior derecha
  CategoryBag: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <ellipse cx="16" cy="10" rx="4.5" ry="1.8"/>
      <path d="M11.5 10 L11.5 25 M20.5 10 L20.5 25"/>
      <path d="M11.5 25 Q11.5 27.5 16 27.5 Q20.5 27.5 20.5 25"/>
      <path d="M19.5 8.5 L19.5 5 Q19.5 4 21 4 Q22.5 4 22.5 5 L22.5 8.5"/>
    </svg>
  ),

  // CategoryAI: dos elipses perpendiculares cruzadas (esfera orbital / lente de análisis) + punto central — evoca visión mágica y análisis IA
  CategoryAI: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <ellipse cx="16" cy="16" rx="10" ry="3.5"/>
      <ellipse cx="16" cy="16" rx="3.5" ry="10"/>
      <circle cx="16" cy="16" r="1.3" fill="currentColor" stroke="none"/>
    </svg>
  ),
};
