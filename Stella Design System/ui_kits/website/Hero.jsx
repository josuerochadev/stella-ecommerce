/* global React */
const { useEffect, useState } = React;

const HERO_PHRASES = [
  "Illuminer votre vie.",
  "Parcourir les constellations et trouver la bonne étoile !",
  "Découvrez les plus éclatants : la splendeur à portée de clic !",
  "Adoptez une étoile voisine : votre coin de ciel personnalisé !",
];
const HERO_IMAGES = ["../../assets/hero/hero-1.jpg", "../../assets/hero/hero-2.jpg", "../../assets/hero/hero-3.jpg"];

function Hero({ onCta }) {
  const [idx, setIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % HERO_PHRASES.length); setFade(true); }, 200);
    }, 4000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setImgIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ position: "relative", width: "100%", height: "calc(100vh - 48px)", overflow: "hidden" }}>
      {HERO_IMAGES.map((src, i) => (
        <img key={src} src={src} alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", filter: "brightness(50%)",
            opacity: i === imgIdx ? 1 : 0,
            transition: "opacity 800ms ease-in-out",
            animation: "stlZoom 15s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`@keyframes stlZoom {0%{transform:scale(1) translateY(0)}50%{transform:scale(1.25) translateY(-10px)}100%{transform:scale(1) translateY(0)}}`}</style>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        textAlign: "center", padding: "0 24px",
      }}>
        <h1 style={{
          fontFamily: "'Dela Gothic One', serif",
          fontSize: "clamp(48px, 8vw, 96px)", margin: 0, color: "#AEC9FF", lineHeight: 1,
        }}>Stella</h1>
        <p style={{
          fontFamily: "'Roboto Slab', serif", fontSize: 22, color: "#AEC9FF",
          maxWidth: 720, marginTop: 16, marginBottom: 24,
          opacity: fade ? 1 : 0, transition: "opacity 300ms ease-in-out",
        }}>{HERO_PHRASES[idx]}</p>
        <a onClick={onCta} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "#FFB347", color: "#3D2A54", cursor: "pointer",
          fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".06em", fontSize: 18,
          padding: "10px 22px", borderRadius: 6,
          transition: "transform 500ms ease, background 200ms ease, color 200ms ease, box-shadow 300ms ease",
        }}
        onMouseOver={e => { e.currentTarget.style.background = "#3D2A54"; e.currentTarget.style.color = "#AEC9FF"; e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseOut={e => { e.currentTarget.style.background = "#FFB347"; e.currentTarget.style.color = "#3D2A54"; e.currentTarget.style.transform = "scale(1)"; }}
        >Voir notre catalogue</a>
      </div>
    </section>
  );
}

window.Hero = Hero;
