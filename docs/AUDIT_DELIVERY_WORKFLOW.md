# Audit Delivery & Workflow — Stella E-Commerce

**Date** : 2026-05-09
**Scope** : Git, CI/CD, Docker, tests, monitoring, dependencies, release, code review
**Note globale** : 3.5/10

---

## Resume

Le projet possede une base de CI correcte (GitHub Actions, Husky, lint-staged, Biome) et une discipline de commits exemplaire (100% conventional commits). Cependant, il manque l'essentiel d'un workflow de delivery mature : aucun test E2E, pas de CD, pas de monitoring/error tracking, pas de staging, pas d'automatisation des dependances, et aucun code review process structure. Les fondations sont la (Docker, Render, CHANGELOG, conventional commits), mais le passage de "projet dev" a "produit livrable" necessite un investissement significatif.

---

## Tableau de synthese

| Categorie                  | Critique | Important | Mineur |
| -------------------------- | -------- | --------- | ------ |
| CI/CD                      | 1        | 2         | —      |
| Tests E2E / integration    | 1        | 1         | —      |
| Monitoring / alerting      | 1        | 2         | —      |
| Code review process        | 2        | 1         | —      |
| Deploiement / staging      | 1        | 1         | —      |
| Gestion des dependances    | 1        | 1         | —      |
| Docker                     | —        | 1         | 2      |
| Pre-commit hooks           | —        | 2         | —      |
| Release management         | —        | 1         | —      |
| Git hygiene                | —        | 1         | 1      |
| Env / config               | —        | 1         | 1      |
| **Total**                  | **7**    | **14**    | **4**  |

---

## Critique — a corriger maintenant

### C1. Aucun test end-to-end

- **Localisation** : projet entier
- **Probleme** : pas de Cypress, Playwright, ni aucun framework E2E. Aucun test sur les flows critiques d'un e-commerce : inscription, connexion, ajout panier, checkout, paiement.
- **Impact** : les regressions sur le parcours d'achat ne sont detectees qu'en production par les utilisateurs.

### C2. Pas de Continuous Deployment

- **Fichier** : `.github/workflows/ci.yml`
- **Probleme** : le pipeline est CI-only (lint, test, typecheck). Aucun job de build, deploy staging, ni deploy production. Le deploiement Render est manuel et n'exige pas le passage du CI avant deploy.
- **Impact** : du code non valide peut etre deploye en production.

### C3. Aucun monitoring / error tracking en production

- **Localisation** : projet entier
- **Probleme** : pas de Sentry, Datadog, New Relic, ni aucun service d'observabilite. Le logger frontend (`client/src/utils/logger.ts:66-67`) a un placeholder pour Sentry mais n'est pas implemente. Pas d'alerting sur erreurs, latence, ou downtime.
- **Impact** : les erreurs en production sont silencieuses et invisibles.

### C4. Pas d'environnement staging / preview

- **Fichier** : `render.yaml`
- **Probleme** : un seul environnement de deploiement (production Render free tier). Pas de preview deployments sur les PRs, pas de staging distinct, pas de strategie de rollback documentee.
- **Impact** : impossible de valider un changement avant qu'il atteigne les utilisateurs.

### C5. Aucune mise a jour automatisee des dependances

- **Localisation** : `.github/` (fichiers manquants)
- **Probleme** : pas de Dependabot (`.github/dependabot.yml` absent), pas de Renovate (`renovate.json` absent). Mises a jour entierement manuelles.
- **Impact** : vulnerabilites connues restent presentes jusqu'a detection manuelle.

### C6. Pas de CODEOWNERS

- **Localisation** : `.github/CODEOWNERS` absent
- **Probleme** : aucune auto-assignation de reviewers sur les PRs. Pas de responsabilite definie par zone de code.
- **Impact** : des changements critiques (auth, paiement) peuvent etre merges sans review du bon expert.

### C7. Pas de PR template

- **Localisation** : `.github/PULL_REQUEST_TEMPLATE.md` absent
- **Probleme** : aucun template de PR, pas de checklist de review, pas de guide pour les contributeurs. Aucun standard pour decrire les changements.
- **Impact** : reviews inconsistantes, contexte manquant, risque de PRs fourre-tout.

---

## Important — a planifier

### I1. Server Dockerfile lance nodemon en production

- **Fichier** : `server/Dockerfile:15`
- **Probleme** : `CMD ["npm", "run", "dev"]` execute nodemon (outil de dev) au lieu de `CMD ["npm", "start"]` qui lance `node src/app.js`.
- **Impact** : surconsommation memoire, watch inutile sur le filesystem, comportement imprevisible en production.

### I2. Pas de commitlint — messages non enforces techniquement

- **Localisation** : racine du projet
- **Probleme** : aucun package `@commitlint/cli`, pas de `.commitlintrc`. Le format conventional commits est respecte a 100% par discipline mais sans enforcement automatique. Pas de validation dans le CI non plus.
- **Impact** : un contributeur externe peut envoyer n'importe quel format de message.

### I3. Coverage desactivee en CI, pas de seuil

- **Fichier** : `.github/workflows/ci.yml:21` (`npm test --no-coverage`)
- **Probleme** : coverage explicitement desactivee cote client en CI. Aucun seuil de couverture configure dans `jest.config.js`. Pas d'upload vers Codecov ou similaire.
- **Impact** : la couverture peut degrader silencieusement sans que personne ne le detecte.

### I4. Hooks contournables sans protection serveur

- **Fichier** : `.husky/_/h:15`
- **Probleme** : `HUSKY=0 git commit` ou `git commit --no-verify` bypass tous les hooks. Aucune branch protection rule documentee cote GitHub pour exiger le passage du CI.
- **Impact** : les garde-fous locaux sont purement optionnels.

### I5. Test AuthContainer casse et exclu indefiniment

- **Fichier** : `client/src/tests/AuthContainer.test.tsx`
- **Probleme** : imports casses (`screen`, `fireEvent` manquants de `@testing-library/react`). Le test est exclu du pre-commit via `--testPathIgnorePatterns=AuthContainer` et de facto ignore.
- **Impact** : dette technique qui s'accumule ; le composant d'auth n'a aucune couverture de test.

### I6. SSL rejectUnauthorized: false en production

- **Fichier** : `server/src/config/database.js:46-48`
- **Probleme** : la validation du certificat SSL PostgreSQL est desactivee en production (`rejectUnauthorized: false`). Vulnerable aux attaques MITM.
- **Impact** : un attaquant sur le reseau peut intercepter les communications DB.

### I7. Pas de health check public

- **Fichier** : `server/src/routes/adminRoutes.js`
- **Probleme** : le seul endpoint de sante (`GET /api/admin/system`) necessite une authentification admin. Inutilisable pour un uptime monitor externe (UptimeRobot, Render health checks, etc.).
- **Impact** : impossible de detecter automatiquement si le service est down.

### I8. Logs non centralises

- **Fichier** : `server/src/utils/logger.js`
- **Probleme** : Winston ecrit sur filesystem local (rotation 20MB, 5 fichiers max). Pas de centralisation vers ELK, CloudWatch, Datadog Logs, ou similaire.
- **Impact** : sur Render (container ephemere), les logs sont perdus a chaque redemarrage. Pas de recherche, correlation, ni alerting sur les logs.

### I9. Release process entierement manuel

- **Localisation** : projet entier
- **Probleme** : pas de `semantic-release`, `standard-version`, ni `release-please`. Pas de tags Git automatiques. Pas de GitHub Releases. Le CHANGELOG est mis a jour manuellement.
- **Impact** : risque d'oubli de mise a jour du CHANGELOG, pas de traceabilite automatique version-commit.

### I10. Pas de npm audit dans le CI

- **Fichier** : `.github/workflows/ci.yml`
- **Probleme** : aucune etape `npm audit` dans le pipeline CI. Pas de Snyk ni GitHub Security Alerts configures.
- **Impact** : des vulnerabilites connues dans les dependances ne bloquent pas le merge.

### I11. Aucun suivi de backlog structure

- **Localisation** : `.github/ISSUE_TEMPLATE/` absent
- **Probleme** : pas de templates d'issues (bug report, feature request), pas de labels, pas de milestones, pas de projet Kanban GitHub. Pas de lien vers un outil externe (Jira, Linear, Notion).
- **Impact** : pas de traceabilite entre les besoins, les tickets, et les PRs.

### I12. Pas de branch protection rules documentees

- **Localisation** : projet GitHub (non verifiable localement)
- **Probleme** : rien ne documente ni ne garantit qu'une review est requise avant merge, ni que le CI doit passer.
- **Impact** : merge direct sur main possible sans validation.

---

## Mineur — nice to have

### M1. Pas de .gitattributes

- **Localisation** : racine du projet
- **Probleme** : aucun fichier `.gitattributes` pour normaliser les fins de ligne ou le traitement des fichiers binaires.

### M2. Credentials hardcodees dans docker-compose (dev only)

- **Fichier** : `docker-compose.yml`
- **Probleme** : `POSTGRES_PASSWORD: stella`, `JWT_SECRET: dev_jwt_secret_change_in_production`. Acceptable en dev mais devrait utiliser un `.env` docker.

### M3. Client Dockerfile utilise --legacy-peer-deps

- **Fichier** : `client/Dockerfile:4`
- **Probleme** : `npm install --legacy-peer-deps` masque des conflits de peer dependencies non resolus.

### M4. Validation env minimale

- **Fichier** : `server/src/config/config.js`
- **Probleme** : seul `JWT_SECRET` est valide comme requis. `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` ont des fallbacks silencieux — une mauvaise config DB ne sera detectee qu'au runtime.

---

## Plan de correction par phases

### Phase 1 — Fondations CI/CD & review (priorite haute)

| #  | Action                                           | Cible                              | Criticite |
| -- | ------------------------------------------------ | ---------------------------------- | --------- |
| 1  | Ajouter `.github/PULL_REQUEST_TEMPLATE.md`       | `.github/`                         | C7        |
| 2  | Ajouter `.github/CODEOWNERS`                     | `.github/`                         | C6        |
| 3  | Ajouter `.github/ISSUE_TEMPLATE/` (bug + feature)| `.github/ISSUE_TEMPLATE/`         | I11       |
| 4  | Configurer branch protection rules sur GitHub    | GitHub Settings                    | I12       |
| 5  | Ajouter commitlint + hook commit-msg             | `package.json`, `.husky/commit-msg`| I2        |
| 6  | Ajouter `npm audit --audit-level=high` au CI     | `.github/workflows/ci.yml`         | I10       |
| 7  | Activer coverage + seuil minimum dans le CI      | `ci.yml`, `jest.config.js`         | I3        |
| 8  | Fixer `server/Dockerfile` CMD                    | `server/Dockerfile:15`             | I1        |

### Phase 2 — Monitoring & observabilite

| #  | Action                                           | Cible                              | Criticite |
| -- | ------------------------------------------------ | ---------------------------------- | --------- |
| 9  | Ajouter endpoint `GET /health` public            | `server/src/routes/`               | I7        |
| 10 | Integrer Sentry (frontend + backend)             | `client/`, `server/`               | C3        |
| 11 | Centraliser les logs (Sentry breadcrumbs ou ext.) | `server/src/utils/logger.js`      | I8        |
| 12 | Fixer SSL `rejectUnauthorized`                   | `server/src/config/database.js:46` | I6        |

### Phase 3 — Deploiement & environnements

| #  | Action                                           | Cible                              | Criticite |
| -- | ------------------------------------------------ | ---------------------------------- | --------- |
| 13 | Ajouter CD dans GitHub Actions (deploy Render)   | `.github/workflows/`               | C2        |
| 14 | Creer environnement staging sur Render           | `render.yaml`                      | C4        |
| 15 | Configurer Dependabot                            | `.github/dependabot.yml`           | C5        |
| 16 | Ajouter semantic-release ou release-please       | `package.json`, CI                 | I9        |

### Phase 4 — Tests E2E

| #  | Action                                           | Cible                              | Criticite |
| -- | ------------------------------------------------ | ---------------------------------- | --------- |
| 17 | Installer Playwright                             | `client/`                          | C1        |
| 18 | Ecrire tests E2E : auth flow                    | `e2e/auth.spec.ts`                 | C1        |
| 19 | Ecrire tests E2E : parcours d'achat             | `e2e/checkout.spec.ts`             | C1        |
| 20 | Fixer AuthContainer.test.tsx                     | `client/src/tests/`                | I5        |
| 21 | Integrer E2E dans le CI                          | `.github/workflows/ci.yml`         | C1        |

### Phase 5 — Polish

| #  | Action                                           | Cible                              | Criticite |
| -- | ------------------------------------------------ | ---------------------------------- | --------- |
| 22 | Ajouter `.gitattributes`                         | racine                             | M1        |
| 23 | Multi-stage Docker builds                        | `client/Dockerfile`, `server/Dockerfile` | M3  |
| 24 | Resoudre peer deps (retirer --legacy-peer-deps)  | `client/Dockerfile`                | M3        |
| 25 | Validation env elargie                           | `server/src/config/config.js`      | M4        |

---

## Points positifs a conserver

- **Conventional commits** : 100% de conformite sur les 30 derniers commits
- **Pre-commit hooks** : Husky + lint-staged + tests unitaires a chaque commit
- **Biome** : linting et formatting uniformes (2-space, double quotes, semicolons, 100 chars)
- **CI GitHub Actions** : lint + test + typecheck sur chaque PR
- **Docker Compose** : stack dev locale fonctionnelle avec healthcheck PostgreSQL
- **Render Blueprint** : IaC de base pour le deploiement
- **CHANGELOG.md** : historique des releases documente
- **Scripts DB proteges** : `createTables` et `resetDatabase` bloquent l'execution en production
- **CONTRIBUTING.md** : conventions documentees pour les branches et commits
- **Lock files** : `package-lock.json` present dans les 3 workspaces
