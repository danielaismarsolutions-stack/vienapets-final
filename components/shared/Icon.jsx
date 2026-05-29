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

  CategorySet: (p) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="10" cy="11" r="3.5" />
      <circle cx="22" cy="11" r="3.5" />
      <path d="M10 14.5 Q16 22 22 14.5" />
      <circle cx="16" cy="22" r="2.5" />
      <path d="M16 19.5 V18" />
    </svg>
  ),

  CategoryHarness: (p) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 9 L12 7 L20 7 L25 9 L23 16 L9 16 Z" />
      <circle cx="16" cy="12" r="1.6" />
      <path d="M16 13.6 V17 M11 16 L11.5 23 M21 16 L20.5 23" />
      <rect x="10.5" y="22" width="3" height="2.2" rx="0.4" />
      <rect x="19.5" y="22" width="3" height="2.2" rx="0.4" />
    </svg>
  ),

  CategoryLeash: (p) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <ellipse cx="7" cy="11" rx="3" ry="4.5" />
      <path d="M10 11 Q15 11 17 16 Q19 21 24 21" />
      <path d="M24 17.5 L24 24.5" />
      <path d="M24 17.5 Q26.5 17.5 26.5 20 Q26.5 22 24.5 22.2" />
    </svg>
  ),

  CategoryBag: (p) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="11" y="7" width="10" height="15" rx="2" />
      <path d="M11 11 H21" />
      <circle cx="16" cy="9" r="0.6" fill="currentColor" />
      <path d="M13.5 22 L13 26 L19 26 L18.5 22" />
      <path d="M13.5 26 Q16 27 18.5 26" />
    </svg>
  ),

  CategoryAI: (p) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 18 Q5 14 8 13 L9 10 L11 13 L17 13 Q21 13 22 16 L24 16 L25 18 L24 22 L21 22 L20 24 L18 24 L18 22 L13 22 L13 24 L11 24 L10 22 L7 22 Q5 21 5 18 Z" />
      <circle cx="20" cy="17.5" r="0.6" fill="currentColor" />
      <path d="M25 8 L25.5 10 L27.5 10.5 L25.5 11 L25 13 L24.5 11 L22.5 10.5 L24.5 10 Z" />
    </svg>
  ),
};
