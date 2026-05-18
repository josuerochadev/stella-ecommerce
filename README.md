<div align="center">

# Stella

**Application e-commerce full-stack pour acheter des etoiles.**

![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/Licence-MIT-blue?style=flat)

[Demo](https://stella-ecommerce.vercel.app/) · [Portfolio](https://josuerocha.dev) · [Signaler un bug](https://github.com/josuerochadev/stella-ecommerce/issues)

</div>

---

## A propos

Stella est une boutique en ligne fictive dediee a la vente d'etoiles. Le projet couvre l'ensemble du cycle e-commerce : catalogue avec recherche et filtres, panier, commande, avis clients et tableau d'administration.

Je l'ai developpe pendant mon Bac+4 Concepteur Developpeur d'Applications pour mettre en pratique ce que j'apprenais au fil de la formation. Le projet m'a suffisamment plu pour que je continue a le faire evoluer depuis.

<!-- Ajouter un screenshot ici une fois disponible -->
<!-- ![Screenshot de Stella](docs/screenshots/home.png) -->

## Fonctionnalites

- Catalogue d'etoiles avec recherche, filtres et fiches produit detaillees
- Authentification securisee par JWT (cookies httpOnly) et protection CSRF
- Panier avec gestion des quantites et liste de souhaits
- Tunnel de commande complet : adresse, recapitulatif, simulation de paiement
- Historique de commandes avec suivi de statut
- Systeme d'avis et de notes par etoiles
- Tableau d'administration avec statistiques et gestion des utilisateurs
- API RESTful documentee via Swagger/OpenAPI
- Rate limiting, sanitisation des entrees (DOMPurify + Joi), en-tetes CSP (Helmet)
- Logging structure (Winston) et monitoring d'erreurs (Sentry)
- Design responsive avec design system sur mesure (Tailwind CSS)
- Support Docker pour le developpement local
- Pipeline CI/CD via GitHub Actions (lint, typecheck, tests, deploiement)

## Stack technique

### Frontend

| Categorie | Outil |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Etat global | Zustand |
| Etat serveur | TanStack Query (React Query) |
| Routage | React Router v7 |
| Styles | Tailwind CSS + design system sur mesure |
| Client HTTP | Axios avec intercepteurs CSRF |
| Monitoring | Sentry |
| Tests | Jest + React Testing Library |

### Backend

| Categorie | Outil |
|---|---|
| Serveur | Node.js + Express |
| Base de donnees | PostgreSQL + Sequelize (ORM) |
| Authentification | JWT + tokens CSRF |
| Securite | Helmet, express-rate-limit, DOMPurify, Joi |
| Logging | Winston (fichier + console) |
| Monitoring | Sentry |
| Cache | node-cache |
| Documentation API | Swagger/OpenAPI |
| Tests | Jest + Supertest |

### Infrastructure

| Categorie | Outil |
|---|---|
| Conteneurisation | Docker + docker-compose |
| CI/CD | GitHub Actions |
| Qualite de code | Biome (linter + formatter), Husky + lint-staged |
| Deploiement | Render (API + client) |

## Demarrer

### Prerequis

- Node.js >= 18
- npm
- PostgreSQL 15

### Installation

```bash
git clone https://github.com/josuerochadev/stella-ecommerce.git
cd stella-ecommerce
```

```bash
cd server && npm install
cd ../client && npm install
```

Configurer les variables d'environnement :

```bash
cp server/.env.example server/.env
# Editer server/.env : identifiants BDD, secret JWT, etc.

cp client/src/.env.example client/.env
# Editer client/.env si l'API tourne sur une autre URL
```

Initialiser la base de donnees :

```bash
createdb stella_ecommerce

cd server
npm run create-tables
npm run generate-data
```

### Option Docker

```bash
docker-compose up --build

# Dans un autre terminal
docker-compose exec server node ../scripts/createTables.js
docker-compose exec server node ../scripts/sampleData.js
```

### Lancer en developpement

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm start
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| API | http://localhost:3000/api |
| Swagger | http://localhost:3000/api-docs |

### Scripts disponibles

| Commande | Dossier | Description |
|---|---|---|
| `npm run dev` | `server/` | Serveur backend avec hot reload |
| `npm start` | `client/` | Serveur de developpement React |
| `npm test` | les deux | Lancer les tests |
| `npm run test:unit` | `server/` | Tests unitaires uniquement |
| `npm run test:integration` | `server/` | Tests d'integration uniquement |
| `npm run test:coverage` | `client/` | Tests avec rapport de couverture |
| `npm run lint` | les deux | Lancer le linter Biome |
| `npm run format` | les deux | Formater le code avec Biome |
| `npm run create-tables` | `server/` | Initialiser les tables en BDD |
| `npm run generate-data` | `server/` | Peupler avec des donnees de test |
| `npm run reset-db` | `server/` | Reinitialiser la base de donnees |
| `npm run create-admin` | `server/` | Creer un compte administrateur |
| `npm run test:e2e` | racine | Lancer les tests Playwright |

## Architecture

Le backend suit un pattern MVC avec injection de dependances. Le frontend decouple les appels API via un pattern repository.

```
stella-ecommerce/
├── client/                # Frontend React TypeScript (port 3001)
│   └── src/
│       ├── components/    # Composants UI reutilisables
│       ├── pages/         # Composants de page (par route)
│       ├── repositories/  # Couche d'acces aux donnees (abstraction API)
│       ├── services/      # Logique metier
│       ├── stores/        # Etat global (Zustand)
│       ├── hooks/         # Hooks React personnalises
│       ├── types/         # Definitions TypeScript
│       └── tests/         # Tests Jest
├── server/                # API Node.js/Express (port 3000)
│   └── src/
│       ├── controllers/   # Gestionnaires de routes
│       ├── services/      # Logique metier
│       ├── repositories/  # Couche d'acces aux donnees
│       ├── models/        # Modeles Sequelize
│       ├── routes/        # Definitions de routes Express
│       ├── middlewares/   # Auth, CSRF, gestion d'erreurs
│       ├── validations/   # Schemas Joi
│       ├── container/     # Conteneur d'injection de dependances
│       ├── config/        # Configuration
│       └── utils/         # Utilitaires
├── scripts/               # Scripts utilitaires BDD
├── docs/                  # Documentation, ADR, audits
│   └── adr/               # Architecture Decision Records
├── e2e/                   # Tests end-to-end (Playwright)
├── .github/workflows/     # Pipeline CI/CD
└── docker-compose.yml     # Orchestration Docker
```

Les decisions architecturales sont documentees sous forme d'ADR dans [`docs/adr/`](./docs/adr/).

## Documentation API

Swagger/OpenAPI est accessible une fois le serveur lance :

**http://localhost:3000/api-docs**

Points d'entree regroupes par tag : `Stars`, `Auth`, `Cart`, `Orders`, `Reviews`, `Wishlist`, `Payments`, `Admin`, `Profile`.

## Contribuer

1. **Fork** le depot
2. Creer une **branche** — `git checkout -b feat/ma-fonctionnalite`
3. **Commiter** en suivant les [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `refactor:`, etc.
4. **Push** et ouvrir une **Pull Request**

Les hooks pre-commit (Husky + Biome) s'executent automatiquement sur les fichiers modifies.

## Licence

Ce projet est sous licence MIT — voir le fichier [LICENSE](./LICENSE).

---

Construit par **[Josue Rocha](https://josuerocha.dev)** · [LinkedIn](https://linkedin.com/in/josuerocha) · [GitHub](https://github.com/josuerochadev)
