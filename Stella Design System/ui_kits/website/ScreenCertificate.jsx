/* global React, Btn, Icon, StarGlow, ConstellationMap, Starfield */
const { useEffect, useRef } = React;

function CertificateScreen({ go, star, ownerName = "Marie Dupont", certId = "STLA-2025-00312" }) {
  const s = star || {
    name: "Sirius", constellation: "Grand Chien", price: 149,
    image: "../../assets/stars/sirius.jpg",
    description: "L'étoile la plus brillante du ciel nocturne.",
    magnitude: -1.46,
  };
  const today = new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 32px" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Btn variant="ghost" size="sm" onClick={() => go("profile")}><Icon name="arrowLeft" size={14}/> Mon compte</Btn>
        <Btn variant="secondary" size="sm"><Icon name="download" size={14}/> Télécharger PDF</Btn>
      </div>

      {/* Certificate card */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #2a1a3e 0%, #1E1326 50%, #0f0a18 100%)",
        border: "1px solid rgba(255,179,71,.3)",
        borderRadius: 16,
        boxShadow: "0 20px 32px -5px rgb(0 0 0/.7), 0 0 40px 8px rgba(255,179,71,.12)",
        padding: "48px 52px",
        color: "#AEC9FF",
      }}>
        {/* Starfield bg */}
        <div style={{ position: "absolute", inset: 0, opacity: .4 }}>
          <Starfield count={80}/>
        </div>

        {/* Corner constellation decoration */}
        <div style={{ position: "absolute", top: 24, right: 24, opacity: .25 }}>
          <ConstellationMap width={140} height={110} animated={false}/>
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <img src="../../assets/logo/monogram.svg" style={{ width: 44, height: 44 }} alt="Stella"/>
            <div>
              <div style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 22, color: "#AEC9FF", lineHeight: 1 }}>Stella</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: ".14em", color: "rgba(174,201,255,.5)", textTransform: "uppercase", marginTop: 2 }}>Certificat d'adoption d'étoile</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(255,179,71,.6))" }}/>
            <div style={{ color: "#FFB347", opacity: .8 }}><Icon name="star" size={14} stroke="#FFB347" style={{ fill: "#FFB347" }}/></div>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(255,179,71,.6))" }}/>
          </div>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 14, color: "rgba(174,201,255,.6)", marginBottom: 6 }}>Ce certificat atteste que</div>
            <div style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 32, color: "#FFB347",
              textShadow: "0 0 20px rgba(255,179,71,.4)", marginBottom: 6 }}>{ownerName}</div>
            <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 14, color: "rgba(174,201,255,.6)", marginBottom: 6 }}>est le gardien de l'étoile</div>
            <div style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 48, color: "#AEC9FF",
              textShadow: "0 0 30px rgba(174,201,255,.3)", lineHeight: 1, marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: ".12em",
              color: "rgba(174,201,255,.55)", textTransform: "uppercase" }}>Constellation de {s.constellation}</div>
          </div>

          {/* Star image */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{
              width: 160, height: 160, borderRadius: "50%", overflow: "hidden",
              border: "3px solid rgba(255,179,71,.4)",
              boxShadow: "0 0 30px 6px rgba(255,179,71,.2), 0 0 60px 12px rgba(255,179,71,.08)",
            }}>
              <img src={s.image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            </div>
          </div>

          {/* Specs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
            {[
              ["Magnitude", s.magnitude],
              ["Constellation", s.constellation],
              ["N° certificat", certId],
            ].map(([label, val]) => (
              <div key={label} style={{ textAlign: "center", padding: "12px", background: "rgba(174,201,255,.04)", borderRadius: 8, border: "1px solid rgba(174,201,255,.08)" }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: ".12em", color: "rgba(174,201,255,.4)", marginBottom: 4, textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 13, color: "#AEC9FF" }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(174,201,255,.12)" }}/>
            <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 11, color: "rgba(174,201,255,.4)", textAlign: "center" }}>
              Émis le {today} · Stella © 2025 · Ce certificat est symbolique
            </div>
            <div style={{ flex: 1, height: 1, background: "rgba(174,201,255,.12)" }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

window.CertificateScreen = CertificateScreen;
