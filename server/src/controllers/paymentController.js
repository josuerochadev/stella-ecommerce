// server/src/controllers/paymentController.js
// Contrôleur pour la gestion des paiements (simulation)

const { paymentService } = require('../services/paymentService');
const { Order, Star, User } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Initier un processus de paiement
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { orderId, method, cardData } = req.body;

    // Vérifier que la commande existe et appartient à l'utilisateur
    const order = await Order.findOne({
      where: { id: orderId, userId: req.user.userId },
      include: [
        {
          model: Star,
          through: { attributes: ['quantity'] }
        }
      ]
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    if (order.status !== 'pending') {
      return next(new AppError('Order cannot be paid. Current status: ' + order.status, 400));
    }

    // Récupérer les informations utilisateur pour le paiement
    const user = await User.findByPk(req.user.userId, {
      attributes: ['email', 'firstName', 'lastName']
    });

    // Préparer les données de paiement
    const paymentData = {
      amount: parseFloat(order.totalAmount),
      currency: 'EUR',
      method,
      orderId: order.id,
      customerData: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        userId: user.id
      },
      cardData: method === 'credit_card' ? cardData : null
    };

    // Traiter le paiement
    const paymentResult = await paymentService.processPayment(paymentData);

    // Déléguer la mise à jour de commande au service
    await paymentService.updateOrderAfterPayment(order, paymentResult, method);

    // Réponse sécurisée
    const response = buildPaymentResponse(paymentResult, order.id);
    const statusCode = getResponseStatusCode(paymentResult.status);

    res.status(statusCode).json(response);

  } catch (error) {
    next(new AppError(`Payment processing failed: ${error.message}`, 500));
  }
};

/**
 * Obtenir les méthodes de paiement disponibles
 */
exports.getPaymentMethods = async (req, res, next) => {
  try {
    const methods = paymentService.getPaymentMethods();

    res.json({
      success: true,
      paymentMethods: methods,
      currencies: ['EUR', 'USD', 'GBP'],
      message: 'Available payment methods (Demo mode)'
    });
  } catch (error) {
    next(new AppError(`Failed to get payment methods: ${error.message}`, 500));
  }
};

/**
 * Vérifier le statut d'un paiement
 */
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    // Rechercher la commande avec cette transaction
    const order = await Order.findOne({
      where: {
        transactionId,
        userId: req.user.userId
      },
      attributes: ['id', 'status', 'totalAmount', 'paymentMethod', 'transactionId', 'createdAt']
    });

    if (!order) {
      return next(new AppError('Transaction not found', 404));
    }

    res.json({
      success: true,
      transaction: {
        id: transactionId,
        orderId: order.id,
        status: order.status,
        amount: order.totalAmount,
        method: order.paymentMethod,
        processedAt: order.createdAt
      }
    });

  } catch (error) {
    next(new AppError(`Failed to get payment status: ${error.message}`, 500));
  }
};

/**
 * Traiter un remboursement (simulation)
 */
exports.processRefund = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { amount, reason } = req.body;

    // Vérifier que la transaction appartient à l'utilisateur
    const order = await Order.findOne({
      where: {
        transactionId,
        userId: req.user.userId,
        status: 'paid'
      }
    });

    if (!order) {
      return next(new AppError('Paid order with this transaction not found', 404));
    }

    // Vérifier que le montant du remboursement est valide
    if (amount > parseFloat(order.totalAmount)) {
      return next(new AppError('Refund amount cannot exceed order total', 400));
    }

    // Traiter le remboursement
    const refundResult = await paymentService.processRefund(transactionId, amount, reason);

    // Mettre à jour le statut de la commande
    order.status = amount >= parseFloat(order.totalAmount) ? 'refunded' : 'partially_refunded';
    order.refundId = refundResult.refundId;
    order.refundReason = reason;
    await order.save();

    res.json({
      success: true,
      refund: {
        id: refundResult.refundId,
        originalTransactionId: transactionId,
        amount: refundResult.amount,
        reason: refundResult.reason,
        status: refundResult.status,
        estimatedArrival: refundResult.estimatedArrival
      },
      message: 'Refund processed successfully (Demo mode)'
    });

  } catch (error) {
    next(new AppError(`Refund processing failed: ${error.message}`, 500));
  }
};

/**
 * Statistiques de paiement (pour admin)
 */
exports.getPaymentStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    // Générer des stats de démonstration
    const stats = paymentService.generatePaymentStats(parseInt(days, 10));

    // Ajouter des stats réelles de la base de données
    const realStats = await Order.findAll({
      attributes: [
        [require('sequelize').fn('COUNT', '*'), 'totalOrders'],
        [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'totalRevenue'],
        [require('sequelize').fn('AVG', require('sequelize').col('totalAmount')), 'averageOrderValue']
      ],
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: new Date(Date.now() - days * MS_PER_DAY)
        }
      }
    });

    const realData = realStats[0]?.dataValues || {};

    res.json({
      success: true,
      period: `${days} days`,
      demoStats: stats,
      realStats: {
        totalOrders: parseInt(realData.totalOrders) || 0,
        totalRevenue: parseFloat(realData.totalRevenue) || 0,
        averageOrderValue: parseFloat(realData.averageOrderValue) || 0
      },
      message: 'Payment statistics (Combined demo + real data)'
    });

  } catch (error) {
    next(new AppError(`Failed to get payment stats: ${error.message}`, 500));
  }
};

/**
 * Simuler une webhook de paiement (pour tests)
 */
exports.simulateWebhook = async (req, res, next) => {
  try {
    const { transactionId, eventType = 'payment.completed' } = req.body;

    // Générer un payload de webhook
    const webhookPayload = paymentService.generateWebhookPayload({
      transactionId,
      eventType,
      timestamp: new Date().toISOString()
    });

    // En production, ce serait envoyé à une URL de webhook
    logger.info('🔗 Webhook simulated:', webhookPayload);

    res.json({
      success: true,
      webhook: webhookPayload,
      message: 'Webhook simulation sent (Demo mode)'
    });

  } catch (error) {
    next(new AppError(`Webhook simulation failed: ${error.message}`, 500));
  }
};

/**
 * Construire la réponse de paiement sécurisée
 */
function buildPaymentResponse(paymentResult, orderId) {
  const response = {
    success: paymentResult.status === 'completed',
    transactionId: paymentResult.transactionId,
    status: paymentResult.status,
    amount: paymentResult.amount,
    currency: paymentResult.currency,
    method: paymentResult.method,
    processingTime: paymentResult.processingTime,
    orderId
  };

  if (paymentResult.cardInfo) {
    response.cardInfo = {
      brand: paymentResult.cardInfo.brand,
      last4: paymentResult.cardInfo.last4
    };
  }

  if (paymentResult.bankInfo) {
    response.bankInfo = paymentResult.bankInfo;
  }

  if (paymentResult.error) {
    response.error = paymentResult.error;
  }

  return response;
}

/**
 * Déterminer le code de statut HTTP
 */
function getResponseStatusCode(paymentStatus) {
  switch (paymentStatus) {
    case 'completed':
      return 200;
    case 'pending':
      return 202;
    default:
      return 400;
  }
}

module.exports = exports;