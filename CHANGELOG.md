# Changelog

All notable changes to this project are documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0](https://github.com/josuerochadev/stella-ecommerce/compare/v1.0.0...v1.1.0) (2026-05-31)


### Features

* add Stella Design System, update UI components and infra ([cf0db8b](https://github.com/josuerochadev/stella-ecommerce/commit/cf0db8b71e530d0e4d17aec348bc428f98bf9b12))
* **deploy:** migrate to Vercel + Railway + Neon ([e29ef53](https://github.com/josuerochadev/stella-ecommerce/commit/e29ef53524d1e259a960b664b8b59468a5befd27))
* **deploy:** migrate to Vercel + Railway + Neon ([975061c](https://github.com/josuerochadev/stella-ecommerce/commit/975061ce9bd87fc529a080f4a08b8d86f7313a17))
* **ux:** audit UX & expérience produit — 5 phases complètes ([d668a8d](https://github.com/josuerochadev/stella-ecommerce/commit/d668a8d5f7b05d6b54b200fd3bfabbcd1abbf422))
* **ux:** phase 2 — navigation, routing, URL filter persistence ([17a7e8d](https://github.com/josuerochadev/stella-ecommerce/commit/17a7e8dfeed212039b239fe45cbdee4b9f8e5a06))
* **ux:** phase 4 — accessibilite & semantique HTML ([612944d](https://github.com/josuerochadev/stella-ecommerce/commit/612944dc94bbd7a7bf16a1de49c5e35110c9d5d8))
* **ux:** phase 5 — responsive & polish ([1c3b279](https://github.com/josuerochadev/stella-ecommerce/commit/1c3b2795c76f8b628e2b15465aaf264d2e2d04fa))


### Bug Fixes

* **auth:** prevent infinite redirect loop for unauthenticated users ([b43539b](https://github.com/josuerochadev/stella-ecommerce/commit/b43539b997388188ccec55ec155b192288aa093d))
* **cart:** fix add-to-cart 500 error on Neon/Railway production ([#52](https://github.com/josuerochadev/stella-ecommerce/issues/52)) ([1efa5ff](https://github.com/josuerochadev/stella-ecommerce/commit/1efa5ffb7618b930e1bf8513065ec67cba446c98))
* **ci:** build client before E2E, serve static files in CI ([6295604](https://github.com/josuerochadev/stella-ecommerce/commit/6295604e37af392a4e8a8b1c95bd9ebefd9e82c1))
* **ci:** conditional Sentry transport, add matchMedia mock for tests ([8785fc3](https://github.com/josuerochadev/stella-ecommerce/commit/8785fc357cd81cad6e0668b3403f4aa8c745a39c))
* **ci:** lazy-load Sentry, unset CI for client webServer in E2E ([81359fb](https://github.com/josuerochadev/stella-ecommerce/commit/81359fb5d1924b08e4795b1b645c654ac96868b0))
* **ci:** mark E2E job as continue-on-error ([3ea86d6](https://github.com/josuerochadev/stella-ecommerce/commit/3ea86d60f0636b3b6b16f76d655d1b36f5cc1880))
* **ci:** resolve CI failures — commitlint parser, peer deps, lint scope ([0cc9514](https://github.com/josuerochadev/stella-ecommerce/commit/0cc9514a0f67ff456aa32d774a9226b872482053))
* **ci:** use test:unit for server CI job (no DB available) ([a00c40d](https://github.com/josuerochadev/stella-ecommerce/commit/a00c40dd9b21c65114f003266645c435e644e4e7))
* **csrf:** stateless CSRF validation for production ([#59](https://github.com/josuerochadev/stella-ecommerce/issues/59)) ([d09d44e](https://github.com/josuerochadev/stella-ecommerce/commit/d09d44e9b27270b5fc5007962fcbb3886ecd5467))
* **csrf:** use sameSite=none for CSRF cookie in cross-origin production ([#58](https://github.com/josuerochadev/stella-ecommerce/issues/58)) ([763a8e7](https://github.com/josuerochadev/stella-ecommerce/commit/763a8e7fa9351f5ae5159c3df68c00b5ae10d669))
* dark theme modals, RGPD compliance and UI fixes ([#51](https://github.com/josuerochadev/stella-ecommerce/issues/51)) ([995e3f8](https://github.com/josuerochadev/stella-ecommerce/commit/995e3f89c521c3cb11227559844e140bf5e5edc4))
* **db:** use underscored column names in model index definitions ([afde0ba](https://github.com/josuerochadev/stella-ecommerce/commit/afde0baaa2b6749281146a44143cdfee6d882edf))
* **deploy:** add .env.production with API proxy URL ([#61](https://github.com/josuerochadev/stella-ecommerce/issues/61)) ([2598444](https://github.com/josuerochadev/stella-ecommerce/commit/2598444a4b4235db76db9eb9e70e8c927e3554bc))
* **deploy:** add Vercel API proxy to fix third-party cookie blocking ([#60](https://github.com/josuerochadev/stella-ecommerce/issues/60)) ([27d8917](https://github.com/josuerochadev/stella-ecommerce/commit/27d8917e2029fb7611ace11bdea1a06975d511dc))
* **e2e:** align tests with current app ([abbcd70](https://github.com/josuerochadev/stella-ecommerce/commit/abbcd70a06c90cbab5c4ee37c616aa3fd00429e2))
* **e2e:** use exact match for 'Nom' placeholder in register form test ([4bf1688](https://github.com/josuerochadev/stella-ecommerce/commit/4bf1688403228dcebe1349b9e8ba1f00dc79ea7d))
* **e2e:** use h1 selector for auth page ([fdb0dd7](https://github.com/josuerochadev/stella-ecommerce/commit/fdb0dd7e715e61bb3152d349aad0983e25749b62))
* **lint:** resolve all Biome lint errors across client codebase ([3713e9d](https://github.com/josuerochadev/stella-ecommerce/commit/3713e9d2b9c924b2f31766ec8a469710ea7f92a1))
* **lint:** resolve all server Biome lint errors (293 fixes) ([1d80834](https://github.com/josuerochadev/stella-ecommerce/commit/1d8083441d9b0fcbe41cc1f1e20cd670eecaa2c3))
* **server:** surface startup error with console.error before process.exit ([7ff356f](https://github.com/josuerochadev/stella-ecommerce/commit/7ff356fe07322db68b1561ae45a23ba66007a824))
* **server:** surface startup error with console.error before process.exit ([82db241](https://github.com/josuerochadev/stella-ecommerce/commit/82db2413e77c848647e7856f7d399357c4e44ba6))
* **ui:** adapt modals and status messages to dark theme ([#50](https://github.com/josuerochadev/stella-ecommerce/issues/50)) ([a8a3df5](https://github.com/josuerochadev/stella-ecommerce/commit/a8a3df5ce568dd8fa500873e29d3c18dae378645))
* **ui:** improve responsive layout for 320px mobile viewports ([#62](https://github.com/josuerochadev/stella-ecommerce/issues/62)) ([5f715ec](https://github.com/josuerochadev/stella-ecommerce/commit/5f715ece2cf4462dfd449ffb363b6d2c5ddc828d))
* **ux:** phase 3 — forms feedback, confirmation, toasts, aria-live ([757e65f](https://github.com/josuerochadev/stella-ecommerce/commit/757e65f8003fb20e296511ef263ae58564ebe04f))


### Performance Improvements

* audit Phase 4 — React Query, backend cache, pool config, Cache-Control ([de52c21](https://github.com/josuerochadev/stella-ecommerce/commit/de52c21264e5c19ec4db0f837bfb95ee9e8e6466))

## [1.0.0] - 2026-05-07

### Added
- Complete checkout flow with order confirmation and order history
- User reviews and ratings system on product pages
- Admin dashboard with user management and statistics
- Change password from profile page
- Quantity controls (+/-) in shopping cart
- Docker + docker-compose support (client, server, postgres)
- GitHub Actions CI pipeline (lint, test, typecheck)
- Husky + lint-staged pre-commit hooks
- Swagger/OpenAPI documentation for 96% of endpoints
- Winston structured logging (file + console transports)
- Dependency injection container for backend services
- Repository pattern for frontend data access
- Barrel files for components, services, and hooks
- Feature-level ErrorBoundary components
- Accessibility: skip links, ARIA roles, semantic HTML
- Render deployment configuration (render.yaml)
- Biome unified linting/formatting across client and server

### Fixed
- Double password hashing on user creation
- Cart total calculation (field mismatch `total` vs `totalAmount`)
- Button/link invalid HTML nesting in Home page (accessibility)
- Race condition in AuthContext replaced setTimeout with Promise.all
- Tailwind dynamic classes not compiled in ResponsiveGrid
- Silent error handling replaced with user-facing feedback
- CSRF protection on user profile and password endpoints
- Webhook signature bypass vulnerability
- CSP: removed unsafe-inline and unsafe-eval from script-src
- Guard NODE_ENV on destructive scripts (reset-db, create-tables)

### Changed
- Migrated to conventional commits
- Upgraded TypeScript to v5, @types/node to v20
- Standardized Biome to ^1.9.4 across all packages
- Centralized server configuration with env validation at startup
- Extracted email templates from emailService (498 -> 340 + 132 lines)
- Extracted Joi schemas from paymentRoutes into paymentValidation.js
- Registered paymentService and emailService in DI container
- Eliminated 6x duplicated cart data transformation
- Connected Register/Login to existing validationService
- Created reusable ID validator for repositories

### Removed
- @types/react-router-dom (v7 includes its own types)
- Hardcoded admin credentials from public HTML file
- Dangerous `as unknown as` and `as any` type casts

## [0.1.0] - 2026-05-06

### Added
- Initial full-stack e-commerce application
- Star catalog with filtering and search
- User authentication with JWT
- Shopping cart and wishlist
- PostgreSQL database with Sequelize ORM
- React TypeScript frontend with Tailwind CSS
- Express backend with MVC architecture
- User stories and wireframes documentation
