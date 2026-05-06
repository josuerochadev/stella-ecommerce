# Audit Qualite du Code — Stella E-Commerce

**Date** : 2026-05-06
**Scope** : client/ + server/ (full-stack)
**Note globale** : 5/10

---

## Resume

L'architecture frontend est solide (TypeScript, Zustand, DI, services separes) mais le backend souffre d'un manque total de tests et de duplications critiques dans la logique de paiement. Les magic numbers sont omnipresents, la validation est dupliquee entre composants et services, et des credentials admin sont exposes en clair dans un fichier public. Le socle est bon mais le projet necessite un effort significatif sur les tests backend, la factorisation du code duplique, et le nettoyage securitaire avant tout deploiement.

---

## Tableau de synthese

| Categorie            | Critique | Important | Mineur |
| -------------------- | -------- | --------- | ------ |
| Duplication de code  | 2        | 2         | —      |
| Tests                | 2        | 3         | 1      |
| Type safety          | —        | 2         | 1      |
| Magic numbers/strings| —        | 3         | 2      |
| SRP / SOLID          | —        | 3         | —      |
| Securite / Logs      | 1        | 3         | 1      |
| Configuration        | —        | 3         | 2      |
| Lisibilite / Naming  | —        | 1         | 3      |
| **Total**            | **4**    | **18**    | **10** |

---

## Critique — a corriger maintenant

### C1. Identifiants admin en clair dans le code source

- **Fichier** : `server/src/public/admin-demo.html:333-335`
- **Probleme** : Email admin (`admin@stella.com`) et mot de passe (`Admin123!@#`) exposes dans un `console.log` en clair, dans un fichier HTML servi publiquement.
- **Impact** : Toute personne accedant a la page peut lire les credentials dans la console du navigateur.

### C2. Zero test backend

- **Fichier** : `server/` (tout le repertoire)
- **Probleme** : Aucun fichier de test n'existe cote serveur malgre 12 controllers, 14 services, et des scripts `npm run test:unit` / `npm run test:integration` configures dans `package.json`. Les repertoires de tests n'existent pas.
- **Impact** : Logique metier critique (auth, paiement, commandes, panier) sans aucune couverture.

### C3. Duplication complete de la logique de paiement

- **Fichiers** : `server/src/controllers/paymentController.js:12-106` et `server/src/controllers/paymentProcessController.js:17-83`
- **Probleme** : `initiatePayment()` est implementee de maniere quasi-identique dans deux controleurs distincts. Violation flagrante de DRY.

### C4. Test qui re-definit la logique au lieu de l'importer

- **Fichier** : `client/src/tests/passwordValidation.test.ts:3-20`
- **Probleme** : La fonction `validatePassword()` est reecrite dans le fichier de test au lieu d'etre importee du service reel. Le test ne valide donc pas le vrai code de production.

---

## Important — a planifier

### I1. Duplication de la validation mot de passe (frontend)

- **Fichiers** : `client/src/components/Register.tsx:60-77` vs `client/src/utils/security.ts:36-52`
- **Probleme** : Les regles de validation (longueur, majuscule, minuscule, chiffre, caractere special) sont dupliquees en dur dans le composant Register au lieu d'utiliser le service centralise `FormValidationService`.

### I2. Magic numbers dans le service de paiement

- **Fichier** : `server/src/services/paymentService.js:93-107`
- **Probleme** : Pourcentages de methodes de paiement (0.6, 0.25, 0.1, 0.03, 0.02) en dur, non extraits en constantes nommees.

### I3. Magic numbers — calcul de dates repete

- **Fichier** : `server/src/controllers/paymentStatsController.js:97, 136, 170, 214`
- **Probleme** : `days * 24 * 60 * 60 * 1000` copie-colle 4 fois. Devrait etre une constante `DAYS_TO_MS` ou une fonction utilitaire.

### I4. `parseInt` sans radix

- **Fichier** : `server/src/controllers/paymentStatsController.js:20, 52, 75, 97, 136, 170, 214`
- **Probleme** : `parseInt(days)` sans second argument (radix 10). Risque d'interpretation en octal.

### I5. Erreur loggee au mauvais niveau

- **Fichier** : `server/src/utils/tokenCleanup.js:14`
- **Probleme** : Un echec de nettoyage de tokens est logge avec `logger.info()` au lieu de `logger.error()`. Silencieux en production.

### I6. Middleware CSRF ne delegue pas au error handler centralise

- **Fichier** : `server/src/middlewares/modernCsrf.js:93-111`
- **Probleme** : Retourne des reponses JSON d'erreur directement (`res.status().json()`) au lieu d'appeler `next(error)`, contournant le middleware d'erreurs centralise.

### I7. Race condition sur les operations panier

- **Fichier** : `server/src/services/CartService.js:99-105`
- **Probleme** : Pattern check-then-act (verification d'existence puis mise a jour) sans transaction. Risque de condition de concurrence.

### I8. `any` type dans le wrapper d'icones

- **Fichier** : `client/src/utils/icons.tsx:27`
- **Probleme** : `const createIconWrapper = (OriginalIcon: any)` — seule utilisation de `any` dans le frontend. Devrait etre type `React.ComponentType<IconProps>`.

### I9. `console.error` dans errorService au lieu du logger

- **Fichier** : `client/src/services/errorService.ts:88`
- **Probleme** : `console.error('Error in error handler:', handlerError)` utilise `console` directement au lieu du logger centralise.

### I10. Zustand stores melangent appels API et gestion d'etat

- **Fichier** : `client/src/stores/useCartStore.ts:36-87`
- **Probleme** : Le store effectue directement les appels API, la transformation des donnees, et la gestion d'erreurs. Violation SRP — le store devrait deleguer au service et ne gerer que l'etat.

### I11. `jsdom` dans les dependances de production

- **Fichiers** : `client/package.json:16` et `server/package.json:41`
- **Probleme** : `jsdom` est liste dans `dependencies` au lieu de `devDependencies`. Gonfle le bundle de production. Cote serveur, il n'est meme jamais utilise.

### I12. Duplication de la conversion de prix (wishlist)

- **Fichier** : `server/src/controllers/wishlistController.js:52-54, 84-90, 135-140`
- **Probleme** : Logique de conversion prix string vers float dupliquee 3 fois. Devrait etre extraite dans un helper.

### I13. Classe `PaymentSimulator` — nom trompeur

- **Fichier** : `server/src/services/paymentService.js:12`
- **Probleme** : La classe s'appelle `PaymentSimulator` mais orchestre reellement le traitement de paiements. Nom qui induit en erreur.

### I14. Violations de lint non corrigees

- **Fichier** : `client/src/utils/modalStyles.ts:16, 61`
- **Probleme** : `noStaticOnlyClass` et `noThisInStatic` — deux warnings Biome non resolus dans le code commite.

### I15. Pre-commit hooks n'executent pas les tests

- **Fichier** : `.husky/pre-commit`
- **Probleme** : Seul `lint-staged` est lance. Aucun test n'est execute avant le commit.

### I16. TODO en production — monitoring non implemente

- **Fichier** : `client/src/utils/logger.ts:51, 62`
- **Probleme** : `// TODO: Send to monitoring service in production` — le tracking d'erreurs en production n'est pas implemente.

### I17. Parametre `days` non valide dans les stats

- **Fichier** : `server/src/controllers/paymentStatsController.js:19, 51, 74`
- **Probleme** : Le query parameter `days` est utilise directement sans validation. Des valeurs negatives ou extremes pourraient causer des problemes.

### I18. Variables globales dans jest.setup.js

- **Fichier** : `server/jest.setup.js:58-60`
- **Probleme** : `global.token`, `global.userId`, `global.sequelize` — pollution du scope global. Cree des dependances cachees entre tests.

---

## Mineur — nice to have

### M1. Codes HTTP semantiquement incorrects

- **Fichier** : `server/src/controllers/wishlistController.js:39, 65`
- **Probleme** : Retourne `200` au lieu de `201 Created` pour la creation d'un item en wishlist.

### M2. Messages d'erreur hardcodes en francais sans i18n

- **Fichier** : `server/src/controllers/wishlistController.js:41, 58, 67, 94, 115, 121, 128...`
- **Probleme** : Messages d'erreur francais en dur. Pas de systeme d'internationalisation ou de constantes centralisees.

### M3. Magic numbers incoherents pour les limites de resultats

- **Fichiers** : `client/src/hooks/useSearchLogic.ts:38` (8), `client/src/components/SearchBar.tsx:116` (5), `client/src/hooks/useCatalogSearch.ts:112` (5)
- **Probleme** : Limites de resultats de recherche differentes et non extraites en constantes.

### M4. Accents manquants dans les messages utilisateur

- **Fichiers** : `client/src/components/ChangePasswordForm.tsx:71`, `client/src/components/ReviewSection.tsx:71`
- **Probleme** : "Mot de passe modifie avec succes." au lieu de "modifie avec succes".

### M5. Liste de mots de passe communs trop courte

- **Fichier** : `server/src/services/BcryptHashingService.js:116-123`
- **Probleme** : Seulement 10 mots de passe communs en dur. Insuffisant comme protection reelle.

### M6. Over-commenting dans le conteneur DI

- **Fichier** : `server/src/container/DIContainer.js`
- **Probleme** : Ratio commentaires/code tres eleve. Le code devrait etre auto-explicatif.

### M7. Export duplique dans starService

- **Fichier** : `client/src/services/starService.ts:107`
- **Probleme** : `fetchStarById` est un alias qui duplique `getStarById`. Surface d'API inutilement doublee.

### M8. `skipLibCheck: true` dans tsconfig

- **Fichier** : `client/tsconfig.json:8`
- **Probleme** : Desactive la verification de types des dependances. Peut masquer des incompatibilites.

### M9. Backend en JavaScript pur sans TypeScript

- **Fichier** : `server/src/` (tout le repertoire)
- **Probleme** : Le serveur utilise uniquement JavaScript (.js) alors que le client est en TypeScript. Incoherence architecturale et absence de type safety cote serveur.

### M10. `collectCoverage: true` par defaut

- **Fichier** : `client/jest.config.js:15`
- **Probleme** : Force le rapport de couverture a chaque execution de tests, ralentissant le watch mode.

---

## Plan de correction recommande

### Phase 1 — Securite (immediat)

| # | Action | Ref |
|---|--------|-----|
| 1 | Supprimer les credentials admin du fichier HTML public | C1 |
| 2 | Deplacer `jsdom` en devDependencies (client + server) | I11 |

### Phase 2 — Duplication et DRY (sprint 1)

| # | Action | Ref |
|---|--------|-----|
| 3 | Fusionner les deux controllers de paiement en un seul | C3 |
| 4 | Extraire la validation mot de passe dans un service partage (Register) | I1 |
| 5 | Extraire la conversion de prix en helper (wishlistController) | I12 |
| 6 | Extraire magic numbers en constantes (paymentService, paymentStatsController) | I2, I3 |

### Phase 3 — Robustesse backend (sprint 2)

| # | Action | Ref |
|---|--------|-----|
| 7 | Ajouter radix a tous les `parseInt` | I4 |
| 8 | Corriger le log level dans tokenCleanup | I5 |
| 9 | Deleguer les erreurs CSRF au error handler centralise | I6 |
| 10 | Ajouter une transaction au CartService (race condition) | I7 |
| 11 | Valider le parametre `days` dans paymentStatsController | I17 |
| 12 | Renommer `PaymentSimulator` en nom coherent | I13 |

### Phase 4 — Tests (sprint 2-3)

| # | Action | Ref |
|---|--------|-----|
| 13 | Creer la structure de tests backend (unit + integration) | C2 |
| 14 | Ecrire les tests critiques : auth, cart, orders, payment | C2 |
| 15 | Corriger passwordValidation.test.ts pour importer le vrai service | C4 |
| 16 | Ajouter l'execution des tests dans le pre-commit hook | I15 |
| 17 | Nettoyer jest.setup.js (supprimer les globales) | I18 |

### Phase 5 — Clean code frontend (sprint 3)

| # | Action | Ref |
|---|--------|-----|
| 18 | Typer le wrapper d'icones (supprimer `any`) | I8 |
| 19 | Remplacer `console.error` par le logger dans errorService | I9 |
| 20 | Separer appels API et etat dans useCartStore | I10 |
| 21 | Corriger les violations Biome dans modalStyles.ts | I14 |

### Phase 6 — Polish (backlog)

| # | Action | Ref |
|---|--------|-----|
| 22 | Corriger les codes HTTP (201 pour creation) | M1 |
| 23 | Centraliser les messages d'erreur en constantes | M2 |
| 24 | Extraire les limites de recherche en constantes | M3 |
| 25 | Corriger les accents dans les messages UI | M4 |
| 26 | Supprimer l'export duplique fetchStarById | M7 |
