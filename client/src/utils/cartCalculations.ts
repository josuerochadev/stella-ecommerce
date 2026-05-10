// client/src/utils/cartCalculations.ts
// Responsabilité unique : Calculs et logique métier du panier

import type { CartItem } from "@/types";

/**
 * Service de calculs du panier
 * Responsabilité unique : Logique de calcul des prix et totaux
 */
export class CartCalculations {
  /**
   * Calculer le prix total d'un article (prix × quantité)
   * Responsabilité : Calcul d'un prix unitaire
   */
  static calculateItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  /**
   * Calculer le total général du panier
   * Responsabilité : Calcul du montant total
   */
  static calculateCartTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      return total + CartCalculations.calculateItemTotal(item.Star.price, item.quantity);
    }, 0);
  }

  /**
   * Formater un prix en euros
   * Responsabilité : Formatage des montants
   */
  static formatPrice(amount: number): string {
    return `${amount.toFixed(2)} €`;
  }

  /**
   * Calculer le total formaté du panier
   * Responsabilité : Calcul et formatage combinés
   */
  static getFormattedCartTotal(cartItems: CartItem[]): string {
    const total = CartCalculations.calculateCartTotal(cartItems);
    return CartCalculations.formatPrice(total);
  }

  /**
   * Obtenir les statistiques du panier
   * Responsabilité : Calcul des métriques du panier
   */
  static getCartStats(cartItems: CartItem[]): {
    totalItems: number;
    totalAmount: number;
    formattedTotal: string;
    averageItemPrice: number;
  } {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = CartCalculations.calculateCartTotal(cartItems);
    const averageItemPrice = totalItems > 0 ? totalAmount / totalItems : 0;

    return {
      totalItems,
      totalAmount,
      formattedTotal: CartCalculations.formatPrice(totalAmount),
      averageItemPrice,
    };
  }

  /**
   * Vérifier si le panier est vide
   * Responsabilité : Validation de l'état du panier
   */
  static isEmpty(cartItems: CartItem[]): boolean {
    return cartItems.length === 0;
  }

  /**
   * Obtenir le nombre total d'articles
   * Responsabilité : Comptage des articles
   */
  static getTotalItemCount(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// Exports de fonctions pour compatibilité
export const calculateItemTotal = CartCalculations.calculateItemTotal;
export const calculateCartTotal = CartCalculations.calculateCartTotal;
export const formatPrice = CartCalculations.formatPrice;
export const getFormattedCartTotal = CartCalculations.getFormattedCartTotal;
export const getCartStats = CartCalculations.getCartStats;
