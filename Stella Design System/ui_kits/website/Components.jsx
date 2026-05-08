/* global React */
/* Stella UI Kit v3 — Components
   Lucide icons, refined tokens, scroll-aware interactions
*/
const { useState, useEffect, useRef } = React;

/* ── Icons (Lucide stroke) ───────────────────────────────────── */
const ICONS = {
  home:       `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  search:     `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
  store:      `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
  cart:       `<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>`,
  heart:      `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
  user:       `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  eye:        `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
  trash:      `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>`,
  arrowLeft:  `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`,
  arrowRight: `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
  arrowDown:  `<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>`,
  plus:       `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  check:      `<polyline points="20 6 9 12 4 10"/>`,
  x:          `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  star:       `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  package:    `<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>`,
  creditCard: `<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
  award:      `<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`,
  download:   `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  lock:       `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  mail:       `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  filter:     `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>`,
  grid:       `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>`,
  menu:       `<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>`,
  sparkles:   `<path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/>`,
};

function Icon({ name, size=18, stroke="currentColor", strokeWidth=1.6, style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink:0, ...style }} className={className}
      dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }}
    />
  );
}

/* ── useScrollY ──────────────────────────────────────────────── */
function useScrollY(ref) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const el = ref?.current || window;
    const onScroll = () => setY(ref?.current ? ref.current.scrollTop : window.scrollY);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref]);
  return y;
}

/* ── useFadeIn (intersection observer) ──────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Reveal wrapper ─────────────────────────────────────────── */
function Reveal({ children, delay=0, y=28, style }) {
  const [ref, visible] = useFadeIn(0.12);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

/* ── Button ──────────────────────────────────────────────────── */
function Btn({ children, variant="primary", size="md", onClick, disabled, fullWidth, style, icon }) {
  const [pressed, setPressed] = useState(false);
  const sz = { sm:{ p:"5px 14px", fs:12 }, md:{ p:"9px 20px", fs:14 }, lg:{ p:"13px 28px", fs:16 } }[size];

  const styles = {
    primary: {
      bg: "#FFB347", color: "#1a0f28", hoverBg: "#FF9F1A", border: "none",
      shadow: "0 0 0 1px rgba(255,179,71,0.3)",
      hoverShadow: "0 8px 24px -4px rgba(255,179,71,0.4), 0 0 0 1px rgba(255,179,71,0.4)",
    },
    secondary: {
      bg: "transparent", color: "#AEC9FF", hoverBg: "rgba(174,201,255,0.06)",
      border: "1px solid rgba(174,201,255,0.2)",
      shadow: "none", hoverShadow: "0 0 0 1px rgba(174,201,255,0.3)",
    },
    ghost: {
      bg: "transparent", color: "rgba(174,201,255,0.6)", hoverBg: "rgba(174,201,255,0.06)",
      border: "none", shadow: "none", hoverShadow: "none",
    },
    danger: {
      bg: "rgba(220,38,38,0.12)", color: "#f87171", hoverBg: "rgba(220,38,38,0.2)",
      border: "1px solid rgba(220,38,38,0.2)", shadow: "none", hoverShadow: "none",
    },
  };
  const [over, setOver] = useState(false);
  const s = styles[variant] || styles.primary;

  return (
    <button disabled={disabled} onClick={onClick}
      onMouseEnter={() => setOver(true)} onMouseLeave={() => { setOver(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 7, fontFamily: "'Bebas Neue', sans-serif",
        letterSpacing: ".06em", lineHeight: 1,
        padding: sz.p, fontSize: sz.fs,
        borderRadius: 5, border: s.border || "none",
        background: over && !disabled ? s.hoverBg : s.bg,
        color: s.color,
        boxShadow: over && !disabled ? s.hoverShadow : s.shadow,
        transform: pressed ? "scale(0.97)" : over && !disabled ? "translateY(-1px)" : "none",
        transition: "all 180ms cubic-bezier(0.16,1,0.3,1)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        width: fullWidth ? "100%" : "auto",
        ...style,
      }}>
      {icon && <Icon name={icon} size={sz.fs + 2}/>}
      {children}
    </button>
  );
}

/* ── Input ───────────────────────────────────────────────────── */
function Input({ label, placeholder, type="text", value, onChange, error, icon, style }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, ...style }}>
      {label && <label style={{ fontFamily:"'Roboto',sans-serif", fontSize:11,
        letterSpacing:".08em", textTransform:"uppercase",
        color: focused ? "rgba(174,201,255,0.8)" : "rgba(174,201,255,0.45)",
        transition:"color 200ms" }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {icon && <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
          color:"rgba(174,201,255,0.3)", pointerEvents:"none" }}><Icon name={icon} size={15}/></div>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width:"100%", padding: icon ? "11px 12px 11px 38px" : "11px 14px",
            background: focused ? "rgba(61,42,84,0.6)" : "rgba(30,19,38,0.8)",
            color:"#AEC9FF", fontFamily:"'Roboto',sans-serif", fontSize:14,
            border: error ? "1px solid rgba(248,113,113,0.4)" : focused ? "1px solid rgba(255,179,71,0.4)" : "1px solid rgba(174,201,255,0.1)",
            borderRadius:5, outline:"none",
            boxShadow: focused ? "0 0 0 3px rgba(255,179,71,0.08)" : "none",
            transition:"all 200ms ease", boxSizing:"border-box",
          }}
        />
      </div>
      {error && <span style={{ fontSize:11, color:"#f87171", fontFamily:"'Roboto',sans-serif" }}>{error}</span>}
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────── */
function Header({ route, go, cartCount=0, wishCount=0, scrollY=0 }) {
  const scrolled = scrollY > 40;
  const NavLink = ({ to, icon, badge }) => {
    const [over, setOver] = useState(false);
    return (
      <button onClick={() => go(to)}
        onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)}
        style={{ background:"none", border:"none", cursor:"pointer", position:"relative",
          color: over ? "#fff" : "rgba(174,201,255,0.7)",
          transition:"color 180ms", padding:"4px 2px" }}>
        <Icon name={icon} size={17} stroke="currentColor"/>
        {badge > 0 && (
          <span style={{ position:"absolute", top:-5, right:-6,
            background:"#FFB347", color:"#1a0f28",
            borderRadius:"50%", width:14, height:14, fontSize:8, fontWeight:700,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Roboto',sans-serif" }}>{badge}</span>
        )}
      </button>
    );
  };

  return (
    <header style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      height:52,
      background: scrolled
        ? "rgba(10,6,18,0.88)"
        : "transparent",
      backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
      borderBottom: scrolled ? "1px solid rgba(174,201,255,0.06)" : "1px solid transparent",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 40px",
      transition:"background 300ms ease, border-color 300ms ease, backdrop-filter 300ms ease",
    }}>
      {/* Logo / nav left */}
      <div style={{ display:"flex", alignItems:"center", gap:20 }}>
        <button onClick={() => go("home")} style={{ background:"none", border:"none",
          cursor:"pointer", padding:0, display:"flex", alignItems:"center" }}>
          <img src="../../assets/logo/wordmark-compact.svg" alt="Stella"
            style={{ height:28, width:"auto", opacity: scrolled ? 0.95 : 0 ,
              transition:"opacity 300ms" }}/>
          {!scrolled && <span style={{ fontFamily:"'Dela Gothic One',serif", fontSize:20,
            color:"rgba(232,222,255,0.9)", letterSpacing:"-0.5px" }}>Stella</span>}
        </button>
      </div>

      {/* Nav right */}
      <nav style={{ display:"flex", alignItems:"center", gap:20 }}>
        <NavLink to="catalog" icon="store"/>
        <NavLink to="cart" icon="cart" badge={cartCount}/>
        <NavLink to="wishlist" icon="heart" badge={wishCount}/>
        <NavLink to="profile" icon="user"/>
      </nav>
    </header>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ padding:"48px 40px 32px", borderTop:"1px solid rgba(174,201,255,0.06)",
      marginTop:80 }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"flex",
        justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:24 }}>
        <div>
          <img src="../../assets/logo/wordmark-compact.svg" alt="Stella"
            style={{ height:32, width:"auto", opacity:0.7, marginBottom:12 }}/>
          <p style={{ fontFamily:"'Roboto',sans-serif", fontSize:12,
            color:"rgba(174,201,255,0.35)", maxWidth:320, lineHeight:1.7, margin:0 }}>
            Adoptez une étoile. Personnalisez-la. Faites-en un cadeau inoubliable.
          </p>
        </div>
        <div style={{ display:"flex", gap:24 }}>
          {["FAQ","Contact","À propos","Mentions légales"].map(l => (
            <span key={l} style={{ fontFamily:"'Roboto',sans-serif", fontSize:12,
              color:"rgba(174,201,255,0.4)", cursor:"pointer",
              letterSpacing:".04em" }}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:1100, margin:"24px auto 0",
        borderTop:"1px solid rgba(174,201,255,0.04)", paddingTop:20,
        fontFamily:"'Roboto',sans-serif", fontSize:11, color:"rgba(174,201,255,0.2)",
        letterSpacing:".04em" }}>
        © 2025 Stella — Tous droits réservés
      </div>
    </footer>
  );
}

/* ── Shell ───────────────────────────────────────────────────── */
function Shell({ children, route, go, cart, wish }) {
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", h, { passive:true });
    return () => el.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ height:"100vh", overflow:"hidden",
      background:"#080610", color:"#AEC9FF",
      fontFamily:"'Roboto',sans-serif", display:"flex", flexDirection:"column" }}>
      <Header route={route} go={go} cartCount={cart.length} wishCount={wish.length} scrollY={scrollY}/>
      <div ref={scrollRef} style={{ flex:1, overflowY:"auto", position:"relative" }}>
        {children}
        <Footer/>
      </div>
    </div>
  );
}

/* ── StarCard v3 ─────────────────────────────────────────────── */
function StarCard({ star, onOpen, onAdd, onWish, inCart, inWish, layout="grid" }) {
  const [over, setOver] = useState(false);
  const isHoriz = layout === "horizontal";

  return (
    <div onMouseEnter={() => setOver(true)} onMouseLeave={() => setOver(false)}
      style={{
        background: over ? "rgba(42,26,62,0.9)" : "rgba(20,12,32,0.8)",
        border: `1px solid ${over ? "rgba(255,179,71,0.25)" : "rgba(174,201,255,0.07)"}`,
        borderRadius:8, overflow:"hidden",
        display:"flex", flexDirection: isHoriz ? "row" : "column",
        transform: over ? "translateY(-3px)" : "none",
        boxShadow: over ? "0 16px 32px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,179,71,0.15)" : "0 4px 12px -4px rgba(0,0,0,0.4)",
        transition:"all 280ms cubic-bezier(0.16,1,0.3,1)",
        cursor:"pointer",
      }}>
      {/* Image */}
      <div style={{ position:"relative", overflow:"hidden",
        flexShrink:0,
        width: isHoriz ? 100 : "100%",
        height: isHoriz ? 100 : 190 }}>
        <img src={star.image} alt={star.name} style={{
          width:"100%", height:"100%", objectFit:"cover", display:"block",
          transform: over ? "scale(1.04)" : "scale(1)",
          transition:"transform 600ms cubic-bezier(0.16,1,0.3,1)",
          filter: over ? "brightness(0.85)" : "brightness(0.75) saturate(0.9)",
        }}/>
        {/* Overlay gradient */}
        {!isHoriz && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80,
          background:"linear-gradient(to top, rgba(8,6,16,0.9), transparent)" }}/>}
        {inWish && (
          <div style={{ position:"absolute", top:8, right:8,
            color:"#FFB347" }}>
            <Icon name="heart" size={14} stroke="#FFB347" style={{ fill:"#FFB347" }}/>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: isHoriz ? "12px 14px" : "14px 16px",
        display:"flex", flexDirection:"column", gap: isHoriz ? 4 : 6, flex:1 }}>
        <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10,
          letterSpacing:".1em", textTransform:"uppercase",
          color:"rgba(174,201,255,0.4)" }}>{star.constellation}</div>
        <div style={{ fontFamily:"'Dela Gothic One',serif",
          fontSize: isHoriz ? 16 : 19, color:"#E8DEFF", lineHeight:1.1 }}>{star.name}</div>
        {!isHoriz && (
          <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:12,
            color:"rgba(174,201,255,0.55)", lineHeight:1.6, flex:1 }}>{star.description}</div>
        )}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop: isHoriz ? 4 : 8 }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize: isHoriz ? 16 : 20,
            color:"#FFB347", letterSpacing:".04em" }}>{star.price} €</span>
          <div style={{ display:"flex", gap:4 }}>
            <Btn size="sm" variant="ghost" onClick={() => onOpen && onOpen(star)}><Icon name="eye" size={13}/></Btn>
            <Btn size="sm" disabled={inCart} onClick={() => onAdd && onAdd(star)}><Icon name="cart" size={13}/></Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Btn, Input, Header, Footer, Shell, StarCard, Reveal, useScrollY, useFadeIn, ICONS });
