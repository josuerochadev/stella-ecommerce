// server/src/repositories/SequelizeOrderRepository.js
// Implémentation du repository commande avec Sequelize
// Responsabilité unique : opérations de persistance des données commande

const { Order, OrderItem, Star, User } = require('../models');
const { IOrderRepository } = require('../interfaces/IOrderRepository');
const { Op } = require('sequelize');
const { validateId } = require('../utils/validators');

/**
 * Repository pour les commandes utilisant Sequelize ORM
 * Implémente IOrderRepository pour respecter le principe d'inversion de dépendances
 */
class SequelizeOrderRepository extends IOrderRepository {
  constructor(orderModel = Order) {
    super();
    this.Order = orderModel;
  }

  /**
   * Trouve une commande par son ID avec ses items
   * @param {number} id - ID de la commande
   * @returns {Promise<Object|null>} Commande trouvée ou null
   * @throws {Error} Si la recherche échoue
   */
  async findById(id) {
    try {
      validateId(id);

      const order = await this.Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'OrderItems',
            include: [{ model: Star, as: 'Star' }]
          },
          {
            model: User,
            as: 'User',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      return order ? order.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find order by ID: ${error.message}`);
    }
  }

  /**
   * Trouve une commande par ID sans inclusions
   * @param {number} id - ID de la commande
   * @returns {Promise<Object|null>} Commande trouvée ou null
   */
  async findByIdSimple(id) {
    try {
      validateId(id);

      const order = await this.Order.findByPk(id);
      return order ? order.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find order by ID: ${error.message}`);
    }
  }

  /**
   * Trouve toutes les commandes d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des commandes
   * @throws {Error} Si la recherche échoue
   */
  async findByUserId(userId) {
    try {
      validateId(userId, 'User ID');

      const orders = await this.Order.findAll({
        where: { userId },
        include: [
          {
            model: OrderItem,
            as: 'OrderItems',
            include: [{ model: Star, as: 'Star' }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return orders.map(order => order.toJSON());
    } catch (error) {
      throw new Error(`Failed to find orders by user ID: ${error.message}`);
    }
  }

  /**
   * Crée une nouvelle commande
   * @param {Object} orderData - Données de la commande
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<Object>} Commande créée
   * @throws {Error} Si la création échoue
   */
  async create(orderData, transaction = null) {
    try {
      this.validateOrderData(orderData);

      const options = transaction ? { transaction } : {};
      const order = await this.Order.create(orderData, options);

      return order.toJSON();
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Met à jour une commande existante
   * @param {number} id - ID de la commande
   * @param {Object} updateData - Données à mettre à jour
   * @param {Object} transaction - Transaction Sequelize optionnelle
   * @returns {Promise<Object>} Commande mise à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async update(id, updateData, transaction = null) {
    try {
      validateId(id);

      if (!updateData || typeof updateData !== 'object') {
        throw new Error('Update data must be an object');
      }

      const options = {
        where: { id },
        returning: true
      };

      if (transaction) {
        options.transaction = transaction;
      }

      const [updatedCount] = await this.Order.update(updateData, options);

      if (updatedCount === 0) {
        throw new Error('Order not found or no changes made');
      }

      const updatedOrder = await this.findById(id);
      return updatedOrder;
    } catch (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }
  }

  /**
   * Met à jour le statut d'une commande
   * @param {number} id - ID de la commande
   * @param {string} status - Nouveau statut
   * @returns {Promise<Object>} Commande mise à jour
   */
  async updateStatus(id, status) {
    try {
      return await this.update(id, { status });
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  /**
   * Supprime une commande
   * @param {number} id - ID de la commande
   * @returns {Promise<boolean>} True si supprimé avec succès
   * @throws {Error} Si la suppression échoue
   */
  async delete(id) {
    try {
      validateId(id);

      const deletedCount = await this.Order.destroy({
        where: { id }
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  }

  /**
   * Compte le nombre de commandes selon des critères
   * @param {Object} where - Conditions de recherche
   * @returns {Promise<number>} Nombre de commandes
   * @throws {Error} Si le comptage échoue
   */
  async count(where = {}) {
    try {
      const count = await this.Order.count({ where });
      return count;
    } catch (error) {
      throw new Error(`Failed to count orders: ${error.message}`);
    }
  }

  /**
   * Trouve toutes les commandes selon des critères
   * @param {Object} where - Conditions de recherche
   * @param {Object} [options] - Options supplémentaires
   * @returns {Promise<Array>} Liste des commandes
   * @throws {Error} Si la recherche échoue
   */
  async findAll(where = {}, options = {}) {
    try {
      const orders = await this.Order.findAll({
        where,
        include: [
          {
            model: OrderItem,
            as: 'OrderItems',
            include: [{ model: Star, as: 'Star' }]
          },
          {
            model: User,
            as: 'User',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        ...options
      });

      return orders.map(order => order.toJSON());
    } catch (error) {
      throw new Error(`Failed to find orders: ${error.message}`);
    }
  }

  /**
   * Récupère toutes les commandes avec pagination
   * @param {Object} options - Options de recherche
   * @returns {Promise<{count: number, rows: Array}>} Résultats paginés
   * @throws {Error} Si la recherche échoue
   */
  async findAndCountAll(options) {
    try {
      if (!options || typeof options !== 'object') {
        throw new Error('Options must be an object');
      }

      const result = await this.Order.findAndCountAll({
        ...options,
        include: [
          {
            model: OrderItem,
            as: 'OrderItems',
            include: [{ model: Star, as: 'Star' }]
          },
          {
            model: User,
            as: 'User',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return {
        count: result.count,
        rows: result.rows.map(order => order.toJSON())
      };
    } catch (error) {
      throw new Error(`Failed to find and count orders: ${error.message}`);
    }
  }

  /**
   * Recherche de commandes avec critères avancés
   * @param {Object} searchCriteria - Critères de recherche
   * @returns {Promise<{count: number, rows: Array}>} Commandes trouvées avec pagination
   */
  async searchOrders(searchCriteria) {
    try {
      const {
        userId,
        status,
        minTotal,
        maxTotal,
        startDate,
        endDate,
        limit = 20,
        offset = 0
      } = searchCriteria;

      const whereCondition = {};

      // Filtre utilisateur
      if (userId) {
        whereCondition.userId = userId;
      }

      // Filtre statut
      if (status) {
        whereCondition.status = status;
      }

      // Filtre total
      if (minTotal !== undefined && minTotal !== null) {
        whereCondition.total = { [Op.gte]: minTotal };
      }
      if (maxTotal !== undefined && maxTotal !== null) {
        whereCondition.total = {
          ...whereCondition.total,
          [Op.lte]: maxTotal
        };
      }

      // Filtre dates
      if (startDate) {
        whereCondition.createdAt = { [Op.gte]: new Date(startDate) };
      }
      if (endDate) {
        whereCondition.createdAt = {
          ...whereCondition.createdAt,
          [Op.lte]: new Date(endDate)
        };
      }

      const result = await this.Order.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: OrderItem,
            as: 'OrderItems',
            include: [{ model: Star, as: 'Star' }]
          },
          {
            model: User,
            as: 'User',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        limit: Math.min(limit, 100),
        offset,
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return {
        count: result.count,
        rows: result.rows.map(order => order.toJSON())
      };
    } catch (error) {
      throw new Error(`Failed to search orders: ${error.message}`);
    }
  }

  /**
   * Vérifie si une commande appartient à un utilisateur
   * @param {number} orderId - ID de la commande
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<boolean>} True si la commande appartient à l'utilisateur
   */
  async belongsToUser(orderId, userId) {
    try {
      if (!orderId || !userId) {
        return false;
      }

      const count = await this.Order.count({
        where: {
          id: orderId,
          userId: userId
        }
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check order ownership: ${error.message}`);
    }
  }

  /**
   * Valide les données commande pour la création
   * @param {Object} orderData - Données à valider
   * @throws {Error} Si les données sont invalides
   * @private
   */
  validateOrderData(orderData) {
    if (!orderData || typeof orderData !== 'object') {
      throw new Error('Order data must be an object');
    }

    const requiredFields = ['userId', 'total'];
    const missingFields = requiredFields.filter(field => orderData[field] === undefined);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validation total
    if (typeof orderData.total !== 'number' || orderData.total < 0) {
      throw new Error('Total must be a positive number');
    }

    // Validation userId
    if (typeof orderData.userId !== 'number') {
      throw new Error('User ID must be a number');
    }
  }
}

module.exports = { SequelizeOrderRepository };