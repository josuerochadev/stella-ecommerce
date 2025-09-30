// client/src/di/container.ts
// Container d'injection de dépendances simple pour le frontend
// Responsabilité unique : gestion et résolution des dépendances frontend

import { ApiCartRepository } from '../repositories/ApiCartRepository';
import { ApiWishlistRepository } from '../repositories/ApiWishlistRepository';
import type { CartRepository } from '../interfaces/CartRepository';
import type { WishlistRepository } from '../interfaces/WishlistRepository';

/**
 * Type pour les services disponibles dans le container
 */
export interface ServiceContainer {
  cartRepository: CartRepository;
  wishlistRepository: WishlistRepository;
}

/**
 * Container d'injection de dépendances pour le frontend
 * Version simplifiée adaptée au contexte React/Zustand
 */
class FrontendDIContainer {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  /**
   * Enregistre un service singleton
   * @param name - Nom du service
   * @param instance - Instance du service
   */
  registerSingleton<T>(name: string, instance: T): void {
    this.singletons.set(name, instance);
  }

  /**
   * Enregistre une factory de service
   * @param name - Nom du service
   * @param factory - Factory function pour créer le service
   */
  registerFactory<T>(name: string, factory: () => T): void {
    this.services.set(name, factory);
  }

  /**
   * Résout un service par son nom
   * @param name - Nom du service
   * @returns Instance du service
   */
  resolve<T>(name: string): T {
    // Vérifier si c'est un singleton
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Vérifier si c'est une factory
    if (this.services.has(name)) {
      const factory = this.services.get(name);
      const instance = factory();

      // Mettre en cache comme singleton après la première création
      this.singletons.set(name, instance);
      return instance;
    }

    throw new Error(`Service '${name}' not found in container`);
  }

  /**
   * Vérifie si un service est enregistré
   * @param name - Nom du service
   * @returns True si le service existe
   */
  has(name: string): boolean {
    return this.services.has(name) || this.singletons.has(name);
  }

  /**
   * Supprime un service du container
   * @param name - Nom du service
   */
  remove(name: string): void {
    this.services.delete(name);
    this.singletons.delete(name);
  }

  /**
   * Vide complètement le container
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }

  /**
   * Retourne les noms de tous les services enregistrés
   */
  getServiceNames(): string[] {
    const serviceNames = Array.from(this.services.keys());
    const singletonNames = Array.from(this.singletons.keys());
    const combined = serviceNames.concat(singletonNames);
    return Array.from(new Set(combined));
  }
}

// Instance globale du container
const container = new FrontendDIContainer();

/**
 * Configure le container avec les services par défaut
 */
export function configureContainer(): void {
  // Enregistrer les repositories
  container.registerFactory('cartRepository', () => new ApiCartRepository());
  container.registerFactory('wishlistRepository', () => new ApiWishlistRepository());
}

/**
 * Récupère une instance de service typée
 * @param serviceName - Nom du service
 * @returns Instance du service
 */
export function getService<K extends keyof ServiceContainer>(
  serviceName: K
): ServiceContainer[K] {
  return container.resolve(serviceName);
}

/**
 * Enregistre un service personnalisé (utile pour les tests)
 * @param serviceName - Nom du service
 * @param instance - Instance du service
 */
export function registerService<K extends keyof ServiceContainer>(
  serviceName: K,
  instance: ServiceContainer[K]
): void {
  container.registerSingleton(serviceName, instance);
}

/**
 * Enregistre une factory de service personnalisée
 * @param serviceName - Nom du service
 * @param factory - Factory function
 */
export function registerServiceFactory<K extends keyof ServiceContainer>(
  serviceName: K,
  factory: () => ServiceContainer[K]
): void {
  container.registerFactory(serviceName, factory);
}

/**
 * Vérifie si un service est disponible
 * @param serviceName - Nom du service
 * @returns True si disponible
 */
export function hasService<K extends keyof ServiceContainer>(
  serviceName: K
): boolean {
  return container.has(serviceName);
}

/**
 * Réinitialise le container (utile pour les tests)
 */
export function resetContainer(): void {
  container.clear();
  configureContainer(); // Reconfigurer avec les services par défaut
}

/**
 * Configuration du container pour les tests avec des mocks
 * @param mocks - Services mockés
 */
export function configureTestContainer(mocks: Partial<ServiceContainer>): void {
  container.clear();

  // Enregistrer les mocks
  Object.entries(mocks).forEach(([serviceName, mock]) => {
    container.registerSingleton(serviceName, mock);
  });

  // Enregistrer les services par défaut pour ceux non mockés
  if (!mocks.cartRepository) {
    container.registerFactory('cartRepository', () => new ApiCartRepository());
  }
  if (!mocks.wishlistRepository) {
    container.registerFactory('wishlistRepository', () => new ApiWishlistRepository());
  }
}

/**
 * Hook React pour récupérer un service
 * Utilise la convention React pour les hooks personnalisés
 */
export function useService<K extends keyof ServiceContainer>(
  serviceName: K
): ServiceContainer[K] {
  // En production, on pourrait ajouter une optimisation avec useMemo
  // pour éviter les re-créations inutiles
  return getService(serviceName);
}

/**
 * Helper pour créer des stores avec injection de dépendances
 * @param createStore - Factory function pour créer le store
 * @param dependencies - Dépendances requises
 * @returns Store configuré avec les dépendances
 */
export function createStoreWithDI<T, D extends Partial<ServiceContainer>>(
  createStore: (dependencies: D) => T,
  dependencies: (keyof ServiceContainer)[]
): T {
  const resolvedDependencies = {} as D;

  dependencies.forEach(depName => {
    resolvedDependencies[depName as keyof D] = getService(depName) as any;
  });

  return createStore(resolvedDependencies);
}

// Configuration initiale au chargement du module
configureContainer();

export { container as DIContainer };