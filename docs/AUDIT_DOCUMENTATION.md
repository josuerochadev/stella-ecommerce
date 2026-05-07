# Audit Documentation & Communication — Stella E-Commerce

**Date** : 2026-05-07
**Scope** : full-stack (client/ + server/ + racine)
**Note globale** : 6/10

---

## Resume

Le projet a une bonne base documentaire (CLAUDE.md, audits, roadmap, Swagger 96%) qui depasse beaucoup de projets portfolio. Mais les lacunes — credentials dans le README, absence de CHANGELOG/ADR/CONTRIBUTING, README partiellement obsolete, JSDoc a 15% — empechent de considerer la documentation comme mature. L'onboarding developpeur prendrait ~25-30 min au lieu des 15 min vises, principalement a cause des instructions d'installation incompletes et de l'arbre de fichiers perime.

---

## Tableau de synthese

| Categorie                    | Critique | Important | Mineur |
| ---------------------------- | -------- | --------- | ------ |
| README                       | 1        | 3         | 2      |
| Documentation technique      | —        | 2         | 1      |
| Changelog / Versioning       | —        | 1         | 1      |
| Commentaires / JSDoc         | —        | 2         | 1      |
| ADR                          | —        | 1         | —      |
| Messages de commit           | —        | 1         | 1      |
| Variables d'environnement    | —        | 1         | 1      |
| Onboarding developpeur       | —        | 1         | 1      |
| Documentation API            | —        | 1         | 2      |
| **Total**                    | **1**    | **13**    | **10** |

---

## Critique — a corriger maintenant

### C1. Credentials utilisateurs exposes dans le README

- **Fichier** : `README.md:200-218`
- **Probleme** : 6 couples email/mot de passe (dont admin) listes en clair dans le README public. N'importe qui accedant au repo GitHub peut se connecter a l'instance deployee.
- **Impact** : Faille de securite directe. Meme pour un projet portfolio, les credentials de test ne doivent pas etre dans un fichier versionne public.

---

## Important — a planifier

### I1. Arbre de fichiers README obsolete vs realite

- **Fichier** : `README.md:86-103`
- **Probleme** : L'arbre montre `client/src/styles/`, `client/src/utils/` et `server/controllers/` (sans `src/`), mais la structure reelle inclut `stores/`, `hooks/`, `types/`, `tests/`, `repositories/`, `validations/`, `config/`, `container/`. L'arbre CLAUDE.md est correct, pas celui du README.
- **Impact** : Un nouveau contributeur se fie a un plan perime.

### I2. Prerequis README perimes

- **Fichier** : `README.md:110`
- **Probleme** : Indique "Node.js (version 14 or higher)" alors que `.nvmrc` pin Node 22 et `engines` exige >=18. Node 14 est EOL depuis avril 2023.
- **Impact** : Un dev pourrait installer Node 14/16 et avoir des erreurs incomprehensibles.

### I3. Section Contributing trop generique, pas de CONTRIBUTING.md

- **Fichier** : `README.md:188-198`
- **Probleme** : 5 lignes generiques (fork/branch/commit/push/PR) sans mentionner : conventional commits (pourtant en place), Biome lint obligatoire, pre-commit hooks Husky, ni la convention "1 PR = 1 theme" documentee dans l'audit architecture.
- **Impact** : Un contributeur peut ignorer les conventions du projet et voir ses PR rejetees.

### I4. Aucun CHANGELOG ni historique de versions

- **Fichier** : Aucun `CHANGELOG.md` a la racine
- **Probleme** : Aucun changelog malgre 158 commits et un projet en production (Render). La roadmap `docs/ROADMAP.md` sert de suivi mais n'est pas un changelog standard.
- **Impact** : Impossible de savoir quelles features/fixes sont dans quelle version. Les `package.json` indiquent v1.0.0 mais aucun tag git, aucune release GitHub.

### I5. Pas d'ADR (Architecture Decision Records)

- **Fichier** : Aucun dossier `docs/adr/` ni fichier ADR
- **Probleme** : Les deux audits documentent l'etat des lieux et les corrections, mais les *decisions* architecturales (pourquoi Zustand vs Redux, pourquoi DI container custom, pourquoi pas TypeScript backend, pourquoi Sequelize sans migrations) ne sont formalisees nulle part.
- **Impact** : Un nouveau dev ne comprend pas le "pourquoi" des choix techniques.

### I6. Couverture JSDoc tres faible et incoherente

- **Fichiers** : `client/src/` (15/141 fichiers = ~10%), `server/src/` (23/91 = ~25%)
- **Probleme** : Quelques fichiers ont un JSDoc exemplaire (`DIContainer.js`, `errorHelpers.ts`, `ApiCartRepository.ts`) mais la grande majorite n'a aucune documentation. Les hooks, stores et services frontend sont presque tous sans JSDoc.
- **Impact** : Signal/bruit desequilibre — on ne sait pas si JSDoc est une convention du projet ou une exception.

### I7. JSDoc absent sur les hooks et stores critiques

- **Fichiers** : `client/src/hooks/useApiCall.ts`, `client/src/hooks/useCartStatus.ts`, `client/src/stores/useCartStore.ts`, `client/src/stores/useWishlistStore.ts`
- **Probleme** : Ces hooks/stores sont au coeur de l'app (gestion panier, appels API) et n'ont aucune documentation de leurs parametres, retours, ou comportements attendus.
- **Impact** : Onboarding ralenti, maintenance plus risquee.

### I8. Historique de commits non-conventionnel sur 38% des commits

- **Fichiers** : Historique git (57 commits sur 150 hors merges)
- **Probleme** : Les anciens commits utilisent des messages en francais informel ("rangement du code", "debuggin typescript", "ameliorations cote client", "panier"). Les conventional commits n'ont ete adoptes qu'a mi-parcours du projet.
- **Impact** : L'historique est difficilement navigable. Un `git log --grep` pour trouver un fix specifique est peu fiable sur la premiere moitie du projet.

### I9. `.env.example` client trop minimaliste

- **Fichier** : `client/src/.env.example` (1 seule variable, 2 lignes)
- **Probleme** : Seule `REACT_APP_API_URL` est documentee. Pas de mention de variables optionnelles ni de commentaires explicatifs au-dela du nom.
- **Impact** : Mineur pour le client (1 seule var), mais le pattern est pauvre compare au server `.env.example` qui est mieux documente.

### I10. Swagger : 2 schemas references mais non definis

- **Fichiers** : `server/src/routes/reviewRoutes.js:85` (ref. `UpdateReviewInput`), `server/src/routes/usersRoutes.js:47` (ref. `UpdateUserInput`)
- **Probleme** : Ces schemas sont references dans les annotations `@swagger` mais ne sont pas definis dans `server/src/utils/swagger.js`. La page Swagger affichera des erreurs de reference.
- **Impact** : Documentation API incomplete et potentiellement trompeuse.

### I11. Onboarding : README n'indique pas la commande de setup DB complete

- **Fichier** : `README.md:140-147`
- **Probleme** : Les etapes 3 et 4 demandent de copier `.env.example` et de creer la DB, mais ne mentionnent pas les commandes `npm run create-tables` et `npm run generate-data` necessaires avant de demarrer (ces commandes sont listees plus bas dans "Useful Scripts" sans lien avec la section Installation).
- **Impact** : Un nouveau dev qui suit les etapes sequentiellement aura une DB vide et des erreurs au lancement.

---

## Mineur — nice to have

### M1. README : section Roadmap vide

- **Fichier** : `README.md:220`
- **Probleme** : Section "## Roadmap" presente mais vide, alors qu'un `docs/ROADMAP.md` detaille existe.
- **Impact** : Impression de projet inacheve. Devrait soit pointer vers `docs/ROADMAP.md`, soit etre supprimee.

### M2. README : section License vide

- **Fichier** : `README.md:224`
- **Probleme** : "[License information coming soon]" — pas de fichier `LICENSE` a la racine.
- **Impact** : Juridiquement ambigu pour un projet public. Un recruteur ou contributeur ne sait pas s'il peut reutiliser le code.

### M3. Pas de Postman collection ni equivalent

- **Probleme** : La documentation API repose uniquement sur Swagger (`/api-docs`). Aucune collection Postman, Insomnia, ou fichier `.http` pour tester rapidement les endpoints.
- **Impact** : L'onboarding API est moins fluide qu'avec une collection importable.

### M4. Route `/users/change-password` non documentee dans Swagger

- **Fichier** : `server/src/routes/usersRoutes.js:60`
- **Probleme** : Endpoint fonctionnel mais sans bloc `@swagger`. Couverture Swagger passe de 96% a 98% si corrige.

### M5. Documentation Swagger dupliquee entre paymentRoutes et adminRoutes

- **Fichiers** : `server/src/routes/paymentRoutes.js:303` et `server/src/routes/adminRoutes.js:324`
- **Probleme** : Le webhook simulation et les payment stats sont documentes dans deux fichiers de routes differents, creant de la confusion.

### M6. Pas de documentation Docker dans le README

- **Fichier** : `README.md` — aucune mention de Docker
- **Probleme** : Le projet a un `docker-compose.yml` et des Dockerfiles fonctionnels, mais le README ne mentionne pas cette option d'installation. Un dev doit decouvrir les fichiers Docker par lui-meme.

### M7. CI ne lance pas les tests backend

- **Fichier** : `.github/workflows/ci.yml:27-41`
- **Probleme** : Le job `lint-server` ne fait que le lint, pas les tests. Le client a lint + test, mais le serveur n'a que lint.
- **Impact** : Pas documente comme choix conscient. Un contributeur pourrait casser le backend sans que la CI ne le detecte.

### M8. `.env.example` client au mauvais chemin

- **Fichier** : `README.md:134` — "Copy the .env.example files in the client/src/ and server/ folders"
- **Probleme** : Le `.env.example` client est dans `client/src/` mais CRA attend le `.env` a la racine de `client/`, pas dans `client/src/`. Instruction potentiellement trompeuse.

### M9. Aucun tag git ni release GitHub

- **Probleme** : 158 commits, `package.json` a v1.0.0, mais `git tag` est vide. Pas de releases GitHub.
- **Impact** : Pas de point de reference stable dans l'historique.

### M10. User stories non liees au code

- **Fichier** : `docs/ressources/user-stories.md`
- **Probleme** : 28 user stories bien redigees mais deconnectees du code (pas de references croisees, pas de mapping vers les composants/routes qui les implementent).
- **Impact** : Faible, mais un lien entre stories et implementation valoriserait le portfolio.

---

## Points forts

- **CLAUDE.md** : Excellent fichier de contexte, arbre a jour, commandes documentees, architecture detaillee
- **Deux audits detailles** (`AUDIT_ARCHITECTURE.md`, `AUDIT_QUALITE_CODE.md`) avec plans de correction suivis
- **Roadmap structuree** avec phases, checklist, et decisions de scope documentees
- **`.env.example` serveur** bien commente avec descriptions en francais
- **Swagger** : 96% de couverture API, schemas bien structures
- **Conventional commits** adoptes et respectes sur toute la seconde moitie du projet
- **Guide de deploiement** (`docs/DEPLOYMENT.md`) clair et actionnable
- **Gitignore** complet et bien organise
- **Qualite des commentaires** : Aucun commentaire inutile detecte, les commentaires existants sont architecturaux et strategiques
- **TODOs propres** : Seulement 2 TODOs legitimes, deja documentes dans les audits

---

## Plan de correction recommande

### Phase 1 — Securite & README (immediat)

| #  | Action                                                                 | Ref      | Statut   |
| -- | ---------------------------------------------------------------------- | -------- | -------- |
| 1  | Retirer les credentials utilisateurs du README                         | C1       | FAIT     |
| 2  | Mettre a jour l'arbre de fichiers README (aligner sur CLAUDE.md)       | I1       | FAIT     |
| 3  | Corriger les prerequis (Node >=18, supprimer mention Node 14)          | I2       | FAIT     |
| 4  | Integrer les commandes DB dans la section Installation                 | I11      | FAIT     |
| 5  | Ajouter la section Docker au README                                    | M6       | FAIT     |
| 6  | Corriger section Roadmap (lien vers docs/ROADMAP.md ou suppression)    | M1       | FAIT     |
| 7  | Corriger section License (choisir une licence, creer LICENSE)          | M2       | FAIT     |

### Phase 2 — Documentation technique (sprint 1)

| #  | Action                                                                 | Ref      | Statut   |
| -- | ---------------------------------------------------------------------- | -------- | -------- |
| 8  | Creer CONTRIBUTING.md (conventional commits, Biome, Husky, 1PR=1theme) | I3       | A FAIRE  |
| 9  | Creer CHANGELOG.md retroactif (basé sur les phases de la roadmap)      | I4       | A FAIRE  |
| 10 | Creer docs/adr/ avec 4-5 ADR fondamentaux                             | I5       | A FAIRE  |

### Phase 3 — Documentation API (sprint 1)

| #  | Action                                                                 | Ref      | Statut   |
| -- | ---------------------------------------------------------------------- | -------- | -------- |
| 11 | Ajouter schemas manquants dans swagger.js (UpdateReviewInput, UpdateUserInput) | I10 | A FAIRE |
| 12 | Documenter PUT /users/change-password dans Swagger                     | M4       | A FAIRE  |
| 13 | Dedupliquer doc Swagger paymentRoutes vs adminRoutes                   | M5       | A FAIRE  |

### Phase 4 — JSDoc hooks/stores/services critiques (sprint 2)

| #  | Action                                                                 | Ref      | Statut   |
| -- | ---------------------------------------------------------------------- | -------- | -------- |
| 14 | JSDoc sur les hooks critiques (useApiCall, useCartStatus, useAuth)     | I7       | A FAIRE  |
| 15 | JSDoc sur les stores (useCartStore, useWishlistStore, useAuthStore)    | I7       | A FAIRE  |
| 16 | JSDoc sur les services frontend (cartService, starService, authService)| I6       | A FAIRE  |

### Phase 5 — Polish (backlog)

| #  | Action                                                                 | Ref      | Statut   |
| -- | ---------------------------------------------------------------------- | -------- | -------- |
| 17 | Enrichir `.env.example` client avec commentaires                       | I9       | A FAIRE  |
| 18 | Corriger chemin `.env.example` client dans README                      | M8       | FAIT     |
| 19 | Creer tag git v1.0.0 + release GitHub                                  | M9       | A FAIRE  |
| 20 | Ajouter tests backend dans CI                                          | M7       | A FAIRE  |

---

## Hors scope (decisions conscientes)

- Recrire l'historique git pour reformater les anciens commits (I8) — trop risque, pas de valeur reelle
- Collection Postman (M3) — Swagger suffit pour un portfolio
- Mapping user stories -> code (M10) — effort disproportionne pour le benefice

---

## Garde-fous transverses

- Une PR = un theme. Pas de PR fourre-tout.
- Conventional commits (deja la norme du repo).
- Pre-commit hooks stricts : ne JAMAIS bypasser avec `--no-verify`.
- Tout nouveau fichier public doit etre relu pour credentials/secrets avant commit.
