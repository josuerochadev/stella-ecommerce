# Audit Performance, Securite, SEO & Bonnes Pratiques — Stella E-Commerce

**Date** : 2026-05-07
**Scope** : client/ + server/ (full-stack)
**Complement de** : AUDIT_ARCHITECTURE.md (architecture & organisation)

---

## Tableau de synthese

| Categorie                              | Critique | Important | Mineur | Note |
| -------------------------------------- | -------- | --------- | ------ | ---- |
| Performance Frontend (bundle, renders) | 0        | 3         | 2      | 6/10 |
| Optimisation des assets (images, fonts)| 1        | 2         | 1      | 3/10 |
| Performance Backend (DB, caching)      | 1        | 4         | 2      | 4/10 |
| Securite (OWASP Top 10)               | 1        | 3         | 3      | 6/10 |
| SEO & Core Web Vitals                 | 2        | 3         | 2      | 2/10 |
| Gestion d'erreurs & logs              | 0        | 2         | 2      | 6/10 |
| Dependencies & audit                  | 1        | 1         | 0      | 4/10 |
| **Total**                             | **6**    | **18**    | **12** | **4.5/10** |

---

## 1. PERFORMANCE FRONTEND

### [OK] Code splitting & lazy loading

Toutes les routes sont lazy-loaded via `React.lazy()` + `Suspense` dans `client/src/App.tsx:15-60`. 14 pages lazy-loaded. Bien implemente.

### [OK] Memoisation & re-renders

- `React.memo` utilise sur les composants de liste : `CatalogStarCard`, `CartStarCard`, `StarCard`, `Catalog`, `ProductDetail`
- `useCallback` dans les hooks critiques (`useCartActions`, `useApiCall`, `useSearchLogic`)
- `useMemo` pour les calculs derives (`useCatalogSearch`, `useStarDetail`)
- Zustand : selectors granulaires utilises correctement (ex: `AddToCartButton.tsx:17-23`)
- 94 occurrences de useMemo/useCallback/React.memo sur 24 fichiers — bon usage

### [I-P1] Pas d'AbortController sur les requetes HTTP

- **Fichier** : `client/src/services/httpClient.ts`
- **Probleme** : Aucune gestion d'annulation des requetes. Si l'utilisateur navigue pendant un fetch, la requete continue et peut causer des memory leaks ou des updates de state sur des composants detruits.
- **Recommandation** : Ajouter AbortController dans httpClient ou utiliser un hook wrapper avec cleanup.

### [I-P2] Pas de cache API cote client (SWR/React Query)

- **Fichier** : `client/src/stores/useCartStore.ts`, `client/src/hooks/useStarDetail.ts`
- **Probleme** : Chaque navigation re-fetch toutes les donnees. `useStarDetail:31` appelle `fetchStars()` a chaque vue produit pour les "related stars". Pas de stale-while-revalidate, pas de cache local.
- **Impact** : Requetes API redondantes, latence percue plus elevee.
- **Recommandation** : Integrer React Query ou SWR pour caching + dedup automatique.

### [I-P3] Pas d'analyse de bundle configuree

- **Fichier** : `client/config-overrides.js` — seulement des alias, pas d'optimisation webpack
- **Fichier** : `client/package.json` — pas de script `analyze`
- **Probleme** : Impossible de mesurer la taille du bundle sans outil. `react-slick` + `slick-carousel` sont des deps lourdes pour un simple carousel.
- **Recommandation** : Ajouter `webpack-bundle-analyzer`, envisager `embla-carousel-react` comme alternative legere.

### [M-P1] Fallback Suspense minimal

- **Fichier** : `client/src/App.tsx:60`
- **Probleme** : `<div className="text-center text-text">Loading...</div>` — pas de skeleton, CLS potentiel.
- **Recommandation** : Remplacer par un skeleton loader pour reduire le CLS.

### [M-P2] Pas de prefetch des routes probables

- **Probleme** : Aucun prefetch des chunks JS pour les routes probables (ex: prefetch du chunk Catalog quand l'utilisateur est sur Home).
- **Recommandation** : Ajouter du prefetching conditionnel via `<link rel="prefetch">` ou router-level prefetch.

---

## 2. OPTIMISATION DES ASSETS

### [C-A1] Images non optimisees — 22 MB de JPG sans format moderne

- **Dossier** : `client/public/assets/images/stars/`
- **Constat** :
  - 22 MB d'images total
  - 100% JPG, **0 WebP, 0 AVIF**
  - Fichiers individuels jusqu'a 1.3 MB (`canopus.jpg`)
  - Pas de versions responsive (srcset)
- **Impact** : LCP catastrophique sur mobile, consommation data excessive.
- **Recommandation** :
  - Convertir toutes les images en WebP (reduction ~30-50%)
  - Generer des variantes responsive (400px, 800px, 1200px)
  - Utiliser `<picture>` avec fallback JPG
  - Ajouter `srcset` et `sizes`

### [I-A1] Aucun lazy loading natif sur les images

- **Fichiers** : `HeroSection.tsx:25-41`, `CatalogStarCard.tsx:28`, `DetailStarCard.tsx:26`, `CartStarCard.tsx:22`
- **Constat** : 8 balises `<img>` trouvees dans le code, **aucune** n'a `loading="lazy"`.
- **Impact** : Toutes les images chargees au premier render, meme hors viewport.
- **Recommandation** : Ajouter `loading="lazy"` sur toutes les images sauf la hero (LCP).

### [I-A2] Images sans dimensions explicites (width/height)

- **Fichiers** : `HeroSection.tsx:25-41` — aucun attribut `width`/`height` sur les `<img>`
- **Impact** : Layout shift (CLS) pendant le chargement des images.
- **Recommandation** : Ajouter `width` et `height` ou utiliser `aspect-ratio` CSS.

### [M-A1] Fonts — chargement correct mais non optimise

- **Fichier** : `client/public/index.html:16-18`
- **Constat** :
  - `preconnect` vers Google Fonts ✅
  - `font-display: swap` dans l'URL Google Fonts ✅
  - **Mais** : 4 familles chargees (Bebas Neue, Dela Gothic One, Roboto Slab, Roboto) avec **tous les poids** de Roboto (100-900, italic+normal = ~18 variantes)
  - Pas de subsetting
  - Pas de `<link rel="preload">` pour la font critique
- **Impact** : ~500KB+ de fonts telecharges, la plupart inutilises.
- **Recommandation** :
  - Limiter Roboto aux poids utilises (400, 500, 700 typiquement)
  - Self-host les fonts pour controle du cache
  - Preload la font critique du hero

---

## 3. PERFORMANCE BACKEND

### [I-B1] Aucune compression des reponses (gzip/brotli)

- **Fichier** : `server/src/app.js`
- **Constat** : Le middleware `compression` n'est pas installe ni utilise. Toutes les reponses JSON sont envoyees en clair.
- **Impact** : Reponses JSON 3-10x plus grosses que necessaire sur le reseau.
- **Recommandation** : `npm install compression` + `app.use(compression())` avant les routes.

### [I-B2] Pas de cache applicatif (Redis/in-memory)

- **Constat** : Aucune couche de cache. Chaque requete au catalogue, constellations, FAQ execute une requete SQL.
- **Fichiers** : Tous les controllers/services font des queries directes sans cache.
- **Impact** : Charge DB inutile pour des donnees rarement modifiees (catalogue d'etoiles).
- **Recommandation** : Ajouter `node-cache` ou Redis pour le catalogue (TTL 5min), les constellations, les stats.

### [C-B3] Aucun index de base de donnees defini

- **Fichiers** : Tous les models (`User.js`, `Star.js`, `Order.js`, `CartItem.js`, `Review.js`, `Wishlist.js`, `OrderStar.js`, `RefreshToken.js`)
- **Constat** : Aucun index explicite defini dans les modeles Sequelize. Les foreign keys ne sont pas indexes :
  - `Order.userId` (requete frequente dans `findByUserId`)
  - `Review.starId`, `Review.userId` (utilisees dans `findByStarId`, `findByUserId`)
  - `CartItem.cartId`, `CartItem.starId`
  - `Wishlist.userId`, `Wishlist.starId`
  - `RefreshToken.userId`
- **Note** : Un script `npm run add-indexes` existe dans `package.json:21` mais n'est jamais appele automatiquement.
- **Impact** : Requetes 10-100x plus lentes sur des tables volumineuses.
- **Recommandation** : Ajouter des indexes sur toutes les foreign keys et les champs frequemment requetes.

### [I-B3] Requetes SQL brutes sans optimisation d'attributs

- **Fichiers** : `server/src/services/StarAdminService.js:31`, `SystemStatsService.js:18`, `dashboardStatistics.js:20`
- **Constat** : 15+ requetes `sequelize.query()` brutes. Utilisation correcte de `replacements` (pas d'injection), mais aucune n'utilise `attributes` pour limiter les colonnes retournees.
- **Fichier** : `server/src/repositories/SequelizeStarRepository.js` — eager loading present avec `include` ✅
- **Recommandation** : Ajouter `attributes` aux requetes pour ne pas fetch des colonnes inutiles.

### [I-B4] getAllStars() sans pagination

- **Fichier** : `server/src/controllers/starController.js:23`, `server/src/repositories/SequelizeStarRepository.js:69-74`
- **Constat** : `getAllStars()` retourne TOUTES les etoiles sans limit ni offset. Fetches tous les attributs.
- **Impact** : Reponses volumineuses, temps de reponse croissant avec le catalogue.
- **Recommandation** : Ajouter pagination server-side (limit/offset) et selection d'attributs.

### [M-B1] Connection pool non configure explicitement

- **Fichier** : `server/src/config/database.js`
- **Constat** : Sequelize utilise les defaults (pool min:0, max:5). Acceptable en dev, sous-dimensionne en production.
- **Recommandation** : Configurer explicitement le pool (min:2, max:20, idle:10000).

### [M-B2] Cache-Control agressif sur les API

- **Fichier** : `server/src/middlewares/contentSecurity.js:38`
- **Constat** : `Cache-Control: no-store, no-cache, must-revalidate` sur **toutes** les API, y compris le catalogue public.
- **Recommandation** : Differencier les endpoints : `max-age=300` pour le catalogue public, `no-store` pour les endpoints authentifies.

---

## 4. SECURITE (OWASP Top 10)

### [OK] Protection XSS — solide

- Pas de `dangerouslySetInnerHTML` dans le client ✅
- DOMPurify installe et utilise cote serveur (`server/src/middlewares/sanitization.js`) avec sanitisation stricte de body, query, params ✅
- CSP configuree dans `contentSecurity.js` ✅
- Helmet actif (`app.js:36`) ✅

### [OK] Protection SQL Injection — correcte

- Toutes les requetes `sequelize.query()` utilisent `replacements` (parametres) ✅
- Sequelize ORM pour les operations CRUD standard ✅
- Joi validation sur les inputs ✅

### [OK] Protection CSRF — implementee

- Double token pattern : session + cookie/header (`server/src/middlewares/modernCsrf.js`) ✅
- Client envoie le token via header + cookie ✅

### [OK] Authentification — correcte avec reserve

- JWT avec cookies `httpOnly: true`, `sameSite: strict` en prod (`server/src/constants/app.js:87-89`) ✅
- Bcrypt pour le hashing des mots de passe (`server/src/services/BcryptHashingService.js`) avec 10 salt rounds ✅
- Rate limiting sur auth endpoints (`authLimiter`, `createAccountLimiter`) ✅
- Token cleanup schedule (`app.js:115`) ✅
- Access token courte duree (15min), refresh token 7 jours en httpOnly cookie ✅

### [C-S0] Access token stocke dans localStorage (vulnerable XSS)

- **Fichiers** : `client/src/context/AuthContext.tsx:31,45,61`, `client/src/services/authService.ts:101,109,117`
- **Constat** : L'access token JWT est stocke dans `localStorage`, accessible par n'importe quel script JS. En cas de XSS (meme via une dependance compromise), le token est exfiltre.
- **Note** : Le refresh token est correctement en `httpOnly` cookie.
- **Impact** : Vol de session possible en cas de XSS.
- **Recommandation** : Migrer l'access token vers un cookie `httpOnly` ou utiliser un pattern BFF (Backend For Frontend).

### [OK] Rate limiting — en place

- Rate limiters configures : general, auth, create account, password reset (`server/src/middlewares/rateLimiter.js`) ✅
- Applique globalement (`app.js:39`) ✅

### [I-S1] Stack traces exposees en mode developpement

- **Fichier** : `server/src/middlewares/errorHandler.js:36`
- **Constat** : En dev, `err.stack`, `err.code`, `err.path` sont envoyes au client. En production, correctement masques.
- **Risque** : Si `NODE_ENV` n'est pas set, le mode n'est ni "production" ni "test" → aucune reponse d'erreur envoyee (lignes 94-96 ne couvrent pas le cas undefined).
- **Recommandation** : Ajouter un fallback `else { sendErrorProd(error, res); }` ou valider NODE_ENV au demarrage.

### [I-S2] CSP non appliquee aux pages HTML

- **Fichier** : `server/src/middlewares/contentSecurity.js`
- **Constat** : `setContentSecurityPolicy` est definie mais **jamais utilisee** dans `app.js`. Seul `setApiSecurityHeaders` est monte (ligne 82). Les pages HTML servies n'ont donc pas de CSP.
- **Impact** : Protection XSS via CSP absente sur les pages.
- **Recommandation** : Appliquer `setContentSecurityPolicy` aux routes HTML ou configurer Helmet avec CSP.

### [M-S1] Validator.js vulnerable

- **Constat** : `npm audit` server montre `validator <=13.15.20` avec bypass de `isURL` (GHSA-9965-vmph-33xx).
- **Recommandation** : `npm update validator`

### [M-S2] `connect-src 'self' https:` trop permissif dans la CSP

- **Fichier** : `server/src/middlewares/contentSecurity.js:15`
- **Constat** : `connect-src 'self' https:` autorise les connexions vers n'importe quel domaine HTTPS.
- **Recommandation** : Restreindre aux domaines API connus.

### [I-S3bis] Validation de paiement accepte des numeros de carte complets

- **Fichier** : `server/src/validations/paymentValidation.js:14-16`
- **Constat** : `number: Joi.string().pattern(/^\d{13,19}$/).required()` — accepte des numeros de carte bruts. Les numeros transitent dans les logs, la memoire, potentiellement en base.
- **Impact** : Non-conformite PCI DSS, exposition de donnees sensibles.
- **Recommandation** : Utiliser un gateway de paiement (Stripe, PayPal) avec tokenisation. Ne jamais manipuler de numeros de carte cote serveur.

### [M-S3] Session secret fallback sur JWT secret

- **Fichier** : `server/src/constants/app.js` ou `server/src/config/config.js`
- **Constat** : Deja identifie dans AUDIT_ARCHITECTURE.md (I10). Le fallback `JWT_SECRET + '_session'` est dangereux.
- **Statut** : Corrige (I10 marque FAIT dans l'audit architecture).

### [M-S4bis] `unsafe-inline` dans style-src de la CSP

- **Fichier** : `server/src/middlewares/contentSecurity.js:12`
- **Constat** : `style-src 'self' 'unsafe-inline'` — autorise les styles inline, ce qui affaiblit la protection contre les attaques CSS injection.
- **Recommandation** : Utiliser des nonces ou hashes pour les styles inline necessaires.

---

## 5. SEO & CORE WEB VITALS

### [C-S1] SPA sans SSR/SSG — aucun contenu indexable

- **Constat** : Application 100% client-side rendered (Create React App). Aucune page n'est pre-rendue.
- **Impact** : Les moteurs de recherche voient une page vide avec `<div id="root"></div>`. Aucun produit, aucune page n'est indexable nativement.
- **Recommandation** :
  - Migrer vers Next.js (SSR/SSG) pour les pages critiques (catalogue, fiches produits, home)
  - Ou implementer un pre-rendering statique (react-snap, prerender.io)

### [C-S2] Meta tags par defaut — non personnalisees

- **Fichier** : `client/public/index.html:12`
- **Constat** :
  - `<meta name="description" content="Web site created using create-react-app">` — description par defaut CRA, non personnalisee
  - Pas de balises Open Graph (`og:title`, `og:description`, `og:image`)
  - Pas de Twitter Cards
  - Pas de canonical URL
  - Title statique "Stella" sans variation par page (SPA)
- **Impact** : Partage social sans preview, SEO devastee.
- **Recommandation** :
  - Installer `react-helmet-async` pour meta tags dynamiques par page
  - Ajouter OG tags et Twitter Cards

### [I-S3] Pas de robots.txt ni sitemap.xml

- **Constat** : Ni `robots.txt` ni `sitemap.xml` ne sont presents dans `client/public/`.
- **Impact** : Crawling non guide, pas de soumission aux moteurs de recherche.
- **Recommandation** : Creer `robots.txt` et `sitemap.xml` dans `client/public/`.

### [I-S4] Pas de donnees structurees (JSON-LD)

- **Constat** : Aucun schema.org/JSON-LD trouve dans le code. Pour un e-commerce, c'est critique.
- **Impact** : Pas de rich snippets dans les resultats de recherche (prix, notes, disponibilite).
- **Recommandation** : Ajouter JSON-LD pour Product, Review, BreadcrumbList, Organization.

### [I-S5] Pas de suivi Core Web Vitals

- **Constat** : Pas de `reportWebVitals`, pas de monitoring LCP/CLS/INP.
- **Recommandation** : Integrer `web-vitals` pour mesurer et monitorer.

### [M-S4] Heading hierarchy non verifiee

- **Constat** : SPA avec routes multiples — risque de `<h1>` multiples ou manquants par page. Necessite verification page par page.

### [M-S5] Manifest.json minimal

- **Fichier** : `client/public/manifest.json`
- **Constat** : Manque les icones 192x192 et 512x512 pour PWA. Seul favicon.ico reference.

---

## 6. GESTION D'ERREURS & LOGS

### [OK] Error handler centralise backend

- `server/src/middlewares/errorHandler.js` — pattern Strategy avec 6+ strategies pour Sequelize, validation, JWT, rate limiting ✅
- Logs Winston avec fichier + console ✅
- Request ID tracking ✅
- Distinction dev/prod pour les reponses d'erreur ✅

### [OK] Error boundaries frontend

- `client/src/components/ErrorBoundary.tsx` — global ✅
- Feature-level error boundaries ajoutees (AUDIT_ARCHITECTURE Phase 6, item 28) ✅

### [I-L0] Pas de handler process-level pour les exceptions non capturees

- **Fichier** : `server/src/app.js`
- **Constat** : Aucun `process.on('uncaughtException')` ni `process.on('unhandledRejection')` n'est configure. En cas d'erreur non capturee, le serveur crash silencieusement.
- **Impact** : Perte de service sans log ni alerte.
- **Recommandation** : Ajouter des handlers globaux avec logging + graceful shutdown.

### [I-L1] Pas de log rotation ni taille max

- **Fichier** : `server/src/middlewares/errorHandler.js:11`
- **Constat** : `new transports.File({ filename: "error.log", level: "error" })` — pas de `maxsize`, pas de `maxFiles`, pas de rotation.
- **Impact** : Le fichier `error.log` grossit indefiniment en production.
- **Recommandation** : Ajouter `maxsize: '20m'`, `maxFiles: 5` ou utiliser `winston-daily-rotate-file`.

### [M-L1] Logger client envoie vers Beacon API mais sans endpoint

- **Fichier** : `client/src/utils/logger.ts:51,62`
- **Constat** : TODOs remplaces par Beacon API (Phase 6), mais si aucun endpoint monitoring n'existe, les beacons sont perdus.

### [M-L2] Morgan format "combined" verbeux

- **Fichier** : `server/src/app.js:60`
- **Constat** : Format `combined` inclut user-agent, referer complets. OK en prod, bruyant en dev.
- **Recommandation** : Utiliser `dev` en developpement, `combined` en production.

---

## 7. DEPENDANCES & AUDIT

### [C-D1] 44 vulnerabilites client, 27 vulnerabilites serveur

- **Client** : 11 low, 10 moderate, 22 high, 1 critical
  - Critical : `nth-check` (ReDoS)
  - High : `webpack` (SSRF), `underscore` (DoS), `tar`, `postcss`
- **Serveur** : 3 low, 7 moderate, 17 high
  - High : `validator` (URL bypass), `underscore` (DoS), `tar`, `bcrypt` (via node-pre-gyp)
- **Recommandation** : Executer `npm audit fix` sur les deux projets. Mettre a jour les deps qui le permettent.

### [I-D1] Pas de CI/CD audit automatique

- **Constat** : Pas de `npm audit` dans les scripts CI visibles.
- **Recommandation** : Ajouter `npm audit --audit-level=high` dans le pipeline CI.

---

## Plan de correction recommande

### Phase 1 — Quick wins securite + perf (1-2 jours) — TERMINEE

| # | Action | Ref | Statut |
|---|--------|-----|--------|
| 1 | `npm audit fix` sur client + server | C-D1 | FAIT (server 27→9, client bloque par CRA) |
| 2 | Fixer le fallback errorHandler (`else sendErrorProd`) | I-S1 | FAIT |
| 3 | Appliquer CSP aux pages HTML via Helmet config | I-S2 | FAIT |
| 4 | Ajouter `loading="lazy"` sur toutes les `<img>` sauf hero | I-A1 | FAIT |
| 5 | Ajouter `width`/`height` sur les `<img>` + `fetchPriority="high"` hero | I-A2 | FAIT |
| 6 | Installer + configurer `compression` middleware | I-B1 | FAIT |
| 7 | Limiter les poids Google Fonts (Roboto 400,500,700 + Slab 300,400,700) | M-A1 | FAIT |
| 8 | Personnaliser meta tags (description, OG, Twitter, keywords) | C-S2 | FAIT |
| 9 | Ajouter robots.txt + sitemap.xml | I-S3 | FAIT |
| 10 | Ajouter `process.on('uncaughtException/unhandledRejection')` | I-L0 | FAIT |

### Phase 2 — Securite auth + DB indexes — TERMINEE

| # | Action | Ref | Statut |
|---|--------|-----|--------|
| 11 | Migrer access token de localStorage vers httpOnly cookie | C-S0 | FAIT (server + client + authMiddleware) |
| 12 | Remplacer validation carte par tokenisation gateway | I-S3bis | FAIT (paymentValidation.js) |
| 13 | Ajouter indexes DB sur toutes les FK + champs filtres | C-B3 | FAIT (8 modeles, 20+ indexes) |
| 14 | Ajouter pagination a `getAllStars()` (limit/offset/page) | I-B4 | FAIT (starController.js) |
| 15 | Configurer log rotation Winston (20MB, 5 fichiers) | I-L1 | FAIT (logger.js) |

### Phase 3 — Assets & SEO (3-5 jours)

| # | Action | Ref | Impact |
|---|--------|-----|--------|
| 16 | Convertir images en WebP + generer variantes responsive | C-A1 | Perf majeur |
| 17 | Installer react-helmet-async pour meta tags dynamiques + OG | C-S2 | SEO |
| 18 | Ajouter JSON-LD pour Product, Review, Organization | I-S4 | SEO |
| 19 | Ajouter AbortController dans httpClient | I-P1 | Perf |
| 20 | Ajouter web-vitals monitoring | I-S5 | Mesure |

### Phase 4 — Architecture perf (sprint)

| # | Action | Ref | Impact |
|---|--------|-----|--------|
| 21 | Integrer React Query ou SWR pour cache API client | I-P2 | Perf |
| 22 | Ajouter cache applicatif backend (node-cache ou Redis) | I-B2 | Perf |
| 23 | Configurer pool Sequelize pour production | M-B1 | Perf |
| 24 | Differencier Cache-Control par type d'endpoint | M-B2 | Perf |
| 25 | Ajouter webpack-bundle-analyzer | I-P3 | Mesure |

### Phase 5 — SSR/Pre-rendering (long terme)

| # | Action | Ref | Impact |
|---|--------|-----|--------|
| 26 | Evaluer migration Next.js ou pre-rendering (react-snap) | C-S1 | SEO majeur |

---

## Resume executif

**Points forts** :
- Code splitting bien implemente (14 routes lazy-loaded)
- Memoisation React correcte (94 usages memo/useCallback/useMemo sur 24 fichiers)
- Securite backend solide (Helmet, CSRF, rate limiting, bcrypt 10 rounds, DOMPurify, Joi)
- Error handling structure avec pattern Strategy + distinction dev/prod
- Zustand avec selectors granulaires
- Input sanitisation complete (body, query, params) via DOMPurify server-side
- SQL injection : 0 risque (replacements parametres sur toutes les raw queries)
- Alt text present sur toutes les images
- HTML semantique (header, footer, main, section) bien utilise

**Points faibles majeurs** :
- **Images** : 22MB de JPG non optimises, pas de lazy loading natif, pas de WebP, pas de dimensions
- **SEO** : SPA pure sans SSR, meta description CRA par defaut, pas de JSON-LD, pas de robots.txt
- **Auth** : Access token en localStorage (vulnerable XSS) malgre refresh token en httpOnly
- **DB** : Aucun index defini dans les modeles Sequelize — requetes lentes sur volumes
- **Dependencies** : 71 vulnerabilites cumulees (44 client + 27 serveur)
- **Pas de compression** HTTP (gzip/brotli) ni de cache applicatif (Redis/in-memory)
- **Fonts** : ~18 variantes de Roboto chargees pour ~3 utilisees (~500KB inutiles)
- **Paiement** : Numeros de carte acceptes en brut (non PCI DSS)
- **Process** : Pas de handler `uncaughtException`/`unhandledRejection`
