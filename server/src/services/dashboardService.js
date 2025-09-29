// server/src/services/dashboardService.js
// Service principal du dashboard - pattern Strategy pour KISS

const { DashboardStatistics } = require('./dashboardStatistics');

/**
 * Service du dashboard suivant le principe KISS
 * Une seule responsabilité : orchestrer la collecte des statistiques
 */
class DashboardService {

  /**
   * Génère le dashboard complet
   * Responsabilité unique : orchestration des services
   */
  static async generateDashboard(period = 30) {
    const days = parseInt(period);
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    try {
      // Collecte parallèle des statistiques - chaque service a sa responsabilité
      const [
        userStats,
        orderStats,
        starStats,
        recentActivity,
        paymentStats
      ] = await Promise.all([
        DashboardStatistics.getUserStatistics(fromDate),
        DashboardStatistics.getOrderStatistics(fromDate),
        DashboardStatistics.getStarStatistics(fromDate),
        DashboardStatistics.getRecentActivity(),
        DashboardStatistics.getPaymentStatistics(days)
      ]);

      // Assembly simple des données - responsabilité unique
      return this.assembleDashboard(days, userStats, orderStats, starStats, recentActivity, paymentStats);

    } catch (error) {
      throw new Error(`Dashboard generation failed: ${error.message}`);
    }
  }

  /**
   * Assemble les données du dashboard
   * Responsabilité unique : formatage de la réponse finale
   */
  static assembleDashboard(days, userStats, orderStats, starStats, recentActivity, paymentStats) {
    // Calcul des métriques dérivées
    const conversionRate = userStats.totalUsers > 0
      ? Math.round((orderStats.totalOrders / userStats.totalUsers) * 100 * 100) / 100
      : 0;

    return {
      period: `${days} days`,
      overview: {
        totalUsers: userStats.totalUsers,
        totalOrders: orderStats.totalOrders,
        totalRevenue: orderStats.totalRevenue,
        totalStars: starStats.totalStars,
        averageOrderValue: orderStats.averageOrderValue,
        conversionRate
      },
      recentActivity: {
        orders: recentActivity.orders,
        topStars: starStats.topStars
      },
      analytics: {
        userGrowth: userStats.userGrowth,
        ordersByStatus: orderStats.ordersByStatus,
        paymentStats: paymentStats
      }
    };
  }
}

module.exports = { DashboardService };