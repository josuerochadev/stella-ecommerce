# Stella E-Commerce - Roadmap de finalisation

Objectif : rendre le projet livrable pour un portfolio professionnel (josuerocha.dev).
Le projet doit fonctionner de bout en bout, sans bugs bloquants, avec un tunnel d'achat complet.

Statut : EN COURS
Derniere mise a jour : 2026-05-06

---

## Organisation du travail

Chaque phase est un ensemble de taches independantes.
On travaille phase par phase, dans l'ordre.
Chaque tache terminee est cochee [x] avec la date.

---

## Phase 1 - Bugs critiques

Le projet doit fonctionner correctement avant d'ajouter quoi que ce soit.

- [x] 1.1 Fix double hashage password (supprime hook beforeCreate/beforeUpdate du modele User) — 2026-05-06
- [x] 1.2 Fix field mismatch OrderService (`total` -> `totalAmount`) — 2026-05-06
- [x] 1.3 Exporter `updateReviewSchema` depuis reviewValidation.js — 2026-05-06
- [x] 1.4 Fix bouton "Ajouter au panier" absent sur DetailStarCard — 2026-05-06
- [x] 1.5 Fix CartStarCard : onRemove utilise la closure correcte — 2026-05-06
- [x] 1.6 Fix page Contact : formulaire avec state et onSubmit — 2026-05-06
- [x] 1.7 Fix FormInput : ID stable avec useId() au lieu de Math.random() — 2026-05-06
- [x] 1.8 Fix Wishlist : cle React stable au lieu de Math.random() — 2026-05-06
- [x] 1.9 Fix App.tsx : isAuthenticated reactif via useAuth() — 2026-05-06
- [x] 1.10 Fix Register : validation password complete (majuscule, minuscule, chiffre, special) — 2026-05-06

---

## Phase 2 - Tunnel d'achat complet

Le coeur de l'application e-commerce. Sans ca, le projet n'a pas de sens.

- [x] 2.1 Page Checkout (formulaire adresse + recap panier + choix paiement) — 2026-05-06
- [x] 2.2 Page confirmation de commande (recapitulatif post-achat) — 2026-05-06
- [x] 2.3 Page historique de commandes (liste + statuts + dates) — 2026-05-06
- [x] 2.4 Controles +/- quantite dans le panier (ApiCartRepository + store + UI) — 2026-05-06
- [x] 2.5 Routes `/checkout`, `/order-confirmation`, `/orders` dans App.tsx (protegees) — 2026-05-06
- [x] 2.6 Route `/orders` dans App.tsx (protegee) — 2026-05-06

---

## Phase 3 - Fonctionnalites secondaires

Ces features enrichissent le projet et montrent une maitrise plus large.

- [x] 3.1 Systeme d'avis/notes sur la page produit (composant ReviewSection + etoiles interactives) — 2026-05-06
- [x] 3.2 Page admin basique (dashboard stats + liste users avec roles) — 2026-05-06
- [~] 3.3 Reset mot de passe — SKIP (aucun endpoint backend, flow email trop complexe pour portfolio)
- [x] 3.4 Modifier mot de passe depuis le profil (endpoint backend + formulaire) — 2026-05-06

---

## Phase 4 - Securite

Corriger les failles identifiees pour un projet credible.

- [x] 4.1 Ajouter requireRole('admin') sur PUT /orders/:id/update-status — 2026-05-06
- [x] 4.2 Ajouter CSRF sur PUT /users/profile, PUT /users/change-password et DELETE /users/me — 2026-05-06
- [x] 4.3 Fix webhook signature bypass (rejeter si pas de signature) — 2026-05-06
- [x] 4.4 Ajouter status 'disputed' dans l'ENUM Order — 2026-05-06
- [x] 4.5 Ajouter branche production dans models/index.js — 2026-05-06
- [x] 4.6 Retirer unsafe-inline et unsafe-eval du CSP script-src — 2026-05-06
- [x] 4.7 Ajouter guard NODE_ENV sur scripts destructifs (reset-db, create-tables) — 2026-05-06

---

## Phase 5 - Qualite & polish

Rendre le projet presentable et professionnel.

- [x] 5.1 Tests : CartCalculations (calculs prix, totaux, stats) — 2026-05-06
- [x] 5.2 Tests : password validation (8 char, majuscule, minuscule, chiffre, special) — 2026-05-06
- [x] 5.3 Tests : order status mapping (couverture des statuts) — 2026-05-06
- [x] 5.4 Fix SkipLinks (ancres #main-content sur main, #navigation sur header) — 2026-05-06
- [x] 5.5 Fix roles ARIA (retire role=contentinfo et role=form mal places) — 2026-05-06
- [x] 5.6 Unifier config Biome (memes regles client/server, quoteStyle, semicolons) — 2026-05-06
- [x] 5.7 Fix server format script (ajouter --write) — 2026-05-06
- [x] 5.8 Nettoyer dead code (ROUTES alignees avec App.tsx, fix useErrorHandler, fix substr deprecie) — 2026-05-06

---

## Phase 6 - Infrastructure (optionnel mais valorisant)

Pour montrer des competences DevOps sur le portfolio.

- [x] 6.1 Docker + docker-compose (client + server + postgres) — 2026-05-06
- [x] 6.2 GitHub Actions CI (lint client/server + tests + typecheck sur PR/push) — 2026-05-06
- [~] 6.3 Migrations Sequelize — SKIP (sync suffisant pour un projet demo)
- [x] 6.4 .nvmrc (Node 22) + engines >=18 dans les deux package.json — 2026-05-06
- [x] 6.5 Husky + lint-staged (pre-commit biome check sur staged files) — 2026-05-06

---

## Hors scope (decisions conscientes)

Ces elements sont volontairement exclus pour un projet portfolio :

- Integration paiement reel (Stripe, etc.) - le systeme simule est suffisant
- Envoi d'emails reel (SMTP/SendGrid) - les emails demo suffisent
- Sentry / monitoring production
- SEO avance
- i18n / multi-langue
- PWA / service worker

---

## Notes

- Branche de travail : `dev`
- Merge vers `main` une fois chaque phase terminee
- Chaque phase peut etre faite en 1-3 sessions de travail
- Priorite absolue : Phases 1-2 (le projet doit fonctionner)
- Phases 3-5 : important pour la credibilite portfolio
- Phase 6 : bonus qui fait la difference
