# Deploiement — Vercel + Railway + Neon

## Architecture

```
Vercel          → Frontend React  (CDN global, gratuit)
Railway         → Backend Express (Node.js, ~$1-3/mois)
Neon            → PostgreSQL      (serverless, gratuit)
```

---

## 1. Base de donnees — Neon

1. Creer un compte sur [neon.tech](https://neon.tech)
2. **New Project** → nommer le projet `stella`
3. Copier la **Connection string** (format `postgresql://user:pass@host/db?sslmode=require`)
4. Garder cette URL pour l'etape Railway

---

## 2. Backend — Railway

1. Creer un compte sur [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Selectionner `stella-ecommerce`, branche `main`
3. Railway detecte le projet Node.js. Configurer dans **Settings** :
   - **Root Directory** : `server`
   - **Start Command** : `npm start`
4. Dans **Variables**, ajouter :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Connection string Neon (copiee a l'etape 1) |
| `JWT_SECRET` | Chaine aleatoire longue (ex: `openssl rand -hex 64`) |
| `SESSION_SECRET` | Autre chaine aleatoire longue |
| `FRONTEND_URL` | URL Vercel du frontend (ex: `https://stella.vercel.app`) — a ajouter apres l'etape 3 |
| `SENTRY_DSN` | (optionnel) DSN Sentry backend |

5. Recuperer l'URL publique du service Railway (ex: `https://stella-api.railway.app`)

### Initialiser la base de donnees

Depuis l'onglet **Shell** du service Railway (ou via Railway CLI) :

```bash
node ../scripts/createTables.js
node ../scripts/sampleData.js
```

---

## 3. Frontend — Vercel

1. Creer un compte sur [vercel.com](https://vercel.com) → **Add New Project** → importer `stella-ecommerce`
2. Configurer le projet :
   - **Root Directory** : `client`
   - **Framework Preset** : Create React App
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`
3. Dans **Environment Variables** :

| Variable | Valeur |
|---|---|
| `REACT_APP_API_URL` | `https://stella-api.railway.app/api` (URL Railway) |
| `REACT_APP_SENTRY_DSN` | (optionnel) DSN Sentry frontend |

4. Deployer. Recuperer l'URL Vercel generee (ex: `https://stella.vercel.app`)
5. **Retourner sur Railway** → mettre a jour `FRONTEND_URL` avec cette URL Vercel

---

## 4. Verification

| Service | URL |
|---|---|
| Frontend | `https://stella.vercel.app` |
| Backend API | `https://stella-api.railway.app/api` |
| Swagger docs | `https://stella-api.railway.app/api-docs` |

Tester avec le compte admin cree par le seed (`scripts/sampleData.js`).

---

## Deploiements suivants

- **Frontend** : Vercel redeploit automatiquement a chaque push sur `main`
- **Backend** : Railway redeploit automatiquement a chaque push sur `main`
- **DB** : Neon ne necessite pas de re-deploiement (schema gere par Sequelize sync au demarrage)

---

## Notes

- Les cookies d'auth sont en `sameSite=none; Secure` en production pour fonctionner en cross-domain (Vercel ≠ Railway)
- Neon met le compute en pause apres inactivite — le premier acces apres pause peut prendre ~1s
- Railway Hobby : $5 de credit inclus/mois, un petit portfolio consomme generalement $1-3
- Neon free tier : 0.5 GB de stockage, aucune expiration (contrairement a Render qui expire apres 90 jours)
