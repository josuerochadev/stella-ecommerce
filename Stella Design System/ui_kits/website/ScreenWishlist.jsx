/* global React, Btn, Icon, StarCard, STARS */
const { useState } = React;

function WishlistScreen({ go, wish, onRemoveWish, onAddToCart, cart }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 32, margin: 0 }}>Mes favoris</h1>
        <span style={{ background: "rgba(56,189,248,.12)", color: "#38bdf8",
          padding: "4px 14px", borderRadius: 999, fontSize: 12,
          fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".1em" }}>
          {wish.length} étoile{wish.length !== 1 ? "s" : ""}
        </span>
      </div>

      {wish.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ marginBottom: 16, color: "rgba(174,201,255,.35)" }}>
            <Icon name="heart" size={48}/>
          </div>
          <p style={{ fontFamily: "'Roboto Slab',serif", fontSize: 18, marginBottom: 24 }}>
            Votre liste de favoris est vide.
          </p>
          <Btn onClick={() => go("catalog")}>Parcourir le catalogue</Btn>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 24 }}>
          {wish.map(s => (
            <div key={s.id} style={{ position: "relative" }}>
              <StarCard star={s} onOpen={() => go("detail", s)} onAdd={onAddToCart} inCart={cart.some(c => c.id === s.id)} inWish/>
              <button onClick={() => onRemoveWish(s.id)} style={{
                position: "absolute", top: 10, left: 10, background: "rgba(220,38,38,.85)",
                border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer",
                color: "#fff", display: "flex", alignItems: "center", gap: 4,
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: ".06em",
              }}>
                <Icon name="x" size={11}/>Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

window.WishlistScreen = WishlistScreen;
