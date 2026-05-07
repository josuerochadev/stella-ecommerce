# Contributing to Stella

Thank you for considering contributing to Stella! This document outlines the conventions and workflow used in this project.

## Getting Started

1. Fork the repository and clone it locally
2. Follow the [Installation guide](./README.md#installation) to set up your environment
3. Create a feature branch from `main`

## Development Workflow

### Branching

- `main` — stable, production-ready code
- Feature branches: `feature/description`, `fix/description`, `refactor/description`

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must follow this format:

```
type(scope): short description

Optional longer description.
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `refactor` — code restructuring without behavior change
- `test` — adding or updating tests
- `docs` — documentation changes
- `chore` — dependency updates, tooling, config
- `ci` — CI/CD pipeline changes
- `infra` — infrastructure (Docker, deployment)
- `style` — formatting, whitespace (no logic change)
- `perf` — performance improvement

**Examples:**
```
feat: add order confirmation page
fix: resolve cart total calculation error
refactor(auth): extract token refresh into service
docs: update README installation steps
```

### Pull Requests

- **One PR = one topic.** No catch-all PRs mixing unrelated changes.
- PR title follows the same conventional commit format.
- Include a short description of what changed and why.
- Visual changes must be verified on 3 breakpoints (mobile/tablet/desktop) before merge.

### Code Quality

**Linting and formatting** are enforced by [Biome](https://biomejs.dev/):
- 2-space indentation
- Double quotes
- Semicolons required
- Line width limit: 100 characters

Run manually:
```bash
npm run lint     # Check for issues
npm run format   # Auto-format
```

**Pre-commit hooks** (Husky + lint-staged) run automatically on every commit. They execute Biome checks on staged files. **Never bypass with `--no-verify`.**

### Testing

- Frontend: `cd client && npm test`
- Backend: `cd server && npm test`

Write tests for new features and bug fixes when applicable.

## Project Conventions

- **Frontend:** TypeScript, React functional components, Zustand for state, repository pattern for API calls
- **Backend:** JavaScript (Node.js/Express), MVC + DI container, Sequelize ORM, Joi for validation
- **Styling:** Tailwind CSS utility classes, no inline styles
- **Comments:** Only when they explain "why", not "what". No obvious comments.

## Reporting Issues

Open an issue on the GitHub repository with:
- A clear title
- Steps to reproduce (if bug)
- Expected vs actual behavior
- Screenshots if relevant
