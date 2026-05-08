/* global React, Btn, Icon, StarCard, STARS */
const { useState } = React;

const ORDERS = [
  { id: "ORD-2024-001", date: "12 jan. 2025", stars: ["Sirius", "Vega"], total: 268, status: "Livré" },
  { id: "ORD-2024-002", date: "28 jan. 2025", stars: ["Betelgeuse"], total: 189, status: "En cours" },
];

function ProfileScreen({ go, user = { name: "Marie Dupont", email: "marie@exemple.fr" }, cart, wish }) {
  const [tab, setTab] = useState("info");
  const tabs = [
    { id: "info",     label: "Mes informations", icon: "user" },
    { id: "orders",   label: "Mes commandes",    icon: "package" },
    { id: "wishlist", label: "Mes favoris",       icon: "heart" },
    { id: "security", label: "Sécurité",          icon: "lock" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 32px" }}>
      {/* Profile header */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32,
        background: "linear-gradient(135deg, #2a1a3e 0%, #1E1326 100%)",
        borderRadius: 12, padding: "24px 28px",
        boxShadow: "0 10px 20px -3px rgb(0 0 0 / .6)",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg,#4e3669,#3D2A54)",
          border: "2px solid #FFB347",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 0 20px 4px rgba(255,179,71,.25)",
        }}>
          <span style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 24, color: "#FFB347" }}>
            {user.name.charAt(0)}
          </span>
        </div>
        <div>
          <div style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 22, color: "#AEC9FF" }}>{user.name}</div>
          <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 13, color: "rgba(174,201,255,.6)", marginTop: 2 }}>{user.email}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <span style={{ background: "rgba(255,179,71,.15)", color: "#FFB347", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".1em" }}>
              {cart.length} étoile{cart.length !== 1 ? "s" : ""} au panier
            </span>
            <span style={{ background: "rgba(56,189,248,.12)", color: "#38bdf8", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".1em" }}>
              {wish.length} favori{wish.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#1E1326", borderRadius: 8, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer",
            fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".06em", fontSize: 13,
            background: tab === t.id ? "#3D2A54" : "transparent",
            color: tab === t.id ? "#AEC9FF" : "rgba(174,201,255,.5)",
            boxShadow: tab === t.id ? "0 4px 8px -1px rgb(0 0 0/.4)" : "none",
            transition: "all 200ms ease",
          }}>
            <Icon name={t.icon} size={14}/>
            <span style={{ display: "none", "@media(min-width:600px)": { display: "inline" } }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "info" && (
        <div style={{ background: "#1E1326", borderRadius: 10, padding: 24, boxShadow: "0 10px 20px -3px rgb(0 0 0/.5)" }}>
          <h2 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 20, margin: "0 0 20px" }}>Mes informations</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[["Prénom", "Marie"], ["Nom", "Dupont"], ["Email", user.email], ["Téléphone", "+33 6 12 34 56 78"]].map(([label, val]) => (
              <div key={label}>
                <label style={{ display: "block", fontFamily: "'Roboto Slab',serif", fontSize: 12, color: "rgba(174,201,255,.6)", marginBottom: 4 }}>{label}</label>
                <input defaultValue={val} style={{ width: "100%", padding: "10px 12px", background: "#2a1a3e", color: "#AEC9FF", border: "2px solid transparent", borderRadius: 6, fontFamily: "'Roboto',sans-serif", fontSize: 14, outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#FFB347"}
                  onBlur={e => e.target.style.borderColor = "transparent"}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}><Btn>Sauvegarder</Btn></div>
        </div>
      )}

      {tab === "orders" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ORDERS.map(o => (
            <div key={o.id} style={{ background: "#1E1326", borderRadius: 10, padding: 20,
              boxShadow: "0 10px 20px -3px rgb(0 0 0/.5)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 16 }}>{o.id}</div>
                <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 12, color: "rgba(174,201,255,.6)", marginTop: 2 }}>
                  {o.date} · {o.stars.join(", ")}
                </div>
              </div>
              <span style={{
                background: o.status === "Livré" ? "rgba(22,163,74,.15)" : "rgba(56,189,248,.12)",
                color: o.status === "Livré" ? "#4ade80" : "#38bdf8",
                padding: "3px 12px", borderRadius: 999, fontSize: 11,
                fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".1em",
              }}>{o.status}</span>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "#FFB347" }}>{o.total} €</div>
              <Btn size="sm" variant="ghost"><Icon name="eye" size={13}/></Btn>
            </div>
          ))}
        </div>
      )}

      {tab === "wishlist" && (
        <div>
          {wish.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(174,201,255,.5)", fontFamily: "'Roboto Slab',serif" }}>
              Aucun favori pour le moment.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {wish.map(s => <StarCard key={s.id} star={s} inWish compact/>)}
            </div>
          )}
        </div>
      )}

      {tab === "security" && (
        <div style={{ background: "#1E1326", borderRadius: 10, padding: 24, boxShadow: "0 10px 20px -3px rgb(0 0 0/.5)" }}>
          <h2 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 20, margin: "0 0 20px" }}>Sécurité</h2>
          {[["Mot de passe actuel", "password", "••••••••••"], ["Nouveau mot de passe", "password", ""], ["Confirmer", "password", ""]].map(([label, type, val]) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: "'Roboto Slab',serif", fontSize: 12, color: "rgba(174,201,255,.6)", marginBottom: 4 }}>{label}</label>
              <input type={type} defaultValue={val} placeholder={val || "••••••••••"}
                style={{ width: "100%", padding: "10px 12px", background: "#2a1a3e", color: "#AEC9FF", border: "2px solid transparent", borderRadius: 6, fontFamily: "'Roboto',sans-serif", fontSize: 14, outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#FFB347"}
                onBlur={e => e.target.style.borderColor = "transparent"}
              />
            </div>
          ))}
          <Btn>Changer le mot de passe</Btn>
        </div>
      )}
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
