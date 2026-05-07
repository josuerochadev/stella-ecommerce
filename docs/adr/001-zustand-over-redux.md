# ADR-001: Zustand pour le state management frontend

**Date** : 2026-05-06
**Statut** : Accepte
**Contexte** : Choix d'une solution de state management pour le frontend React.

## Decision

Utiliser **Zustand** au lieu de Redux, MobX, ou du Context API natif.

## Raisons

- **Simplicite** : Zustand n'impose pas de boilerplate (reducers, actions, action types). Un store se definit en quelques lignes.
- **Performance** : Re-renders granulaires par defaut via des selectors, sans avoir besoin de `memo` ou `reselect`.
- **Taille** : ~1 KB gzipped vs ~7 KB pour Redux Toolkit. Pertinent pour un projet portfolio ou le bundle size compte.
- **Compatibilite** : Fonctionne nativement avec React hooks, pas besoin de Provider wrapper.
- **Testabilite** : Les stores sont des fonctions pures, facilement mockables dans les tests.

## Alternatives considerees

- **Redux Toolkit** : Plus structure, mais surdimensionne pour un projet de cette taille (5 stores). Le boilerplate slices/thunks n'apporte pas de valeur ici.
- **React Context** : Suffisant pour l'auth, mais cause des re-renders excessifs pour le panier/wishlist qui changent frequemment.
- **MobX** : Approche reactive interessante, mais paradigme different (observables) qui complexifie l'onboarding.

## Consequences

- Les stores sont dans `client/src/stores/` (useCartStore, useWishlistStore, useAuthStore).
- Pas de middleware Redux DevTools, mais Zustand offre un middleware devtools optionnel.
- Les appels API sont delegues aux services/repositories, les stores ne gerent que l'etat.
