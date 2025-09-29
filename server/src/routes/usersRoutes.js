// server/src/routes/usersRoutes.js
// Responsabilité unique : Routes de gestion des profils utilisateur

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticateUser, requireAuth } = require("../middlewares/authMiddleware");

router.use(authenticateUser);

// Routes d'authentification déplacées vers /auth

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", requireAuth, profileController.getUserProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", requireAuth, profileController.updateProfile);

// Route de logout déplacée vers /auth

/**
 * @swagger
 * /users/profile/stats:
 *   get:
 *     summary: Get user profile statistics
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                     completedOrders:
 *                       type: integer
 *                     totalReviews:
 *                       type: integer
 *                     averageRating:
 *                       type: string
 *                     cartItems:
 *                       type: integer
 *                     wishlistItems:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/profile/stats", requireAuth, profileController.getProfileStats);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Delete user account
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/me", requireAuth, profileController.deleteAccount);

module.exports = router;
