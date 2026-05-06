# Deploiement sur Render

## Architecture

```
Render
├── stella-client  (Static Site - gratuit)
│   └── Build React → CDN
├── stella-api     (Web Service - gratuit)
│   └── Node.js Express
└── stella-db      (PostgreSQL - gratuit 90 jours)
```

## Etapes

### 1. Creer le Blueprint

- Aller sur [render.com](https://render.com) → Sign up avec GitHub
- New → Blueprint → selectionner le repo `stella-ecommerce` → branche `main`
- Render lit le `render.yaml` et cree les 3 services automatiquement

### 2. Configurer les variables d'environnement

Une fois les services crees, noter les URLs generees par Render (ex: `stella-api-xxxx.onrender.com`).

**Service `stella-api` (Environment) :**

| Variable | Valeur |
|----------|--------|
| `FRONTEND_URL` | `https://stella-client-xxxx.onrender.com` (URL du static site) |
| `JWT_SECRET` | (auto-genere par render.yaml) |
| `NODE_ENV` | `production` (auto) |
| `DATABASE_URL` | (auto-lie a stella-db) |

**Service `stella-client` (Environment) :**

| Variable | Valeur |
|----------|--------|
| `REACT_APP_API_URL` | `https://stella-api-xxxx.onrender.com/api` (URL du web service) |

### 3. Initialiser la base de donnees

Dans le dashboard Render → service `stella-api` → Shell :

```bash
node ../scripts/createTables.js
node ../scripts/sampleData.js
```

### 4. Verifier

- Frontend : `https://stella-client-xxxx.onrender.com`
- Backend : `https://stella-api-xxxx.onrender.com/api`
- Swagger : `https://stella-api-xxxx.onrender.com/api-docs`
- Login test : `john@example.com` / `password123`

## Notes

- Le free tier Render met le backend en veille apres 15 min d'inactivite
- Premier chargement apres veille : ~30 secondes
- La DB PostgreSQL gratuite expire apres 90 jours (puis $7/mois)
- Les URLs exactes sont generees par Render, remplacer `xxxx` par les vraies valeurs
