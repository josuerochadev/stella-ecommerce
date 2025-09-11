# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Stella is a full-stack e-commerce application for buying stars, built with a React TypeScript frontend and Node.js/Express backend using PostgreSQL.

```text
stella-ecommerce/
├── client/          # React TypeScript frontend (port 3001)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route-based page components
│   │   ├── services/      # API calls and external services
│   │   ├── stores/        # Zustand state management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript type definitions
│   │   └── tests/         # Jest test files
├── server/          # Node.js/Express backend API (port 3000)
│   ├── src/
│   │   ├── controllers/   # Route handlers and business logic
│   │   ├── models/        # Sequelize ORM models
│   │   ├── routes/        # Express route definitions
│   │   ├── middlewares/   # Custom middleware functions
│   │   ├── validations/   # Joi validation schemas
│   │   ├── utils/         # Helper utilities
│   │   └── config/        # Configuration files
├── scripts/         # Database utility scripts
└── docs/           # Project documentation and screenshots
```

## Development Commands

### Frontend (client/)

- `npm start` - Start development server on port 3001
- `npm run build` - Build production bundle
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Backend (server/)

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

### Database Management (from server/)

- `npm run create-tables` - Initialize database tables (destructive)
- `npm run generate-data` - Populate with sample data
- `npm run reset-db` - Reset database completely

## Architecture Details

### Frontend Architecture

- **State Management**: Zustand for global state, React hooks for local state
- **Routing**: React Router v7 for navigation
- **HTTP Client**: Axios with interceptors for authentication and CSRF tokens
- **Styling**: Tailwind CSS with custom components
- **Testing**: Jest with React Testing Library

### Backend Architecture

- **Framework**: Express.js with MVC pattern
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens with secure httpOnly cookies
- **Security**: Helmet, CORS, CSRF protection, input validation with Joi
- **API Documentation**: Swagger/OpenAPI at `/api-docs`
- **Logging**: Winston with file and console transports

### Key Features

- User authentication with JWT and CSRF protection
- Star catalog with filtering and search functionality
- Shopping cart and wishlist management
- Order processing and status tracking
- User reviews and ratings system
- Responsive design with Tailwind CSS

## Code Standards

The project uses Biome for consistent code formatting and linting across both frontend and backend:

- 2-space indentation
- Double quotes for strings
- Semicolons required
- Line width limit of 100 characters
- Unused variables treated as errors

## Environment Setup

Both client and server require `.env` files:

- Client: API URL configuration
- Server: Database credentials, JWT secrets, and environment settings

## Testing

- Frontend: Jest with jsdom environment, tests in `client/src/tests/`
- Backend: Jest with Node environment, tests in separate test directories
- Coverage reports generated for both environments

## API Communication

- Base URL: `http://localhost:3000/api`
- CSRF tokens automatically handled via cookies and request headers
- Authentication tokens stored in localStorage and sent via Authorization header
- All API responses follow consistent `ApiResponse<T>` format
