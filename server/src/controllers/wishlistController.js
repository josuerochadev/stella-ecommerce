// server/src/controllers/wishlistController.js
// Contrôleur pour la gestion de la liste d'envies
// Responsabilité unique : orchestration du WishlistRepository et gestion des erreurs HTTP

const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const { getService } = require('../container/containerConfig');

/**
 * Contrôleur de la liste d'envies utilisant l'injection de dépendances
 * Délègue toute la logique métier au WishlistRepository
 */
class WishlistController {
  constructor(wishlistRepository) {
    this.wishlistRepository = wishlistRepository;
  }

  /**
   * Ajoute une étoile à la liste d'envies
   */
  addToWishlist = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { starId } = req.body;

      // Validation
      if (!starId) {
        return next(new AppError('Star ID is required', 400));
      }

      const parsedStarId = parseInt(starId, 10);
      if (isNaN(parsedStarId)) {
        return next(new AppError('Star ID must be a valid number', 400));
      }

      // Vérifier si l'étoile existe déjà dans la liste
      const exists = await this.wishlistRepository.exists(userId, parsedStarId);
      if (exists) {
        return res.status(200).json({
          success: true,
          message: "L'étoile est déjà dans la liste de souhaits"
        });
      }

      // Ajouter à la liste d'envies
      const wishlistItem = await this.wishlistRepository.addItem({
        userId,
        starId: parsedStarId
      });

      // Transformer le prix en nombre
      if (wishlistItem?.Star && typeof wishlistItem.Star.price === 'string') {
        wishlistItem.Star.price = parseFloat(wishlistItem.Star.price);
      }

      res.status(201).json({
        success: true,
        message: "L'étoile a été ajoutée à la liste de souhaits",
        wishlistItem
      });
    } catch (error) {
      logger.error('Error adding to wishlist:', error);

      if (error.message === 'Item already exists in wishlist') {
        return res.status(200).json({
          success: true,
          message: "L'étoile est déjà dans la liste de souhaits"
        });
      }

      next(new AppError(`Erreur lors de l'ajout à la liste de souhaits: ${error.message}`, 400));
    }
  };

  /**
   * Récupère la liste d'envies de l'utilisateur
   */
  getWishlist = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const wishlist = await this.wishlistRepository.findByUserId(userId);

      // Transformer les prix en nombres
      const wishlistItems = wishlist.map(item => {
        if (item.Star && typeof item.Star.price === 'string') {
          item.Star.price = parseFloat(item.Star.price);
        }
        return item;
      });

      res.json({
        success: true,
        message: 'Liste de souhaits récupérée avec succès',
        wishlist: wishlistItems,
        count: wishlistItems.length
      });
    } catch (error) {
      logger.error('Error getting wishlist:', error);
      next(new AppError(`Erreur lors de la récupération de la liste de souhaits: ${error.message}`, 500));
    }
  };

  /**
   * Supprime une étoile de la liste d'envies
   */
  removeFromWishlist = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { starId } = req.params;

      // Validation
      const parsedStarId = parseInt(starId, 10);
      if (isNaN(parsedStarId)) {
        return next(new AppError('starId doit être un nombre valide', 400));
      }

      // Vérifier que l'item existe
      const exists = await this.wishlistRepository.exists(userId, parsedStarId);
      if (!exists) {
        return next(new AppError("L'étoile n'a pas été trouvée dans la liste de souhaits", 404));
      }

      // Supprimer l'item
      const removed = await this.wishlistRepository.removeItem(userId, parsedStarId);

      if (!removed) {
        return next(new AppError('Échec de la suppression de l\'étoile', 500));
      }

      // Récupérer la liste mise à jour
      const updatedWishlist = await this.wishlistRepository.findByUserId(userId);

      // Transformer les prix en nombres
      const updatedWishlistItems = updatedWishlist.map(item => {
        if (item.Star && typeof item.Star.price === 'string') {
          item.Star.price = parseFloat(item.Star.price);
        }
        return item;
      });

      res.json({
        success: true,
        message: "L'étoile a été supprimée de la liste de souhaits",
        wishlist: updatedWishlistItems,
        count: updatedWishlistItems.length
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de la wishlist:', error);
      next(new AppError(`Erreur lors de la suppression de l'étoile de la liste de souhaits: ${error.message}`, 400));
    }
  };

  /**
   * Vide complètement la liste d'envies
   */
  clearWishlist = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      await this.wishlistRepository.clearWishlist(userId);

      res.json({
        success: true,
        message: 'Liste de souhaits vidée avec succès'
      });
    } catch (error) {
      logger.error('Error clearing wishlist:', error);
      next(new AppError(`Erreur lors du vidage de la liste de souhaits: ${error.message}`, 400));
    }
  };

  /**
   * Récupère le nombre d'items dans la liste d'envies
   */
  getWishlistCount = async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const count = await this.wishlistRepository.count(userId);

      res.json({
        success: true,
        count
      });
    } catch (error) {
      logger.error('Error getting wishlist count:', error);
      next(new AppError(`Erreur lors du comptage de la liste de souhaits: ${error.message}`, 500));
    }
  };
}

// Instance du contrôleur avec injection de dépendances
const wishlistRepository = getService('wishlistRepository');
const wishlistControllerInstance = new WishlistController(wishlistRepository);

// Export des méthodes pour compatibilité avec les routes existantes
module.exports = {
  addToWishlist: wishlistControllerInstance.addToWishlist,
  getWishlist: wishlistControllerInstance.getWishlist,
  removeFromWishlist: wishlistControllerInstance.removeFromWishlist,
  clearWishlist: wishlistControllerInstance.clearWishlist,
  getWishlistCount: wishlistControllerInstance.getWishlistCount,
  WishlistController
};