// client/src/repositories/ApiWishlistRepository.ts
// Implémentation du repository wishlist utilisant l'API REST
// Responsabilité unique : communication avec l'API pour les opérations de wishlist

import { getWishlist, addToWishlist, removeFromWishlist } from '../services/api';
import type { WishlistRepository } from '../interfaces/WishlistRepository';
import type { WishlistItem } from '../types';

/**
 * Repository pour la wishlist utilisant l'API REST
 * Implémente WishlistRepository pour respecter le principe d'inversion de dépendances
 */
export class ApiWishlistRepository implements WishlistRepository {
  /**
   * Récupère la wishlist de l'utilisateur connecté
   * @returns {Promise<{wishlist: WishlistItem[]}>} Wishlist avec ses articles
   * @throws {Error} Si la récupération échoue
   */
  async getWishlist(): Promise<{wishlist: WishlistItem[]}> {
    try {
      const response = await getWishlist();
      return {
        wishlist: response.wishlist || []
      };
    } catch (error) {
      throw new Error(`Failed to fetch wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ajoute un article à la wishlist
   * @param {number} starId - ID de l'étoile à ajouter
   * @returns {Promise<{wishlistItem: WishlistItem}>} Article ajouté
   * @throws {Error} Si l'ajout échoue
   */
  async addToWishlist(starId: number): Promise<{wishlistItem: WishlistItem}> {
    try {
      if (!starId || starId <= 0) {
        throw new Error('Star ID must be a positive number');
      }

      const response = await addToWishlist(starId);

      // Normalisation des prix
      const normalizedItem = this.normalizeWishlistItem(response.wishlistItem);

      return {
        wishlistItem: normalizedItem
      };
    } catch (error) {
      throw new Error(`Failed to add item to wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Supprime un article de la wishlist
   * @param {number} starId - ID de l'étoile à supprimer
   * @returns {Promise<void>} Confirmation de suppression
   * @throws {Error} Si la suppression échoue
   */
  async removeFromWishlist(starId: number): Promise<void> {
    try {
      if (!starId || starId <= 0) {
        throw new Error('Star ID must be a positive number');
      }

      await removeFromWishlist(starId);
    } catch (error) {
      throw new Error(`Failed to remove item from wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Vérifie si un article est dans la wishlist
   * @param {number} starId - ID de l'étoile à vérifier
   * @returns {Promise<boolean>} True si l'article est dans la wishlist
   * @throws {Error} Si la vérification échoue
   */
  async isInWishlist(starId: number): Promise<boolean> {
    try {
      if (!starId || starId <= 0) {
        throw new Error('Star ID must be a positive number');
      }

      const wishlist = await this.getWishlist();
      return wishlist.wishlist.some(item => item.starId === starId);
    } catch (error) {
      throw new Error(`Failed to check if item is in wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Vide complètement la wishlist
   * @returns {Promise<void>} Confirmation de vidage
   * @throws {Error} Si l'opération échoue
   */
  async clearWishlist(): Promise<void> {
    try {
      // Récupérer tous les articles pour les supprimer un par un
      const wishlist = await this.getWishlist();

      // Supprimer chaque article
      const deletePromises = wishlist.wishlist.map(item =>
        this.removeFromWishlist(item.starId)
      );

      await Promise.all(deletePromises);
    } catch (error) {
      throw new Error(`Failed to clear wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Récupère le nombre d'articles dans la wishlist
   * @returns {Promise<number>} Nombre d'articles
   * @throws {Error} Si le comptage échoue
   */
  async getWishlistCount(): Promise<number> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.wishlist.length;
    } catch (error) {
      throw new Error(`Failed to get wishlist count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Déplace un article de la wishlist vers le panier
   * @param {number} starId - ID de l'étoile à déplacer
   * @param {number} quantity - Quantité à ajouter au panier
   * @returns {Promise<void>} Confirmation du déplacement
   * @throws {Error} Si l'opération échoue
   */
  async moveToCart(starId: number, quantity: number = 1): Promise<void> {
    try {
      if (!starId || starId <= 0) {
        throw new Error('Star ID must be a positive number');
      }

      if (!quantity || quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }

      // Vérifier que l'article est dans la wishlist
      const isInWishlist = await this.isInWishlist(starId);
      if (!isInWishlist) {
        throw new Error('Item not found in wishlist');
      }

      // Note: Cette fonctionnalité nécessiterait une coordination avec CartRepository
      // Pour l'instant, on lance une erreur indiquant que cette fonctionnalité nécessite
      // une implémentation coordonnée
      throw new Error('Move to cart functionality requires coordinated implementation with CartRepository');
    } catch (error) {
      throw new Error(`Failed to move item to cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Synchronise la wishlist locale avec le serveur
   * @param {WishlistItem[]} localItems - Articles locaux à synchroniser
   * @returns {Promise<{wishlist: WishlistItem[]}>} Wishlist synchronisée
   * @throws {Error} Si la synchronisation échoue
   */
  async syncWishlist(localItems: WishlistItem[]): Promise<{wishlist: WishlistItem[]}> {
    try {
      // Stratégie simple : récupérer la wishlist serveur (source de vérité)
      const serverWishlist = await this.getWishlist();

      // Pour une synchronisation plus avancée, on pourrait :
      // 1. Comparer les articles locaux vs serveur
      // 2. Fusionner les différences
      // 3. Envoyer les différences au serveur

      // Pour l'instant, le serveur fait autorité
      return serverWishlist;
    } catch (error) {
      // En cas d'erreur, retourner les articles locaux
      return { wishlist: localItems };
    }
  }

  /**
   * Recherche dans la wishlist
   * @param {string} query - Terme de recherche
   * @returns {Promise<WishlistItem[]>} Articles correspondants
   * @throws {Error} Si la recherche échoue
   */
  async searchWishlist(query: string): Promise<WishlistItem[]> {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Search query must be a non-empty string');
      }

      const wishlist = await this.getWishlist();
      const lowercaseQuery = query.toLowerCase().trim();

      return wishlist.wishlist.filter(item => {
        const starName = item.Star?.name?.toLowerCase() || '';
        const starDescription = item.Star?.description?.toLowerCase() || '';
        const constellation = item.Star?.constellation?.toLowerCase() || '';

        return starName.includes(lowercaseQuery) ||
               starDescription.includes(lowercaseQuery) ||
               constellation.includes(lowercaseQuery);
      });
    } catch (error) {
      throw new Error(`Failed to search wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Partage la wishlist (génère un lien de partage)
   * @returns {Promise<{shareUrl: string}>} URL de partage
   * @throws {Error} Si la génération échoue
   */
  async shareWishlist(): Promise<{shareUrl: string}> {
    try {
      // Note: Cette fonctionnalité nécessiterait un endpoint API dédié
      // Pour l'instant, générer une URL basique
      const wishlistCount = await this.getWishlistCount();

      // Générer un ID de partage temporaire (en production, ceci devrait venir du serveur)
      const shareId = btoa(`wishlist_${Date.now()}_${Math.random()}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);

      const shareUrl = `${window.location.origin}/shared/wishlist/${shareId}`;

      // En production, cette URL devrait être générée par le serveur
      // et l'ID de partage devrait être sauvegardé en base
      console.warn('Share wishlist: Mock implementation - needs server endpoint');

      return {
        shareUrl
      };
    } catch (error) {
      throw new Error(`Failed to share wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Normalise un article de wishlist (conversion des prix)
   * @param {WishlistItem} item - Article à normaliser
   * @returns {WishlistItem} Article normalisé
   * @private
   */
  private normalizeWishlistItem(item: WishlistItem): WishlistItem {
    return {
      ...item,
      Star: {
        ...item.Star,
        price: typeof item.Star.price === 'string'
          ? parseFloat(item.Star.price)
          : item.Star.price
      }
    };
  }

  /**
   * Valide les données d'un article de wishlist
   * @param {WishlistItem} item - Article à valider
   * @returns {boolean} True si valide
   * @private
   */
  private validateWishlistItem(item: WishlistItem): boolean {
    return !!(
      item &&
      item.id &&
      item.starId &&
      item.Star &&
      item.Star.starid &&
      item.Star.name &&
      typeof item.Star.price === 'number' && item.Star.price > 0
    );
  }

  /**
   * Normalise une liste d'articles de wishlist
   * @param {WishlistItem[]} items - Articles à normaliser
   * @returns {WishlistItem[]} Articles normalisés
   * @private
   */
  private normalizeWishlistItems(items: WishlistItem[]): WishlistItem[] {
    return items
      .map(item => this.normalizeWishlistItem(item))
      .filter(item => this.validateWishlistItem(item));
  }
}