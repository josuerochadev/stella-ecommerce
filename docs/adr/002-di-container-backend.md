# ADR-002: Dependency Injection container custom pour le backend

**Date** : 2026-05-06
**Statut** : Accepte
**Contexte** : Besoin de decoupler les controllers des implementations concretes des services et repositories.

## Decision

Implementer un **conteneur DI custom** (`server/src/container/DIContainer.js`) plutot que d'utiliser une librairie tierce (InversifyJS, Awilix, tsyringe).

## Raisons

- **Controle total** : Le conteneur est simple (~220 lignes) et couvre exactement les besoins du projet (register, resolve, singleton).
- **Zero dependance** : Pas de decorateurs TypeScript, pas de metadata reflection. Le backend est en JavaScript pur.
- **Transparence** : La configuration du conteneur est dans `containerConfig.js`, lisible d'un coup d'oeil.
- **Testabilite** : Les services recoivent leurs dependances par injection, ce qui permet de mocker facilement dans les tests.

## Alternatives considerees

- **Awilix** : Excellent pour Node.js, mais ajoute une dependance pour un projet qui n'a que ~15 services a enregistrer.
- **Import direct** : Plus simple mais cree un couplage fort. Impossible de mocker sans hacks (`jest.mock()`).
- **InversifyJS** : Requiert TypeScript et decorateurs, incompatible avec le backend JS du projet.

## Consequences

- Tous les services et repositories sont enregistres dans `server/src/container/containerConfig.js`.
- Les controllers resolvent leurs dependances depuis le conteneur.
- Le conteneur supporte les modes singleton et transient.
- Deux patterns d'export coexistent dans les controllers : DI-based (bind) et non-DI (exports directs). C'est un compromis accepte (voir AUDIT_ARCHITECTURE.md I7).
