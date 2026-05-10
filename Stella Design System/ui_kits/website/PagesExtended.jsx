/* global React, Btn, Input, Icon, StarCard, Reveal, CosmicDivider, CosmicGrid, GrainOverlay, AmbientGlow, OrbitField, STARS */
const { useState } = React;

/* ─────────────────────────────────────────────────────────────
   PROFILE
───────────────────────────────────────────────────────────── */
function ProfileScreen({ go, cart, wish }) {
  const [tab, setTab] = useState("info");
  const orders = [
    { id:"STLA-2025-0018", date:"12 jan. 2025", stars:["Sirius","Vega"], total:268, status:"Livré" },
    { id:"STLA-2025-0031", date:"3 mars 2025",  stars:["Betelgeuse"],   total:189, status:"En cours" },
  ];

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"96px 40px 60px" }}>
      {/* Header */}
      <Reveal>
        <div style={{ display:"flex", alignItems:"center", gap:24, marginBottom:48,
          paddingBottom:32, borderBottom:"1px solid rgba(174,201,255,0.07)" }}>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"linear-gradient(135deg,#3D2A54,#1a0f28)",
            border:"1px solid rgba(255,179,71,0.3)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            boxShadow:"0 0 24px rgba(255,179,71,0.12)",
          }}>
            <span style={{ fontFamily:"'Dela Gothic One',serif", fontSize:28, color:"#FFB347" }}>M</span>
          </div>
          <div>
            <div style={{ fontFamily:"'Dela Gothic One',serif", fontSize:24, color:"#E8DEFF", marginBottom:4 }}>
              Marie Dupont
            </div>
            <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:13, color:"rgba(174,201,255,0.45)" }}>
              marie@exemple.fr
            </div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
            <span style={{ background:"rgba(255,179,71,0.1)", color:"rgba(255,179,71,0.8)",
              padding:"4px 12px", borderRadius:3, fontSize:11, fontFamily:"'Roboto',sans-serif",
              letterSpacing:".08em" }}>{cart.length} au panier</span>
            <span style={{ background:"rgba(174,201,255,0.07)", color:"rgba(174,201,255,0.5)",
              padding:"4px 12px", borderRadius:3, fontSize:11, fontFamily:"'Roboto',sans-serif",
              letterSpacing:".08em" }}>{wish.length} favori{wish.length!==1?"s":""}</span>
          </div>
        </div>
      </Reveal>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid rgba(174,201,255,0.07)", marginBottom:36 }}>
        {[["info","Informations"],["orders","Commandes"],["security","Sécurité"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{
            padding:"10px 20px", border:"none", borderBottom:`2px solid ${tab===id ? "#FFB347" : "transparent"}`,
            background:"transparent", color: tab===id ? "#FFB347" : "rgba(174,201,255,0.4)",
            fontFamily:"'Roboto',sans-serif", fontSize:13, letterSpacing:".04em",
            cursor:"pointer", transition:"all 200ms",
          }}>{label}</button>
        ))}
      </div>

      {tab==="info" && (
        <Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, maxWidth:600 }}>
            {[["Prénom","Marie"],["Nom","Dupont"],["Email","marie@exemple.fr"],["Téléphone","+33 6 12 34 56 78"]].map(([label,val])=>(
              <Input key={label} label={label} value={val}/>
            ))}
            <div style={{ gridColumn:"1/-1", marginTop:8 }}>
              <Btn>Enregistrer</Btn>
            </div>
          </div>
        </Reveal>
      )}

      {tab==="orders" && (
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {orders.map((o,i)=>(
            <Reveal key={o.id} delay={i*0.06}>
              <div style={{ display:"flex", alignItems:"center", gap:20, padding:"18px 0",
                borderBottom:"1px solid rgba(174,201,255,0.05)" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:11, letterSpacing:".08em",
                    color:"rgba(174,201,255,0.35)", marginBottom:3 }}>{o.id}</div>
                  <div style={{ fontFamily:"'Dela Gothic One',serif", fontSize:16, color:"#E8DEFF" }}>
                    {o.stars.join(" · ")}
                  </div>
                  <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:12,
                    color:"rgba(174,201,255,0.35)", marginTop:2 }}>{o.date}</div>
                </div>
                <span style={{
                  padding:"3px 10px", borderRadius:3, fontSize:11,
                  fontFamily:"'Roboto',sans-serif", letterSpacing:".06em",
                  background: o.status==="Livré" ? "rgba(22,163,74,0.12)" : "rgba(56,189,248,0.1)",
                  color: o.status==="Livré" ? "#4ade80" : "#38bdf8",
                }}>{o.status}</span>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22,
                  color:"#FFB347", letterSpacing:".02em" }}>{o.total} €</div>
                <Btn variant="ghost" size="sm" onClick={()=>go("certificate")} icon="award"/>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {tab==="security" && (
        <Reveal>
          <div style={{ maxWidth:400, display:"flex", flexDirection:"column", gap:14 }}>
            <Input label="Mot de passe actuel" type="password" placeholder="••••••••"/>
            <Input label="Nouveau mot de passe" type="password" placeholder="••••••••"/>
            <Input label="Confirmer" type="password" placeholder="••••••••"/>
            <Btn style={{ marginTop:8 }}>Changer le mot de passe</Btn>
          </div>
        </Reveal>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WISHLIST
───────────────────────────────────────────────────────────── */
function WishlistScreen({ go, wish, onRemoveWish, onAddToCart, cart }) {
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"96px 40px 60px" }}>
      <Reveal>
        <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
          textTransform:"uppercase", color:"rgba(255,179,71,0.6)", marginBottom:10 }}>FAVORIS</div>
        <h1 style={{ fontFamily:"'Dela Gothic One',serif", fontSize:"clamp(32px,4vw,52px)",
          margin:"0 0 40px", color:"#E8DEFF", letterSpacing:"-1px" }}>
          {wish.length > 0 ? `${wish.length} étoile${wish.length>1?"s":""} sauvegardée${wish.length>1?"s":""}` : "Aucun favori"}
        </h1>
      </Reveal>

      {wish.length===0 ? (
        <div style={{ padding:"80px 0", textAlign:"center" }}>
          <div style={{ color:"rgba(174,201,255,0.1)", marginBottom:20 }}><Icon name="heart" size={56}/></div>
          <p style={{ fontFamily:"'Roboto Slab',serif", fontWeight:300, fontSize:16,
            color:"rgba(174,201,255,0.4)", marginBottom:24 }}>Aucune étoile sauvegardée pour le moment.</p>
          <Btn onClick={()=>go("catalog")} icon="sparkles">Parcourir le catalogue</Btn>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:20 }}>
          {wish.map((s,i)=>(
            <Reveal key={s.id} delay={i*0.05}>
              <div style={{ position:"relative" }}>
                <StarCard star={s} onOpen={()=>go("detail",s)} onAdd={onAddToCart}
                  inCart={cart.some(c=>c.id===s.id)} inWish/>
                <button onClick={()=>onRemoveWish(s.id)} style={{
                  position:"absolute", top:10, left:10,
                  background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.2)",
                  borderRadius:4, padding:"3px 8px", cursor:"pointer",
                  color:"#f87171", fontFamily:"'Roboto',sans-serif", fontSize:10,
                  letterSpacing:".06em", display:"flex", alignItems:"center", gap:4,
                }}>
                  <Icon name="x" size={10}/>Retirer
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CHECKOUT
───────────────────────────────────────────────────────────── */
const STEPS = ["Récapitulatif","Livraison","Paiement"];

function CheckoutScreen({ go, cart }) {
  const [step, setStep] = useState(0);
  const total = cart.reduce((s,x)=>s+x.price,0);

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"96px 40px 60px" }}>
      {/* Step bar */}
      <Reveal>
        <div style={{ display:"flex", alignItems:"center", marginBottom:48 }}>
          {STEPS.map((s,i)=>(
            <React.Fragment key={s}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{
                  width:28, height:28, borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  background: i<step ? "rgba(74,222,128,0.15)" : i===step ? "rgba(255,179,71,0.15)" : "rgba(174,201,255,0.05)",
                  border: `1px solid ${i<step ? "rgba(74,222,128,0.4)" : i===step ? "rgba(255,179,71,0.4)" : "rgba(174,201,255,0.1)"}`,
                  color: i<step ? "#4ade80" : i===step ? "#FFB347" : "rgba(174,201,255,0.3)",
                  fontFamily:"'Roboto',sans-serif", fontSize:12, transition:"all 300ms",
                }}>
                  {i<step ? <Icon name="check" size={12} stroke="currentColor" strokeWidth={2.5}/> : i+1}
                </div>
                <span style={{ fontFamily:"'Roboto',sans-serif", fontSize:12, letterSpacing:".06em",
                  color: i===step ? "#AEC9FF" : "rgba(174,201,255,0.35)" }}>{s}</span>
              </div>
              {i<STEPS.length-1 && (
                <div style={{ flex:1, height:1, margin:"0 16px",
                  background: i<step ? "rgba(74,222,128,0.2)" : "rgba(174,201,255,0.06)",
                  transition:"background 400ms" }}/>
              )}
            </React.Fragment>
          ))}
        </div>
      </Reveal>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:28 }}>
        {/* Main */}
        <Reveal>
          <div style={{ background:"rgba(12,8,22,0.7)", border:"1px solid rgba(174,201,255,0.07)",
            borderRadius:8, padding:28, backdropFilter:"blur(12px)" }}>
            <GrainOverlay opacity={0.025}/>

            {step===0 && (
              <>
                <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".15em",
                  textTransform:"uppercase", color:"rgba(174,201,255,0.4)", marginBottom:20 }}>RÉCAPITULATIF</div>
                {cart.map(s=>(
                  <div key={s.id} style={{ display:"flex", gap:14, padding:"12px 0",
                    borderBottom:"1px solid rgba(174,201,255,0.05)" }}>
                    <img src={s.image} alt={s.name} style={{ width:56, height:56, objectFit:"cover",
                      borderRadius:4, filter:"brightness(0.8)" }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Dela Gothic One',serif", fontSize:15, color:"#E8DEFF" }}>{s.name}</div>
                      <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:11,
                        color:"rgba(174,201,255,0.35)", marginTop:2 }}>{s.constellation}</div>
                    </div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20,
                      color:"#FFB347", alignSelf:"center" }}>{s.price} €</div>
                  </div>
                ))}
              </>
            )}

            {step===1 && (
              <>
                <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".15em",
                  textTransform:"uppercase", color:"rgba(174,201,255,0.4)", marginBottom:20 }}>ADRESSE</div>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <Input label="Nom complet" placeholder="Marie Dupont" icon="user"/>
                  <Input label="Adresse" placeholder="12 rue des Étoiles"/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <Input label="Ville" placeholder="Paris"/>
                    <Input label="Code postal" placeholder="75001"/>
                  </div>
                </div>
              </>
            )}

            {step===2 && (
              <>
                <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".15em",
                  textTransform:"uppercase", color:"rgba(174,201,255,0.4)", marginBottom:20 }}>PAIEMENT</div>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <Input label="Numéro de carte" placeholder="4242 4242 4242 4242" icon="creditCard"/>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                    <Input label="Titulaire" placeholder="M. DUPONT"/>
                    <Input label="Expiration" placeholder="MM/AA"/>
                    <Input label="CVV" type="password" placeholder="•••"/>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 12px",
                    background:"rgba(22,163,74,0.06)", border:"1px solid rgba(22,163,74,0.15)",
                    borderRadius:4, color:"rgba(74,222,128,0.7)",
                    fontFamily:"'Roboto',sans-serif", fontSize:11 }}>
                    <Icon name="lock" size={12} stroke="currentColor"/> Paiement sécurisé 256-bit SSL
                  </div>
                </div>
              </>
            )}

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
              <Btn variant="ghost" onClick={()=>step>0?setStep(s=>s-1):go("cart")} icon="arrowLeft">Retour</Btn>
              <Btn onClick={()=>step<STEPS.length-1?setStep(s=>s+1):go("confirm")} icon="arrowRight">
                {step===STEPS.length-1 ? "Confirmer" : "Continuer"}
              </Btn>
            </div>
          </div>
        </Reveal>

        {/* Summary */}
        <Reveal delay={0.1}>
          <div style={{ background:"rgba(12,8,22,0.7)", border:"1px solid rgba(174,201,255,0.07)",
            borderRadius:8, padding:22, backdropFilter:"blur(12px)", position:"sticky", top:80 }}>
            <GrainOverlay opacity={0.025}/>
            <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".15em",
              textTransform:"uppercase", color:"rgba(174,201,255,0.4)", marginBottom:16 }}>RÉSUMÉ</div>
            {cart.map(s=>(
              <div key={s.id} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0",
                fontFamily:"'Roboto',sans-serif", fontSize:13,
                borderBottom:"1px solid rgba(174,201,255,0.04)" }}>
                <span style={{ color:"rgba(174,201,255,0.55)" }}>{s.name}</span>
                <span style={{ color:"rgba(255,179,71,0.7)" }}>{s.price} €</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", paddingTop:14,
              fontFamily:"'Bebas Neue',sans-serif", fontSize:24 }}>
              <span style={{ color:"rgba(174,201,255,0.5)" }}>Total</span>
              <span style={{ color:"#FFB347" }}>{total} €</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONFIRMATION
───────────────────────────────────────────────────────────── */
function ConfirmScreen({ go, cart }) {
  const orderId = "STLA-2025-" + String(Math.floor(Math.random()*9000)+1000);
  const total = cart.reduce((s,x)=>s+x.price,0);

  return (
    <div style={{ maxWidth:600, margin:"0 auto", padding:"100px 40px 60px", textAlign:"center" }}>
      <Reveal>
        <div style={{ width:72, height:72, borderRadius:"50%", margin:"0 auto 28px",
          background:"rgba(22,163,74,0.1)", border:"1px solid rgba(22,163,74,0.25)",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 0 32px rgba(22,163,74,0.15)" }}>
          <Icon name="check" size={32} stroke="#4ade80" strokeWidth={2}/>
        </div>
        <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
          textTransform:"uppercase", color:"rgba(255,179,71,0.6)", marginBottom:10 }}>COMMANDE CONFIRMÉE</div>
        <h1 style={{ fontFamily:"'Dela Gothic One',serif", fontSize:40, margin:"0 0 12px",
          color:"#E8DEFF", letterSpacing:"-1px" }}>Merci !</h1>
        <p style={{ fontFamily:"'Roboto Slab',serif", fontWeight:300, fontSize:16,
          color:"rgba(174,201,255,0.55)", lineHeight:1.7, marginBottom:32 }}>
          Votre commande <span style={{ color:"rgba(255,179,71,0.8)" }}>{orderId}</span> a bien été enregistrée.
          Votre certificat d'adoption sera disponible sous 24h.
        </p>

        <div style={{ background:"rgba(12,8,22,0.7)", border:"1px solid rgba(174,201,255,0.07)",
          borderRadius:8, padding:24, marginBottom:28, backdropFilter:"blur(12px)", textAlign:"left" }}>
          {cart.map(s=>(
            <div key={s.id} style={{ display:"flex", gap:12, padding:"10px 0",
              borderBottom:"1px solid rgba(174,201,255,0.04)", alignItems:"center" }}>
              <img src={s.image} alt={s.name} style={{ width:48, height:48,
                objectFit:"cover", borderRadius:4, filter:"brightness(0.8)" }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Dela Gothic One',serif", fontSize:14, color:"#E8DEFF" }}>{s.name}</div>
                <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:11,
                  color:"rgba(174,201,255,0.35)" }}>{s.constellation}</div>
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#FFB347" }}>{s.price} €</div>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:14,
            fontFamily:"'Bebas Neue',sans-serif", fontSize:22 }}>
            <span style={{ color:"rgba(174,201,255,0.5)" }}>Total</span>
            <span style={{ color:"#FFB347" }}>{total} €</span>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <Btn onClick={()=>go("certificate")} icon="award">Voir le certificat</Btn>
          <Btn variant="secondary" onClick={()=>go("catalog")}>Continuer</Btn>
        </div>
      </Reveal>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CERTIFICATE
───────────────────────────────────────────────────────────── */
function CertificateScreen({ go, star }) {
  const s = star || STARS[0];
  const certId = "STLA-2025-00" + String(s.id).padStart(3,"0");
  const today = new Date().toLocaleDateString("fr-FR",{year:"numeric",month:"long",day:"numeric"});

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"96px 40px 60px" }}>
      <Reveal>
        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          <Btn variant="ghost" size="sm" onClick={()=>go("profile")} icon="arrowLeft">Mon compte</Btn>
          <Btn variant="secondary" size="sm" icon="download">Télécharger</Btn>
        </div>

        {/* Certificate */}
        <div style={{ position:"relative", overflow:"hidden",
          background:"linear-gradient(135deg,#130a24 0%,#0a0614 60%,#080610 100%)",
          border:"1px solid rgba(255,179,71,0.2)",
          borderRadius:10, padding:"52px 56px",
          boxShadow:"0 32px 64px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,179,71,0.08)" }}>

          <GrainOverlay opacity={0.05}/>
          {/* Orbit bg */}
          <div style={{ position:"absolute", right:-80, top:-40, width:500, height:400, opacity:.12 }}>
            <OrbitField rings={3} animated={false} style={{ width:"100%", height:"100%" }}/>
          </div>

          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:36, position:"relative" }}>
            <img src="../../assets/logo/monogram.svg" alt="Stella" style={{ width:38, height:38 }}/>
            <div>
              <div style={{ fontFamily:"'Dela Gothic One',serif", fontSize:18, color:"#E8DEFF",
                letterSpacing:"-0.3px", lineHeight:1 }}>Stella</div>
              <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:9, letterSpacing:".16em",
                textTransform:"uppercase", color:"rgba(255,179,71,0.45)", marginTop:2 }}>
                CERTIFICAT D'ADOPTION
              </div>
            </div>
            <div style={{ marginLeft:"auto", fontFamily:"'Roboto',sans-serif", fontSize:10,
              color:"rgba(174,201,255,0.3)", letterSpacing:".06em" }}>{certId}</div>
          </div>

          <CosmicDivider style={{ marginBottom:40 }}/>

          {/* Main content */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"start", position:"relative" }}>
            <div>
              <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".16em",
                textTransform:"uppercase", color:"rgba(174,201,255,0.3)", marginBottom:10 }}>
                CE CERTIFICAT ATTESTE QUE
              </div>
              <div style={{ fontFamily:"'Dela Gothic One',serif", fontSize:28, color:"#FFB347",
                marginBottom:12, lineHeight:1 }}>Marie Dupont</div>
              <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".1em",
                textTransform:"uppercase", color:"rgba(174,201,255,0.3)", marginBottom:6 }}>
                EST LE GARDIEN DE L'ÉTOILE
              </div>
              <div style={{ fontFamily:"'Dela Gothic One',serif",
                fontSize:"clamp(40px,7vw,64px)", color:"#E8DEFF",
                lineHeight:.9, letterSpacing:"-1px", marginBottom:6 }}>{s.name}</div>
              <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:11, letterSpacing:".12em",
                textTransform:"uppercase", color:"rgba(174,201,255,0.35)", marginBottom:28 }}>
                {s.constellation}
              </div>

              {/* Specs */}
              <div style={{ display:"flex", gap:20 }}>
                {[["Magnitude",s.magnitude],["Constellation",s.constellation.slice(0,8)]].map(([k,v])=>(
                  <div key={k}>
                    <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:9, letterSpacing:".12em",
                      textTransform:"uppercase", color:"rgba(174,201,255,0.3)", marginBottom:3 }}>{k}</div>
                    <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:14, color:"rgba(174,201,255,0.7)" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Star image */}
            <div style={{ width:160, height:160, borderRadius:"50%", overflow:"hidden",
              border:"1px solid rgba(255,179,71,0.2)",
              boxShadow:"0 0 40px rgba(255,179,71,0.1)", flexShrink:0 }}>
              <img src={s.image} alt={s.name} style={{ width:"100%", height:"100%",
                objectFit:"cover", filter:"brightness(0.75) saturate(0.85)" }}/>
            </div>
          </div>

          <CosmicDivider style={{ margin:"36px 0 20px" }}/>

          <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10,
            color:"rgba(174,201,255,0.2)", letterSpacing:".06em" }}>
            Émis le {today} · Ce certificat est symbolique · Stella © 2025
          </div>
        </div>
      </Reveal>
    </div>
  );
}

Object.assign(window, { ProfileScreen, WishlistScreen, CheckoutScreen, ConfirmScreen, CertificateScreen });
