// server/src/controllers/refundController.js
// Responsabilité unique : Gestion des remboursements

const { paymentService } = require('../services/paymentService');
const { Order } = require('../models');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Contrôleur de gestion des remboursements
 * Responsabilité unique : Traitement et suivi des remboursements
 */
class RefundController {
  /**
   * Traiter un remboursement
   * Responsabilité : Processus complet de remboursement
   */
  static async processRefund(req, res, next) {
    try {
      const { transactionId } = req.params;
      const { amount, reason } = req.body;

      // Validation de la transaction
      const order = await RefundController._validateRefundableOrder(transactionId, req.user.userId);

      if (!order) {
        return next(new AppError('Paid order with this transaction not found', 404));
      }

      // Validation du montant
      if (amount > parseFloat(order.totalAmount)) {
        return next(new AppError('Refund amount cannot exceed order total', 400));
      }

      // Traitement du remboursement
      const refundResult = await paymentService.processRefund(transactionId, amount, reason);

      // Mise à jour du statut de commande
      await RefundController._updateOrderRefundStatus(order, amount, refundResult, reason);

      // Réponse structurée
      const response = RefundController._buildRefundResponse(refundResult, transactionId);

      res.json(response);

    } catch (error) {
      next(new AppError(`Refund processing failed: ${error.message}`, 500));
    }
  }

  /**
   * Obtenir l'historique des remboursements d'un utilisateur
   * Responsabilité : Consultation des remboursements
   */
  static async getUserRefunds(req, res, next) {
    try {
      const refunds = await Order.findAll({
        where: {
          userId: req.user.userId,
          status: ['refunded', 'partially_refunded']
        },
        attributes: [
          'id',
          'transactionId',
          'refundId',
          'totalAmount',
          'refundReason',
          'status',
          'createdAt',
          'updatedAt'
        ],
        order: [['updatedAt', 'DESC']]
      });

      res.json({
        success: true,
        refunds: refunds.map(refund => ({
          orderId: refund.id,
          transactionId: refund.transactionId,
          refundId: refund.refundId,
          originalAmount: refund.totalAmount,
          reason: refund.refundReason,
          status: refund.status,
          requestedAt: refund.updatedAt,
          orderDate: refund.createdAt
        })),
        count: refunds.length
      });

    } catch (error) {
      next(new AppError(`Failed to get refund history: ${error.message}`, 500));
    }
  }

  /**
   * Obtenir le statut d'un remboursement spécifique
   * Responsabilité : Suivi du statut de remboursement
   */
  static async getRefundStatus(req, res, next) {
    try {
      const { refundId } = req.params;

      const order = await Order.findOne({
        where: {
          refundId,
          userId: req.user.userId
        },
        attributes: [
          'id',
          'transactionId',
          'refundId',
          'totalAmount',
          'refundReason',
          'status',
          'createdAt',
          'updatedAt'
        ]
      });

      if (!order) {
        return next(new AppError('Refund not found', 404));
      }

      res.json({
        success: true,
        refund: {
          id: refundId,
          orderId: order.id,
          transactionId: order.transactionId,
          originalAmount: order.totalAmount,
          reason: order.refundReason,
          status: order.status,
          processedAt: order.updatedAt,
          estimatedCompletion: RefundController._calculateEstimatedCompletion(order.updatedAt)
        }
      });

    } catch (error) {
      next(new AppError(`Failed to get refund status: ${error.message}`, 500));
    }
  }

  /**
   * Valider qu'une commande peut être remboursée
   * Responsabilité : Validation des conditions de remboursement
   */
  static async _validateRefundableOrder(transactionId, userId) {
    return await Order.findOne({
      where: {
        transactionId,
        userId,
        status: 'paid'
      }
    });
  }

  /**
   * Mettre à jour le statut de commande après remboursement
   * Responsabilité : Gestion des états de commande post-remboursement
   */
  static async _updateOrderRefundStatus(order, amount, refundResult, reason) {
    const isFullRefund = amount >= parseFloat(order.totalAmount);

    order.status = isFullRefund ? 'refunded' : 'partially_refunded';
    order.refundId = refundResult.refundId;
    order.refundReason = reason;

    await order.save();
  }

  /**
   * Construire la réponse de remboursement
   * Responsabilité : Formatage de la réponse de remboursement
   */
  static _buildRefundResponse(refundResult, transactionId) {
    return {
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
    };
  }

  /**
   * Calculer la date estimée de completion du remboursement
   * Responsabilité : Estimation des délais de remboursement
   */
  static _calculateEstimatedCompletion(processedAt) {
    const estimatedDays = 5; // 5 jours ouvrables standard
    const completion = new Date(processedAt);
    completion.setDate(completion.getDate() + estimatedDays);
    return completion.toISOString();
  }
}

// Exports pour compatibilité
module.exports = {
  RefundController,
  processRefund: RefundController.processRefund,
  getUserRefunds: RefundController.getUserRefunds,
  getRefundStatus: RefundController.getRefundStatus,
};