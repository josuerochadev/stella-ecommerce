// server/src/routes/paymentRoutes.js
// Routes pour la gestion des paiements

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { csrfValidate } = require('../middlewares/modernCsrf');
const { authenticateUser, requireAuth, requireRole } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const Joi = require('joi');

// Middleware d'authentification pour toutes les routes
router.use(authenticateUser);

// Schémas de validation
const initiatePaymentSchema = Joi.object({
  orderId: Joi.number().integer().positive().required(),
  method: Joi.string().valid('credit_card', 'paypal', 'bank_transfer', 'apple_pay', 'google_pay').required(),
  cardData: Joi.when('method', {
    is: 'credit_card',
    then: Joi.object({
      number: Joi.string().pattern(/^\d{13,19}$/).required(),
      expiry: Joi.string().pattern(/^\d{2}\/\d{2}$/).required(),
      cvv: Joi.string().pattern(/^\d{3,4}$/).required(),
      name: Joi.string().min(2).max(100).required()
    }).required(),
    otherwise: Joi.optional()
  })
});

const refundSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  reason: Joi.string().min(5).max(500).required()
});

const webhookSchema = Joi.object({
  transactionId: Joi.string().required(),
  eventType: Joi.string().valid('payment.completed', 'payment.failed', 'refund.processed').optional()
});

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
router.post('/refund/:transactionId',
  requireAuth,
  csrfValidate,
  validate(refundSchema),
  paymentController.processRefund
);

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
router.get('/stats',
  requireAuth,
  requireRole('admin'),
  paymentController.getPaymentStats
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
router.post('/webhook/simulate',
  requireAuth,
  requireRole('admin'),
  csrfValidate,
  validate(webhookSchema),
  paymentController.simulateWebhook
);

module.exports = router;