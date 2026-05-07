# ADR-004: Sequelize sync au lieu de migrations

**Date** : 2026-05-06
**Statut** : Accepte
**Contexte** : Gestion du schema de base de donnees — migrations vs sync automatique.

## Decision

Utiliser **`sequelize.sync()`** avec des scripts de creation de tables (`scripts/createTables.js`) au lieu du systeme de migrations Sequelize CLI.

## Raisons

- **Projet demo** : Stella est un projet portfolio, pas un produit en production avec des utilisateurs reels. Il n'y a pas de donnees a preserver entre les mises a jour du schema.
- **Simplicite** : `sync({ force: true })` recrée les tables a chaque initialisation. Pas besoin de gerer un historique de migrations.
- **Rapidite de dev** : Modifier un modele et relancer `create-tables` est plus rapide que creer/tester/rollback une migration.
- **Donnees de seed** : Le script `sampleData.js` regenere les donnees de demo. Pas de risque de perte.

## Compromis acceptes

- **Non viable en production** : Si le projet devait accueillir de vrais utilisateurs, des migrations seraient obligatoires pour ne pas perdre les donnees.
- **Pas d'historique de schema** : Impossible de rollback a une version precedente du schema sans Git.
- **Scripts destructifs proteges** : Les scripts `create-tables` et `reset-db` sont proteges par un guard `NODE_ENV !== 'production'`.

## Alternatives considerees

- **Sequelize CLI migrations** : Decision consciente de skip (voir ROADMAP.md point 6.3). Le benefice est faible pour un projet demo.
- **Knex migrations** : Changerait l'ORM, hors scope.
