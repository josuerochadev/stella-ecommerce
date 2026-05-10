/* global React, Btn, Input, Icon, StarCard, Reveal, GrainOverlay, OrbitField, CosmicGrid, AmbientGlow, CosmicDivider, ScatteredDots */
const { useState, useEffect, useRef, useMemo } = React;

const STARS = [
  { id:1,  name:"Sirius",     constellation:"Grand Chien",  price:149, magnitude:-1.46, image:"../../assets/stars/sirius.jpg",     description:"L'étoile la plus brillante du ciel nocturne, un joyau bleu-blanc de la constellation du Grand Chien." },
  { id:2,  name:"Vega",       constellation:"Lyre",         price:119, magnitude:0.03,  image:"../../assets/stars/vega.jpg",       description:"Cinquième étoile la plus brillante, ancienne étoile polaire et future de nouveau dans 12 000 ans." },
  { id:3,  name:"Betelgeuse", constellation:"Orion",        price:189, magnitude:0.42,  image:"../../assets/stars/betelgeuse.jpg", description:"Supergéante rouge à l'épaule d'Orion, destinée à une supernova spectaculaire." },
  { id:4,  name:"Rigel",      constellation:"Orion",        price:179, magnitude:0.18,  image:"../../assets/stars/rigel.jpg",      description:"Supergéante bleue au pied d'Orion, l'une des étoiles les plus lumineuses de la Voie Lactée." },
  { id:5,  name:"Aldebaran",  constellation:"Taureau",      price:139, magnitude:0.85,  image:"../../assets/stars/aldebaran.jpg",  description:"Géante rouge, œil ardent du Taureau, 65 fois plus grande que notre Soleil." },
  { id:6,  name:"Antares",    constellation:"Scorpion",     price:159, magnitude:1.06,  image:"../../assets/stars/antares.jpg",    description:"Supergéante rouge rivale de Mars, cœur pulsant de la constellation du Scorpion." },
  { id:7,  name:"Arcturus",   constellation:"Bouvier",      price:129, magnitude:-0.05, image:"../../assets/stars/arcturus.jpg",   description:"Géante orange, quatrième étoile la plus brillante, guide des navigateurs depuis l'Antiquité." },
  { id:8,  name:"Capella",    constellation:"Cocher",       price:109, magnitude:0.08,  image:"../../assets/stars/capella.jpg",    description:"Système binaire de deux géantes jaunes, sixième étoile la plus brillante du ciel." },
  { id:9,  name:"Procyon",    constellation:"Petit Chien",  price:99,  magnitude:0.34,  image:"../../assets/stars/procyon.jpg",    description:"Étoile sous-géante de type F, compagne lumineuse du Grand Chien dans le Triangle d'Hiver." },
  { id:10, name:"Altair",     constellation:"Aigle",        price:109, magnitude:0.77,  image:"../../assets/stars/altair.jpg",     description:"Étoile en rotation ultra-rapide, aplatie aux pôles, coin du Triangle d'Été." },
  { id:11, name:"Deneb",      constellation:"Cygne",        price:219, magnitude:1.25,  image:"../../assets/stars/deneb.jpg",      description:"Hypergéante bleue, l'une des étoiles intrinsèquement les plus lumineuses connues." },
  { id:12, name:"Spica",      constellation:"Vierge",       price:169, magnitude:0.97,  image:"../../assets/stars/spica.jpg",      description:"Étoile binaire spectroscopique, joyau azuré de la Vierge, repère de la Voie Lactée." },
];

/* ─────────────────────────────────────────────────────────────
   HOME
───────────────────────────────────────────────────────────── */
function HomeScreen({ go, cart, wish, onAdd, onWish }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const phrases = ["Illuminer votre vie.", "Adoptez une étoile voisine.", "La splendeur à portée de clic."];
  const imgs = ["../../assets/hero/hero-1.jpg","../../assets/hero/hero-2.jpg","../../assets/hero/hero-3.jpg"];

  useEffect(() => {
    const t = setInterval(() => setPhraseIdx(i => (i+1) % phrases.length), 4500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setImgIdx(i => (i+1) % imgs.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ color:"#AEC9FF" }}>
      {/* ── Hero ── */}
      <section style={{ position:"relative", height:"100vh", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {/* BG images */}
        {imgs.map((src,i) => (
          <img key={src} src={src} alt="" style={{
            position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
            opacity: i===imgIdx ? 1 : 0,
            transition:"opacity 1.2s ease",
            filter:"brightness(0.28) saturate(0.7)",
            animation: i===imgIdx ? "stlZoom 18s ease-in-out infinite" : "none",
          }}/>
        ))}

        {/* Grain */}
        <GrainOverlay opacity={0.045} blend="overlay"/>

        {/* Ambient colour */}
        <AmbientGlow color="#3D2A54" x="30%" y="60%" size="55%" opacity={0.55} style={{ zIndex:1 }}/>
        <AmbientGlow color="#1a0f28" x="70%" y="40%" size="45%" opacity={0.4} style={{ zIndex:1 }}/>

        {/* Orbit decoration */}
        <div style={{ position:"absolute", right:"-5%", top:"15%", width:520, height:320, opacity:0.55, zIndex:2 }}>
          <OrbitField rings={3} animated={true}/>
        </div>

        {/* Gradient vignettes */}
        <div style={{ position:"absolute", inset:0, zIndex:2,
          background:"linear-gradient(to top, #080610 0%, transparent 35%, transparent 65%, #080610 100%)" }}/>

        {/* Content */}
        <div style={{ position:"relative", zIndex:3, textAlign:"center", padding:"0 24px", maxWidth:800 }}>
          <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:11, letterSpacing:".2em",
            textTransform:"uppercase", color:"rgba(255,179,71,0.7)", marginBottom:20,
            opacity:1 }}>
            STELLA — ADOPT A STAR
          </div>
          <h1 style={{
            fontFamily:"'Dela Gothic One',serif",
            fontSize:"clamp(64px,10vw,120px)", margin:"0 0 8px",
            color:"#E8DEFF", lineHeight:.95, letterSpacing:"-2px",
          }}>Stella</h1>
          <p style={{
            fontFamily:"'Roboto Slab',serif", fontWeight:300,
            fontSize:"clamp(17px,2.5vw,22px)", color:"rgba(232,222,255,0.65)",
            margin:"20px 0 36px", lineHeight:1.5,
            minHeight:"2em",
            transition:"opacity 400ms ease",
          }}>{phrases[phraseIdx]}</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <Btn size="lg" onClick={() => go("catalog")} icon="sparkles">Voir le catalogue</Btn>
            <Btn size="lg" variant="secondary" onClick={() => go("home")}>En savoir plus</Btn>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)",
          zIndex:3, color:"rgba(174,201,255,0.3)",
          animation:"stlFloat 3s ease-in-out infinite" }}>
          <Icon name="arrowDown" size={18}/>
        </div>
      </section>

      {/* ── About ── */}
      <section style={{ maxWidth:1100, margin:"0 auto", padding:"120px 40px 80px",
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
        <Reveal>
          <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
            textTransform:"uppercase", color:"rgba(255,179,71,0.6)", marginBottom:16 }}>
            QUI SOMMES-NOUS
          </div>
          <h2 style={{ fontFamily:"'Dela Gothic One',serif", fontSize:"clamp(32px,4vw,52px)",
            margin:"0 0 24px", color:"#E8DEFF", lineHeight:1.05, letterSpacing:"-1px" }}>
            Un morceau du<br/>ciel, pour vous.
          </h2>
          <p style={{ fontFamily:"'Roboto Slab',serif", fontWeight:300, fontSize:16,
            color:"rgba(174,201,255,0.7)", lineHeight:1.8, marginBottom:32 }}>
            Chez Stella, nous sommes passionnés par les étoiles et leur capacité à inspirer des générations.
            Nous vous proposons une expérience unique : adopter une étoile et la personnaliser pour en faire
            un cadeau inoubliable.
          </p>
          <Btn variant="secondary" onClick={() => {}}>Notre histoire</Btn>
        </Reveal>

        <Reveal delay={0.15}>
          <div style={{ position:"relative", height:380 }}>
            <CosmicGrid color="rgba(174,201,255,0.04)" cols={8} rows={6}/>
            <img src="../../assets/astro.png" alt="Astronaute" style={{
              position:"relative", zIndex:1, width:"100%", height:"100%",
              objectFit:"contain", filter:"drop-shadow(0 0 40px rgba(61,42,84,0.8))",
            }}/>
            <OrbitField rings={2} animated={true} style={{ position:"absolute", inset:0, zIndex:2, opacity:.5 }}/>
          </div>
        </Reveal>
      </section>

      {/* ── New arrivals ── */}
      <section style={{ padding:"0 0 100px", position:"relative" }}>
        <GrainOverlay opacity={0.025}/>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 40px" }}>
          <Reveal>
            <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:40 }}>
              <div>
                <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
                  textTransform:"uppercase", color:"rgba(255,179,71,0.6)", marginBottom:10 }}>
                  CATALOGUE
                </div>
                <h2 style={{ fontFamily:"'Dela Gothic One',serif", fontSize:"clamp(28px,3.5vw,42px)",
                  margin:0, color:"#E8DEFF", letterSpacing:"-0.5px" }}>
                  Dernières étoiles
                </h2>
              </div>
              <Btn variant="ghost" onClick={() => go("catalog")} icon="arrowRight">Voir tout</Btn>
            </div>
          </Reveal>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {STARS.slice(0,8).map((s,i) => (
              <Reveal key={s.id} delay={i*0.06}>
                <StarCard star={s} onOpen={st => go("detail",st)} onAdd={onAdd} onWish={onWish}
                  inCart={cart.some(c=>c.id===s.id)} inWish={wish.some(w=>w.id===s.id)}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Did you know ── */}
      <section style={{ padding:"80px 40px", borderTop:"1px solid rgba(174,201,255,0.05)",
        borderBottom:"1px solid rgba(174,201,255,0.05)", position:"relative", overflow:"hidden" }}>
        <AmbientGlow color="#FFB347" x="50%" y="50%" size="40%" opacity={0.04}/>
        <Reveal>
          <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
            <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
              textTransform:"uppercase", color:"rgba(255,179,71,0.6)", marginBottom:20 }}>
              LE SAVIEZ-VOUS ?
            </div>
            <blockquote style={{ fontFamily:"'Roboto Slab',serif", fontWeight:300,
              fontSize:"clamp(18px,2.5vw,26px)", color:"rgba(232,222,255,0.75)",
              lineHeight:1.6, margin:0, padding:0, border:"none" }}>
              « Il y a plus d'étoiles dans l'univers que de grains de sable sur toutes les plages de la Terre. »
            </blockquote>
          </div>
        </Reveal>
      </section>

      {/* ── CTA band ── */}
      <section style={{ padding:"100px 40px", position:"relative", overflow:"hidden", textAlign:"center" }}>
        <div style={{ position:"absolute", inset:0, opacity:.35 }}>
          <OrbitField rings={4} animated={true} style={{ width:"100%", height:"100%",
            position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}/>
        </div>
        <GrainOverlay opacity={0.03}/>
        <Reveal>
          <div style={{ position:"relative", zIndex:1 }}>
            <h2 style={{ fontFamily:"'Dela Gothic One',serif", fontSize:"clamp(32px,5vw,64px)",
              margin:"0 0 16px", color:"#E8DEFF", letterSpacing:"-1px", lineHeight:1 }}>
              Rejoignez-nous
            </h2>
            <p style={{ fontFamily:"'Roboto Slab',serif", fontWeight:300, fontSize:17,
              color:"rgba(174,201,255,0.6)", maxWidth:480, margin:"0 auto 36px", lineHeight:1.7 }}>
              Rejoignez la communauté Stella et faites partie de notre univers.
            </p>
            <Btn size="lg" onClick={() => go("login")}>Créer un compte</Btn>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CATALOG
───────────────────────────────────────────────────────────── */
function CatalogScreen({ go, cart, wish, onAdd, onWish }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("relevance");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceMax, setPriceMax] = useState(300);

  const filtered = useMemo(() => {
    let res = STARS.filter(s =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.constellation.toLowerCase().includes(q.toLowerCase())
    ).filter(s => s.price <= priceMax);
    if (sort === "price-asc")  res = [...res].sort((a,b) => a.price-b.price);
    if (sort === "price-desc") res = [...res].sort((a,b) => b.price-a.price);
    if (sort === "name")       res = [...res].sort((a,b) => a.name.localeCompare(b.name));
    return res;
  }, [q, sort, priceMax]);

  return (
    <div style={{ minHeight:"100vh", paddingTop:80 }}>
      {/* Page header */}
      <div style={{ padding:"40px 40px 32px", borderBottom:"1px solid rgba(174,201,255,0.06)",
        position:"relative", overflow:"hidden" }}>
        <GrainOverlay opacity={0.03}/>
        <AmbientGlow color="#3D2A54" x="80%" y="50%" size="40%" opacity={0.3}/>
        <div style={{ maxWidth:1100, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
            textTransform:"uppercase", color:"rgba(255,179,71,0.6)", marginBottom:10 }}>
            CATALOGUE
          </div>
          <h1 style={{ fontFamily:"'Dela Gothic One',serif",
            fontSize:"clamp(36px,5vw,64px)", margin:"0 0 24px",
            color:"#E8DEFF", letterSpacing:"-1px" }}>
            {filtered.length} étoiles disponibles
          </h1>
          {/* Search + filters */}
          <div style={{ display:"flex", gap:10, maxWidth:720 }}>
            <div style={{ flex:1, position:"relative" }}>
              <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
                color:"rgba(174,201,255,0.3)", zIndex:1 }}><Icon name="search" size={15}/></div>
              <input value={q} onChange={e=>setQ(e.target.value)}
                placeholder="Rechercher par nom ou constellation…"
                style={{ width:"100%", padding:"11px 14px 11px 40px", fontSize:14,
                  background:"rgba(20,12,32,0.7)", color:"#AEC9FF",
                  border:"1px solid rgba(174,201,255,0.1)", borderRadius:5,
                  fontFamily:"'Roboto',sans-serif", outline:"none", boxSizing:"border-box",
                  transition:"border-color 200ms" }}
                onFocus={e=>e.target.style.borderColor="rgba(255,179,71,0.35)"}
                onBlur={e=>e.target.style.borderColor="rgba(174,201,255,0.1)"}
              />
            </div>
            <button onClick={() => setFilterOpen(v=>!v)} style={{
              padding:"0 18px", background: filterOpen ? "rgba(255,179,71,0.12)" : "rgba(20,12,32,0.7)",
              border:`1px solid ${filterOpen ? "rgba(255,179,71,0.3)" : "rgba(174,201,255,0.1)"}`,
              borderRadius:5, color: filterOpen ? "#FFB347" : "rgba(174,201,255,0.6)",
              cursor:"pointer", display:"flex", alignItems:"center", gap:7,
              fontFamily:"'Roboto',sans-serif", fontSize:13, transition:"all 200ms",
            }}>
              <Icon name="filter" size={14}/> Filtres
            </button>
            <select value={sort} onChange={e=>setSort(e.target.value)}
              style={{ padding:"0 14px", background:"rgba(20,12,32,0.7)",
                border:"1px solid rgba(174,201,255,0.1)", borderRadius:5,
                color:"rgba(174,201,255,0.7)", fontFamily:"'Roboto',sans-serif",
                fontSize:13, cursor:"pointer", outline:"none" }}>
              <option value="relevance">Pertinence</option>
              <option value="price-asc">Prix ↑</option>
              <option value="price-desc">Prix ↓</option>
              <option value="name">Nom A–Z</option>
            </select>
          </div>
          {/* Filter panel */}
          {filterOpen && (
            <div style={{ marginTop:16, padding:"16px 20px",
              background:"rgba(20,12,32,0.8)", border:"1px solid rgba(174,201,255,0.08)",
              borderRadius:6, maxWidth:720, display:"flex", gap:24, alignItems:"center" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".1em",
                  textTransform:"uppercase", color:"rgba(174,201,255,0.4)", marginBottom:8 }}>
                  PRIX MAX — {priceMax} €
                </div>
                <input type="range" min={50} max={300} step={10} value={priceMax}
                  onChange={e=>setPriceMax(Number(e.target.value))}
                  style={{ width:"100%", accentColor:"#FFB347" }}/>
              </div>
              <Btn variant="ghost" size="sm" onClick={()=>{setQ("");setPriceMax(300);setSort("relevance");}}>
                Réinitialiser
              </Btn>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 40px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0",
            color:"rgba(174,201,255,0.3)", fontFamily:"'Roboto Slab',serif", fontSize:16 }}>
            Aucune étoile ne correspond à votre recherche.
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:20 }}>
            {filtered.map((s,i) => (
              <Reveal key={s.id} delay={Math.min(i*0.04,0.3)}>
                <StarCard star={s} onOpen={st=>go("detail",st)} onAdd={onAdd} onWish={onWish}
                  inCart={cart.some(c=>c.id===s.id)} inWish={wish.some(w=>w.id===s.id)}/>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DETAIL
───────────────────────────────────────────────────────────── */
function DetailScreen({ go, current, cart, wish, onAdd, onWish }) {
  const star = current || STARS[0];
  const inCart = cart.some(c=>c.id===star.id);
  const inWish = wish.some(w=>w.id===star.id);
  const related = STARS.filter(s=>s.id!==star.id).slice(0,4);

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Hero */}
      <div style={{ position:"relative", height:"70vh", overflow:"hidden" }}>
        <img src={star.image} alt={star.name} style={{
          width:"100%", height:"100%", objectFit:"cover",
          filter:"brightness(0.35) saturate(0.8)",
        }}/>
        <GrainOverlay opacity={0.04}/>
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to top, #080610 0%, transparent 50%)" }}/>
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to right, #080610 0%, transparent 50%)" }}/>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"55%", opacity:.35 }}>
          <OrbitField rings={3} animated={true} style={{ width:"100%", height:"100%" }}/>
        </div>
        {/* Text overlay on image */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:2, padding:"0 40px 48px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
              textTransform:"uppercase", color:"rgba(255,179,71,0.7)", marginBottom:10 }}>
              {star.constellation}
            </div>
            <h1 style={{ fontFamily:"'Dela Gothic One',serif",
              fontSize:"clamp(56px,8vw,96px)", margin:0,
              color:"#E8DEFF", lineHeight:.95, letterSpacing:"-2px" }}>
              {star.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"56px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:60 }}>
          {/* Left */}
          <Reveal>
            <p style={{ fontFamily:"'Roboto Slab',serif", fontWeight:300,
              fontSize:18, color:"rgba(174,201,255,0.75)", lineHeight:1.8, marginBottom:40 }}>
              {star.description}
            </p>
            {/* Specs */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1,
              border:"1px solid rgba(174,201,255,0.07)", borderRadius:6, overflow:"hidden", marginBottom:40 }}>
              {[["Constellation",star.constellation],["Magnitude",star.magnitude],["Distance","8,6 al"],["Luminosité","25,4 L☉"],["Type","Étoile principale"],["Statut","Disponible"]].map(([k,v])=>(
                <div key={k} style={{ padding:"16px 20px",
                  background:"rgba(20,12,32,0.5)",
                  borderBottom:"1px solid rgba(174,201,255,0.05)" }}>
                  <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".1em",
                    textTransform:"uppercase", color:"rgba(174,201,255,0.35)", marginBottom:4 }}>{k}</div>
                  <div style={{ fontFamily:"'Roboto Slab',serif", fontSize:15, color:"#AEC9FF" }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn variant="ghost" onClick={()=>go("catalog")} icon="arrowLeft">Retour</Btn>
            </div>
          </Reveal>

          {/* Right — purchase panel */}
          <Reveal delay={0.1}>
            <div style={{ position:"sticky", top:80, background:"rgba(20,12,32,0.8)",
              border:"1px solid rgba(174,201,255,0.08)", borderRadius:8, padding:28,
              backdropFilter:"blur(12px)" }}>
              <GrainOverlay opacity={0.03}/>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42,
                color:"#FFB347", letterSpacing:".02em", marginBottom:4 }}>{star.price} €</div>
              <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:12,
                color:"rgba(174,201,255,0.4)", marginBottom:24 }}>Certificat d'adoption inclus</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <Btn fullWidth disabled={inCart} onClick={()=>onAdd(star)} icon="cart">
                  {inCart ? "Ajouté au panier" : "Ajouter au panier"}
                </Btn>
                <Btn fullWidth variant="secondary" onClick={()=>onWish(star)} icon="heart">
                  {inWish ? "Retirer des favoris" : "Ajouter aux favoris"}
                </Btn>
              </div>
              <CosmicDivider style={{ margin:"20px 0" }}/>
              <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:11,
                color:"rgba(174,201,255,0.35)", lineHeight:1.7 }}>
                ✓ Certificat personnalisé<br/>
                ✓ Coordonnées exactes<br/>
                ✓ Livraison numérique immédiate
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related */}
        <div style={{ marginTop:80 }}>
          <Reveal>
            <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
              textTransform:"uppercase", color:"rgba(174,201,255,0.4)", marginBottom:16 }}>
              VOUS POURRIEZ AIMER
            </div>
          </Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {related.map((s,i)=>(
              <Reveal key={s.id} delay={i*0.06}>
                <StarCard star={s} onOpen={st=>go("detail",st)} onAdd={onAdd} onWish={onWish}
                  inCart={cart.some(c=>c.id===s.id)} inWish={wish.some(w=>w.id===s.id)}/>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CART
───────────────────────────────────────────────────────────── */
function CartScreen({ go, cart, onRemove }) {
  const total = cart.reduce((s,x)=>s+x.price,0);

  if (cart.length===0) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      flexDirection:"column", gap:20, textAlign:"center", padding:40 }}>
      <div style={{ color:"rgba(174,201,255,0.15)" }}><Icon name="cart" size={64}/></div>
      <h1 style={{ fontFamily:"'Dela Gothic One',serif", fontSize:32, margin:0, color:"#E8DEFF" }}>
        Votre panier est vide
      </h1>
      <p style={{ fontFamily:"'Roboto Slab',serif", fontWeight:300, fontSize:16,
        color:"rgba(174,201,255,0.5)", maxWidth:380, margin:0, lineHeight:1.7 }}>
        Parcourez notre catalogue pour ajouter des étoiles à votre panier.
      </p>
      <Btn onClick={()=>go("catalog")} icon="sparkles">Parcourir le catalogue</Btn>
    </div>
  );

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"100px 40px 60px" }}>
      <Reveal>
        <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".2em",
          textTransform:"uppercase", color:"rgba(255,179,71,0.6)", marginBottom:10 }}>
          MON PANIER
        </div>
        <h1 style={{ fontFamily:"'Dela Gothic One',serif", fontSize:"clamp(32px,4vw,52px)",
          margin:"0 0 40px", color:"#E8DEFF", letterSpacing:"-1px" }}>
          {cart.length} étoile{cart.length>1?"s":""} sélectionnée{cart.length>1?"s":""}
        </h1>
      </Reveal>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:32, alignItems:"start" }}>
        {/* Items */}
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {cart.map((s,i) => (
            <Reveal key={s.id} delay={i*0.05}>
              <div style={{ display:"flex", gap:0, borderBottom:"1px solid rgba(174,201,255,0.05)",
                padding:"20px 0", alignItems:"center" }}>
                <img src={s.image} alt={s.name} style={{
                  width:80, height:80, objectFit:"cover", borderRadius:4, flexShrink:0,
                  filter:"brightness(0.85) saturate(0.9)"
                }}/>
                <div style={{ flex:1, padding:"0 20px" }}>
                  <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".1em",
                    textTransform:"uppercase", color:"rgba(174,201,255,0.35)", marginBottom:3 }}>
                    {s.constellation}
                  </div>
                  <div style={{ fontFamily:"'Dela Gothic One',serif", fontSize:18, color:"#E8DEFF" }}>
                    {s.name}
                  </div>
                </div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22,
                  color:"#FFB347", letterSpacing:".02em", marginRight:20 }}>
                  {s.price} €
                </div>
                <Btn variant="ghost" size="sm" onClick={()=>onRemove(s.id)}>
                  <Icon name="x" size={14}/>
                </Btn>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Summary */}
        <Reveal delay={0.1}>
          <div style={{ background:"rgba(20,12,32,0.8)", border:"1px solid rgba(174,201,255,0.07)",
            borderRadius:8, padding:28, position:"sticky", top:80, backdropFilter:"blur(12px)" }}>
            <GrainOverlay opacity={0.03}/>
            <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:10, letterSpacing:".15em",
              textTransform:"uppercase", color:"rgba(174,201,255,0.4)", marginBottom:20 }}>
              RÉSUMÉ
            </div>
            {cart.map(s=>(
              <div key={s.id} style={{ display:"flex", justifyContent:"space-between",
                padding:"6px 0", borderBottom:"1px solid rgba(174,201,255,0.04)",
                fontFamily:"'Roboto',sans-serif", fontSize:13 }}>
                <span style={{ color:"rgba(174,201,255,0.6)" }}>{s.name}</span>
                <span style={{ color:"rgba(255,179,71,0.8)" }}>{s.price} €</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"16px 0 0",
              fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:".02em" }}>
              <span style={{ color:"rgba(174,201,255,0.6)" }}>Total</span>
              <span style={{ color:"#FFB347" }}>{total} €</span>
            </div>
            <div style={{ marginTop:20 }}>
              <Btn fullWidth size="lg" onClick={()=>go("checkout")} icon="arrowRight">
                Passer commande
              </Btn>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────────────────────── */
function LoginScreen({ go }) {
  const [tab, setTab] = useState("login");
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      padding:24, position:"relative" }}>
      <AmbientGlow color="#3D2A54" x="50%" y="50%" size="55%" opacity={0.35}/>
      <div style={{ position:"absolute", inset:0, opacity:.2 }}>
        <OrbitField rings={3} animated={false} style={{ width:"100%", height:"100%",
          position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }}/>
      </div>
      <GrainOverlay opacity={0.04}/>

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <img src="../../assets/logo/monogram.svg" alt="Stella"
            style={{ width:52, height:52, marginBottom:12 }}/>
          <h1 style={{ fontFamily:"'Dela Gothic One',serif", fontSize:28, margin:0,
            color:"#E8DEFF", letterSpacing:"-0.5px" }}>
            {tab==="login" ? "Connexion" : "Inscription"}
          </h1>
        </div>

        {/* Card */}
        <div style={{ background:"rgba(12,8,22,0.85)", border:"1px solid rgba(174,201,255,0.08)",
          borderRadius:10, padding:32, backdropFilter:"blur(20px)" }}>
          <GrainOverlay opacity={0.025}/>

          {/* Tab switcher */}
          <div style={{ display:"flex", gap:0, background:"rgba(174,201,255,0.04)",
            borderRadius:5, padding:3, marginBottom:24 }}>
            {[["login","Se connecter"],["register","S'inscrire"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{
                flex:1, padding:"7px 10px", border:"none", borderRadius:4, cursor:"pointer",
                background: tab===id ? "rgba(61,42,84,0.8)" : "transparent",
                color: tab===id ? "#AEC9FF" : "rgba(174,201,255,0.4)",
                fontFamily:"'Bebas Neue',sans-serif", letterSpacing:".06em", fontSize:13,
                boxShadow: tab===id ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                transition:"all 200ms",
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {tab==="register" && (
              <Input label="Nom complet" placeholder="Marie Dupont" icon="user"/>
            )}
            <Input label="Email" type="email" placeholder="marie@exemple.fr" icon="mail"/>
            <Input label="Mot de passe" type="password" placeholder="••••••••" icon="lock"/>
            <div style={{ marginTop:6 }}>
              <Btn fullWidth size="lg" onClick={()=>go("home")}>
                {tab==="login" ? "Se connecter" : "Créer mon compte"}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, CatalogScreen, DetailScreen, CartScreen, LoginScreen, STARS });
