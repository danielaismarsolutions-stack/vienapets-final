// Viena Pets — shared UI components
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// ---------- ICONOS (minimalistas, trazo fino) ----------
const Icon = {
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
};

// ---------- CART CONTEXT (localStorage) ----------
const CartCtx = createContext(null);
function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vp_cart") || "[]"); }
    catch { return []; }
  });
  const [open, setOpen] = useState(false);
  useEffect(() => { localStorage.setItem("vp_cart", JSON.stringify(items)); }, [items]);

  const add = (item) => {
    setItems((prev) => {
      const cat = item.category || "unknown";
      const key = `${item.modelId}-${cat}-${item.size || ""}`;
      const existing = prev.find((p) => p.key === key);
      if (existing) return prev.map((p) => p.key === key ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...item, key, qty: 1 }];
    });
    setOpen(true);
  };
  const remove = (key) => setItems((prev) => prev.filter((p) => p.key !== key));
  const updateQty = (key, qty) => setItems((prev) => prev.map((p) => p.key === key ? { ...p, qty: Math.max(1, qty) } : p));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  // Lógica de descuento pack 10%: si en el carrito hay arnés + correa + portabolsas del mismo modelo,
  // se aplica un 10% sobre el subtotal de esas 3 piezas. El qty considerado es el mínimo de las 3.
  // Los items con category="conjunto" ya vienen con el precio descontado, no se cuentan aquí.
  const packDiscount = (() => {
    const byModel = {};
    items.forEach((it) => {
      if (!it.category || it.category === "conjunto") return;
      if (!byModel[it.modelId]) byModel[it.modelId] = {};
      byModel[it.modelId][it.category] = it;
    });
    let discount = 0;
    Object.values(byModel).forEach((g) => {
      if (g.harness && g.leash && g.bag) {
        const minQty = Math.min(g.harness.qty, g.leash.qty, g.bag.qty);
        const packSubtotal = (g.harness.price + g.leash.price + g.bag.price) * minQty;
        discount += packSubtotal * 0.1;
      }
    });
    return Math.round(discount * 100) / 100;
  })();

  const totalAfterDiscount = Math.round((subtotal - packDiscount) * 100) / 100;

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, count, subtotal, packDiscount, totalAfterDiscount, open, setOpen }}>
      {children}
    </CartCtx.Provider>
  );
}
const useCart = () => useContext(CartCtx);

// ---------- ROUTER SIMPLE (hash-based) ----------
const RouteCtx = createContext(null);
function RouteProvider({ children }) {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.replace("#", "") || "/";
    return h;
  });
  useEffect(() => {
    const on = () => {
      const h = window.location.hash.replace("#", "") || "/";
      setRoute(h);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const go = (path) => { window.location.hash = path; };
  return <RouteCtx.Provider value={{ route, go }}>{children}</RouteCtx.Provider>;
}
const useRoute = () => useContext(RouteCtx);

// ---------- RESPONSIVE HELPER ----------
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

// ---------- ANNOUNCEMENT BAR ----------
function AnnouncementBar() {
  return (
    <div style={{ background: "var(--vp-brown)", color: "var(--vp-paper)", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 400, padding: "9px 24px", textAlign: "center", height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
      Lleva el conjunto completo y ahorra un 10%
    </div>
  );
}

// ---------- NAVBAR ----------
function Navbar({ variant = "boutique" }) {
  const { go, route } = useRoute();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const onHome = route === "/";
  const transparent = onHome && !scrolled;

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: transparent ? "transparent" : "var(--vp-cream)",
      borderBottom: transparent ? "1px solid transparent" : "1px solid rgba(74,46,28,.12)",
      transition: "background .3s ease, border-color .3s ease",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "20px 40px", maxWidth: 1600, margin: "0 auto", gap: 24 }}>
        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <NavLink onClick={() => go("/tienda")} active={route.startsWith("/tienda")}>Tienda</NavLink>
          <NavLink onClick={() => go("/modelos")} active={route.startsWith("/modelos")}>Modelos</NavLink>
          <NavLink onClick={() => go("/historia")} active={route === "/historia"}>Historia</NavLink>
          <NavLink onClick={() => go("/cuidado")} active={route === "/cuidado"}>Cuidado</NavLink>
        </nav>

        <div style={{ textAlign: "center", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => go("/")}>
          <img src="assets/logo-viena-pets-oficial.png" alt="Viena Pets" style={{ height: 64, width: "auto", objectFit: "contain", display: "block", filter: "drop-shadow(0 1px 2px rgba(74,46,28,.06))" }} />
        </div>

        <div style={{ display: "flex", gap: 18, justifyContent: "flex-end", alignItems: "center", color: "var(--vp-brown)" }}>
          <Icon.Search style={{ width: 18, height: 18, cursor: "pointer" }} />
          <Icon.Heart style={{ width: 18, height: 18, cursor: "pointer" }} />
          <Icon.User style={{ width: 18, height: 18, cursor: "pointer" }} />
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setOpen(true)}>
            <Icon.Bag style={{ width: 18, height: 18 }} />
            {count > 0 && (
              <span style={{ position: "absolute", top: -6, right: -8, background: "var(--vp-brown)", color: "var(--vp-paper)", borderRadius: 999, fontSize: 9, width: 16, height: 16, display: "grid", placeItems: "center", fontWeight: 600 }}>{count}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ children, onClick, active }) {
  const activeColor = "var(--vp-olive-deep)";
  const baseColor = "var(--vp-brown)";
  return (
    <a onClick={onClick} style={{
      fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase",
      color: active ? activeColor : baseColor, cursor: "pointer", fontWeight: active ? 500 : 400,
      paddingBottom: 4,
      borderBottom: active ? `1px solid ${activeColor}` : "1px solid transparent",
      transition: "border-color .25s ease, color .25s ease",
    }} onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = activeColor}
       onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = active ? activeColor : "transparent"}>
      {children}
    </a>
  );
}

// ---------- FOOTER ----------
function Footer() {
  const { go } = useRoute();
  return (
    <footer style={{ background: "var(--vp-cream-soft)", color: "var(--vp-ink)", padding: "80px 40px 32px", marginTop: 80 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 60 }}>
        <div>
          <img src="assets/logo-viena-pets-oficial.png" alt="Viena Pets" style={{ height: 110, width: "auto", objectFit: "contain", display: "block", marginBottom: 24 }} />
          <p style={{ color: "var(--vp-ink-soft)", fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
            Arneses, correas y accesorios para perros. Diseños exclusivos diseñados en España, en ediciones limitadas.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 24, color: "var(--vp-brown)" }}>
            <Icon.Instagram style={{ width: 20, height: 20, cursor: "pointer" }} />
          </div>
        </div>

        <FooterCol title="Tienda" links={[
          { label: "Todos los arneses", to: "/tienda" },
          { label: "Modelo Capri", to: "/producto/capri" },
          { label: "Modelo Peachy", to: "/producto/peachy" },
          { label: "Modelo Daisy", to: "/producto/daisy" },
          { label: "Correas", to: "/tienda" },
        ]} go={go} />

        <FooterCol title="Marca" links={[
          { label: "Historia", to: "/historia" },
          { label: "Modelos", to: "/modelos" },
          { label: "Guía de tallas", to: "/guia-de-tallas" },
          { label: "Probador IA", to: "/probador" },
        ]} go={go} />

        <div>
          <div className="vp-eyebrow" style={{ marginBottom: 16 }}>Newsletter</div>
          <p style={{ fontSize: 13, color: "var(--vp-ink-soft)", lineHeight: 1.6, marginBottom: 16 }}>Historias, paseos y primeras miradas a cada colección.</p>
          <div style={{ display: "flex", borderBottom: "1px solid var(--vp-brown)" }}>
            <input placeholder="tu correo" style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "10px 0", fontSize: 13, color: "var(--vp-ink)" }} />
            <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--vp-brown)" }}>
              <Icon.Arrow style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "60px auto 0", paddingTop: 32, borderTop: "1px solid rgba(74,46,28,.15)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--vp-ink-muted)", letterSpacing: "0.1em", textTransform: "uppercase", flexWrap: "wrap", gap: 16 }}>
        <div>© 2026 Viena Pets · Madrid · Envío gratuito a partir de 45 €</div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <span style={{ cursor: "pointer" }}>Política de privacidad</span>
          <span style={{ cursor: "pointer" }}>Términos</span>
          <span style={{ cursor: "pointer" }}>Envíos</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, go }) {
  return (
    <div>
      <div className="vp-eyebrow" style={{ marginBottom: 16 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map((l) => (
          <li key={l.label}>
            <a onClick={() => go(l.to)} style={{ cursor: "pointer", fontSize: 14, color: "var(--vp-ink-soft)", fontFamily: "var(--font-body)" }}>{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- CART DRAWER ----------
function CartDrawer() {
  const { items, open, setOpen, updateQty, remove, subtotal, packDiscount, totalAfterDiscount } = useCart();
  const { go } = useRoute();
  return (
    <>
      {/* backdrop */}
      <div style={{
        position: "fixed", inset: 0, background: "rgba(42,29,18,.35)", backdropFilter: "blur(2px)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity .3s ease", zIndex: 90,
      }} onClick={() => setOpen(false)} />
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 440, maxWidth: "92vw",
        background: "var(--vp-cream)", zIndex: 100,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .4s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(42,29,18,.15)",
      }}>
        <div style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(74,46,28,.15)" }}>
          <div className="vp-eyebrow">Tu cesta · {items.length} {items.length === 1 ? "pieza" : "piezas"}</div>
          <Icon.Close style={{ width: 20, height: 20, cursor: "pointer", color: "var(--vp-brown)" }} onClick={() => setOpen(false)} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 28px" }}>
          {items.length === 0 ? (
            <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--vp-ink-muted)" }}>
              <Icon.Bag style={{ width: 48, height: 48, margin: "0 auto 24px", color: "var(--vp-brown)", opacity: .4 }} />
              <div className="vp-serif" style={{ fontSize: 22, color: "var(--vp-brown)", marginBottom: 10 }}>Tu cesta está vacía</div>
              <p style={{ fontSize: 14 }}>Empieza a explorar nuestros modelos favoritos.</p>
              <button className="vp-btn" style={{ marginTop: 24 }} onClick={() => { setOpen(false); go("/tienda"); }}>Ver la tienda</button>
            </div>
          ) : items.map((it) => (
            <div key={it.key} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, padding: "20px 0", borderBottom: "1px solid rgba(74,46,28,.1)" }}>
              <div style={{ width: 80, height: 80, background: it.swatch, backgroundImage: `url(${it.img})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
              <div>
                <div className="vp-serif" style={{ fontSize: 18, color: "var(--vp-brown)" }}>{it.name}</div>
                <div style={{ fontSize: 12, color: "var(--vp-ink-muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: ".1em" }}>{it.type}{it.size ? ` · Talla ${it.size}` : ""}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                  <QtyStepper qty={it.qty} onChange={(q) => updateQty(it.key, q)} />
                  <span style={{ fontSize: 11, color: "var(--vp-ink-muted)", textDecoration: "underline", cursor: "pointer" }} onClick={() => remove(it.key)}>Eliminar</span>
                </div>
              </div>
              <div className="vp-serif" style={{ fontSize: 16, color: "var(--vp-brown)" }}>€{(it.price * it.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "20px 28px 28px", borderTop: "1px solid rgba(74,46,28,.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color: "var(--vp-ink-muted)" }}>
              <span>Subtotal</span><span>€{subtotal.toFixed(2)}</span>
            </div>
            {packDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color: "var(--vp-olive-deep)" }}>
                <span>Descuento pack (-10%)</span><span>−€{packDiscount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, fontSize: 13, color: "var(--vp-ink-muted)" }}>
              <span>Envío</span><span style={{ fontSize: 12 }}>Se calcula en el siguiente paso</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>Total</span>
              <span className="vp-serif" style={{ fontSize: 20, color: "var(--vp-brown)" }}>€{totalAfterDiscount.toFixed(2)}</span>
            </div>
            <button className="vp-btn full" onClick={() => { setOpen(false); go("/checkout"); }}>Finalizar compra <Icon.Arrow style={{ width: 14, height: 14 }} /></button>
          </div>
        )}
      </aside>
    </>
  );
}

function QtyStepper({ qty, onChange }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid rgba(74,46,28,.3)", height: 30 }}>
      <button onClick={() => onChange(qty - 1)} style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", color: "var(--vp-brown)", display: "grid", placeItems: "center" }}>
        <Icon.Minus style={{ width: 12, height: 12 }} />
      </button>
      <span style={{ width: 28, textAlign: "center", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{qty}</span>
      <button onClick={() => onChange(qty + 1)} style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", color: "var(--vp-brown)", display: "grid", placeItems: "center" }}>
        <Icon.Plus style={{ width: 12, height: 12 }} />
      </button>
    </div>
  );
}

// ---------- VISUAL ELEMENT: Swatch del producto (SVG) ----------
// Renderiza el estampado de cada modelo como SVG para usar en cards sin foto real
function ModelSwatch({ model, style, radius = 0 }) {
  const id = `sw-${model.id}`;
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {model.id === "capri" && (
          <pattern id={id} x="0" y="0" width="28" height="200" patternUnits="userSpaceOnUse">
            <rect width="28" height="200" fill={model.hex.secondary} />
            <rect x="14" width="14" height="200" fill={model.hex.primary} />
          </pattern>
        )}
        {model.id === "peachy" && (
          <pattern id={id} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill={model.hex.primary} />
            <g fill={model.hex.secondary} transform="translate(25 25)">
              <path d="M0 -12 L3 -4 L12 -4 L5 2 L8 12 L0 6 L-8 12 L-5 2 L-12 -4 L-3 -4 Z" />
            </g>
            <g fill={model.hex.secondary} transform="translate(0 0)" opacity=".8">
              <path d="M0 -8 L2 -3 L8 -3 L3 1 L5 8 L0 4 L-5 8 L-3 1 L-8 -3 L-2 -3 Z" />
            </g>
            <g fill={model.hex.secondary} transform="translate(50 50)" opacity=".8">
              <path d="M0 -8 L2 -3 L8 -3 L3 1 L5 8 L0 4 L-5 8 L-3 1 L-8 -3 L-2 -3 Z" />
            </g>
          </pattern>
        )}
        {model.id === "daisy" && (
          <pattern id={id} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="28" height="28" fill={model.hex.primary} />
            <circle cx="14" cy="14" r="4" fill={model.hex.secondary} />
            <circle cx="0" cy="0" r="4" fill={model.hex.secondary} />
            <circle cx="28" cy="0" r="4" fill={model.hex.secondary} />
            <circle cx="0" cy="28" r="4" fill={model.hex.secondary} />
            <circle cx="28" cy="28" r="4" fill={model.hex.secondary} />
          </pattern>
        )}
      </defs>
      <rect width="200" height="200" fill={`url(#${id})`} rx={radius} />
    </svg>
  );
}

// ---------- PAGE TRANSITION WRAPPER ----------
function PageFade({ children, routeKey }) {
  return <div key={routeKey} style={{ animation: "vpFadeIn .5s ease" }}>{children}</div>;
}

// Export to window
Object.assign(window, { Icon, CartProvider, useCart, RouteProvider, useRoute, useIsMobile, AnnouncementBar, Navbar, Footer, CartDrawer, QtyStepper, ModelSwatch, PageFade });
