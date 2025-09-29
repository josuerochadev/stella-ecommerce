// server/src/controllers/paymentWebhookController.js
// Responsabilité unique : Gestion des webhooks et événements de paiement

const { paymentService } = require('../services/paymentService');
const { Order } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');

/**
 * Contrôleur de gestion des webhooks de paiement
 * Responsabilité unique : Traitement des événements et notifications externes
 */
class PaymentWebhookController {
  /**
   * Simuler une webhook de paiement (pour tests et développement)
   * Responsabilité : Génération et test des webhooks
   */
  static async simulateWebhook(req, res, next) {
    try {
      const { transactionId, eventType = 'payment.completed' } = req.body;

      // Validation de la transaction
      if (transactionId) {
        const order = await Order.findOne({
          where: { transactionId }
        });

        if (!order) {
          return next(new AppError('Transaction not found for webhook simulation', 404));
        }
      }

      // Génération du payload de webhook
      const webhookPayload = paymentService.generateWebhookPayload({
        transactionId,
        eventType,
        timestamp: new Date().toISOString()
      });

      // Simulation de l'envoi (en production, serait envoyé à une URL)
      logger.info('🔗 Webhook simulated:', webhookPayload);

      res.json({
        success: true,
        webhook: webhookPayload,
        message: 'Webhook simulation sent (Demo mode)'
      });

    } catch (error) {
      next(new AppError(`Webhook simulation failed: ${error.message}`, 500));
    }
  }

  /**
   * Traiter une webhook réelle (endpoint pour les providers de paiement)
   * Responsabilité : Réception et traitement des webhooks externes
   */
  static async handleWebhook(req, res, next) {
    try {
      const { eventType, data, signature } = req.body;

      // Vérification de la signature (sécurité)
      const isValid = PaymentWebhookController._verifyWebhookSignature(req.body, signature);

      if (!isValid) {
        return next(new AppError('Invalid webhook signature', 401));
      }

      // Traitement selon le type d'événement
      const result = await PaymentWebhookController._processWebhookEvent(eventType, data);

      // Log de l'événement
      logger.info(`📥 Webhook processed: ${eventType}`, {
        transactionId: data.transactionId,
        status: result.status
      });

      // Réponse rapide pour le provider
      res.status(200).json({
        received: true,
        processed: result.processed,
        message: result.message
      });

    } catch (error) {
      logger.error('❌ Webhook processing error:', error);
      next(new AppError(`Webhook processing failed: ${error.message}`, 500));
    }
  }

  /**
   * Obtenir les événements de webhook pour une transaction
   * Responsabilité : Historique des événements de paiement
   */
  static async getWebhookEvents(req, res, next) {
    try {
      const { transactionId } = req.params;

      // Vérifier que la transaction appartient à l'utilisateur (pour les utilisateurs)
      // Ou permettre l'accès aux admins
      const order = await Order.findOne({
        where: { transactionId },
        ...(req.user.role !== 'admin' && { where: { ...Order.where, userId: req.user.userId } })
      });

      if (!order) {
        return next(new AppError('Transaction not found', 404));
      }

      // En mode démo, génération d'événements simulés
      const events = PaymentWebhookController._generateMockWebhookHistory(transactionId, order.status);

      res.json({
        success: true,
        transactionId,
        events,
        count: events.length,
        message: 'Webhook events history (Demo mode)'
      });

    } catch (error) {
      next(new AppError(`Failed to get webhook events: ${error.message}`, 500));
    }
  }

  /**
   * Renvoyer une webhook (retry mechanism)
   * Responsabilité : Gestion des tentatives de renvoi
   */
  static async retryWebhook(req, res, next) {
    try {
      const { webhookId } = req.params;

      // En mode démo, simulation du retry
      const retryResult = {
        webhookId,
        attempt: Math.floor(Math.random() * 3) + 1,
        success: Math.random() > 0.3, // 70% de succès
        timestamp: new Date().toISOString(),
        nextRetryAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // Dans 5 minutes
      };

      logger.info(`🔄 Webhook retry attempted: ${webhookId}`, retryResult);

      res.json({
        success: true,
        retry: retryResult,
        message: 'Webhook retry initiated (Demo mode)'
      });

    } catch (error) {
      next(new AppError(`Webhook retry failed: ${error.message}`, 500));
    }
  }

  /**
   * Vérifier la signature d'une webhook
   * Responsabilité : Validation de l'authenticité des webhooks
   */
  static _verifyWebhookSignature(payload, signature) {
    // En production, utilisation d'une vraie vérification cryptographique
    // Pour la démo, simulation d'une vérification
    const expectedSignature = 'demo_signature_' + JSON.stringify(payload).length;
    return signature === expectedSignature || !signature; // Permissif en mode démo
  }

  /**
   * Traiter un événement de webhook
   * Responsabilité : Orchestration du traitement d'événements
   */
  static async _processWebhookEvent(eventType, data) {
    try {
      switch (eventType) {
        case 'payment.completed':
          return await PaymentWebhookController._handlePaymentCompleted(data);

        case 'payment.failed':
          return await PaymentWebhookController._handlePaymentFailed(data);

        case 'refund.processed':
          return await PaymentWebhookController._handleRefundProcessed(data);

        case 'chargeback.created':
          return await PaymentWebhookController._handleChargebackCreated(data);

        default:
          logger.warn(`⚠️ Unknown webhook event type: ${eventType}`);
          return {
            processed: false,
            status: 'ignored',
            message: `Unknown event type: ${eventType}`
          };
      }
    } catch (error) {
      logger.error(`❌ Event processing error for ${eventType}:`, error);
      return {
        processed: false,
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Traiter un paiement complété
   */
  static async _handlePaymentCompleted(data) {
    const order = await Order.findOne({
      where: { transactionId: data.transactionId }
    });

    if (order && order.status === 'pending') {
      order.status = 'paid';
      await order.save();
    }

    return {
      processed: true,
      status: 'completed',
      message: 'Payment marked as completed'
    };
  }

  /**
   * Traiter un paiement échoué
   */
  static async _handlePaymentFailed(data) {
    const order = await Order.findOne({
      where: { transactionId: data.transactionId }
    });

    if (order && order.status === 'pending') {
      order.status = 'payment_failed';
      order.paymentError = data.error || 'Payment failed';
      await order.save();
    }

    return {
      processed: true,
      status: 'failed',
      message: 'Payment marked as failed'
    };
  }

  /**
   * Traiter un remboursement traité
   */
  static async _handleRefundProcessed(data) {
    const order = await Order.findOne({
      where: { transactionId: data.originalTransactionId }
    });

    if (order) {
      order.status = data.amount >= parseFloat(order.totalAmount) ? 'refunded' : 'partially_refunded';
      order.refundId = data.refundId;
      await order.save();
    }

    return {
      processed: true,
      status: 'refunded',
      message: 'Refund processed successfully'
    };
  }

  /**
   * Traiter une contestation créée
   */
  static async _handleChargebackCreated(data) {
    const order = await Order.findOne({
      where: { transactionId: data.transactionId }
    });

    if (order) {
      order.status = 'disputed';
      await order.save();
    }

    return {
      processed: true,
      status: 'disputed',
      message: 'Chargeback dispute created'
    };
  }

  /**
   * Générer un historique simulé d'événements webhook
   */
  static _generateMockWebhookHistory(transactionId, orderStatus) {
    const baseTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // Il y a 2 heures
    const events = [];

    // Événement de création
    events.push({
      id: `wh_${Date.now()}_1`,
      type: 'payment.initiated',
      transactionId,
      timestamp: new Date(baseTime.getTime()).toISOString(),
      status: 'processed',
      attempts: 1
    });

    // Événement selon le statut actuel
    if (['paid', 'refunded', 'partially_refunded'].includes(orderStatus)) {
      events.push({
        id: `wh_${Date.now()}_2`,
        type: 'payment.completed',
        transactionId,
        timestamp: new Date(baseTime.getTime() + 30000).toISOString(),
        status: 'processed',
        attempts: 1
      });
    }

    if (orderStatus === 'payment_failed') {
      events.push({
        id: `wh_${Date.now()}_2`,
        type: 'payment.failed',
        transactionId,
        timestamp: new Date(baseTime.getTime() + 30000).toISOString(),
        status: 'processed',
        attempts: 2
      });
    }

    if (['refunded', 'partially_refunded'].includes(orderStatus)) {
      events.push({
        id: `wh_${Date.now()}_3`,
        type: 'refund.processed',
        transactionId,
        timestamp: new Date(baseTime.getTime() + 3600000).toISOString(),
        status: 'processed',
        attempts: 1
      });
    }

    return events;
  }
}

// Exports pour compatibilité
module.exports = {
  PaymentWebhookController,
  simulateWebhook: PaymentWebhookController.simulateWebhook,
  handleWebhook: PaymentWebhookController.handleWebhook,
  getWebhookEvents: PaymentWebhookController.getWebhookEvents,
  retryWebhook: PaymentWebhookController.retryWebhook,
};