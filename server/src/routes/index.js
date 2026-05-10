// server/src/routes/index.js
const { Router } = require("express");
const router = Router();
const { authenticateUser } = require("../middlewares/authMiddleware");

const healthRoutes = require("./healthRoutes");
const starsRoutes = require("./starsRoutes");
const authRoutes = require("./authRoutes");
const usersRoutes = require("./usersRoutes");
const ordersRoutes = require("./ordersRoutes");
const cartRoutes = require("./cartRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const reviewRoutes = require("./reviewRoutes");
const paymentRoutes = require("./paymentRoutes");
const adminRoutes = require("./adminRoutes");

// Health check (no auth required)
router.use("/health", healthRoutes);

// Public routes
router.use("/stars", starsRoutes);
router.use("/auth", authRoutes);

// Authentication middleware applied to all routes requiring authentication
router.use(authenticateUser);

// Profile routes requiring authentication
router.use("/users", usersRoutes);

// Routes requiring authentication
router.use("/orders", ordersRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
