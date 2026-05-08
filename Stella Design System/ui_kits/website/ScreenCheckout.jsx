/* global React, Btn, Icon */
const { useState } = React;

const STEPS = ["Récapitulatif", "Livraison", "Paiement", "Confirmation"];

function CheckoutScreen({ go, cart, onConfirm }) {
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState({ name: "", address: "", city: "", zip: "" });
  const [payment, setPayment] = useState({ card: "", expiry: "", cvv: "", name: "" });
  const total = cart.reduce((s, x) => s + x.price, 0);

  const next = () => { if (step < 3) setStep(s => s + 1); else { onConfirm && onConfirm(); go("confirm"); } };
  const back = () => step > 0 ? setStep(s => s - 1) : go("cart");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 32px" }}>
      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: i < step ? "#16a34a" : i === step ? "#FFB347" : "#2a1a3e",
                color: i < step ? "#fff" : i === step ? "#3D2A54" : "rgba(174,201,255,.4)",
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 14,
                border: i === step ? "2px solid #FFB347" : "2px solid transparent",
                boxShadow: i === step ? "0 0 12px rgba(255,179,71,.4)" : "none",
                transition: "all 300ms ease",
              }}>
                {i < step ? <Icon name="check" size={14} stroke="#fff" strokeWidth={2.5}/> : i + 1}
              </div>
              <span style={{ fontFamily: "'Roboto Slab',serif", fontSize: 10, color: i === step ? "#AEC9FF" : "rgba(174,201,255,.4)", whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? "#16a34a" : "#2a1a3e", margin: "0 6px 16px", transition: "background 400ms ease" }}/>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
        {/* Main panel */}
        <div style={{ background: "#1E1326", borderRadius: 10, padding: 24, boxShadow: "0 10px 20px -3px rgb(0 0 0/.5)" }}>

          {step === 0 && (
            <>
              <h2 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 20, margin: "0 0 16px" }}>Récapitulatif de commande</h2>
              {cart.map(s => (
                <div key={s.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(174,201,255,.08)" }}>
                  <img src={s.image} alt={s.name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(174,201,255,.6)", fontFamily: "'Roboto Slab',serif" }}>{s.constellation}</div>
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "#FFB347" }}>{s.price} €</div>
                </div>
              ))}
            </>
          )}

          {step === 1 && (
            <>
              <h2 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 20, margin: "0 0 16px" }}>Adresse de livraison</h2>
              {[["Nom complet","name","Marie Dupont"],["Adresse","address","12 rue des Étoiles"],["Ville","city","Paris"],["Code postal","zip","75001"]].map(([label, field, ph]) => (
                <div key={field} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontFamily: "'Roboto Slab',serif", fontSize: 12, color: "rgba(174,201,255,.6)", marginBottom: 4 }}>{label}</label>
                  <input value={delivery[field]} placeholder={ph}
                    onChange={e => setDelivery(d => ({ ...d, [field]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", background: "#2a1a3e", color: "#AEC9FF", border: "2px solid transparent", borderRadius: 6, fontFamily: "'Roboto',sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "#FFB347"}
                    onBlur={e => e.target.style.borderColor = "transparent"}
                  />
                </div>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 20, margin: "0 0 16px" }}>Informations de paiement</h2>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontFamily: "'Roboto Slab',serif", fontSize: 12, color: "rgba(174,201,255,.6)", marginBottom: 4 }}>Numéro de carte</label>
                <div style={{ position: "relative" }}>
                  <input value={payment.card} placeholder="4242 4242 4242 4242"
                    onChange={e => setPayment(p => ({ ...p, card: e.target.value }))}
                    style={{ width: "100%", padding: "10px 40px 10px 12px", background: "#2a1a3e", color: "#AEC9FF", border: "2px solid transparent", borderRadius: 6, fontFamily: "'Roboto Slab',serif", fontSize: 14, outline: "none", letterSpacing: ".1em", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "#FFB347"}
                    onBlur={e => e.target.style.borderColor = "transparent"}
                  />
                  <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(174,201,255,.4)" }}>
                    <Icon name="creditCard" size={16}/>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                {[["Titulaire","name","Marie Dupont"],["Expiration","expiry","MM/AA"],["CVV","cvv","•••"]].map(([label,field,ph]) => (
                  <div key={field}>
                    <label style={{ display: "block", fontFamily: "'Roboto Slab',serif", fontSize: 12, color: "rgba(174,201,255,.6)", marginBottom: 4 }}>{label}</label>
                    <input type={field === "cvv" ? "password" : "text"} value={payment[field]} placeholder={ph}
                      onChange={e => setPayment(p => ({ ...p, [field]: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", background: "#2a1a3e", color: "#AEC9FF", border: "2px solid transparent", borderRadius: 6, fontFamily: "'Roboto',sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = "#FFB347"}
                      onBlur={e => e.target.style.borderColor = "transparent"}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(22,163,74,.1)", borderRadius: 6, color: "#4ade80", fontFamily: "'Roboto Slab',serif", fontSize: 12 }}>
                <Icon name="lock" size={14} stroke="#4ade80"/>
                Paiement sécurisé SSL 256-bit
              </div>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ color: "#4ade80", marginBottom: 16 }}><Icon name="check" size={48} stroke="#4ade80" strokeWidth={2}/></div>
              <h2 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 24 }}>Merci pour votre commande !</h2>
              <p style={{ fontFamily: "'Roboto Slab',serif", fontSize: 15, color: "rgba(174,201,255,.8)", marginTop: 8 }}>
                Votre certificat d'adoption sera disponible sous 24h.
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <Btn variant="ghost" onClick={back}><Icon name="arrowLeft" size={14}/> Retour</Btn>
            <Btn onClick={next}>{step === 2 ? "Confirmer la commande" : step === 3 ? "Fermer" : "Continuer"} <Icon name="arrowRight" size={14}/></Btn>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ background: "#1E1326", borderRadius: 10, padding: 20, boxShadow: "0 10px 20px -3px rgb(0 0 0/.5)", alignSelf: "start" }}>
          <h3 style={{ fontFamily: "'Dela Gothic One',serif", fontSize: 16, margin: "0 0 12px" }}>Résumé</h3>
          {cart.map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0",
              borderBottom: "1px solid rgba(174,201,255,.06)", fontFamily: "'Roboto Slab',serif", fontSize: 13 }}>
              <span style={{ color: "rgba(174,201,255,.8)" }}>{s.name}</span>
              <span style={{ color: "#FFB347" }}>{s.price} €</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0",
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#AEC9FF" }}>
            <span>Total</span>
            <span style={{ color: "#FFB347" }}>{total} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.CheckoutScreen = CheckoutScreen;
