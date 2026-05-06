// server/src/controllers/paymentStatsController.js
// Responsabilité unique : Statistiques et analytics de paiement

const { paymentService } = require('../services/paymentService');
const { Order } = require('../models');
const { AppError } = require('../middlewares/errorHandler');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Contrôleur des statistiques de paiement
 * Responsabilité unique : Génération et présentation des métriques de paiement
 */
class PaymentStatsController {
  /**
   * Obtenir les statistiques générales de paiement
   * Responsabilité : Compilation des métriques de performance
   */
  static async getPaymentStats(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const period = parseInt(days, 10);

      // Statistiques de démonstration
      const demoStats = paymentService.generatePaymentStats(period);

      // Statistiques réelles de la base de données
      const realStats = await PaymentStatsController._getRealPaymentStats(period);

      // Statistiques par méthode de paiement
      const methodStats = await PaymentStatsController._getPaymentMethodStats(period);

      res.json({
        success: true,
        period: `${period} days`,
        demoStats,
        realStats,
        methodStats,
        message: 'Payment statistics (Combined demo + real data)'
      });

    } catch (error) {
      next(new AppError(`Failed to get payment stats: ${error.message}`, 500));
    }
  }

  /**
   * Obtenir les métriques de conversion de paiement
   * Responsabilité : Analyse du taux de succès des paiements
   */
  static async getConversionMetrics(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const period = parseInt(days, 10);

      const metrics = await PaymentStatsController._calculateConversionMetrics(period);

      res.json({
        success: true,
        period: `${period} days`,
        metrics,
        message: 'Payment conversion metrics'
      });

    } catch (error) {
      next(new AppError(`Failed to get conversion metrics: ${error.message}`, 500));
    }
  }

  /**
   * Obtenir le rapport de revenus
   * Responsabilité : Analyse des revenus et tendances
   */
  static async getRevenueReport(req, res, next) {
    try {
      const { days = 30, groupBy = 'day' } = req.query;
      const period = parseInt(days, 10);

      const revenueData = await PaymentStatsController._getRevenueData(period, groupBy);

      res.json({
        success: true,
        period: `${period} days`,
        groupBy,
        data: revenueData,
        message: 'Revenue report generated'
      });

    } catch (error) {
      next(new AppError(`Failed to generate revenue report: ${error.message}`, 500));
    }
  }

  /**
   * Obtenir les statistiques réelles de la base de données
   * Responsabilité : Extraction des métriques de performance réelles
   */
  static async _getRealPaymentStats(days) {
    const cutoffDate = new Date(Date.now() - days * MS_PER_DAY);

    const stats = await Order.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', '*'), 'totalOrders'],
        [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'totalRevenue'],
        [require('sequelize').fn('AVG', require('sequelize').col('totalAmount')), 'averageOrderValue'],
        [require('sequelize').fn('COUNT', require('sequelize').where(
          require('sequelize').col('status'), 'paid'
        )), 'successfulPayments'],
        [require('sequelize').fn('COUNT', require('sequelize').where(
          require('sequelize').col('status'), 'payment_failed'
        )), 'failedPayments']
      ],
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: cutoffDate
        }
      }
    });

    const data = stats[0]?.dataValues || {};

    return {
      totalOrders: parseInt(data.totalOrders) || 0,
      totalRevenue: parseFloat(data.totalRevenue) || 0,
      averageOrderValue: parseFloat(data.averageOrderValue) || 0,
      successfulPayments: parseInt(data.successfulPayments) || 0,
      failedPayments: parseInt(data.failedPayments) || 0,
      successRate: data.totalOrders > 0 ?
        ((data.successfulPayments / data.totalOrders) * 100).toFixed(2) : 0
    };
  }

  /**
   * Obtenir les statistiques par méthode de paiement
   * Responsabilité : Analyse de la performance par méthode
   */
  static async _getPaymentMethodStats(days) {
    const cutoffDate = new Date(Date.now() - days * MS_PER_DAY);

    const methodStats = await Order.findAll({
      attributes: [
        'paymentMethod',
        [require('sequelize').fn('COUNT', '*'), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'revenue']
      ],
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: cutoffDate
        },
        status: 'paid',
        paymentMethod: {
          [require('sequelize').Op.ne]: null
        }
      },
      group: ['paymentMethod'],
      order: [[require('sequelize').literal('revenue'), 'DESC']]
    });

    return methodStats.map(stat => ({
      method: stat.paymentMethod,
      transactions: parseInt(stat.dataValues.count),
      revenue: parseFloat(stat.dataValues.revenue),
      percentage: 0 // Calculé côté client si nécessaire
    }));
  }

  /**
   * Calculer les métriques de conversion
   * Responsabilité : Analyse des taux de conversion et abandon
   */
  static async _calculateConversionMetrics(days) {
    const cutoffDate = new Date(Date.now() - days * MS_PER_DAY);

    const conversionData = await Order.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', require('sequelize').where(
          require('sequelize').col('status'), 'pending'
        )), 'pendingOrders'],
        [require('sequelize').fn('COUNT', require('sequelize').where(
          require('sequelize').col('status'), 'paid'
        )), 'completedPayments'],
        [require('sequelize').fn('COUNT', require('sequelize').where(
          require('sequelize').col('status'), 'payment_failed'
        )), 'failedPayments'],
        [require('sequelize').fn('COUNT', require('sequelize').where(
          require('sequelize').col('status'), 'cancelled'
        )), 'abandonedOrders']
      ],
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: cutoffDate
        }
      }
    });

    const data = conversionData[0]?.dataValues || {};
    const total = Object.values(data).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

    return {
      totalInitiated: total,
      completed: parseInt(data.completedPayments) || 0,
      failed: parseInt(data.failedPayments) || 0,
      abandoned: parseInt(data.abandonedOrders) || 0,
      pending: parseInt(data.pendingOrders) || 0,
      conversionRate: total > 0 ? ((data.completedPayments / total) * 100).toFixed(2) : 0,
      abandonmentRate: total > 0 ? ((data.abandonedOrders / total) * 100).toFixed(2) : 0,
      failureRate: total > 0 ? ((data.failedPayments / total) * 100).toFixed(2) : 0
    };
  }

  /**
   * Obtenir les données de revenus groupées
   * Responsabilité : Génération de rapports de revenus temporels
   */
  static async _getRevenueData(days, groupBy) {
    const cutoffDate = new Date(Date.now() - days * MS_PER_DAY);

    // Format de groupement selon la période
    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = '%Y-%m-%d %H:00:00';
        break;
      case 'week':
        dateFormat = '%Y-%u';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const revenueData = await Order.findAll({
      attributes: [
        [require('sequelize').fn('DATE_FORMAT', require('sequelize').col('createdAt'), dateFormat), 'period'],
        [require('sequelize').fn('COUNT', '*'), 'transactions'],
        [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'revenue']
      ],
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: cutoffDate
        },
        status: 'paid'
      },
      group: [require('sequelize').literal('period')],
      order: [[require('sequelize').literal('period'), 'ASC']]
    });

    return revenueData.map(item => ({
      period: item.dataValues.period,
      transactions: parseInt(item.dataValues.transactions),
      revenue: parseFloat(item.dataValues.revenue)
    }));
  }
}

// Exports pour compatibilité
module.exports = {
  PaymentStatsController,
  getPaymentStats: PaymentStatsController.getPaymentStats,
  getConversionMetrics: PaymentStatsController.getConversionMetrics,
  getRevenueReport: PaymentStatsController.getRevenueReport,
};