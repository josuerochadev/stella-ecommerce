// server/src/repositories/SequelizeWishlistRepository.js
// Implémentation du repository liste d'envies avec Sequelize
// Responsabilité unique : opérations de persistance des données liste d'envies

const { Wishlist, Star } = require('../models');
const { IWishlistRepository } = require('../interfaces/IWishlistRepository');

/**
 * Repository pour les listes d'envies utilisant Sequelize ORM
 * Implémente IWishlistRepository pour respecter le principe d'inversion de dépendances
 */
class SequelizeWishlistRepository extends IWishlistRepository {
  constructor(wishlistModel = Wishlist) {
    super();
    this.Wishlist = wishlistModel;
  }

  /**
   * Trouve tous les items de la liste d'envies d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des items
   * @throws {Error} Si la recherche échoue
   */
  async findByUserId(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const wishlistItems = await this.Wishlist.findAll({
        where: { userId },
        include: [
          {
            model: Star,
            as: 'Star'
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return wishlistItems.map(item => item.toJSON());
    } catch (error) {
      throw new Error(`Failed to find wishlist by user ID: ${error.message}`);
    }
  }

  /**
   * Trouve un item spécifique de la liste d'envies
   * @param {number} userId - ID de l'utilisateur
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<Object|null>} Item trouvé ou null
   * @throws {Error} Si la recherche échoue
   */
  async findItem(userId, starId) {
    try {
      if (!userId || !starId) {
        throw new Error('User ID and Star ID are required');
      }

      const wishlistItem = await this.Wishlist.findOne({
        where: {
          userId,
          starId
        },
        include: [{ model: Star, as: 'Star' }]
      });

      return wishlistItem ? wishlistItem.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find wishlist item: ${error.message}`);
    }
  }

  /**
   * Ajoute un item à la liste d'envies
   * @param {Object} wishlistData - Données de l'item
   * @returns {Promise<Object>} Item créé
   * @throws {Error} Si l'ajout échoue
   */
  async addItem(wishlistData) {
    try {
      const { userId, starId } = wishlistData;

      if (!userId || !starId) {
        throw new Error('User ID and Star ID are required');
      }

      // Vérifier si l'item existe déjà
      const existingItem = await this.findItem(userId, starId);
      if (existingItem) {
        return existingItem;
      }

      const wishlistItem = await this.Wishlist.create({
        userId,
        starId
      });

      // Récupérer l'item avec les relations
      const createdItem = await this.Wishlist.findByPk(wishlistItem.id, {
        include: [{ model: Star, as: 'Star' }]
      });

      return createdItem ? createdItem.toJSON() : null;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Item already exists in wishlist');
      }
      throw new Error(`Failed to add wishlist item: ${error.message}`);
    }
  }

  /**
   * Supprime un item de la liste d'envies
   * @param {number} userId - ID de l'utilisateur
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<boolean>} True si supprimé avec succès
   * @throws {Error} Si la suppression échoue
   */
  async removeItem(userId, starId) {
    try {
      if (!userId || !starId) {
        throw new Error('User ID and Star ID are required');
      }

      const deletedCount = await this.Wishlist.destroy({
        where: {
          userId,
          starId
        }
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to remove wishlist item: ${error.message}`);
    }
  }

  /**
   * Vide la liste d'envies d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<boolean>} True si vidé avec succès
   * @throws {Error} Si l'opération échoue
   */
  async clearWishlist(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      await this.Wishlist.destroy({
        where: { userId }
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to clear wishlist: ${error.message}`);
    }
  }

  /**
   * Vérifie si une étoile est dans la liste d'envies
   * @param {number} userId - ID de l'utilisateur
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<boolean>} True si l'item existe
   */
  async exists(userId, starId) {
    try {
      if (!userId || !starId) {
        return false;
      }

      const count = await this.Wishlist.count({
        where: {
          userId,
          starId
        }
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check wishlist item existence: ${error.message}`);
    }
  }

  /**
   * Compte le nombre d'items dans la liste d'envies
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<number>} Nombre d'items
   */
  async count(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const count = await this.Wishlist.count({
        where: { userId }
      });

      return count;
    } catch (error) {
      throw new Error(`Failed to count wishlist items: ${error.message}`);
    }
  }

  /**
   * Trouve un item par son ID
   * @param {number} id - ID de l'item
   * @returns {Promise<Object|null>} Item trouvé ou null
   */
  async findById(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('ID must be a valid number');
      }

      const wishlistItem = await this.Wishlist.findByPk(id, {
        include: [{ model: Star, as: 'Star' }]
      });

      return wishlistItem ? wishlistItem.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find wishlist item by ID: ${error.message}`);
    }
  }

  /**
   * Supprime un item par son ID
   * @param {number} id - ID de l'item
   * @returns {Promise<boolean>} True si supprimé avec succès
   */
  async deleteById(id) {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('ID must be a valid number');
      }

      const deletedCount = await this.Wishlist.destroy({
        where: { id }
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete wishlist item by ID: ${error.message}`);
    }
  }
}

module.exports = { SequelizeWishlistRepository };