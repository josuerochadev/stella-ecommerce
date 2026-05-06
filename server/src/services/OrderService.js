// server/src/services/OrderService.js
// Service métier pour la gestion des commandes
// Responsabilité unique : logique métier des commandes

const { sequelize, OrderStar } = require('../models');

/**
 * Service pour la gestion des commandes
 * Encapsule la logique métier et utilise les repositories pour la persistance
 */
class OrderService {
  /**
   * @param {IOrderRepository} orderRepository - Repository des commandes
   * @param {IStarRepository} starRepository - Repository des étoiles
   * @param {IUserRepository} userRepository - Repository des utilisateurs
   */
  constructor(orderRepository, starRepository, userRepository) {
    this.orderRepository = orderRepository;
    this.starRepository = starRepository;
    this.userRepository = userRepository;
  }

  /**
   * Crée une nouvelle commande avec transaction
   * @param {number} userId - ID de l'utilisateur
   * @param {Array} items - Items de la commande [{starId, quantity}]
   * @param {string} shippingAddress - Adresse de livraison
   * @param {string} paymentMethod - Méthode de paiement
   * @returns {Promise<Object>} Commande créée
   */
  async createOrder(userId, items, shippingAddress, paymentMethod) {
    const transaction = await sequelize.transaction();

    try {
      // Validation
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Items must be a non-empty array');
      }

      if (!shippingAddress) {
        throw new Error('Shipping address is required');
      }

      if (!paymentMethod) {
        throw new Error('Payment method is required');
      }

      // Vérifier que l'utilisateur existe
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      // Récupérer toutes les étoiles en une seule requête (optimisation)
      const starIds = items.map(item => item.starId);
      const stars = await this.starRepository.findAll(
        { starid: starIds },
        { attributes: ['starid', 'price'], raw: true }
      );

      // Créer un map pour accès O(1)
      const starMap = new Map(stars.map(star => [star.starid, star]));

      // Vérifier que toutes les étoiles existent
      const missingStars = starIds.filter(id => !starMap.has(id));
      if (missingStars.length > 0) {
        throw new Error(`Stars not found: ${missingStars.join(', ')}`);
      }

      // Calculer le montant total
      let totalAmount = 0;
      const orderStarsToCreate = [];

      for (const item of items) {
        const star = starMap.get(item.starId);

        // Validation quantité
        if (!item.quantity || item.quantity < 1) {
          throw new Error(`Invalid quantity for star ${item.starId}`);
        }

        orderStarsToCreate.push({
          starId: star.starid,
          quantity: item.quantity
        });

        totalAmount += parseFloat(star.price) * item.quantity;
      }

      // Créer la commande
      const order = await this.orderRepository.create(
        {
          userId,
          date: new Date(),
          status: 'pending',
          totalAmount,
          shippingAddress,
          paymentMethod
        },
        transaction
      );

      if (!order || !order.id) {
        throw new Error('Order creation failed');
      }

      // Ajouter orderId aux items
      const orderStarsWithOrderId = orderStarsToCreate.map(item => ({
        ...item,
        orderId: order.id
      }));

      // Insertion en lot des OrderStar
      await OrderStar.bulkCreate(orderStarsWithOrderId, { transaction });

      // Commit de la transaction
      await transaction.commit();

      return {
        orderId: order.id,
        total: totalAmount,
        status: order.status
      };
    } catch (error) {
      // Rollback en cas d'erreur
      await transaction.rollback();
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Récupère toutes les commandes d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des commandes
   */
  async getUserOrders(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const orders = await this.orderRepository.findByUserId(userId);
      return orders;
    } catch (error) {
      throw new Error(`Failed to get user orders: ${error.message}`);
    }
  }

  /**
   * Récupère les détails d'une commande
   * @param {number} orderId - ID de la commande
   * @param {number} userId - ID de l'utilisateur (pour vérification)
   * @returns {Promise<Object>} Détails de la commande
   */
  async getOrderDetails(orderId, userId) {
    try {
      if (!orderId || typeof orderId !== 'number') {
        throw new Error('Order ID must be a valid number');
      }

      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      // Vérifier que la commande appartient à l'utilisateur
      const belongsToUser = await this.orderRepository.belongsToUser(orderId, userId);
      if (!belongsToUser) {
        throw new Error('Order not found');
      }

      const order = await this.orderRepository.findById(orderId);
      return order;
    } catch (error) {
      throw new Error(`Failed to get order details: ${error.message}`);
    }
  }

  /**
   * Met à jour le statut d'une commande (admin seulement)
   * @param {number} orderId - ID de la commande
   * @param {string} status - Nouveau statut
   * @param {number} adminUserId - ID de l'admin effectuant l'opération
   * @returns {Promise<Object>} Commande mise à jour
   */
  async updateOrderStatus(orderId, status, adminUserId) {
    try {
      if (!orderId || typeof orderId !== 'number') {
        throw new Error('Order ID must be a valid number');
      }

      if (!status) {
        throw new Error('Status is required');
      }

      if (!adminUserId || typeof adminUserId !== 'number') {
        throw new Error('Admin user ID must be a valid number');
      }

      // Vérifier que l'utilisateur est admin
      const adminUser = await this.userRepository.findById(adminUserId);
      if (!adminUser || adminUser.role !== 'admin') {
        throw new Error('Only admins can update order status');
      }

      // Vérifier que la commande existe
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      // Mettre à jour le statut
      const updatedOrder = await this.orderRepository.updateStatus(orderId, status);
      return updatedOrder;
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  /**
   * Récupère les statistiques de commandes d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Statistiques
   */
  async getUserOrderStats(userId) {
    try {
      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      const orders = await this.orderRepository.findByUserId(userId);

      const stats = {
        totalOrders: orders.length,
        totalSpent: 0,
        ordersByStatus: {}
      };

      for (const order of orders) {
        stats.totalSpent += parseFloat(order.total || 0);

        if (!stats.ordersByStatus[order.status]) {
          stats.ordersByStatus[order.status] = 0;
        }
        stats.ordersByStatus[order.status]++;
      }

      return stats;
    } catch (error) {
      throw new Error(`Failed to get user order stats: ${error.message}`);
    }
  }

  /**
   * Annule une commande (si en statut pending)
   * @param {number} orderId - ID de la commande
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Commande annulée
   */
  async cancelOrder(orderId, userId) {
    try {
      if (!orderId || typeof orderId !== 'number') {
        throw new Error('Order ID must be a valid number');
      }

      if (!userId || typeof userId !== 'number') {
        throw new Error('User ID must be a valid number');
      }

      // Vérifier que la commande appartient à l'utilisateur
      const belongsToUser = await this.orderRepository.belongsToUser(orderId, userId);
      if (!belongsToUser) {
        throw new Error('Order not found');
      }

      const order = await this.orderRepository.findById(orderId);

      // Vérifier le statut
      if (order.status !== 'pending') {
        throw new Error('Only pending orders can be cancelled');
      }

      // Mettre à jour le statut
      const cancelledOrder = await this.orderRepository.updateStatus(orderId, 'cancelled');
      return cancelledOrder;
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }
}

module.exports = { OrderService };