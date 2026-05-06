// server/src/services/CartService.js
// Service métier pour la gestion du panier
// Responsabilité unique : logique métier du panier

const { sequelize } = require('../models');

/**
 * Service pour la gestion du panier
 * Encapsule la logique métier et utilise le repository pour la persistance
 */
class CartService {
  /**
   * @param {ICartRepository} cartRepository - Repository du panier
   * @param {IStarRepository} starRepository - Repository des étoiles
   */
  constructor(cartRepository, starRepository) {
    this.cartRepository = cartRepository;
    this.starRepository = starRepository;
  }

  /**
   * Récupère ou crée le panier d'un utilisateur
   * Élimine la duplication de cette logique dans les contrôleurs
   * @param {number} userId - ID de l'utilisateur
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<Object>} Le panier de l'utilisateur
   * @throws {Error} Si la récupération échoue
   */
  async getOrCreateCart(userId, transaction = null) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      let cart = await this.cartRepository.findByUserId(userId);

      if (!cart) {
        cart = await this.cartRepository.create({ userId }, transaction);
      }

      return cart;
    } catch (error) {
      throw new Error(`Failed to get or create cart: ${error.message}`);
    }
  }

  /**
   * Récupère le panier d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Le panier avec ses items
   */
  async getCart(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const cart = await this.cartRepository.findByUserId(userId);

      // Retourner un panier vide si aucun panier n'existe
      if (!cart) {
        return {
          cartItems: []
        };
      }

      return cart;
    } catch (error) {
      throw new Error(`Failed to get cart: ${error.message}`);
    }
  }

  /**
   * Ajoute un item au panier
   * @param {number} userId - ID de l'utilisateur
   * @param {number} starId - ID de l'étoile
   * @param {number} quantity - Quantité à ajouter
   * @returns {Promise<Object>} L'item du panier créé ou mis à jour
   */
  async addToCart(userId, starId, quantity = 1) {
    try {
      // Validation
      if (!userId || !starId) {
        throw new Error('User ID and Star ID are required');
      }

      if (typeof quantity !== 'number' || quantity < 1) {
        throw new Error('Quantity must be a positive number');
      }

      // Vérifier que l'étoile existe
      const starExists = await this.starRepository.exists(starId);
      if (!starExists) {
        throw new Error('Star not found');
      }

      // Transaction pour éviter la race condition check-then-act
      return await sequelize.transaction(async (t) => {
        const cart = await this.getOrCreateCart(userId, t);

        const existingItem = await this.cartRepository.findCartItem(cart.id, starId, t);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          return await this.cartRepository.updateCartItemQuantity(existingItem.id, newQuantity, t);
        }

        return await this.cartRepository.addCartItem({
          cartId: cart.id,
          starId,
          quantity
        }, t);
      });
    } catch (error) {
      throw new Error(`Failed to add to cart: ${error.message}`);
    }
  }

  /**
   * Met à jour la quantité d'un item du panier
   * @param {number} userId - ID de l'utilisateur
   * @param {number} cartItemId - ID de l'item du panier
   * @param {number} quantity - Nouvelle quantité
   * @returns {Promise<Object>} L'item mis à jour
   */
  async updateCartItemQuantity(userId, cartItemId, quantity) {
    try {
      // Validation
      if (!userId || !cartItemId) {
        throw new Error('User ID and Cart Item ID are required');
      }

      if (typeof quantity !== 'number' || quantity < 1) {
        throw new Error('Quantity must be a positive number');
      }

      // Vérifier que le panier appartient à l'utilisateur
      const cart = await this.cartRepository.findByUserId(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Vérifier que l'item appartient au panier
      const cartItem = cart.cartItems?.find(item => item.id === cartItemId);
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      // Mettre à jour la quantité
      return await this.cartRepository.updateCartItemQuantity(cartItemId, quantity);
    } catch (error) {
      throw new Error(`Failed to update cart item: ${error.message}`);
    }
  }

  /**
   * Supprime un item du panier
   * @param {number} userId - ID de l'utilisateur
   * @param {number} cartItemId - ID de l'item du panier
   * @returns {Promise<boolean>} True si supprimé avec succès
   */
  async removeFromCart(userId, cartItemId) {
    try {
      // Validation
      if (!userId || !cartItemId) {
        throw new Error('User ID and Cart Item ID are required');
      }

      // Vérifier que le panier appartient à l'utilisateur
      const cart = await this.cartRepository.findByUserId(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      // Vérifier que l'item appartient au panier
      const cartItem = cart.cartItems?.find(item => item.id === cartItemId);
      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      // Supprimer l'item
      return await this.cartRepository.removeCartItem(cartItemId);
    } catch (error) {
      throw new Error(`Failed to remove from cart: ${error.message}`);
    }
  }

  /**
   * Vide le panier d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<boolean>} True si vidé avec succès
   */
  async clearCart(userId, transaction = null) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const cart = await this.cartRepository.findByUserId(userId);

      if (!cart) {
        return true; // Panier déjà vide
      }

      return await this.cartRepository.clearCart(cart.id, transaction);
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  /**
   * Calcule le total du panier
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<number>} Le montant total
   */
  async calculateCartTotal(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const cart = await this.cartRepository.findByUserId(userId);

      if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        return 0;
      }

      return cart.cartItems.reduce((total, item) => {
        const itemPrice = item.Star?.price || 0;
        return total + (itemPrice * item.quantity);
      }, 0);
    } catch (error) {
      throw new Error(`Failed to calculate cart total: ${error.message}`);
    }
  }

  /**
   * Compte le nombre d'items dans le panier
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<number>} Nombre d'items
   */
  async getCartItemCount(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const cart = await this.cartRepository.findByUserId(userId);

      if (!cart) {
        return 0;
      }

      return await this.cartRepository.countCartItems(cart.id);
    } catch (error) {
      throw new Error(`Failed to get cart item count: ${error.message}`);
    }
  }

  /**
   * Valide le panier avant de créer une commande
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<{valid: boolean, errors: Array<string>, cart: Object}>}
   */
  async validateCart(userId) {
    try {
      const cart = await this.cartRepository.findByUserId(userId);
      const errors = [];

      if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        errors.push('Cart is empty');
        return { valid: false, errors, cart: null };
      }

      // Vérifier que toutes les étoiles existent toujours
      for (const item of cart.cartItems) {
        if (!item.Star) {
          errors.push(`Star ${item.starId} not found`);
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        cart
      };
    } catch (error) {
      throw new Error(`Failed to validate cart: ${error.message}`);
    }
  }
}

module.exports = { CartService };