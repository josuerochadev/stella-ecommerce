// client/src/interfaces/WishlistRepository.ts
// Interface pour les opérations de persistance de la wishlist
// Responsabilité unique : abstraction des opérations de la wishlist

import type { WishlistItem } from "@/types";

/**
 * Interface pour le repository de la liste de souhaits
 * Abstrait les opérations de données pour faciliter les tests et le DIP
 */
export interface WishlistRepository {
  /**
   * Récupère la wishlist de l'utilisateur connecté
   * @returns {Promise<{wishlist: WishlistItem[]}>} Wishlist avec ses articles
   * @throws {Error} Si la récupération échoue
   */
  getWishlist(): Promise<{ wishlist: WishlistItem[] }>;

  /**
   * Ajoute un article à la wishlist
   * @param {number} starId - ID de l'étoile à ajouter
   * @returns {Promise<{wishlistItem: WishlistItem}>} Article ajouté
   * @throws {Error} Si l'ajout échoue
   */
  addToWishlist(starId: number): Promise<{ wishlistItem: WishlistItem }>;

  /**
   * Supprime un article de la wishlist
   * @param {number} starId - ID de l'étoile à supprimer
   * @returns {Promise<void>} Confirmation de suppression
   * @throws {Error} Si la suppression échoue
   */
  removeFromWishlist(starId: number): Promise<void>;

  /**
   * Vérifie si un article est dans la wishlist
   * @param {number} starId - ID de l'étoile à vérifier
   * @returns {Promise<boolean>} True si l'article est dans la wishlist
   * @throws {Error} Si la vérification échoue
   */
  isInWishlist(starId: number): Promise<boolean>;

  /**
   * Vide complètement la wishlist
   * @returns {Promise<void>} Confirmation de vidage
   * @throws {Error} Si l'opération échoue
   */
  clearWishlist(): Promise<void>;

  /**
   * Récupère le nombre d'articles dans la wishlist
   * @returns {Promise<number>} Nombre d'articles
   * @throws {Error} Si le comptage échoue
   */
  getWishlistCount(): Promise<number>;

  /**
   * Déplace un article de la wishlist vers le panier
   * @param {number} starId - ID de l'étoile à déplacer
   * @param {number} quantity - Quantité à ajouter au panier
   * @returns {Promise<void>} Confirmation du déplacement
   * @throws {Error} Si l'opération échoue
   */
  moveToCart(starId: number, quantity: number): Promise<void>;

  /**
   * Synchronise la wishlist locale avec le serveur
   * @param {WishlistItem[]} localItems - Articles locaux à synchroniser
   * @returns {Promise<{wishlist: WishlistItem[]}>} Wishlist synchronisée
   * @throws {Error} Si la synchronisation échoue
   */
  syncWishlist(localItems: WishlistItem[]): Promise<{ wishlist: WishlistItem[] }>;

  /**
   * Recherche dans la wishlist
   * @param {string} query - Terme de recherche
   * @returns {Promise<WishlistItem[]>} Articles correspondants
   * @throws {Error} Si la recherche échoue
   */
  searchWishlist(query: string): Promise<WishlistItem[]>;

  /**
   * Partage la wishlist (génère un lien de partage)
   * @returns {Promise<{shareUrl: string}>} URL de partage
   * @throws {Error} Si la génération échoue
   */
  shareWishlist(): Promise<{ shareUrl: string }>;
}
