// server/src/services/dashboardStatistics.js
// Services pour statistiques du dashboard - suivant principe KISS

const { User, Order, Star, sequelize } = require("../models");
const { paymentService } = require("./paymentService");
const { Op } = require("sequelize");

/**
 * Interface pour les statistiques du dashboard
 * Chaque service a une responsabilité unique
 */
class DashboardStatistics {
  /**
   * Statistiques générales des utilisateurs
   */
  static async getUserStatistics(_fromDate) {
    const totalUsers = await User.count();

    const userGrowth = await sequelize.query(
      `
      SELECT DATE(created_at) as date, COUNT(*) as new_users
      FROM users
      WHERE created_at >= :sevenDaysAgo
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `,
      {
        replacements: { sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    return {
      totalUsers,
      userGrowth: userGrowth.map((day) => ({
        date: day.date,
        newUsers: Number.parseInt(day.new_users),
      })),
    };
  }

  /**
   * Statistiques des commandes
   */
  static async getOrderStatistics(fromDate) {
    const [totalOrders, totalRevenue, ordersByStatus] = await Promise.all([
      // Nombre de commandes dans la période
      Order.count({
        where: { createdAt: { [Op.gte]: fromDate } },
      }),

      // Revenus totaux
      Order.sum("total_amount", {
        where: {
          status: ["paid", "shipped"],
          createdAt: { [Op.gte]: fromDate },
        },
      }),

      // Répartition par statut
      Order.findAll({
        attributes: [
          "status",
          [sequelize.fn("COUNT", "*"), "count"],
          [sequelize.fn("SUM", sequelize.col("total_amount")), "total"],
        ],
        where: { createdAt: { [Op.gte]: fromDate } },
        group: ["status"],
      }),
    ]);

    const averageOrderValue = totalOrders > 0 ? (totalRevenue || 0) / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue: Number.parseFloat(totalRevenue) || 0,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      ordersByStatus: ordersByStatus.map((status) => ({
        status: status.status,
        count: Number.parseInt(status.dataValues.count),
        total: Number.parseFloat(status.dataValues.total) || 0,
      })),
    };
  }

  /**
   * Statistiques des étoiles
   */
  static async getStarStatistics(fromDate) {
    const [totalStars, topStars] = await Promise.all([
      // Nombre total d'étoiles
      Star.count(),

      // Étoiles les plus populaires
      sequelize.query(
        `
        SELECT s.name, s.constellation, s.price, COUNT(os.star_id) as sales_count
        FROM stars s
        LEFT JOIN order_stars os ON s.starid = os.star_id
        LEFT JOIN orders o ON os.order_id = o.id AND o.status IN ('paid', 'shipped')
        WHERE o.created_at >= :fromDate
        GROUP BY s.starid, s.name, s.constellation, s.price
        ORDER BY sales_count DESC
        LIMIT 5
      `,
        {
          replacements: { fromDate },
          type: sequelize.QueryTypes.SELECT,
        },
      ),
    ]);

    return {
      totalStars,
      topStars: topStars.map((star) => ({
        name: star.name,
        constellation: star.constellation,
        price: Number.parseFloat(star.price),
        salesCount: Number.parseInt(star.sales_count),
      })),
    };
  }

  /**
   * Activité récente
   */
  static async getRecentActivity() {
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email"],
        },
      ],
      attributes: ["id", "status", "total_amount", "payment_method", "createdAt"],
    });

    return {
      orders: recentOrders.map((order) => ({
        id: order.id,
        customer: `${order.User.firstName} ${order.User.lastName}`,
        email: order.User.email,
        amount: Number.parseFloat(order.total_amount),
        status: order.status,
        paymentMethod: order.payment_method,
        date: order.createdAt,
      })),
    };
  }

  /**
   * Statistiques de paiement
   */
  static async getPaymentStatistics(days) {
    return paymentService.generatePaymentStats(days);
  }
}

module.exports = { DashboardStatistics };
