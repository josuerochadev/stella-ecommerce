# ADR-005: Repository pattern pour les appels API frontend

**Date** : 2026-05-06
**Statut** : Accepte
**Contexte** : Organisation des appels API dans le frontend React/TypeScript.

## Decision

Utiliser un **repository pattern** (`client/src/repositories/`) pour abstraire les appels API, au-dessus de la couche services.

## Raisons

- **Separation des responsabilites** : Les repositories encapsulent les appels HTTP (Axios). Les stores (Zustand) ne gerent que l'etat. Les composants ne connaissent ni Axios ni les URLs.
- **Testabilite** : Les repositories implementent une interface (TypeScript). On peut injecter un mock repository dans les tests sans toucher a Axios.
- **Cohérence avec le backend** : Le backend utilise aussi un repository pattern (SequelizeOrderRepository, SequelizeCartRepository, etc.). La symetrie facilite la comprehension.
- **Refactoring safe** : Changer la source de donnees (REST -> GraphQL, Axios -> fetch) ne touche que le repository, pas les stores ni les composants.

## Structure

```
client/src/
├── repositories/
│   ├── ApiCartRepository.ts    # Implementation concrete (Axios)
│   └── types.ts                # Interfaces
├── services/
│   ├── cartService.ts          # Logique metier frontend
│   └── api.ts                  # Instance Axios configuree
└── stores/
    └── useCartStore.ts         # Etat global (utilise le repository)
```

## Alternatives considerees

- **Services directs** : Plus simple mais melange appels HTTP et transformation de donnees. Deja utilise sur certains services (starService, authService) — migration progressive vers le pattern repository.
- **React Query / TanStack Query** : Cache et revalidation automatiques, mais ajoute une dependance lourde et un paradigme different. Zustand + repositories suffit pour la taille du projet.
