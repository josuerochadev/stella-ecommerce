/* global React */
/* Stella Brand Motifs v3 — Grain + Noise + Orbits
   No clipart stars. Geometric, editorial, cinematic.
   Components: <GrainOverlay>, <OrbitField>, <CosmicGrid>, <AmbientGlow>, <CosmicDivider>
*/
const { useMemo, useRef, useEffect } = React;

/* ── GrainOverlay ─────────────────────────────────────────────
   SVG feTurbulence noise layered over any surface.
   Props: opacity (0–1, default .035), blend ("overlay"|"screen"|"multiply"), style */
function GrainOverlay({ opacity = 0.035, blend = "overlay", style, animated = false }) {
  const id = useMemo(() => `grain-${Math.random().toString(36).slice(2,7)}`, []);
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%",
        pointerEvents:"none", mixBlendMode: blend, opacity, ...style }}>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`}/>
      {animated && (
        <animate attributeName="opacity" values={`${opacity};${opacity*0.6};${opacity}`} dur="8s" repeatCount="indefinite"/>
      )}
    </svg>
  );
}

/* ── OrbitField ───────────────────────────────────────────────
   2–4 overlapping elliptical orbit rings. Geometric, no stars.
   Props: width, height, rings, color, accentColor, animated, style */
function OrbitField({ width="100%", height="100%", rings=3, color="rgba(174,201,255,0.08)",
  accentColor="#FFB347", animated=true, style, className }) {

  const orbits = useMemo(() => [
    { rx:42, ry:18, rot:-22, cx:"50%", cy:"50%", accent: true,  dotAngle: 38 },
    { rx:65, ry:28, rot: 12, cx:"50%", cy:"50%", accent: false, dotAngle: 210 },
    { rx:85, ry:38, rot:-8,  cx:"50%", cy:"50%", accent: false, dotAngle: 290 },
    { rx:110,ry:52, rot: 18, cx:"50%", cy:"50%", accent: false, dotAngle: 155 },
  ].slice(0, rings), [rings]);

  // Compute dot position from angle on ellipse
  const dotPos = (rx, ry, angleDeg) => {
    const a = angleDeg * Math.PI / 180;
    return { x: rx * Math.cos(a), y: ry * Math.sin(a) };
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      viewBox="-140 -70 280 140" preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ width, height, overflow:"visible", ...style }}>
      <defs>
        <filter id="orbit-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {orbits.map((o,i) => (
          <linearGradient key={`og-${i}`} id={`og-${i}`} gradientTransform={`rotate(${o.rot+90})`}>
            <stop offset="0%" stopColor={o.accent ? accentColor : color} stopOpacity="0.9"/>
            <stop offset="50%" stopColor={o.accent ? accentColor : color} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={o.accent ? accentColor : color} stopOpacity="0.6"/>
          </linearGradient>
        ))}
      </defs>

      {orbits.map((o, i) => {
        const dp = dotPos(o.rx, o.ry, o.dotAngle);
        return (
          <g key={i} transform={`rotate(${o.rot})`}>
            {/* Full ellipse (faint) */}
            <ellipse cx="0" cy="0" rx={o.rx} ry={o.ry}
              stroke={color} strokeWidth="0.4" fill="none" opacity="0.5"/>
            {/* Accent arc (top half, vivid) */}
            <path
              d={`M ${-o.rx} 0 A ${o.rx} ${o.ry} 0 0 1 ${o.rx} 0`}
              stroke={`url(#og-${i})`} strokeWidth={o.accent ? "0.9" : "0.5"}
              fill="none" strokeLinecap="round"
              filter={o.accent ? "url(#orbit-glow)" : undefined}/>
            {/* Moving dot on accent orbit only */}
            {o.accent && (
              <>
                <circle cx={dp.x} cy={dp.y} r="2.2" fill={accentColor} filter="url(#orbit-glow)">
                  {animated && (
                    <animateTransform attributeName="transform" type="rotate"
                      from={`0 0 0`} to={`360 0 0`} dur="18s" repeatCount="indefinite"
                      additive="sum"/>
                  )}
                </circle>
                <circle cx={dp.x} cy={dp.y} r="4.5" fill="none" stroke={accentColor}
                  strokeWidth="0.4" opacity="0.3">
                  {animated && (
                    <animateTransform attributeName="transform" type="rotate"
                      from={`0 0 0`} to={`360 0 0`} dur="18s" repeatCount="indefinite"
                      additive="sum"/>
                  )}
                </circle>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── CosmicGrid ───────────────────────────────────────────────
   Subtle perspective grid — editorial / data-map feel.
   Props: color, opacity, cols, rows, style */
function CosmicGrid({ color="rgba(174,201,255,0.06)", opacity=1, cols=12, rows=8, style, className }) {
  const lines = useMemo(() => {
    const h = [], v = [];
    for (let r=0; r<=rows; r++) h.push(r/rows);
    for (let c=0; c<=cols; c++) v.push(c/cols);
    return { h, v };
  }, [cols, rows]);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
      preserveAspectRatio="none" className={className}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%",
        pointerEvents:"none", opacity, ...style }}>
      {lines.h.map((y,i) => (
        <line key={`h${i}`} x1="0" y1={y*100} x2="100" y2={y*100}
          stroke={color} strokeWidth="0.4"/>
      ))}
      {lines.v.map((x,i) => (
        <line key={`v${i}`} x1={x*100} y1="0" x2={x*100} y2="100"
          stroke={color} strokeWidth="0.4"/>
      ))}
      {/* Cross markers at intersections (sparse) */}
      {[{x:25,y:25},{x:75,y:25},{x:50,y:50},{x:25,y:75},{x:75,y:75}].map((p,i)=>(
        <g key={`cross-${i}`}>
          <line x1={p.x-1.2} y1={p.y} x2={p.x+1.2} y2={p.y} stroke={color} strokeWidth="0.6" opacity="2"/>
          <line x1={p.x} y1={p.y-1.2} x2={p.x} y2={p.y+1.2} stroke={color} strokeWidth="0.6" opacity="2"/>
        </g>
      ))}
    </svg>
  );
}

/* ── AmbientGlow ──────────────────────────────────────────────
   Soft radial colour bleed — replaces garish gradients.
   Props: color, x, y, size, opacity, style */
function AmbientGlow({ color="#3D2A54", x="50%", y="50%", size="60%", opacity=0.6, style, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%",
        pointerEvents:"none", overflow:"hidden", ...style }}>
      <defs>
        <radialGradient id={`ag-${color.slice(1)}`} cx={x} cy={y} r={size} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity={opacity}/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#ag-${color.slice(1)})`}/>
    </svg>
  );
}

/* ── CosmicDivider ────────────────────────────────────────────
   Thin horizontal rule with orbit accent. Clean, no clipart. */
function CosmicDivider({ style, className, color="rgba(174,201,255,0.15)", accentColor="#FFB347" }) {
  return (
    <div className={className} style={{ display:"flex", alignItems:"center", gap:0, height:20, ...style }}>
      <div style={{ flex:1, height:"1px",
        background:`linear-gradient(to right, transparent, ${color} 30%, ${color} 70%, transparent)` }}/>
      <div style={{ width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, position:"relative" }}>
        <svg width="20" height="20" viewBox="-10 -10 20 20" fill="none">
          <ellipse rx="7" ry="4" stroke={accentColor} strokeWidth="0.7" opacity="0.4"/>
          <circle cx="5.5" cy="-2.8" r="1.5" fill={accentColor} opacity="0.8"/>
        </svg>
      </div>
      <div style={{ flex:1, height:"1px",
        background:`linear-gradient(to left, transparent, ${color} 30%, ${color} 70%, transparent)` }}/>
    </div>
  );
}

/* ── ScatteredDots ────────────────────────────────────────────
   Tiny dots — NOT stars, just texture. No twinkle animation. */
function ScatteredDots({ count=60, style, className }) {
  const dots = useMemo(() => Array.from({length:count},(_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    r: Math.random()*0.8+0.2,
    op: 0.08 + Math.random()*0.22,
    color: i%9===0 ? "#FFB347" : i%13===0 ? "#AEC9FF" : "white",
  })), [count]);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", ...style }}>
      {dots.map(d=><circle key={d.id} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity={d.op}/>)}
    </svg>
  );
}

Object.assign(window, { GrainOverlay, OrbitField, CosmicGrid, AmbientGlow, CosmicDivider, ScatteredDots });
