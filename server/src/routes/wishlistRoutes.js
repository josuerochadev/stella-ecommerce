// src/routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { csrfValidate } = require("../middlewares/modernCsrf");
const { requireAuth } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
  addToWishlistSchema,
  removeFromWishlistSchema,
} = require("../validations/wishlistValidation");

router.use(requireAuth);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wishlist'
 *       401:
 *         description: Unauthorized
 */
router.get("/", wishlistController.getWishlist);

/**
 * @swagger
 * /wishlist/add:
 *   post:
 *     summary: Add item to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToWishlistInput'
 *     responses:
 *       200:
 *         description: Item added to wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wishlist'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/add",
  csrfValidate,
  validate(addToWishlistSchema),
  wishlistController.addToWishlist,
);

/**
 * @swagger
 * /wishlist/remove/{starId}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: starId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wishlist'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in wishlist
 */
router.delete(
  "/remove/:starId",
  csrfValidate,
  validate(removeFromWishlistSchema, "params"),
  wishlistController.removeFromWishlist,
);

module.exports = router;
