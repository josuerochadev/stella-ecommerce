// server/src/formatters/userResponseFormatter.js
// Formatage des réponses utilisateurs pour l'API
// Responsabilité unique : transformation des données en format de réponse cohérent

/**
 * Formateur de réponses utilisateurs
 * Responsabilité unique : standardisation et formatage des données de sortie
 */
class UserResponseFormatter {
  /**
   * Formate un utilisateur unique avec ses statistiques
   * @param {Object} user - Données utilisateur de la base
   * @param {Object} stats - Statistiques de l'utilisateur
   * @returns {Object} Utilisateur formaté
   */
  static formatUser(user, stats = null) {
    const formattedUser = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      joinDate: user.createdAt,
      stats: stats || {
        orderCount: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        lastOrderDate: null
      }
    };

    return formattedUser;
  }

  /**
   * Formate une liste d'utilisateurs avec leurs statistiques
   * @param {Array} users - Liste des utilisateurs
   * @param {Map} statsMap - Map des statistiques par ID utilisateur
   * @returns {Array} Liste formatée des utilisateurs
   */
  static formatUserList(users, statsMap = new Map()) {
    return users.map(user => {
      const userStats = statsMap.get(user.id) || {
        orderCount: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        lastOrderDate: null
      };

      return this.formatUser(user, userStats);
    });
  }

  /**
   * Formate les informations de pagination
   * @param {number} currentPage - Page actuelle
   * @param {number} limit - Limite par page
   * @param {number} totalCount - Nombre total d'éléments
   * @returns {Object} Informations de pagination formatées
   */
  static formatPagination(currentPage, limit, totalCount) {
    const totalPages = Math.ceil(totalCount / limit);

    return {
      currentPage: parseInt(currentPage),
      totalPages,
      totalUsers: totalCount,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      limit: parseInt(limit)
    };
  }

  /**
   * Formate la réponse complète de la liste des utilisateurs
   * @param {Array} users - Liste des utilisateurs
   * @param {Map} statsMap - Map des statistiques
   * @param {Object} paginationParams - Paramètres de pagination
   * @param {number} totalCount - Nombre total d'utilisateurs
   * @returns {Object} Réponse API formatée
   */
  static formatUsersResponse(users, statsMap, paginationParams, totalCount) {
    const { page, limit } = paginationParams;

    return {
      success: true,
      users: this.formatUserList(users, statsMap),
      pagination: this.formatPagination(page, limit, totalCount),
      meta: {
        totalUsers: totalCount,
        usersOnPage: users.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Formate la réponse de mise à jour de rôle utilisateur
   * @param {Object} user - Utilisateur mis à jour
   * @param {string} message - Message de succès
   * @returns {Object} Réponse API formatée
   */
  static formatUserRoleUpdateResponse(user, message) {
    return {
      success: true,
      message,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formate les statistiques détaillées d'un utilisateur
   * @param {Object} user - Données utilisateur
   * @param {Object} detailedStats - Statistiques détaillées
   * @returns {Object} Profil utilisateur complet formaté
   */
  static formatDetailedUserProfile(user, detailedStats) {
    return {
      success: true,
      user: {
        ...this.formatUser(user),
        detailedStats: {
          orders: {
            total: parseInt(detailedStats.total_orders) || 0,
            paid: parseInt(detailedStats.paid_orders) || 0,
            pending: parseInt(detailedStats.pending_orders) || 0,
            cancelled: parseInt(detailedStats.cancelled_orders) || 0
          },
          financial: {
            totalSpent: parseFloat(detailedStats.total_spent) || 0,
            averageOrderValue: parseFloat(detailedStats.avg_order_value) || 0
          },
          activity: {
            firstOrderDate: detailedStats.first_order_date,
            lastOrderDate: detailedStats.last_order_date,
            uniqueStarsPurchased: parseInt(detailedStats.unique_stars_purchased) || 0
          }
        }
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formate les erreurs de validation
   * @param {Array} errors - Liste des erreurs
   * @returns {Object} Réponse d'erreur formatée
   */
  static formatValidationError(errors) {
    return {
      success: false,
      error: 'Validation failed',
      details: errors,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Formate une réponse d'erreur générique
   * @param {string} message - Message d'erreur
   * @param {number} statusCode - Code de statut HTTP
   * @returns {Object} Réponse d'erreur formatée
   */
  static formatErrorResponse(message, statusCode = 500) {
    return {
      success: false,
      error: message,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { UserResponseFormatter };