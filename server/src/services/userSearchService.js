// server/src/services/userSearchService.js
// Service spécialisé pour la recherche d'utilisateurs
// Responsabilité unique : construction des conditions de recherche et pagination

const { Op } = require('sequelize');

/**
 * Service de recherche d'utilisateurs
 * Responsabilité unique : gestion de la logique de recherche et filtrage
 */
class UserSearchService {
  /**
   * Construit les conditions de recherche pour les utilisateurs
   * @param {string} search - Terme de recherche
   * @param {string} role - Filtre par rôle
   * @returns {Object} Conditions WHERE pour Sequelize
   */
  static buildSearchConditions(search, role) {
    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      whereCondition.role = role;
    }

    return whereCondition;
  }

  /**
   * Valide et normalise les paramètres de pagination
   * @param {string|number} page - Numéro de page
   * @param {string|number} limit - Limite par page
   * @returns {Object} Paramètres de pagination validés
   */
  static validatePaginationParams(page = 1, limit = 20) {
    const validatedPage = Math.max(1, parseInt(page) || 1);
    const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (validatedPage - 1) * validatedLimit;

    return {
      page: validatedPage,
      limit: validatedLimit,
      offset
    };
  }

  /**
   * Valide et normalise les paramètres de tri
   * @param {string} sortBy - Champ de tri
   * @param {string} order - Ordre de tri
   * @returns {Object} Paramètres de tri validés
   */
  static validateSortParams(sortBy = 'createdAt', order = 'DESC') {
    const allowedSortFields = ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'];
    const allowedOrders = ['ASC', 'DESC'];

    const validatedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validatedOrder = allowedOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    return {
      sortBy: validatedSortBy,
      order: validatedOrder
    };
  }

  /**
   * Construit les options de requête Sequelize complètes
   * @param {Object} params - Paramètres de recherche, pagination et tri
   * @returns {Object} Options pour findAndCountAll
   */
  static buildQueryOptions(params) {
    const { search, role, page, limit, sortBy, order } = params;

    const whereCondition = this.buildSearchConditions(search, role);
    const { offset, limit: validatedLimit } = this.validatePaginationParams(page, limit);
    const { sortBy: validatedSortBy, order: validatedOrder } = this.validateSortParams(sortBy, order);

    return {
      where: whereCondition,
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
      order: [[validatedSortBy, validatedOrder]],
      limit: validatedLimit,
      offset
    };
  }
}

module.exports = { UserSearchService };