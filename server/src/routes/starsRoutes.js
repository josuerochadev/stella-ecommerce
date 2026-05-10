// src/routes/starsRoutes.js
const express = require("express");
const router = express.Router();
const starController = require("../controllers/starController");
const validate = require("../middlewares/validate");
const { idSchema, filterSchema } = require("../validations/starValidation");
const { publicCache } = require("../middlewares/contentSecurity");

/**
 * @swagger
 * /stars:
 *   get:
 *     summary: Get all stars
 *     tags: [Stars]
 *     responses:
 *       200:
 *         description: List of all stars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Star'
 */
router.get("/", publicCache(300), starController.getAllStars);

/**
 * @swagger
 * /stars/filter:
 *   get:
 *     summary: Filter stars
 *     tags: [Stars]
 *     parameters:
 *       - in: query
 *         name: constellation
 *         schema:
 *           type: string
 *       - in: query
 *         name: minMagnitude
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxMagnitude
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Filtered list of stars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Star'
 */
router.get(
  "/filter",
  publicCache(300),
  validate(filterSchema, "query"),
  starController.filterStars,
);

/**
 * @swagger
 * /stars/search:
 *   get:
 *     summary: Search stars by name
 *     tags: [Stars]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *     responses:
 *       200:
 *         description: List of stars matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Star'
 */
router.get("/search", publicCache(120), starController.searchStars);

/**
 * @swagger
 * /stars/{id}:
 *   get:
 *     summary: Get a star by ID
 *     tags: [Stars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Star details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Star'
 *       404:
 *         description: Star not found
 */
router.get("/:starid", publicCache(300), validate(idSchema, "params"), starController.getStarById);

module.exports = router;
