// client/src/interfaces/CartRepository.ts
// Interface pour les opérations de persistance du panier
// Responsabilité unique : abstraction des opérations du panier

import type { CartItem } from "@/types";

/**
 * Interface pour le repository du panier d'achat
 * Abstrait les opérations de données pour faciliter les tests et le DIP
 */
export interface CartRepository {
  /**
   * Récupère le panier de l'utilisateur connecté
   * @returns {Promise<{cartItems: CartItem[]}>} Panier avec ses articles
   * @throws {Error} Si la récupération échoue
   */
  getCart(): Promise<{ cartItems: CartItem[] }>;

  /**
   * Ajoute un article au panier
   * @param {number} starId - ID de l'étoile à ajouter
   * @param {number} quantity - Quantité à ajouter
   * @returns {Promise<void>} Confirmation d'ajout
   * @throws {Error} Si l'ajout échoue
   */
  addToCart(starId: number, quantity: number): Promise<void>;

  /**
   * Supprime un article du panier
   * @param {number} cartItemId - ID de l'article à supprimer
   * @returns {Promise<void>} Confirmation de suppression
   * @throws {Error} Si la suppression échoue
   */
  removeFromCart(cartItemId: number): Promise<void>;

  /**
   * Met à jour la quantité d'un article dans le panier
   * @param {number} cartItemId - ID de l'article à modifier
   * @param {number} quantity - Nouvelle quantité
   * @returns {Promise<void>} Confirmation de mise à jour
   * @throws {Error} Si la mise à jour échoue
   */
  updateCartItemQuantity(cartItemId: number, quantity: number): Promise<void>;

  /**
   * Vide complètement le panier
   * @returns {Promise<void>} Confirmation de vidage
   * @throws {Error} Si l'opération échoue
   */
  clearCart(): Promise<void>;

  /**
   * Calcule le total du panier
   * @returns {Promise<{total: number, itemCount: number}>} Totaux du panier
   * @throws {Error} Si le calcul échoue
   */
  getCartSummary(): Promise<{ total: number; itemCount: number }>;

  /**
   * Vérifie si un article est déjà dans le panier
   * @param {number} starId - ID de l'étoile à vérifier
   * @returns {Promise<boolean>} True si l'article est dans le panier
   * @throws {Error} Si la vérification échoue
   */
  isInCart(starId: number): Promise<boolean>;

  /**
   * Synchronise le panier local avec le serveur
   * @param {CartItem[]} localItems - Articles locaux à synchroniser
   * @returns {Promise<{cartItems: CartItem[]}>} Panier synchronisé
   * @throws {Error} Si la synchronisation échoue
   */
  syncCart(localItems: CartItem[]): Promise<{ cartItems: CartItem[] }>;
}
