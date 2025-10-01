// server/src/container/containerConfig.js
// Configuration du container d'injection de dépendances
// Responsabilité unique : enregistrement de tous les services

const { DIContainer } = require('./DIContainer');
const { BcryptHashingService } = require('../services/BcryptHashingService');
const { SequelizeUserRepository } = require('../repositories/SequelizeUserRepository');
const { SequelizeStarRepository } = require('../repositories/SequelizeStarRepository');
const { SequelizeOrderRepository } = require('../repositories/SequelizeOrderRepository');
const { SequelizeCartRepository } = require('../repositories/SequelizeCartRepository');
const { SequelizeWishlistRepository } = require('../repositories/SequelizeWishlistRepository');
const { SequelizeReviewRepository } = require('../repositories/SequelizeReviewRepository');
const { CartService } = require('../services/CartService');
const { StarAdminService } = require('../services/StarAdminService');
const { OrderService } = require('../services/OrderService');
const tokenService = require('../services/tokenService');

/**
 * Configure et retourne le container d'injection de dépendances
 * @returns {DIContainer} Container configuré
 */
function createContainer() {
  const container = new DIContainer();

  try {
    // Services de base
    container.register(
      'hashingService',
      BcryptHashingService,
      [], // Pas de dépendances
      true // Singleton
    );

    // Repositories
    container.register(
      'userRepository',
      SequelizeUserRepository,
      [], // Pas de dépendances (User model injecté dans le constructeur)
      true // Singleton
    );

    container.register(
      'starRepository',
      SequelizeStarRepository,
      [],
      true // Singleton
    );

    container.register(
      'orderRepository',
      SequelizeOrderRepository,
      [],
      true // Singleton
    );

    container.register(
      'cartRepository',
      SequelizeCartRepository,
      [],
      true // Singleton
    );

    container.register(
      'wishlistRepository',
      SequelizeWishlistRepository,
      [],
      true // Singleton
    );

    container.register(
      'reviewRepository',
      SequelizeReviewRepository,
      [],
      true // Singleton
    );

    // Services métier
    container.register(
      'cartService',
      CartService,
      ['cartRepository', 'starRepository'], // Dépendances
      true // Singleton
    );

    container.register(
      'starAdminService',
      StarAdminService,
      ['starRepository'], // Dépendances
      true // Singleton
    );

    container.register(
      'orderService',
      OrderService,
      ['orderRepository', 'starRepository', 'userRepository'], // Dépendances
      true // Singleton
    );

    // Services existants (token service)
    container.registerInstance('tokenService', tokenService);

    // Validation des dépendances
    container.validateAllDependencies();

    return container;
  } catch (error) {
    throw new Error(`Failed to configure DI container: ${error.message}`);
  }
}

/**
 * Container global (singleton)
 */
let globalContainer = null;

/**
 * Récupère le container global (pattern singleton)
 * @returns {DIContainer} Container global
 */
function getContainer() {
  if (!globalContainer) {
    globalContainer = createContainer();
  }
  return globalContainer;
}

/**
 * Réinitialise le container global (utile pour les tests)
 */
function resetContainer() {
  globalContainer = null;
}

/**
 * Configure le container pour les tests avec des mocks
 * @param {Object} mocks - Services mockés
 * @returns {DIContainer} Container de test
 */
function createTestContainer(mocks = {}) {
  const container = new DIContainer();

  // Services par défaut
  const defaultServices = {
    hashingService: new BcryptHashingService(),
    userRepository: new SequelizeUserRepository(),
    starRepository: new SequelizeStarRepository(),
    orderRepository: new SequelizeOrderRepository(),
    cartRepository: new SequelizeCartRepository(),
    wishlistRepository: new SequelizeWishlistRepository(),
    reviewRepository: new SequelizeReviewRepository(),
    tokenService: tokenService
  };

  // Merger avec les mocks
  const services = { ...defaultServices, ...mocks };

  // Enregistrer tous les services
  for (const [name, service] of Object.entries(services)) {
    container.registerInstance(name, service);
  }

  return container;
}

/**
 * Helper pour récupérer un service du container global
 * @param {string} serviceName - Nom du service
 * @returns {Object} Instance du service
 */
function getService(serviceName) {
  return getContainer().resolve(serviceName);
}

/**
 * Helper pour vérifier si un service existe
 * @param {string} serviceName - Nom du service
 * @returns {boolean} True si le service existe
 */
function hasService(serviceName) {
  return getContainer().has(serviceName);
}

/**
 * Affiche les informations de debug du container
 */
function debugContainer() {
  const container = getContainer();
  const info = container.getDebugInfo();

  console.log('=== DI Container Debug Info ===');
  console.log(`Total services: ${info.totalServices}`);
  console.log(`Instantiated singletons: ${info.instantiatedSingletons}`);
  console.log('\nServices:');

  for (const [name, details] of Object.entries(info.services)) {
    console.log(`  ${name}:`);
    console.log(`    Type: ${details.type}`);
    console.log(`    Dependencies: [${details.dependencies.join(', ')}]`);
    console.log(`    Singleton: ${details.singleton}`);
    console.log(`    Instantiated: ${details.instantiated}`);
  }

  console.log('==============================');
}

module.exports = {
  createContainer,
  getContainer,
  resetContainer,
  createTestContainer,
  getService,
  hasService,
  debugContainer
};