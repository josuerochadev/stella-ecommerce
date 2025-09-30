// server/src/controllers/reviewController.js
// Contrôleur pour la gestion des avis
// Responsabilité unique : orchestration du ReviewRepository et gestion des erreurs HTTP

const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const { getService } = require('../container/containerConfig');

/**
 * Contrôleur des avis utilisant l'injection de dépendances
 * Délègue toute la logique métier au ReviewRepository
 */
class ReviewController {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  /**
   * Récupère tous les avis d'une étoile
   */
  getReviewsForStar = async (req, res, next) => {
    try {
      const { starId } = req.query;

      if (!starId) {
        return next(new AppError('Star ID is required', 400));
      }

      const parsedStarId = parseInt(starId, 10);
      if (isNaN(parsedStarId)) {
        return next(new AppError('Star ID must be a valid number', 400));
      }

      const reviews = await this.reviewRepository.findByStarId(parsedStarId);

      res.json({
        success: true,
        data: reviews,
        count: reviews.length
      });
    } catch (error) {
      logger.error('Error fetching reviews:', error);
      next(new AppError(`Error fetching reviews: ${error.message}`, 500));
    }
  };

  /**
   * Ajoute un nouvel avis
   */
  addReview = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { starId, rating, comment } = req.body;

      // Validation
      if (!starId) {
        return next(new AppError('Star ID is required', 400));
      }

      if (!rating || rating < 1 || rating > 5) {
        return next(new AppError('Rating must be between 1 and 5', 400));
      }

      const parsedStarId = parseInt(starId, 10);
      if (isNaN(parsedStarId)) {
        return next(new AppError('Star ID must be a valid number', 400));
      }

      // Vérifier si l'utilisateur a déjà évalué cette étoile
      const hasReviewed = await this.reviewRepository.hasUserReviewedStar(userId, parsedStarId);
      if (hasReviewed) {
        return next(new AppError('You have already reviewed this star', 400));
      }

      // Créer l'avis
      const review = await this.reviewRepository.create({
        userId,
        starId: parsedStarId,
        rating,
        comment: comment || null
      });

      res.status(201).json({
        success: true,
        message: 'Review added',
        review
      });
    } catch (error) {
      logger.error('Error in addReview function:', error);

      if (error.message === 'You have already reviewed this star') {
        return next(new AppError(error.message, 400));
      }

      next(new AppError(`Error adding review: ${error.message}`, 400));
    }
  };

  /**
   * Met à jour un avis existant
   */
  updateReview = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const reviewId = parseInt(req.params.id, 10);
      const { rating, comment } = req.body;

      // Validation
      if (isNaN(reviewId)) {
        return next(new AppError('Invalid review ID', 400));
      }

      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return next(new AppError('Rating must be between 1 and 5', 400));
      }

      // Vérifier que l'avis existe et appartient à l'utilisateur
      const existingReview = await this.reviewRepository.findById(reviewId);
      if (!existingReview) {
        return next(new AppError('Review not found', 404));
      }

      if (existingReview.userId !== userId) {
        return next(new AppError("You don't have permission to update this review", 403));
      }

      // Mettre à jour
      const updateData = {};
      if (rating !== undefined) updateData.rating = rating;
      if (comment !== undefined) updateData.comment = comment;

      const updatedReview = await this.reviewRepository.update(reviewId, updateData);

      res.json({
        success: true,
        message: 'Review updated successfully',
        review: updatedReview
      });
    } catch (error) {
      logger.error('Error updating review:', error);
      next(new AppError(`Error updating review: ${error.message}`, 400));
    }
  };

  /**
   * Supprime un avis
   */
  deleteReview = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const reviewId = parseInt(req.params.id, 10);

      // Validation
      if (isNaN(reviewId)) {
        return next(new AppError('Invalid review ID', 400));
      }

      // Vérifier que l'avis existe et appartient à l'utilisateur
      const existingReview = await this.reviewRepository.findById(reviewId);
      if (!existingReview) {
        return next(new AppError('Review not found', 404));
      }

      if (existingReview.userId !== userId) {
        return next(new AppError("You don't have permission to delete this review", 403));
      }

      // Supprimer
      const deleted = await this.reviewRepository.delete(reviewId);

      if (!deleted) {
        return next(new AppError('Failed to delete review', 500));
      }

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting review:', error);
      next(new AppError(`Error deleting review: ${error.message}`, 400));
    }
  };

  /**
   * Récupère tous les avis d'un utilisateur
   */
  getUserReviews = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const reviews = await this.reviewRepository.findByUserId(userId);

      res.json({
        success: true,
        data: reviews,
        count: reviews.length
      });
    } catch (error) {
      logger.error('Error fetching user reviews:', error);
      next(new AppError(`Error fetching user reviews: ${error.message}`, 500));
    }
  };

  /**
   * Récupère la note moyenne d'une étoile
   */
  getStarAverageRating = async (req, res, next) => {
    try {
      const { starId } = req.params;

      const parsedStarId = parseInt(starId, 10);
      if (isNaN(parsedStarId)) {
        return next(new AppError('Star ID must be a valid number', 400));
      }

      const averageRating = await this.reviewRepository.getAverageRating(parsedStarId);
      const reviewCount = await this.reviewRepository.count({ starId: parsedStarId });

      res.json({
        success: true,
        starId: parsedStarId,
        averageRating: averageRating || 0,
        reviewCount
      });
    } catch (error) {
      logger.error('Error getting star average rating:', error);
      next(new AppError(`Error getting star average rating: ${error.message}`, 500));
    }
  };
}

// Instance du contrôleur avec injection de dépendances
const reviewRepository = getService('reviewRepository');
const reviewControllerInstance = new ReviewController(reviewRepository);

// Export des méthodes pour compatibilité avec les routes existantes
module.exports = {
  getReviewsForStar: reviewControllerInstance.getReviewsForStar,
  addReview: reviewControllerInstance.addReview,
  updateReview: reviewControllerInstance.updateReview,
  deleteReview: reviewControllerInstance.deleteReview,
  getUserReviews: reviewControllerInstance.getUserReviews,
  getStarAverageRating: reviewControllerInstance.getStarAverageRating,
  ReviewController
};