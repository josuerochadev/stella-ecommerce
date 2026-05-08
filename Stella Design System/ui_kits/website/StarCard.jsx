/* global React, Btn */
const STARS = [
  { id: 1, name: "Sirius",     constellation: "Grand Chien",     price: 149, magnitude: -1.46, image: "../../assets/stars/sirius.jpg",     description: "L'étoile la plus brillante du ciel nocturne." },
  { id: 2, name: "Vega",       constellation: "Lyre",            price: 119, magnitude:  0.03, image: "../../assets/stars/vega.jpg",       description: "Cinquième étoile la plus brillante du ciel." },
  { id: 3, name: "Betelgeuse", constellation: "Orion",           price: 189, magnitude:  0.42, image: "../../assets/stars/betelgeuse.jpg", description: "Supergéante rouge à l'épaule d'Orion." },
  { id: 4, name: "Rigel",      constellation: "Orion",           price: 179, magnitude:  0.18, image: "../../assets/stars/rigel.jpg",      description: "Supergéante bleue, joyau d'Orion." },
  { id: 5, name: "Aldebaran",  constellation: "Taureau",         price: 139, magnitude:  0.85, image: "../../assets/stars/aldebaran.jpg",  description: "Œil rouge du Taureau." },
  { id: 6, name: "Antares",    constellation: "Scorpion",        price: 159, magnitude:  1.06, image: "../../assets/stars/antares.jpg",    description: "Cœur rouge ardent du Scorpion." },
  { id: 7, name: "Arcturus",   constellation: "Bouvier",         price: 129, magnitude: -0.05, image: "../../assets/stars/arcturus.jpg",   description: "Géante orange du Bouvier." },
  { id: 8, name: "Capella",    constellation: "Cocher",          price: 109, magnitude:  0.08, image: "../../assets/stars/capella.jpg",    description: "Système d'étoiles dorées." },
  { id: 9, name: "Procyon",    constellation: "Petit Chien",     price:  99, magnitude:  0.34, image: "../../assets/stars/procyon.jpg",    description: "Compagne fidèle du Grand Chien." },
];

function StarCard({ star, onOpen, onAdd, inCart }) {
  return (
    <div style={{
      background: "#1E1326", color: "#AEC9FF",
      borderRadius: 8, boxShadow: "0 10px 15px -3px rgb(0 0 0 / .3)",
      overflow: "hidden", display: "flex", flexDirection: "column",
      transition: "transform 300ms ease, box-shadow 300ms ease",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgb(0 0 0 / .4)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgb(0 0 0 / .3)"; }}
    >
      <img src={star.image} alt={star.name} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h2 style={{ fontFamily: "'Dela Gothic One', serif", fontSize: 20, margin: 0 }}>{star.name}</h2>
        <p style={{ fontFamily: "'Roboto Slab', serif", fontSize: 13, opacity: .9, margin: 0, lineHeight: 1.5, flex: 1 }}>{star.description}</p>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{star.price} €</div>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <Btn onClick={() => onOpen(star)}><i className="fas fa-eye"></i></Btn>
          <Btn onClick={() => onAdd(star)} style={inCart ? { opacity: .55, cursor: "not-allowed" } : null}>
            <i className="fas fa-cart-shopping"></i>
          </Btn>
          <Btn variant="ghost"><i className="fas fa-heart"></i></Btn>
        </div>
      </div>
    </div>
  );
}

window.STARS = STARS;
window.StarCard = StarCard;
