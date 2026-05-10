// server/src/controllers/cartController.js
// Contrôleur pour la gestion du panier
// Responsabilité unique : orchestration du CartService et gestion des erreurs HTTP

const { AppError } = require("../middlewares/errorHandler");
const { getService } = require("../container/containerConfig");

/**
 * Contrôleur du panier utilisant l'injection de dépendances
 * Délègue toute la logique métier au CartService
 */
class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  /**
   * Récupère le panier de l'utilisateur
   */
  getCart = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const cart = await this.cartService.getCart(userId);

      res.json({
        success: true,
        cart,
      });
    } catch (error) {
      next(new AppError(`Error fetching cart: ${error.message}`, 500));
    }
  };

  /**
   * Ajoute un item au panier
   */
  addToCart = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { starId, quantity = 1 } = req.body;

      // Validation des données d'entrée
      if (!starId) {
        return next(new AppError("Star ID is required", 400));
      }

      if (quantity < 1) {
        return next(new AppError("Quantity must be at least 1", 400));
      }

      const cartItem = await this.cartService.addToCart(userId, starId, quantity);

      res.status(201).json({
        success: true,
        message: "Item added to cart",
        cartItem,
      });
    } catch (error) {
      if (error.message === "Star not found") {
        return next(new AppError(error.message, 404));
      }
      next(new AppError(`Error adding item to cart: ${error.message}`, 400));
    }
  };

  /**
   * Met à jour la quantité d'un item
   */
  updateCartItem = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { cartItemId, quantity } = req.body;

      // Validation des données d'entrée
      if (!cartItemId) {
        return next(new AppError("Cart item ID is required", 400));
      }

      if (!quantity || quantity < 1) {
        return next(new AppError("Quantity must be at least 1", 400));
      }

      const cartItem = await this.cartService.updateCartItemQuantity(userId, cartItemId, quantity);

      res.json({
        success: true,
        message: "Cart item updated",
        cartItem,
      });
    } catch (error) {
      if (error.message === "Cart not found" || error.message === "Cart item not found") {
        return next(new AppError(error.message, 404));
      }
      next(new AppError(`Error updating cart item: ${error.message}`, 400));
    }
  };

  /**
   * Supprime un item du panier
   */
  removeFromCart = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { cartItemId } = req.params;

      // Validation
      if (!cartItemId) {
        return next(new AppError("Cart item ID is required", 400));
      }

      const removed = await this.cartService.removeFromCart(userId, Number.parseInt(cartItemId));

      if (!removed) {
        return next(new AppError("Failed to remove item from cart", 500));
      }

      res.json({
        success: true,
        message: "Item removed from cart",
      });
    } catch (error) {
      if (error.message === "Cart not found" || error.message === "Cart item not found") {
        return next(new AppError(error.message, 404));
      }
      next(new AppError(`Error removing item from cart: ${error.message}`, 400));
    }
  };

  /**
   * Vide le panier
   */
  clearCart = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      await this.cartService.clearCart(userId);

      res.json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      next(new AppError(`Error clearing cart: ${error.message}`, 400));
    }
  };

  /**
   * Récupère le total du panier
   */
  getCartTotal = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const total = await this.cartService.calculateCartTotal(userId);

      res.json({
        success: true,
        total,
      });
    } catch (error) {
      next(new AppError(`Error calculating cart total: ${error.message}`, 500));
    }
  };

  /**
   * Récupère le nombre d'items dans le panier
   */
  getCartItemCount = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const count = await this.cartService.getCartItemCount(userId);

      res.json({
        success: true,
        count,
      });
    } catch (error) {
      next(new AppError(`Error getting cart item count: ${error.message}`, 500));
    }
  };
}

// Instance du contrôleur avec injection de dépendances
const cartService = getService("cartService");
const cartControllerInstance = new CartController(cartService);

// Export des méthodes pour compatibilité avec les routes existantes
module.exports = {
  getCart: cartControllerInstance.getCart,
  addToCart: cartControllerInstance.addToCart,
  updateCartItem: cartControllerInstance.updateCartItem,
  removeFromCart: cartControllerInstance.removeFromCart,
  clearCart: cartControllerInstance.clearCart,
  getCartTotal: cartControllerInstance.getCartTotal,
  getCartItemCount: cartControllerInstance.getCartItemCount,
  CartController,
};
