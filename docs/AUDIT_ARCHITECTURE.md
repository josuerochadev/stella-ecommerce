# Audit Architecture & Organisation — Stella E-Commerce

**Date** : 2026-05-07
**Scope** : client/ + server/ (full-stack)
**Note globale** : 5.5/10

---

## Resume

L'architecture de base est saine (MVC, DI Container, Zustand, services separes) mais souffre d'incohérences systémiques : 3 patterns d'export controllers, 3 versions de Biome, validation dupliquée malgré un service existant. Les violations DRY sont nombreuses (localStorage x12, transformCartItems x6, validation IDs x3) et 5 fichiers backend dépassent 300 lignes dont `emailService` a 498. Les problèmes critiques (secrets Git, types dangereux, accessibilité cassée) nécessitent une action immédiate avant tout nouveau développement.

---

## Tableau de synthese

| Categorie                          | Critique | Important | Mineur |
| ---------------------------------- | -------- | --------- | ------ |
| Secrets / Configuration            | ~~1~~ 0  | 2         | 1      |
| DRY / Duplication                  | 1        | 4         | —      |
| God Files / SRP                    | 1        | 3         | 1      |
| Type safety                        | ~~1~~ 0  | —         | 1      |
| Accessibilite / Responsivite       | ~~1~~ 0  | —         | 1      |
| Coherence exports / imports        | —        | 2         | 1      |
| Design patterns / DI               | —        | 2         | —      |
| Documentation API                  | —        | 1         | 1      |
| Dependencies                       | ~~—~~ 0  | ~~1~~ 0   | 3      |
| State management                   | —        | 1         | 1      |
| Hooks / Reutilisabilite            | —        | —         | 2      |
| **Total**                          | **5** -> **1** | **16** -> **15** | **12** |

---

## Critique — a corriger maintenant

### ~~C1. Secrets exposes dans Git~~ INVALIDE

- **Statut** : Faux positif. Les fichiers `.env` n'ont jamais ete commites dans l'historique Git. Le `.gitignore` les exclut correctement.

### C2. emailService — God File (498 lignes)

- **Fichier** : `server/src/services/emailService.js` (498 lignes)
- **Probleme** : Mélange 5 templates HTML inline (~65 lignes chacun avec styles inline dupliqués), gestion de queue, file I/O, retry logic, et simulation dans un seul fichier.
- **Impact** : Impossible a tester unitairement, maintenance cauchemardesque. Changement de template = risque de régression sur la queue.

### ~~C3. Type casting dangereux~~ CORRIGE

- **Fichier** : `client/src/pages/Checkout.tsx:67` — cast `as unknown as` supprime, utilise `response.data?.id` directement (type `Order.id`).
- **Fichier** : `client/src/hooks/useApiCall.ts:54` — `as any` remplace par `error instanceof Error ? error : new Error(String(error))`.

### ~~C4. HTML semantique invalide — accessibilite cassee~~ CORRIGE

- **Fichier** : `client/src/pages/Home.tsx:65-67` — `<button><a>` remplace par `<a className="btn">`. Structure DOM valide, accessible.

### ~~C5. @types/react-router-dom v5 vs react-router-dom v7~~ CORRIGE

- **Fichier** : `client/package.json` — `@types/react-router-dom` v5.3.3 supprime. `react-router-dom` v7 embarque ses propres types.

---

## Important — a planifier

### I1. localStorage sans abstraction — 12 occurrences directes

- **Fichiers** : `client/src/context/AuthContext.tsx:31,47`, `client/src/hooks/useApiCall.ts:92`, `client/src/hooks/useCartStatus.ts`, `client/src/components/ReviewSection.tsx:63`, `client/src/components/CookieBanner.tsx`, `client/src/utils/accessibilityThemes.ts`
- **Probleme** : 12 appels directs a `localStorage.getItem/setItem` disperses sans service centralise.
- **Impact** : Migration impossible (sessionStorage, IndexedDB), duplication, et bugs de timing.

### I2. Transformation de donnees dupliquee 6 fois

- **Fichier** : `client/src/services/cartService.ts:36-42, 54-56, 70-72, 85-87, 118-120, 134-136`
- **Probleme** : Le meme bloc `if (response.data.data?.cartItems) { response.data.data.cartItems = transformCartItems(...) }` est copie-colle 6 fois.
- **Fichier** : `client/src/stores/useCartStore.ts:36-47`
- **Probleme** : Le store re-transforme les donnees deja transformees par le service (double transformation).
- **Impact** : Changement de transformation = 7 endroits a modifier.

### I3. Validation formulaire dupliquee, service existant ignore

- **Fichiers** : `client/src/components/Register.tsx:32-65` et `client/src/components/Login.tsx:26-58`
- **Probleme** : Meme logique de validation email/password copiee dans les deux composants.
- **Fichier** : `client/src/services/validationService.ts:60-104`
- **Probleme** : Un service de validation existe mais n'est jamais utilise par Register/Login.
- **Impact** : Maintenance double, risque d'incoherence des regles de validation.

### I4. Validation d'IDs dupliquee dans les repositories

- **Fichiers** : `server/src/repositories/SequelizeOrderRepository.js:27-29`, `server/src/repositories/SequelizeReviewRepository.js:26-29`, `server/src/repositories/SequelizeCartRepository.js`
- **Probleme** : Meme bloc `if (!id || typeof id !== 'number') { throw new Error('ID must be a valid number'); }` copie 3+ fois.
- **Impact** : Pas de point central de validation, maintenance N fois.

### I5. God Components frontend (>200 lignes)

- **Fichier** : `client/src/pages/Admin.tsx` (229 lignes) — dashboard + users + management melanges
- **Fichier** : `client/src/pages/Checkout.tsx` (212 lignes) — formulaire + etat + logique metier
- **Fichier** : `client/src/components/AccessibilityPanel.tsx` (206 lignes) — controles + themes + UI
- **Impact** : Testabilite faible, composants difficiles a reutiliser et maintenir.

### I6. God Files backend (>300 lignes)

- **Fichier** : `server/src/repositories/SequelizeReviewRepository.js` (439 lignes)
- **Fichier** : `server/src/repositories/SequelizeOrderRepository.js` (418 lignes)
- **Fichier** : `server/src/routes/paymentRoutes.js` (414 lignes) — routes + schemas Joi + Swagger + middlewares melanges
- **Fichier** : `server/src/repositories/SequelizeCartRepository.js` (355 lignes)
- **Impact** : Fichiers trop gros, responsabilites melangees, maintenance difficile.

### I7. Pattern d'export des controllers incoherent — 3 conventions

- **Fichier** : `server/src/controllers/cartController.js:198-208` — `module.exports = { method: instance.method }`
- **Fichier** : `server/src/controllers/authController.js:230-231` — factory + instance + `.bind()`
- **Fichier** : `server/src/controllers/adminController.js:18` — `exports.method = async (req, res) => {}`
- **Impact** : Impossible de savoir comment importer sans lire la fin du fichier. Onboarding penalise.

### I8. Injection de dependances incomplete

- **Fichier** : `server/src/services/paymentService.js:21-23` — `PaymentOrchestrator` cree `new PaymentProcessor()` en dur au lieu d'injection.
- **Fichiers** : `paymentService.js` et `emailService.js` non enregistres dans `server/src/container/containerConfig.js`
- **Impact** : Services impossibles a mocker, tests unitaires bloques.

### I9. Logique metier dans le controller HTTP

- **Fichier** : `server/src/controllers/paymentController.js:60-69`
- **Probleme** : Mise a jour directe du statut de commande (`order.status = 'paid'; order.paymentMethod = method; await order.save()`) sans passer par un service.
- **Impact** : Logique dispersee entre controllers et services, non testable unitairement.

### I10. Configuration non centralisee

- **Fichier** : `server/src/config/config.js` — seulement 4 lignes (PORT + NODE_ENV)
- **Fichier** : `server/src/app.js:46` — `process.env.SESSION_SECRET || process.env.JWT_SECRET + '_session'` — fallback dangereux
- **Fichier** : `server/src/config/database.js` — 11 appels `process.env` sans validation d'existence
- **Impact** : Peut demarrer avec config partielle et echouer en runtime. Secrets disperses.

### I11. Biome — 3 versions differentes

- **Fichier** : `biome.json` (root) — schema 1.4.1
- **Fichier** : `client/package.json:28` — `@biomejs/biome` 1.5.3
- **Fichier** : `server/package.json:53` — `@biomejs/biome` ^1.9.4
- **Impact** : Regles de linting potentiellement incoherentes entre client et serveur.

### I12. AuthContext — hack de timing

- **Fichier** : `client/src/context/AuthContext.tsx:40`
- **Probleme** : `setTimeout(() => { fetchCart(); fetchWishlist(); fetchProfile(); }, 100)` — race condition potentielle, pas d'`await` sur les promises.
- **Impact** : Comportement imprevisible au chargement, donnees potentiellement stale.

---

## Mineur — nice to have

### M1. Aucun barrel file (index.ts/js)

- **Dossiers** : `client/src/components/` (57 fichiers), `server/src/controllers/`, `server/src/services/`, `server/src/repositories/`
- **Probleme** : Imports verbeux partout, pas de point d'entree centralise par module.

### M2. Hooks reutilisables non exploites

- **Fichier** : `client/src/hooks/useLoadingState.ts` — existe mais non utilise par `Profile.tsx:31`, `Admin.tsx:49`, `ReviewSection.tsx:39` qui reimplementent `useState(true)`.
- **Manque** : Hook `useFormErrors()` — `Register.tsx:13-20` et `Login.tsx:14-17` dupliquent le meme pattern d'etats d'erreur par champ.

### M3. Classes Tailwind dynamiques non compilees

- **Fichier** : `client/src/components/ResponsiveGrid.tsx:30-36`
- **Probleme** : `` `grid-cols-${maxColumns.xs}` `` — classes generees dynamiquement, jamais compilees par Tailwind (purge statique). Le breakpoint `xs:` reference n'existe pas dans Tailwind par defaut.

### M4. Swagger schemas non a jour

- **Fichier** : `server/src/utils/swagger.js:32` — `id` declare `string` mais User.id est `INTEGER`
- **Fichier** : `server/src/utils/swagger.js:44,49` — `username` dans schema mais le model User utilise `firstName/lastName`
- ~30% des routes sans documentation Swagger.

### M5. Dependencies inutiles ou obsoletes

- **Fichier** : `server/package.json:56` — `sqlite3` jamais utilise (DB = PostgreSQL)
- **Fichier** : `client/package.json:10` — `@types/node ^16` obsolete (Node 16 EOL)
- **Fichier** : `client/package.json:24` — `typescript ^4.9.5` (2022, v5.x disponible)
- **Fichier** : `client/jest.config.js:7` — `identity-obj-proxy` reference mais absent des devDependencies

### M6. Gestion d'erreur silencieuse et incoherente

- **Fichier** : `client/src/components/ReviewSection.tsx:50` — `catch { /* Silently fail */ }`
- **Fichier** : `client/src/pages/Admin.tsx:69` — `catch { setError("...") }`
- **Impact** : UX incoherente, erreurs avalees sans feedback utilisateur.

### M7. TODO en production non traites

- **Fichier** : `client/src/utils/logger.ts:51` — `// TODO: Send to monitoring service in production`
- **Fichier** : `client/src/utils/logger.ts:62` — `// TODO: Send to error tracking service (Sentry, etc.)`

### M8. Versions projet incoherentes

- **Fichier** : `client/package.json:3` — version `0.1.0`
- **Fichier** : `server/package.json:3` — version `1.0.0`
- **Fichier** : `server/package.json:65` — `packageManager: pnpm@9.6.0` specifie cote serveur, absent cote client.

### M9. Pas d'Error Boundaries locales

- **Fichier** : `client/src/components/ErrorBoundary.tsx` — Un seul ErrorBoundary global
- **Probleme** : Pas de boundaries par feature (Search, Cart, Checkout). Une erreur dans le panier crashe toute l'app.

### M10. Pas de cache API cote admin

- **Fichier** : `client/src/pages/Admin.tsx:57-78`
- **Probleme** : Re-fetch complet a chaque changement d'onglet, pas de memoization ni cache.

### M11. Couplage — fan-in excessif paymentService

- **Fichiers** : `paymentController.js`, `refundController.js`, `paymentStatsController.js`, `paymentWebhookController.js`, `dashboardStatistics.js`
- **Probleme** : `paymentService` utilise par 5+ fichiers. Changement = impact large.

### M12. Sequelize importe directement dans 12+ services

- **Fichiers** : `StarAdminService.js:31`, `SystemStatsService.js:18`, `dashboardStatistics.js:20`, etc.
- **Probleme** : Requetes SQL brutes eparpillees sans query builder centralise.

---

## Analyse de couplage — Resume

| Aspect                       | Etat                                                    |
| ---------------------------- | ------------------------------------------------------- |
| Dependances circulaires      | Aucune detectee                                         |
| Fan-in excessif              | paymentService utilise par 5+ fichiers                  |
| Sequelize en dur             | Importe directement dans 12+ services                   |
| Imports dynamiques suspects  | `CollectionButton.tsx:108` — `await import(...)` hack   |

---

## Plan de correction recommande

### Phase 1 — Securite & Urgences (immediat) — TERMINEE

| #  | Action                                                                 | Ref      | Statut     |
| -- | ---------------------------------------------------------------------- | -------- | ---------- |
| 1  | ~~Nettoyer les secrets de l'historique Git~~                           | C1       | INVALIDE   |
| 2  | ~~Regenerer le JWT_SECRET~~                                            | C1       | INVALIDE   |
| 3  | Fixer le button/link invalide dans Home.tsx                            | C4       | FAIT       |
| 4  | Supprimer @types/react-router-dom (v7 embarque ses types)              | C5       | FAIT       |
| 5  | Supprimer les casts `as unknown as` et `as any` — typer correctement   | C3       | FAIT       |

### Phase 2 — DRY & Duplication (sprint 1) — EN COURS

| #  | Action                                                                 | Ref      | Statut     |
| -- | ---------------------------------------------------------------------- | -------- | ---------- |
| 6  | Creer un `StorageService` centralise pour localStorage                 | I1       | A FAIRE    |
| 7  | Extraire la transformation cart dans un helper `normalizeCartResponse`  | I2       | FAIT       |
| 8  | Brancher Register/Login sur le validationService existant              | I3       | FAIT       |
| 9  | Creer un validateur d'ID reutilisable pour les repositories            | I4       | FAIT       |

### Phase 3 — God Files & SRP (sprint 1-2) — TERMINEE

| #  | Action                                                                 | Ref      | Statut     |
| -- | ---------------------------------------------------------------------- | -------- | ---------- |
| 10 | Extraire templates email dans emailTemplates.js (498 -> 340 + 132)     | C2       | FAIT       |
| 11 | ~~Decouper Admin.tsx~~ deja bien structure (DashboardView + UsersView)  | I5       | NON REQUIS |
| 12 | Extraire les schemas Joi dans paymentValidation.js                     | I6       | FAIT       |
| 13 | ~~Decouper repositories~~ tailles acceptables apres Phase 2 validateId | I6       | NON REQUIS |

### Phase 4 — Coherence & Patterns (sprint 2) — TERMINEE

| #  | Action                                                                 | Ref      | Statut     |
| -- | ---------------------------------------------------------------------- | -------- | ---------- |
| 14 | ~~Uniformiser exports controllers~~ 2 patterns justifies (DI vs non-DI)| I7       | ACCEPTABLE |
| 15 | Enregistrer paymentService et emailService dans le DI Container        | I8       | FAIT       |
| 16 | Extraire logique metier paymentController -> updateOrderAfterPayment   | I9       | FAIT       |
| 17 | Centraliser config serveur + validation env vars au demarrage          | I10      | FAIT       |
| 18 | Standardiser Biome a ^1.9.4 (root + client + server)                  | I11      | FAIT       |
| 19 | Remplacer setTimeout AuthContext par Promise.all                       | I12      | FAIT       |

### Phase 5 — Dependencies & Config (sprint 2) — TERMINEE

| #  | Action                                                                 | Ref      | Statut     |
| -- | ---------------------------------------------------------------------- | -------- | ---------- |
| 20 | Upgrader @types/node v20, TypeScript v5 (sqlite3 garde: tests l'utilisent) | M5   | FAIT       |
| 21 | Installer identity-obj-proxy manquant                                  | M5       | FAIT       |
| 22 | Mettre a jour les schemas Swagger vs realite (IDs integer, User corrige) | M4     | FAIT       |
| 23 | Synchroniser versions package.json (client 0.1.0 -> 1.0.0)            | M8       | FAIT       |

### Phase 6 — Polish (backlog) — TERMINEE

| #  | Action                                                                 | Ref      | Statut     |
| -- | ---------------------------------------------------------------------- | -------- | ---------- |
| 24 | Ajouter des barrel files pour components/, services/, controllers/     | M1       | BACKLOG    |
| 25 | Extraire hook useFormErrors, brancher Login + Register                  | M2       | FAIT       |
| 26 | Fixer les classes Tailwind dynamiques dans ResponsiveGrid              | M3       | FAIT       |
| 27 | Uniformiser la gestion d'erreurs (pas de catch silencieux)             | M6       | FAIT       |
| 28 | FeatureErrorBoundary + integration Cart, Checkout, Orders, Admin       | M9       | FAIT       |
| 29 | Cache API admin avec useRef pour eviter refetch par onglet             | M10      | FAIT       |
| 30 | Monitoring via Beacon API en production (logger.ts)                    | M7       | FAIT       |

---

## Garde-fous transverses

- Une PR = un theme. Pas de PR fourre-tout.
- Jamais de decoupage de composant >300 lignes sans tests prealables (filet Phase 4).
- Conventional commits (deja la norme du repo).
- Validation visuelle manuelle sur les 3 breakpoints (mobile/tablet/desktop) avant chaque merge.
- Pre-commit hooks stricts : ne JAMAIS bypasser avec `--no-verify`.
