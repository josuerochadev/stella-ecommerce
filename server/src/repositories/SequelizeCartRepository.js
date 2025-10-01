// server/src/repositories/SequelizeCartRepository.js
// Implémentation du repository panier avec Sequelize
// Responsabilité unique : opérations de persistance des données panier

const { Cart, CartItem, Star } = require('../models');
const { ICartRepository } = require('../interfaces/ICartRepository');

/**
 * Repository pour les paniers utilisant Sequelize ORM
 * Implémente ICartRepository pour respecter le principe d'inversion de dépendances
 */
class SequelizeCartRepository extends ICartRepository {
  constructor(cartModel = Cart, cartItemModel = CartItem) {
    super();
    this.Cart = cartModel;
    this.CartItem = cartItemModel;
  }

  /**
   * Trouve un panier par l'ID utilisateur avec ses items
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object|null>} Panier trouvé ou null
   * @throws {Error} Si la recherche échoue
   */
  async findByUserId(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const cart = await this.Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: 'cartItems',
            include: [
              {
                model: Star,
                as: 'Star'
              }
            ]
          }
        ]
      });

      return cart ? cart.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find cart by user ID: ${error.message}`);
    }
  }

  /**
   * Trouve un panier par son ID
   * @param {number} id - ID du panier
   * @returns {Promise<Object|null>} Panier trouvé ou null
   * @throws {Error} Si la recherche échoue
   */
  async findById(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('ID must be a valid number');
      }

      const cart = await this.Cart.findByPk(id, {
        include: [
          {
            model: CartItem,
            as: 'cartItems',
            include: [
              {
                model: Star,
                as: 'Star'
              }
            ]
          }
        ]
      });

      return cart ? cart.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find cart by ID: ${error.message}`);
    }
  }

  /**
   * Crée un nouveau panier
   * @param {Object} cartData - Données du panier
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<Object>} Panier créé
   * @throws {Error} Si la création échoue
   */
  async create(cartData, transaction = null) {
    try {
      if (!cartData || !cartData.userId) {
        throw new Error('User ID is required to create a cart');
      }

      const options = transaction ? { transaction } : {};
      const cart = await this.Cart.create(cartData, options);

      return cart.toJSON();
    } catch (error) {
      throw new Error(`Failed to create cart: ${error.message}`);
    }
  }

  /**
   * Supprime un panier
   * @param {number} id - ID du panier
   * @returns {Promise<boolean>} True si supprimé avec succès
   * @throws {Error} Si la suppression échoue
   */
  async delete(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('ID must be a valid number');
      }

      const deletedCount = await this.Cart.destroy({
        where: { id }
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete cart: ${error.message}`);
    }
  }

  /**
   * Supprime le panier d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<boolean>} True si supprimé avec succès
   */
  async deleteByUserId(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const deletedCount = await this.Cart.destroy({
        where: { userId }
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete cart by user ID: ${error.message}`);
    }
  }

  /**
   * Trouve un item du panier
   * @param {number} cartId - ID du panier
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<Object|null>} Item trouvé ou null
   */
  async findCartItem(cartId, starId) {
    try {
      if (!cartId || !starId) {
        throw new Error('Cart ID and Star ID are required');
      }

      const cartItem = await this.CartItem.findOne({
        where: {
          cartId,
          starId
        },
        include: [{ model: Star, as: 'Star' }]
      });

      return cartItem ? cartItem.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find cart item: ${error.message}`);
    }
  }

  /**
   * Ajoute un item au panier
   * @param {Object} cartItemData - Données de l'item
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<Object>} Item créé
   */
  async addCartItem(cartItemData, transaction = null) {
    try {
      const { cartId, starId, quantity } = cartItemData;

      if (!cartId || !starId) {
        throw new Error('Cart ID and Star ID are required');
      }

      const options = transaction ? { transaction } : {};
      const cartItem = await this.CartItem.create(
        {
          cartId,
          starId,
          quantity: quantity || 1
        },
        options
      );

      // Récupérer l'item avec les relations
      const createdItem = await this.CartItem.findByPk(cartItem.id, {
        include: [{ model: Star, as: 'Star' }],
        ...(transaction ? { transaction } : {})
      });

      return createdItem ? createdItem.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to add cart item: ${error.message}`);
    }
  }

  /**
   * Met à jour la quantité d'un item
   * @param {number} cartItemId - ID de l'item
   * @param {number} quantity - Nouvelle quantité
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<Object>} Item mis à jour
   */
  async updateCartItemQuantity(cartItemId, quantity, transaction = null) {
    try {
      if (!cartItemId) {
        throw new Error('Cart item ID is required');
      }

      if (typeof quantity !== 'number' || quantity < 1) {
        throw new Error('Quantity must be a positive number');
      }

      const options = {
        where: { id: cartItemId },
        returning: true
      };

      if (transaction) {
        options.transaction = transaction;
      }

      const [updatedCount] = await this.CartItem.update(
        { quantity },
        options
      );

      if (updatedCount === 0) {
        throw new Error('Cart item not found');
      }

      const updatedItem = await this.CartItem.findByPk(cartItemId, {
        include: [{ model: Star, as: 'Star' }],
        ...(transaction ? { transaction } : {})
      });

      return updatedItem ? updatedItem.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to update cart item quantity: ${error.message}`);
    }
  }

  /**
   * Supprime un item du panier
   * @param {number} cartItemId - ID de l'item
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<boolean>} True si supprimé avec succès
   */
  async removeCartItem(cartItemId, transaction = null) {
    try {
      if (!cartItemId) {
        throw new Error('Cart item ID is required');
      }

      const options = { where: { id: cartItemId } };
      if (transaction) {
        options.transaction = transaction;
      }

      const deletedCount = await this.CartItem.destroy(options);
      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to remove cart item: ${error.message}`);
    }
  }

  /**
   * Vide le panier d'un utilisateur
   * @param {number} cartId - ID du panier
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<boolean>} True si vidé avec succès
   */
  async clearCart(cartId, transaction = null) {
    try {
      if (!cartId) {
        throw new Error('Cart ID is required');
      }

      const options = { where: { cartId } };
      if (transaction) {
        options.transaction = transaction;
      }

      await this.CartItem.destroy(options);
      return true;
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  /**
   * Compte le nombre d'items dans un panier
   * @param {number} cartId - ID du panier
   * @returns {Promise<number>} Nombre d'items
   */
  async countCartItems(cartId) {
    try {
      if (!cartId) {
        throw new Error('Cart ID is required');
      }

      const count = await this.CartItem.count({
        where: { cartId }
      });

      return count;
    } catch (error) {
      throw new Error(`Failed to count cart items: ${error.message}`);
    }
  }

  /**
   * Vérifie si un panier existe pour un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<boolean>} True si le panier existe
   */
  async exists(userId) {
    try {
      if (!userId) {
        return false;
      }

      const count = await this.Cart.count({
        where: { userId }
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check cart existence: ${error.message}`);
    }
  }
}

module.exports = { SequelizeCartRepository };