// server/src/routes/usersRoutes.js
// Responsabilité unique : Routes de gestion des profils utilisateur

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticateUser, requireAuth } = require("../middlewares/authMiddleware");
const { csrfValidate } = require("../middlewares/modernCsrf");
const validate = require("../middlewares/validate");
const { updateProfileSchema } = require("../validations/userValidation");
const { exportLimiter } = require("../middlewares/rateLimiter");

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
router.put(
  "/profile",
  requireAuth,
  csrfValidate,
  validate(updateProfileSchema),
  profileController.updateProfile,
);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password or weak new password
 *       401:
 *         description: Unauthorized
 */
router.put("/change-password", requireAuth, csrfValidate, profileController.changePassword);

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
router.delete("/me", requireAuth, csrfValidate, profileController.deleteAccount);

/**
 * @swagger
 * /users/me/export:
 *   get:
 *     summary: Export all personal data (GDPR portability)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JSON file containing all user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/me/export", requireAuth, exportLimiter, profileController.exportData);

module.exports = router;
