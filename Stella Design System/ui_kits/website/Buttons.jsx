/* global React */
function Btn({ children, variant = "default", onClick, style }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".06em", fontSize: 16,
    padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer",
    transition: "transform 500ms ease, background 200ms ease, color 200ms ease, box-shadow 300ms ease",
    ...style,
  };
  const variants = {
    default: { background: "#FFB347", color: "#3D2A54" },
    outline: { background: "transparent", color: "#AEC9FF", border: "2px solid #3D2A54" },
    ghost:   { background: "transparent", color: "#AEC9FF" },
    danger:  { background: "#dc2626", color: "#fff" },
  };
  const hover = {
    default: { background: "#3D2A54", color: "#AEC9FF", transform: "scale(1.05)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / .3)" },
    outline: { background: "#3D2A54", color: "#fff" },
    ghost:   { background: "rgba(61,42,84,.5)" },
    danger:  { background: "#b91c1c" },
  };
  const [over, setOver] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
      style={{ ...base, ...variants[variant], ...(over ? hover[variant] : {}) }}
    >{children}</button>
  );
}

function FilterChip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'Roboto Slab', serif", fontSize: 13,
      background: active ? "#FFB347" : "#AEC9FF",
      color: active ? "#1E1326" : "#3D2A54",
      border: "1px solid #3D2A54",
      padding: "4px 12px", borderRadius: 4, cursor: "pointer",
    }}>{children}</button>
  );
}

window.Btn = Btn;
window.FilterChip = FilterChip;
