// server/src/services/userStatsService.js
// Service spécialisé pour les statistiques des utilisateurs
// Responsabilité unique : calcul et agrégation des données de commandes

const { sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * Service de statistiques utilisateurs
 * Responsabilité unique : gestion des calculs de statistiques et métriques
 */
class UserStatsService {
  /**
   * Récupère les statistiques de commandes pour une liste d'utilisateurs
   * @param {Array<number>} userIds - IDs des utilisateurs
   * @returns {Promise<Map>} Map des statistiques par ID utilisateur
   */
  static async getUserOrderStats(userIds) {
    if (!userIds || userIds.length === 0) {
      return new Map();
    }

    try {
      const orderStats = await sequelize.query(`
        SELECT
          user_id,
          COUNT(*) as order_count,
          COALESCE(SUM(total_amount), 0) as total_spent,
          AVG(total_amount) as avg_order_value,
          MAX(created_at) as last_order_date
        FROM orders
        WHERE user_id IN (:userIds) AND status IN ('paid', 'shipped', 'delivered')
        GROUP BY user_id
      `, {
        replacements: { userIds },
        type: sequelize.QueryTypes.SELECT
      });

      // Créer un Map pour accès rapide par ID utilisateur
      return new Map(
        orderStats.map(stat => [
          stat.user_id,
          {
            orderCount: parseInt(stat.order_count) || 0,
            totalSpent: parseFloat(stat.total_spent) || 0,
            averageOrderValue: parseFloat(stat.avg_order_value) || 0,
            lastOrderDate: stat.last_order_date
          }
        ])
      );
    } catch (error) {
      logger.error('Error fetching user order stats:', error);
      return new Map();
    }
  }

  /**
   * Récupère des statistiques détaillées pour un utilisateur spécifique
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Statistiques détaillées
   */
  static async getDetailedUserStats(userId) {
    try {
      const [userStats] = await sequelize.query(`
        SELECT
          COUNT(o.id) as total_orders,
          COALESCE(SUM(o.total_amount), 0) as total_spent,
          COALESCE(AVG(o.total_amount), 0) as avg_order_value,
          COUNT(CASE WHEN o.status = 'paid' THEN 1 END) as paid_orders,
          COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders,
          MIN(o.created_at) as first_order_date,
          MAX(o.created_at) as last_order_date,
          COUNT(DISTINCT os.star_id) as unique_stars_purchased
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        LEFT JOIN order_stars os ON o.id = os.order_id
        WHERE u.id = :userId
        GROUP BY u.id
      `, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      });

      return userStats || {
        total_orders: 0,
        total_spent: 0,
        avg_order_value: 0,
        paid_orders: 0,
        pending_orders: 0,
        cancelled_orders: 0,
        first_order_date: null,
        last_order_date: null,
        unique_stars_purchased: 0
      };
    } catch (error) {
      logger.error('Error fetching detailed user stats:', error);
      return null;
    }
  }

  /**
   * Calcule les métriques de performance pour un groupe d'utilisateurs
   * @param {Array<number>} userIds - IDs des utilisateurs
   * @returns {Promise<Object>} Métriques agrégées
   */
  static async getUserPerformanceMetrics(userIds) {
    if (!userIds || userIds.length === 0) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        averageUserValue: 0
      };
    }

    try {
      const [metrics] = await sequelize.query(`
        SELECT
          COUNT(DISTINCT u.id) as total_users,
          COUNT(DISTINCT CASE WHEN o.id IS NOT NULL THEN u.id END) as active_users,
          COALESCE(SUM(o.total_amount), 0) as total_revenue,
          COALESCE(AVG(user_totals.user_total), 0) as average_user_value
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id AND o.status IN ('paid', 'shipped', 'delivered')
        LEFT JOIN (
          SELECT user_id, SUM(total_amount) as user_total
          FROM orders
          WHERE user_id IN (:userIds) AND status IN ('paid', 'shipped', 'delivered')
          GROUP BY user_id
        ) user_totals ON u.id = user_totals.user_id
        WHERE u.id IN (:userIds)
      `, {
        replacements: { userIds },
        type: sequelize.QueryTypes.SELECT
      });

      return {
        totalUsers: parseInt(metrics.total_users) || 0,
        activeUsers: parseInt(metrics.active_users) || 0,
        totalRevenue: parseFloat(metrics.total_revenue) || 0,
        averageUserValue: parseFloat(metrics.average_user_value) || 0
      };
    } catch (error) {
      logger.error('Error fetching user performance metrics:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        averageUserValue: 0
      };
    }
  }

  /**
   * Récupère les statistiques par défaut pour un utilisateur sans commandes
   * @returns {Object} Statistiques vides
   */
  static getDefaultStats() {
    return {
      orderCount: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      lastOrderDate: null
    };
  }
}

module.exports = { UserStatsService };