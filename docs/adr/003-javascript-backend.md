# ADR-003: JavaScript (pas TypeScript) pour le backend

**Date** : 2026-05-06
**Statut** : Accepte
**Contexte** : Le frontend utilise TypeScript. Faut-il aussi migrer le backend vers TypeScript ?

## Decision

Garder le backend en **JavaScript pur** (Node.js/Express).

## Raisons

- **Pragmatisme** : Le backend etait deja developpe en JS avant l'ajout de TypeScript sur le client. Une migration representerait un effort important pour un benefice limite sur un projet portfolio.
- **Sequelize** : L'ORM Sequelize en JS est mature et bien documente. Le support TypeScript de Sequelize (v6) necessite des decorateurs et une config complexe.
- **Validation runtime** : La validation est assuree par Joi a la frontiere (routes/validations/), ce qui compense partiellement l'absence de types statiques.
- **DI Container** : Le conteneur custom fonctionne bien en JS. En TypeScript, il faudrait soit des generics complexes, soit une librairie comme tsyringe.

## Compromis acceptes

- Pas de type safety statique cote serveur. Les erreurs de typage ne sont detectees qu'au runtime ou par les tests.
- JSDoc est utilise sur les fichiers critiques (DIContainer, repositories) pour compenser.
- Le linting strict via Biome attrape certaines erreurs (unused vars, unreachable code).

## Alternatives considerees

- **Migration TypeScript** : Trop couteux pour le benefice. Priorite donnee aux features et a la qualite du code existant.
- **JSDoc + tsc --checkJs** : Envisageable comme etape intermediaire, mais pas encore mis en place.
