# Stella — Star E-Commerce

![CI](https://github.com/josuerochadev/stella-ecommerce/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)

Stella is a full-stack e-commerce application for buying stars, built as a portfolio project demonstrating end-to-end web development skills — from database design to a polished React UI.

---

## Features

- Star catalog with search, filters, and detail pages
- Secure authentication — JWT (httpOnly cookies) + CSRF protection
- Shopping cart with quantity controls and wishlist
- Full checkout flow — address form, order summary, payment simulation
- Order history with status tracking
- User reviews and star ratings
- Admin dashboard with stats and user management
- RESTful API with Swagger/OpenAPI documentation
- Rate limiting, input sanitization (DOMPurify + Joi), CSP headers (Helmet)
- Structured logging (Winston) and error monitoring (Sentry)
- Responsive design with custom Design System (Tailwind CSS)
- Docker support for containerized development
- CI pipeline via GitHub Actions (lint, typecheck, tests)

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 + TypeScript 5 | UI framework with full type safety |
| Zustand | Global state management |
| TanStack Query (React Query) | Server state, caching, and data fetching |
| React Router v7 | Client-side routing |
| Tailwind CSS | Utility-first styling with custom design system |
| Axios | HTTP client with CSRF interceptors |
| Sentry | Frontend error monitoring |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | RESTful API server |
| Sequelize + PostgreSQL | ORM with relational data model |
| JWT + CSRF tokens | Authentication and session security |
| Helmet + express-rate-limit | HTTP hardening and rate limiting |
| DOMPurify + Joi | Input sanitization and schema validation |
| Winston | Structured logging (file + console) |
| Sentry | Backend error monitoring |
| node-cache | In-memory caching |
| Swagger/OpenAPI | Interactive API documentation |
| Jest + Supertest | Unit and integration tests |

### Infrastructure

| Technology | Purpose |
|---|---|
| Docker + docker-compose | Containerized local development |
| GitHub Actions | CI pipeline (lint, typecheck, tests) |
| Husky + lint-staged | Pre-commit quality gates |
| Biome | Unified linter and formatter (client + server) |
| Render | Production deployment (`render.yaml`) |

---

## Architecture

The project follows an **MVC** pattern on the backend with a **dependency injection container**, and a **repository pattern** on the frontend to decouple API calls from components.

```
stella-ecommerce/
├── client/                # React TypeScript frontend (port 3001)
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Route-based page components
│       ├── repositories/  # Data access layer (API abstraction)
│       ├── services/      # Business logic helpers
│       ├── stores/        # Zustand global state
│       ├── hooks/         # Custom React hooks
│       ├── types/         # TypeScript type definitions
│       └── tests/         # Jest test files
├── server/                # Node.js/Express backend API (port 3000)
│   └── src/
│       ├── controllers/   # Route handlers
│       ├── services/      # Business logic
│       ├── repositories/  # Data access layer
│       ├── models/        # Sequelize ORM models
│       ├── routes/        # Express route definitions
│       ├── middlewares/   # Auth, CSRF, error handling
│       ├── validations/   # Joi schemas
│       ├── container/     # Dependency injection container
│       ├── config/        # App and DB configuration
│       └── utils/         # Helper utilities
├── scripts/               # Database utility scripts
├── docs/                  # Documentation, ADRs, audits, screenshots
├── .github/workflows/     # CI/CD pipeline
├── docker-compose.yml     # Docker orchestration
└── render.yaml            # Render deployment config
```

Key architectural decisions are documented as ADRs in [`docs/adr/`](./docs/adr/):

- [001 — Zustand over Redux](./docs/adr/001-zustand-over-redux.md)
- [002 — DI container on the backend](./docs/adr/002-di-container-backend.md)
- [003 — JavaScript backend (no TypeScript)](./docs/adr/003-javascript-backend.md)
- [004 — Sequelize sync over migrations](./docs/adr/004-sequelize-sync-no-migrations.md)
- [005 — Repository pattern on the frontend](./docs/adr/005-repository-pattern-frontend.md)

---

## Installation

### Prerequisites

- Node.js >= 18 (recommended: 22, see `.nvmrc`)
- npm
- PostgreSQL 15

### Option A — Standard Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/josuerochadev/stella-ecommerce.git
   cd stella-ecommerce
   ```

2. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env — database credentials, JWT secret, etc.

   cp client/src/.env.example client/.env
   # Edit client/.env if your API runs on a different URL
   ```

4. **Initialize the database**
   ```bash
   # macOS
   brew services start postgresql@15
   # Linux: sudo systemctl start postgresql

   createdb stella_ecommerce

   cd server
   npm run create-tables   # Create schema
   npm run generate-data   # Seed sample data
   ```

### Option B — Docker Setup

```bash
# Start all services (client + server + postgres)
docker-compose up --build

# In a separate terminal, initialize the database
docker-compose exec server node ../scripts/createTables.js
docker-compose exec server node ../scripts/sampleData.js
```

Once running, the application is available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000/api |
| Swagger docs | http://localhost:3000/api-docs |

---

## Usage

### Starting Without Docker

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm start
```

Open **http://localhost:3001** in your browser.

### Demo Accounts

Sample accounts are created by the seed script. See `scripts/sampleData.js` for credentials, including a regular user and an admin account.

### Development Commands

| Command | Location | Description |
|---|---|---|
| `npm run dev` | `server/` | Start dev server with hot reload |
| `npm start` | `client/` | Start React dev server |
| `npm test` | both | Run tests |
| `npm run test:unit` | `server/` | Unit tests only |
| `npm run test:integration` | `server/` | Integration tests only |
| `npm run test:coverage` | `client/` | Tests with coverage report |
| `npm run lint` | both | Run Biome linter |
| `npm run format` | both | Format code with Biome |
| `npm run create-tables` | `server/` | Initialize database tables |
| `npm run generate-data` | `server/` | Populate with sample data |
| `npm run reset-db` | `server/` | Reset database (dev only) |
| `npm run create-admin` | `server/` | Create an admin user |

---

## API Documentation

Swagger/OpenAPI is available once the server is running:

**http://localhost:3000/api-docs**

Endpoints are grouped by tag: `Stars`, `Auth`, `Cart`, `Orders`, `Reviews`, `Wishlist`, `Payments`, `Admin`, `Profile`.

---

## Contributing

1. **Fork** the repository
2. Create a **feature branch** — `git checkout -b feat/my-feature`
3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `refactor:`, etc.
4. **Push** and open a **Pull Request** (one PR per topic)

Pre-commit hooks (Husky + Biome) run automatically on staged files. Do not bypass with `--no-verify`.

If you find a bug or have an improvement idea, open an [issue](https://github.com/josuerochadev/stella-ecommerce/issues).

---

## Roadmap

See [docs/ROADMAP.md](./docs/ROADMAP.md) for the full project roadmap. All phases are complete — the project is production-ready as a portfolio piece.

---

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
