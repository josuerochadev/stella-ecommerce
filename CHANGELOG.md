# Changelog

All notable changes to this project are documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

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
