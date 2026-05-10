/* global React, Btn, Icon, StarGlow */

function ConfirmScreen({ go, cart }) {
  const orderNum = "STLA-2025-" + String(Math.floor(Math.random() * 9000) + 1000);
  const total = cart.reduce((s, x) => s + x.price, 0);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px 32px", textAlign: "center" }}>
      {/* Animated success icon */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(22,163,74,.25) 0%, transparent 70%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px 8px rgba(22,163,74,.2)",
          animation: "stl-pulse-glow 2.5s ease-in-out infinite",
        }}>
          <Icon name="check" size={48} stroke="#4ade80" strokeWidth={2.5}/>
        </div>
      </div>

      <h1 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 36, margin: "0 0 8px", color: "#AEC9FF" }}>
        Commande confirmée !
      </h1>
      <p style={{ fontFamily: "'Roboto Slab',serif", fontSize: 17, color: "rgba(174,201,255,.8)", marginBottom: 6, lineHeight: 1.6 }}>
        Merci pour votre confiance. Votre commande <strong style={{ color: "#AEC9FF" }}>{orderNum}</strong> a bien été enregistrée.
      </p>
      <p style={{ fontFamily: "'Roboto Slab',serif", fontSize: 14, color: "rgba(174,201,255,.55)", marginBottom: 32 }}>
        Un email de confirmation vous a été envoyé. Votre certificat d'adoption sera disponible sous 24h.
      </p>

      {/* Order summary card */}
      <div style={{ background: "#1E1326", borderRadius: 12, padding: 24,
        boxShadow: "0 10px 20px -3px rgb(0 0 0/.5)", marginBottom: 28, textAlign: "left" }}>
        <div style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 16, marginBottom: 14, color: "#AEC9FF" }}>Votre commande</div>
        {cart.map(s => (
          <div key={s.id} style={{ display: "flex", gap: 12, padding: "10px 0",
            borderBottom: "1px solid rgba(174,201,255,.06)" }}>
            <img src={s.image} alt={s.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 15 }}>{s.name}</div>
              <div style={{ fontFamily: "'Roboto Slab',serif", fontSize: 11, color: "rgba(174,201,255,.5)", marginTop: 2 }}>{s.constellation}</div>
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "#FFB347", alignSelf: "center" }}>{s.price} €</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14,
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 20 }}>
          <span>Total payé</span>
          <span style={{ color: "#FFB347" }}>{total} €</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Btn onClick={() => go("certificate", cart[0])}><Icon name="award" size={15}/> Voir le certificat</Btn>
        <Btn variant="secondary" onClick={() => go("catalog")}>Continuer mes achats</Btn>
      </div>
    </div>
  );
}

window.ConfirmScreen = ConfirmScreen;
