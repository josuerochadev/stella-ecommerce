// src/controllers/reviewController.js

const { Review, Order, Star, User } = require("../models");
const { AppError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");

exports.getReviewsForStar = async (req, res, next) => {
  try {
    const { starId } = req.query;
    if (!starId) {
      return next(new AppError("Star ID is required", 400));
    }
    const reviews = await Review.findAll({
      where: { starId },
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });
    res.json(reviews);
  } catch (error) {
    next(new AppError(`Error fetching reviews: ${error.message}`, 500));
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { starId, rating, comment } = req.body;
    // Vérifier si l'utilisateur a acheté l'étoile
    const order = await Order.findOne({
      where: { userId: req.user.userId },
      include: [
        {
          model: Star,
          where: { id: starId },
        },
      ],
    });
    if (!order) {
      return next(new AppError("You can only review stars you've purchased", 403));
    }
    const review = await Review.create({
      userId: req.user.userId,
      starId,
      rating,
      comment,
    });
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    logger.error("Error in addReview function:", error);
    next(new AppError(`Error adding review: ${error.message}`, 400));
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const review = await Review.findOne({
      where: { id, userId: req.user.userId },
    });

    if (!review) {
      return next(new AppError("Review not found or you don't have permission to update it", 404));
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    next(new AppError(`Error updating review: ${error.message}`, 400));
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({
      where: { id, userId: req.user.userId },
    });

    if (!review) {
      return next(new AppError("Review not found or you don't have permission to delete it", 404));
    }

    await review.destroy();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    next(new AppError(`Error deleting review: ${error.message}`, 400));
  }
};

module.exports = exports;
