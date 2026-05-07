// server/src/routes/paymentRoutes.js
// Responsabilité unique : Routes de gestion des paiements décomposées

const express = require('express');
const router = express.Router();

// Import des contrôleurs spécialisés suivant le principe SRP
const paymentController = require('../controllers/paymentController');
const refundController = require('../controllers/refundController');
const paymentStatsController = require('../controllers/paymentStatsController');
const paymentWebhookController = require('../controllers/paymentWebhookController');

const { csrfValidate } = require('../middlewares/modernCsrf');
const { authenticateUser, requireAuth, requireRole } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { initiatePaymentSchema, refundSchema, webhookSchema } = require('../validations/paymentValidation');

// Middleware d'authentification pour toutes les routes
router.use(authenticateUser);

/**
 * @swagger
 * /payments/methods:
 *   get:
 *     summary: Get available payment methods
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Available payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 paymentMethods:
 *                   type: array
 *                 currencies:
 *                   type: array
 */
router.get('/methods', requireAuth, paymentController.getPaymentMethods);

/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Initiate a payment for an order
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: number
 *               method:
 *                 type: string
 *                 enum: [credit_card, paypal, bank_transfer, apple_pay, google_pay]
 *               cardData:
 *                 type: object
 *                 properties:
 *                   number:
 *                     type: string
 *                   expiry:
 *                     type: string
 *                   cvv:
 *                     type: string
 *                   name:
 *                     type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       202:
 *         description: Payment pending
 *       400:
 *         description: Payment failed
 */
router.post('/initiate',
  requireAuth,
  csrfValidate,
  validate(initiatePaymentSchema),
  paymentController.initiatePayment
);

/**
 * @swagger
 * /payments/status/{transactionId}:
 *   get:
 *     summary: Get payment status
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status retrieved
 *       404:
 *         description: Transaction not found
 */
router.get('/status/:transactionId', requireAuth, paymentController.getPaymentStatus);

/**
 * @swagger
 * /payments/refund/{transactionId}:
 *   post:
 *     summary: Process a refund
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *       400:
 *         description: Invalid refund request
 *       404:
 *         description: Transaction not found
 */
// Routes de remboursement
router.post('/refund/:transactionId',
  requireAuth,
  csrfValidate,
  validate(refundSchema),
  refundController.processRefund
);

/**
 * @swagger
 * /payments/refunds:
 *   get:
 *     summary: Get user refund history
 *     tags: [Refunds]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User refund history
 */
router.get('/refunds', requireAuth, refundController.getUserRefunds);

/**
 * @swagger
 * /payments/refunds/{refundId}:
 *   get:
 *     summary: Get refund status
 *     tags: [Refunds]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: refundId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refund status
 *       404:
 *         description: Refund not found
 */
router.get('/refunds/:refundId', requireAuth, refundController.getRefundStatus);

/**
 * @swagger
 * /payments/stats:
 *   get:
 *     summary: Get payment statistics (Admin only)
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *           default: 30
 *     responses:
 *       200:
 *         description: Payment statistics
 *       403:
 *         description: Admin access required
 */
// Routes de statistiques (Admin uniquement)
router.get('/stats',
  requireAuth,
  requireRole('admin'),
  paymentStatsController.getPaymentStats
);

/**
 * @swagger
 * /payments/stats/conversion:
 *   get:
 *     summary: Get payment conversion metrics (Admin only)
 *     tags: [Payment Stats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *           default: 30
 *     responses:
 *       200:
 *         description: Conversion metrics
 *       403:
 *         description: Admin access required
 */
router.get('/stats/conversion',
  requireAuth,
  requireRole('admin'),
  paymentStatsController.getConversionMetrics
);

/**
 * @swagger
 * /payments/stats/revenue:
 *   get:
 *     summary: Get revenue report (Admin only)
 *     tags: [Payment Stats]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: number
 *           default: 30
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *           default: day
 *     responses:
 *       200:
 *         description: Revenue report
 *       403:
 *         description: Admin access required
 */
router.get('/stats/revenue',
  requireAuth,
  requireRole('admin'),
  paymentStatsController.getRevenueReport
);

/**
 * @swagger
 * /payments/webhook/simulate:
 *   post:
 *     summary: Simulate webhook for testing (Admin only)
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *               eventType:
 *                 type: string
 *                 enum: [payment.completed, payment.failed, refund.processed]
 *     responses:
 *       200:
 *         description: Webhook simulated successfully
 *       403:
 *         description: Admin access required
 */
// Routes de webhook
router.post('/webhook/simulate',
  requireAuth,
  requireRole('admin'),
  csrfValidate,
  validate(webhookSchema),
  paymentWebhookController.simulateWebhook
);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Handle payment webhooks from external providers
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventType:
 *                 type: string
 *               data:
 *                 type: object
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       401:
 *         description: Invalid signature
 */
router.post('/webhook', paymentWebhookController.handleWebhook);

/**
 * @swagger
 * /payments/webhook/events/{transactionId}:
 *   get:
 *     summary: Get webhook events for a transaction
 *     tags: [Webhooks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook events history
 *       404:
 *         description: Transaction not found
 */
router.get('/webhook/events/:transactionId',
  requireAuth,
  paymentWebhookController.getWebhookEvents
);

/**
 * @swagger
 * /payments/webhook/retry/{webhookId}:
 *   post:
 *     summary: Retry a failed webhook (Admin only)
 *     tags: [Webhooks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook retry initiated
 *       403:
 *         description: Admin access required
 */
router.post('/webhook/retry/:webhookId',
  requireAuth,
  requireRole('admin'),
  paymentWebhookController.retryWebhook
);

module.exports = router;