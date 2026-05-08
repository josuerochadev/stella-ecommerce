/* global React, Btn, STARS, StarCard */
const FUN_FACTS = [
  "La plus proche étoile de la Terre, après le Soleil, est Proxima Centauri, située à 4,2 années-lumière.",
  "Il y a plus d'étoiles dans l'univers que de grains de sable sur toutes les plages de la Terre.",
  "Les étoiles ne scintillent pas réellement, c'est l'atmosphère terrestre qui crée cette illusion.",
];

function AboutSection() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", textAlign: "center", color: "#AEC9FF" }}>
      <h2 style={{ fontFamily: "'Dela Gothic One', serif", fontSize: 30, marginBottom: 28 }}>Qui sommes-nous ?</h2>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
        <img src="../../assets/astro.png" alt="Astronaute" style={{ width: 240, height: 240, objectFit: "contain" }} />
        <div style={{ flex: 1, minWidth: 320, textAlign: "left", maxWidth: 600 }}>
          <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: 17, lineHeight: 1.6 }}>
            Chez Stella, nous sommes passionnés par les étoiles et leur capacité à inspirer des
            générations. Nous vous proposons une expérience unique : adopter une étoile et la
            personnaliser pour en faire un cadeau inoubliable. Notre mission est d'illuminer la vie
            de nos clients en leur offrant un morceau du ciel.
          </p>
          <div style={{ marginTop: 16 }}><Btn>Voir plus</Btn></div>
        </div>
      </div>
    </section>
  );
}

function NewArrivalsSection({ onOpen, onAdd, cartIds }) {
  return (
    <section style={{ padding: "32px 0", textAlign: "center" }}>
      <h2 style={{ fontFamily: "'Dela Gothic One', serif", fontSize: 30, color: "#AEC9FF", margin: "16px 0 24px" }}>Nouveautés</h2>
      <div style={{ display: "flex", gap: 20, padding: "0 32px", overflowX: "auto" }}>
        {STARS.slice(0, 6).map(s => (
          <div key={s.id} style={{ minWidth: 240, maxWidth: 260, flex: "0 0 auto" }}>
            <StarCard star={s} onOpen={onOpen} onAdd={onAdd} inCart={cartIds.includes(s.id)} />
          </div>
        ))}
      </div>
    </section>
  );
}

function FunFactSection() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % FUN_FACTS.length), 6000); return () => clearInterval(t); }, []);
  return (
    <section style={{ padding: "48px 24px", textAlign: "center" }}>
      <p style={{
        display: "inline-block", maxWidth: 700,
        fontFamily: "'Roboto Slab', serif", fontSize: 22, color: "#1E1326",
      }}>
        <span style={{ background: "#FFB347", padding: "4px 8px" }}>{FUN_FACTS[i]}</span>
      </p>
      <h2 style={{ fontFamily: "'Dela Gothic One', serif", fontSize: 20, color: "#AEC9FF", marginTop: 24 }}>Le saviez-vous ?</h2>
    </section>
  );
}

function JoinUsSection({ onLogin }) {
  return (
    <section style={{ background: "#3D2A54", padding: "32px 24px", textAlign: "center", color: "#AEC9FF", marginTop: 32 }}>
      <h2 style={{ fontFamily: "'Dela Gothic One', serif", fontSize: 30, marginBottom: 16 }}>Rejoignez-nous</h2>
      <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: 17, maxWidth: 640, margin: "0 auto 20px" }}>
        Rejoignez la communauté Stella pour être au courant des dernières nouveautés et événements
        autour des étoiles. Inscrivez-vous à notre newsletter et faites partie de notre univers.
      </p>
      <Btn onClick={onLogin}>Se connecter</Btn>
    </section>
  );
}

window.AboutSection = AboutSection;
window.NewArrivalsSection = NewArrivalsSection;
window.FunFactSection = FunFactSection;
window.JoinUsSection = JoinUsSection;
