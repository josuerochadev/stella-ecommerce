// client/src/repositories/ApiCartRepository.ts
// Implémentation du repository panier utilisant l'API REST
// Responsabilité unique : communication avec l'API pour les opérations de panier

import { getCart, addToCart, removeFromCart } from "@/services/api";
import type { CartRepository } from "@/interfaces/CartRepository";
import type { CartItem } from "@/types";
import { transformCartItem, safeNumberTransform } from "@/utils/dataTransformers";
import { createFormattedError } from "@/utils/errorHelpers";

/**
 * Repository pour le panier utilisant l'API REST
 * Implémente CartRepository pour respecter le principe d'inversion de dépendances
 */
export class ApiCartRepository implements CartRepository {
  /**
   * Récupère le panier de l'utilisateur connecté
   * @returns {Promise<{cartItems: CartItem[]}>} Panier avec ses articles
   * @throws {Error} Si la récupération échoue
   */
  async getCart(): Promise<{cartItems: CartItem[]}> {
    try {
      const response = await getCart();
      return {
        cartItems: response.cartItems || []
      };
    } catch (error) {
      throw createFormattedError(error, 'Failed to fetch cart');
    }
  }

  /**
   * Ajoute un article au panier
   * @param {number} starId - ID de l'étoile à ajouter
   * @param {number} quantity - Quantité à ajouter
   * @returns {Promise<void>} Confirmation d'ajout
   * @throws {Error} Si l'ajout échoue
   */
  async addToCart(starId: number, quantity: number): Promise<void> {
    try {
      if (!starId || starId <= 0) {
        throw new Error('Star ID must be a positive number');
      }

      if (!quantity || quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }

      await addToCart(starId, quantity);
    } catch (error) {
      throw createFormattedError(error, 'Failed to add item to cart');
    }
  }

  /**
   * Supprime un article du panier
   * @param {number} cartItemId - ID de l'article à supprimer
   * @returns {Promise<void>} Confirmation de suppression
   * @throws {Error} Si la suppression échoue
   */
  async removeFromCart(cartItemId: number): Promise<void> {
    try {
      if (!cartItemId || cartItemId <= 0) {
        throw new Error('Cart item ID must be a positive number');
      }

      await removeFromCart(cartItemId);
    } catch (error) {
      throw createFormattedError(error, 'Failed to remove item from cart');
    }
  }

  /**
   * Met à jour la quantité d'un article dans le panier
   * @param {number} cartItemId - ID de l'article à modifier
   * @param {number} quantity - Nouvelle quantité
   * @returns {Promise<void>} Confirmation de mise à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<void> {
    try {
      if (!cartItemId || cartItemId <= 0) {
        throw new Error('Cart item ID must be a positive number');
      }

      if (!quantity || quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }

      // Pour l'instant, supprimer et re-ajouter (à améliorer quand l'API aura un endpoint update)
      await this.removeFromCart(cartItemId);

      // Note: Cette approche nécessiterait de récupérer le starId depuis le cart item
      // En attendant un endpoint API dédié pour la mise à jour
      throw new Error('Update quantity not yet implemented - API endpoint needed');
    } catch (error) {
      throw createFormattedError(error, 'Failed to update cart item quantity');
    }
  }

  /**
   * Vide complètement le panier
   * @returns {Promise<void>} Confirmation de vidage
   * @throws {Error} Si l'opération échoue
   */
  async clearCart(): Promise<void> {
    try {
      // Récupérer tous les articles pour les supprimer un par un
      const cart = await this.getCart();

      // Supprimer chaque article
      const deletePromises = cart.cartItems.map(item =>
        this.removeFromCart(item.id)
      );

      await Promise.all(deletePromises);
    } catch (error) {
      throw createFormattedError(error, 'Failed to clear cart');
    }
  }

  /**
   * Calcule le total du panier
   * @returns {Promise<{total: number, itemCount: number}>} Totaux du panier
   * @throws {Error} Si le calcul échoue
   */
  async getCartSummary(): Promise<{total: number, itemCount: number}> {
    try {
      const cart = await this.getCart();

      const total = cart.cartItems.reduce((sum, item) => {
        const price = safeNumberTransform(item.Star.price, 0);
        return sum + (price * item.quantity);
      }, 0);

      const itemCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        total: Math.round(total * 100) / 100, // Arrondir à 2 décimales
        itemCount
      };
    } catch (error) {
      throw createFormattedError(error, 'Failed to calculate cart summary');
    }
  }

  /**
   * Vérifie si un article est déjà dans le panier
   * @param {number} starId - ID de l'étoile à vérifier
   * @returns {Promise<boolean>} True si l'article est dans le panier
   * @throws {Error} Si la vérification échoue
   */
  async isInCart(starId: number): Promise<boolean> {
    try {
      if (!starId || starId <= 0) {
        throw new Error('Star ID must be a positive number');
      }

      const cart = await this.getCart();
      return cart.cartItems.some(item => item.starId === starId);
    } catch (error) {
      throw createFormattedError(error, 'Failed to check if item is in cart');
    }
  }

  /**
   * Synchronise le panier local avec le serveur
   * @param {CartItem[]} localItems - Articles locaux à synchroniser
   * @returns {Promise<{cartItems: CartItem[]}>} Panier synchronisé
   * @throws {Error} Si la synchronisation échoue
   */
  async syncCart(localItems: CartItem[]): Promise<{cartItems: CartItem[]}> {
    try {
      // Stratégie simple : récupérer le panier serveur (source de vérité)
      const serverCart = await this.getCart();

      // Pour une synchronisation plus avancée, on pourrait :
      // 1. Comparer les articles locaux vs serveur
      // 2. Fusionner les quantités ou résoudre les conflits
      // 3. Envoyer les différences au serveur

      // Pour l'instant, le serveur fait autorité
      return serverCart;
    } catch (error) {
      // En cas d'erreur, retourner les articles locaux
      return { cartItems: localItems };
    }
  }

  /**
   * Valide les données d'un article de panier
   * @param {CartItem} item - Article à valider
   * @returns {boolean} True si valide
   * @private
   */
  private validateCartItem(item: CartItem): boolean {
    return !!(
      item &&
      item.id &&
      item.starId &&
      item.quantity > 0 &&
      item.Star &&
      item.Star.starid &&
      item.Star.name &&
      typeof item.Star.price === 'number' && item.Star.price > 0
    );
  }

  /**
   * Normalise les prix en nombres
   * @param {CartItem[]} items - Articles à normaliser
   * @returns {CartItem[]} Articles normalisés
   * @private
   */
  private normalizeCartItems(items: CartItem[]): CartItem[] {
    return items
      .map(item => transformCartItem(item))
      .filter(item => this.validateCartItem(item));
  }
}