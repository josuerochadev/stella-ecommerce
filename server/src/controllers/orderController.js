// server/src/controllers/orderController.js
// Contrôleur pour la gestion des commandes
// Responsabilité unique : orchestration du OrderService et gestion des erreurs HTTP

const { AppError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");
const { getService } = require("../container/containerConfig");

/**
 * Contrôleur des commandes utilisant l'injection de dépendances
 * Délègue toute la logique métier au OrderService
 */
class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  /**
   * Crée une nouvelle commande
   */
  createOrder = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { items, shippingAddress, paymentMethod } = req.body;

      // Validation des données d'entrée
      if (!items || !Array.isArray(items) || items.length === 0) {
        return next(new AppError("Items array is required and must not be empty", 400));
      }

      if (!shippingAddress) {
        return next(new AppError("Shipping address is required", 400));
      }

      if (!paymentMethod) {
        return next(new AppError("Payment method is required", 400));
      }

      // Serialize address object to string for TEXT column storage
      const serializedAddress =
        typeof shippingAddress === "object" ? JSON.stringify(shippingAddress) : shippingAddress;

      const order = await this.orderService.createOrder(
        userId,
        items,
        serializedAddress,
        paymentMethod,
      );

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId: order.orderId,
        total: order.total,
        status: order.status,
      });
    } catch (error) {
      logger.error("Error in createOrder function:", error);

      if (error.message.includes("User with id") && error.message.includes("not found")) {
        return next(new AppError(error.message, 404));
      }

      if (error.message.includes("Stars not found")) {
        return next(new AppError(error.message, 404));
      }

      next(new AppError(`Error creating order: ${error.message}`, 400));
    }
  };

  /**
   * Récupère toutes les commandes de l'utilisateur
   */
  getUserOrders = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const orders = await this.orderService.getUserOrders(userId);

      res.json({
        success: true,
        data: orders,
        count: orders.length,
      });
    } catch (error) {
      logger.error("Error fetching user orders:", error);
      next(new AppError(`Error fetching user orders: ${error.message}`, 500));
    }
  };

  /**
   * Récupère les détails d'une commande
   */
  getOrderDetails = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const orderId = Number.parseInt(req.params.id);

      if (!orderId || Number.isNaN(orderId)) {
        return next(new AppError("Invalid order ID", 400));
      }

      const order = await this.orderService.getOrderDetails(orderId, userId);

      if (!order) {
        return next(new AppError("Order not found", 404));
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      logger.error("Error fetching order details:", error);

      if (error.message === "Order not found") {
        return next(new AppError(error.message, 404));
      }

      next(new AppError(`Error fetching order details: ${error.message}`, 500));
    }
  };

  /**
   * Met à jour le statut d'une commande (admin seulement)
   */
  updateOrderStatus = async (req, res, next) => {
    try {
      const adminUserId = req.user.userId;
      const orderId = Number.parseInt(req.params.id);
      const { status } = req.body;

      // Validation
      if (!orderId || Number.isNaN(orderId)) {
        return next(new AppError("Invalid order ID", 400));
      }

      if (!status) {
        return next(new AppError("Status is required", 400));
      }

      const updatedOrder = await this.orderService.updateOrderStatus(orderId, status, adminUserId);

      res.json({
        success: true,
        message: "Order status updated",
        order: updatedOrder,
      });
    } catch (error) {
      logger.error("Error updating order status:", error);

      if (error.message === "Only admins can update order status") {
        return next(new AppError(error.message, 403));
      }

      if (error.message === "Order not found") {
        return next(new AppError(error.message, 404));
      }

      next(new AppError(`Error updating order status: ${error.message}`, 400));
    }
  };

  /**
   * Récupère les statistiques de commandes de l'utilisateur
   */
  getUserOrderStats = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const stats = await this.orderService.getUserOrderStats(userId);

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      logger.error("Error getting user order stats:", error);
      next(new AppError(`Error getting user order stats: ${error.message}`, 500));
    }
  };

  /**
   * Annule une commande
   */
  cancelOrder = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const orderId = Number.parseInt(req.params.id);

      if (!orderId || Number.isNaN(orderId)) {
        return next(new AppError("Invalid order ID", 400));
      }

      const cancelledOrder = await this.orderService.cancelOrder(orderId, userId);

      res.json({
        success: true,
        message: "Order cancelled successfully",
        order: cancelledOrder,
      });
    } catch (error) {
      logger.error("Error cancelling order:", error);

      if (error.message === "Order not found") {
        return next(new AppError(error.message, 404));
      }

      if (error.message === "Only pending orders can be cancelled") {
        return next(new AppError(error.message, 400));
      }

      next(new AppError(`Error cancelling order: ${error.message}`, 400));
    }
  };
}

// Instance du contrôleur avec injection de dépendances
const orderService = getService("orderService");
const orderControllerInstance = new OrderController(orderService);

// Export des méthodes pour compatibilité avec les routes existantes
module.exports = {
  createOrder: orderControllerInstance.createOrder,
  getUserOrders: orderControllerInstance.getUserOrders,
  getOrderDetails: orderControllerInstance.getOrderDetails,
  updateOrderStatus: orderControllerInstance.updateOrderStatus,
  getUserOrderStats: orderControllerInstance.getUserOrderStats,
  cancelOrder: orderControllerInstance.cancelOrder,
  OrderController,
};
