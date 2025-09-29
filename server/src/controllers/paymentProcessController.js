// server/src/controllers/paymentProcessController.js
// Responsabilité unique : Traitement des paiements et transactions

const { paymentService } = require('../services/paymentService');
const { Order, Star, User } = require('../models');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Contrôleur de traitement des paiements
 * Responsabilité unique : Initiation et suivi des transactions de paiement
 */
class PaymentProcessController {
  /**
   * Initier un processus de paiement
   * Responsabilité : Orchestration du processus de paiement complet
   */
  static async initiatePayment(req, res, next) {
    try {
      const { orderId, method, cardData } = req.body;

      // Validation de la commande
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

      // Récupération des données utilisateur
      const user = await User.findByPk(req.user.userId, {
        attributes: ['email', 'firstName', 'lastName']
      });

      // Préparation des données de paiement
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

      // Traitement du paiement
      const paymentResult = await paymentService.processPayment(paymentData);

      // Mise à jour du statut de commande
      if (paymentResult.status === 'completed') {
        order.status = 'paid';
        order.paymentMethod = method;
        order.transactionId = paymentResult.transactionId;
        await order.save();
      } else if (paymentResult.status === 'failed') {
        order.status = 'payment_failed';
        order.paymentError = paymentResult.error;
        await order.save();
      }

      // Réponse sécurisée
      const response = PaymentProcessController._buildPaymentResponse(paymentResult, order.id);
      const statusCode = PaymentProcessController._getResponseStatusCode(paymentResult.status);

      res.status(statusCode).json(response);

    } catch (error) {
      next(new AppError(`Payment processing failed: ${error.message}`, 500));
    }
  }

  /**
   * Vérifier le statut d'un paiement
   * Responsabilité : Consultation du statut de transaction
   */
  static async getPaymentStatus(req, res, next) {
    try {
      const { transactionId } = req.params;

      // Recherche de la transaction
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
  }

  /**
   * Obtenir les méthodes de paiement disponibles
   * Responsabilité : Configuration des méthodes de paiement
   */
  static async getPaymentMethods(req, res, next) {
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
  }

  /**
   * Construire la réponse de paiement sécurisée
   * Responsabilité : Formatage des données de réponse
   */
  static _buildPaymentResponse(paymentResult, orderId) {
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

    // Informations de carte (sécurisées)
    if (paymentResult.cardInfo) {
      response.cardInfo = {
        brand: paymentResult.cardInfo.brand,
        last4: paymentResult.cardInfo.last4
      };
    }

    // Informations bancaires
    if (paymentResult.bankInfo) {
      response.bankInfo = paymentResult.bankInfo;
    }

    // Erreurs de traitement
    if (paymentResult.error) {
      response.error = paymentResult.error;
    }

    return response;
  }

  /**
   * Déterminer le code de statut HTTP
   * Responsabilité : Mapping statut paiement vers code HTTP
   */
  static _getResponseStatusCode(paymentStatus) {
    switch (paymentStatus) {
      case 'completed':
        return 200;
      case 'pending':
        return 202;
      default:
        return 400;
    }
  }
}

// Exports pour compatibilité
module.exports = {
  PaymentProcessController,
  initiatePayment: PaymentProcessController.initiatePayment,
  getPaymentStatus: PaymentProcessController.getPaymentStatus,
  getPaymentMethods: PaymentProcessController.getPaymentMethods,
};