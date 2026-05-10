// server/src/container/DIContainer.js
// Container d'injection de dépendances simple
// Responsabilité unique : gestion et résolution des dépendances

/**
 * Container d'injection de dépendances simple
 * Permet l'enregistrement et la résolution de services
 */
class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * Enregistre un service avec son constructeur et ses dépendances
   * @param {string} name - Nom du service
   * @param {Function} constructor - Constructeur du service
   * @param {Array<string>} dependencies - Liste des dépendances
   * @param {boolean} singleton - Si le service doit être un singleton
   */
  register(name, constructor, dependencies = [], singleton = false) {
    if (!name || typeof name !== "string") {
      throw new Error("Service name must be a non-empty string");
    }

    if (typeof constructor !== "function") {
      throw new Error("Service constructor must be a function");
    }

    if (!Array.isArray(dependencies)) {
      throw new Error("Dependencies must be an array");
    }

    this.services.set(name, {
      constructor,
      dependencies,
      singleton,
    });
  }

  /**
   * Enregistre une instance directement (toujours singleton)
   * @param {string} name - Nom du service
   * @param {Object} instance - Instance du service
   */
  registerInstance(name, instance) {
    if (!name || typeof name !== "string") {
      throw new Error("Service name must be a non-empty string");
    }

    if (!instance) {
      throw new Error("Instance cannot be null or undefined");
    }

    this.singletons.set(name, instance);
  }

  /**
   * Enregistre une factory function
   * @param {string} name - Nom du service
   * @param {Function} factory - Factory function
   * @param {Array<string>} dependencies - Dépendances de la factory
   * @param {boolean} singleton - Si le résultat doit être mis en cache
   */
  registerFactory(name, factory, dependencies = [], singleton = false) {
    if (!name || typeof name !== "string") {
      throw new Error("Service name must be a non-empty string");
    }

    if (typeof factory !== "function") {
      throw new Error("Factory must be a function");
    }

    this.services.set(name, {
      factory,
      dependencies,
      singleton,
    });
  }

  /**
   * Résout et retourne une instance du service demandé
   * @param {string} name - Nom du service
   * @returns {Object} Instance du service
   */
  resolve(name) {
    if (!name || typeof name !== "string") {
      throw new Error("Service name must be a non-empty string");
    }

    // Vérifier si c'est déjà une instance singleton
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Récupérer la définition du service
    const serviceDefinition = this.services.get(name);
    if (!serviceDefinition) {
      throw new Error(`Service '${name}' not registered`);
    }

    // Si c'est un singleton et déjà instancié, le retourner
    if (serviceDefinition.singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Résoudre les dépendances
    const resolvedDependencies = serviceDefinition.dependencies.map((depName) => {
      try {
        return this.resolve(depName);
      } catch (error) {
        throw new Error(
          `Failed to resolve dependency '${depName}' for service '${name}': ${error.message}`,
        );
      }
    });

    // Créer l'instance
    let instance;

    if (serviceDefinition.factory) {
      // Utiliser la factory function
      instance = serviceDefinition.factory(...resolvedDependencies);
    } else {
      // Utiliser le constructeur
      instance = new serviceDefinition.constructor(...resolvedDependencies);
    }

    // Mettre en cache si singleton
    if (serviceDefinition.singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  /**
   * Vérifie si un service est enregistré
   * @param {string} name - Nom du service
   * @returns {boolean} True si le service est enregistré
   */
  has(name) {
    return this.services.has(name) || this.singletons.has(name);
  }

  /**
   * Supprime un service du container
   * @param {string} name - Nom du service
   */
  unregister(name) {
    this.services.delete(name);
    this.singletons.delete(name);
  }

  /**
   * Vide complètement le container
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
  }

  /**
   * Retourne la liste des services enregistrés
   * @returns {Array<string>} Noms des services
   */
  getRegisteredServices() {
    const serviceNames = Array.from(this.services.keys());
    const singletonNames = Array.from(this.singletons.keys());
    return [...new Set([...serviceNames, ...singletonNames])];
  }

  /**
   * Valide les dépendances circulaires
   * @param {string} serviceName - Nom du service à valider
   * @param {Set<string>} visited - Services déjà visités
   * @param {Set<string>} visiting - Services en cours de visite
   * @throws {Error} Si une dépendance circulaire est détectée
   */
  validateDependencies(serviceName, visited = new Set(), visiting = new Set()) {
    if (visiting.has(serviceName)) {
      throw new Error(`Circular dependency detected involving service '${serviceName}'`);
    }

    if (visited.has(serviceName)) {
      return;
    }

    visiting.add(serviceName);

    const serviceDefinition = this.services.get(serviceName);
    if (serviceDefinition?.dependencies) {
      for (const dependency of serviceDefinition.dependencies) {
        if (!this.has(dependency)) {
          throw new Error(
            `Service '${serviceName}' depends on unregistered service '${dependency}'`,
          );
        }
        this.validateDependencies(dependency, visited, visiting);
      }
    }

    visiting.delete(serviceName);
    visited.add(serviceName);
  }

  /**
   * Valide toutes les dépendances du container
   * @throws {Error} Si des dépendances invalides sont trouvées
   */
  validateAllDependencies() {
    const allServices = this.getRegisteredServices();
    const visited = new Set();

    for (const serviceName of allServices) {
      this.validateDependencies(serviceName, visited);
    }
  }

  /**
   * Affiche les informations de debug du container
   * @returns {Object} Informations de debug
   */
  getDebugInfo() {
    const services = {};

    for (const [name, definition] of this.services) {
      services[name] = {
        type: definition.factory ? "factory" : "constructor",
        dependencies: definition.dependencies,
        singleton: definition.singleton,
        instantiated: this.singletons.has(name),
      };
    }

    for (const [name] of this.singletons) {
      if (!services[name]) {
        services[name] = {
          type: "instance",
          dependencies: [],
          singleton: true,
          instantiated: true,
        };
      }
    }

    return {
      totalServices: this.getRegisteredServices().length,
      instantiatedSingletons: this.singletons.size,
      services,
    };
  }
}

module.exports = { DIContainer };
