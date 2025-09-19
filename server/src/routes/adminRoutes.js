// server/src/routes/adminRoutes.js
// Routes pour le panel d'administration

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { csrfValidate } = require('../middlewares/modernCsrf');
const { authenticateUser, requireAuth, requireRole } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const Joi = require('joi');

// Middleware: toutes les routes admin nécessitent une authentification admin
router.use(authenticateUser);
router.use(requireAuth);
router.use(requireRole('admin'));

// Schémas de validation
const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('client', 'admin').required()
});

const updateStarPriceSchema = Joi.object({
  price: Joi.number().positive().precision(2).max(99999.99).required()
});

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard with statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: number
 *           default: 30
 *         description: Period in days for statistics
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 dashboard:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                     recentActivity:
 *                       type: object
 *                     analytics:
 *                       type: object
 *       403:
 *         description: Admin access required
 */
router.get('/dashboard', adminController.getDashboard);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get paginated list of users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [client, admin]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: Users list retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get('/users', adminController.getUsers);

/**
 * @swagger
 * /admin/users/{userId}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [client, admin]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role or cannot change own role
 *       404:
 *         description: User not found
 *       403:
 *         description: Admin access required
 */
router.put('/users/:userId/role',
  csrfValidate,
  validate(updateUserRoleSchema),
  adminController.updateUserRole
);

/**
 * @swagger
 * /admin/stars:
 *   get:
 *     summary: Get paginated list of stars with sales data
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: constellation
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: Stars list retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get('/stars', adminController.getStars);

/**
 * @swagger
 * /admin/stars/{starId}/price:
 *   put:
 *     summary: Update star price
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: starId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 99999.99
 *     responses:
 *       200:
 *         description: Star price updated successfully
 *       400:
 *         description: Invalid price
 *       404:
 *         description: Star not found
 *       403:
 *         description: Admin access required
 */
router.put('/stars/:starId/price',
  csrfValidate,
  validate(updateStarPriceSchema),
  adminController.updateStarPrice
);

/**
 * @swagger
 * /admin/system:
 *   get:
 *     summary: Get system statistics and health
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: System statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 system:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: object
 *                     server:
 *                       type: object
 *                     application:
 *                       type: object
 *       403:
 *         description: Admin access required
 */
router.get('/system', adminController.getSystemStats);

// Routes pour les statistiques de paiement (réutilise le contrôleur payment)
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * /admin/payments/stats:
 *   get:
 *     summary: Get detailed payment statistics
 *     tags: [Admin]
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
 *         description: Payment statistics retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get('/payments/stats', paymentController.getPaymentStats);

/**
 * @swagger
 * /admin/payments/webhook/simulate:
 *   post:
 *     summary: Simulate payment webhook for testing
 *     tags: [Admin]
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
router.post('/payments/webhook/simulate',
  csrfValidate,
  paymentController.simulateWebhook
);

module.exports = router;