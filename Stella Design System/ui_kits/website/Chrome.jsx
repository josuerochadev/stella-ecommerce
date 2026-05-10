/* global React */
const { useState } = React;

const Icon = ({ name, badge, size = 18 }) => (
  <span style={{ position: "relative", display: "inline-block", color: "inherit", fontSize: size }}>
    <i className={`fas fa-${name}`}></i>
    {badge ? (
      <span style={{
        position: "absolute", top: -8, right: -8,
        background: "#dc2626", color: "#fff", borderRadius: "50%",
        width: 18, height: 18, fontSize: 10, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{badge}</span>
    ) : null}
  </span>
);

function Header({ route, go, cartCount, wishCount, authed }) {
  const linkStyle = { color: "#AEC9FF", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" };
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: 48,
      background: "linear-gradient(90deg, #1E1326 0%, #3D2A54 100%)",
      color: "#AEC9FF",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 40px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / .35)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <a style={linkStyle} onClick={() => go("home")}><Icon name="house" size={18} /></a>
        {route !== "home" && (
          <span style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, textTransform: "capitalize" }}>
            {{ catalog: "Catalogue", detail: "Sirius", cart: "Votre panier", login: "Connexion" }[route] || ""}
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {route !== "catalog" && <a style={linkStyle}><Icon name="magnifying-glass" /></a>}
        <a style={linkStyle} onClick={() => go("catalog")}><Icon name="store" /></a>
        <a style={linkStyle} onClick={() => go("cart")}><Icon name="cart-shopping" badge={cartCount} /></a>
        <a style={linkStyle}><Icon name="heart" badge={wishCount} /></a>
        <a style={linkStyle} onClick={() => go("login")}><Icon name="user" /></a>
      </div>
    </header>
  );
}

function Footer() {
  const linkStyle = { color: "#AEC9FF", margin: "0 8px", textDecoration: "none", fontFamily: "'Roboto Slab', serif" };
  return (
    <footer style={{
      background: "#1E1326", color: "#AEC9FF",
      padding: "24px 0", marginTop: 48, textAlign: "center",
    }}>
      <div>
        <a style={linkStyle}>FAQ</a>
        <a style={linkStyle}>Contact</a>
        <a style={linkStyle}>À propos</a>
        <a style={linkStyle}>Mentions Légales</a>
        <a style={linkStyle}>Politique de Confidentialité</a>
      </div>
      <p style={{ marginTop: 12, fontSize: 14, color: "rgba(174,201,255,.85)" }}>© 2025 Stella. Tous droits réservés.</p>
    </footer>
  );
}

function Shell({ children, route, go, cart, wish, authed }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(90deg, #3D2A54 0%, #1E1326 100%)",
      color: "#AEC9FF", fontFamily: "'Roboto', sans-serif",
    }}>
      <Header route={route} go={go} cartCount={cart} wishCount={wish} authed={authed} />
      <main style={{ paddingTop: 48 }}>{children}</main>
      <Footer />
    </div>
  );
}

window.Chrome = { Header, Footer, Shell, Icon };
