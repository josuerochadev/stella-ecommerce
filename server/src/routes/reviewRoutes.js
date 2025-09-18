// src/routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { csrfValidate } = require("../middlewares/modernCsrf");
const { requireAuth } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { addReviewSchema, updateReviewSchema } = require("../validations/reviewValidation");

router.use(requireAuth);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews for a star
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: starId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the star
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid starId
 */
router.get("/", reviewController.getReviewsForStar);

/**
 * @swagger
 * /reviews/add:
 *   post:
 *     summary: Add a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddReviewInput'
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/add", csrfValidate, validate(addReviewSchema), reviewController.addReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewInput'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User does not own this review
 *       404:
 *         description: Review not found
 */
router.put("/:id", csrfValidate, validate(updateReviewSchema), reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User does not own this review
 *       404:
 *         description: Review not found
 */
router.delete("/:id", csrfValidate, reviewController.deleteReview);

module.exports = router;
