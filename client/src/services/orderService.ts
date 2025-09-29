// client/src/services/orderService.ts
// Responsabilité unique : Gestion des commandes

import { httpClient } from "./httpClient";
import type { Order, OrderData, OrderStatus, ApiResponse } from "../types";

/**
 * Service de gestion des commandes
 * Responsabilité unique : CRUD et suivi des commandes
 */
export class OrderService {
  /**
   * Créer une nouvelle commande
   */
  static async createOrder(orderData: OrderData): Promise<ApiResponse<Order>> {
    const response = await httpClient.post<ApiResponse<Order>>("/orders", orderData);
    return response.data;
  }

  /**
   * Récupérer toutes les commandes de l'utilisateur
   */
  static async getUserOrders(): Promise<ApiResponse<Order[]>> {
    const response = await httpClient.get<ApiResponse<Order[]>>("/orders");
    return response.data;
  }

  /**
   * Récupérer les détails d'une commande spécifique
   */
  static async getOrderDetails(orderId: string): Promise<ApiResponse<Order>> {
    const response = await httpClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  }

  /**
   * Mettre à jour le statut d'une commande (admin)
   */
  static async updateOrderStatus(orderId: number, status: OrderStatus): Promise<ApiResponse<Order>> {
    const response = await httpClient.put<ApiResponse<Order>>(`/orders/${orderId}/update-status`, { status });
    return response.data;
  }

  /**
   * Annuler une commande
   */
  static async cancelOrder(orderId: number): Promise<ApiResponse<Order>> {
    const response = await httpClient.put<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
    return response.data;
  }
}

// Exports nommés pour compatibilité
export const createOrder = OrderService.createOrder;
export const getUserOrders = OrderService.getUserOrders;
export const getOrderDetails = OrderService.getOrderDetails;
export const updateOrderStatus = OrderService.updateOrderStatus;