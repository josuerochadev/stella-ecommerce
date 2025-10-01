// client/src/services/wishlistService.ts
// Responsabilité unique : Gestion de la liste d'envies

import { httpClient } from "./httpClient";
import { transformWishlistItems } from "@/utils/dataTransformers";
import type { GetWishlistResponse, AddToWishlistResponse } from "@/types";

/**
 * Interface pour la réponse de suppression de wishlist
 */
interface RemoveFromWishlistResponse {
  message: string;
  success: boolean;
}

/**
 * Service de gestion de la liste d'envies
 * Responsabilité unique : CRUD des articles de la wishlist
 */
export class WishlistService {
  /**
   * Récupérer la liste d'envies de l'utilisateur
   * Responsabilité : Lecture du contenu de la wishlist
   */
  static async getWishlist(): Promise<GetWishlistResponse> {
    const response = await httpClient.get<GetWishlistResponse>("/wishlist");

    // Normalisation des données via transformateur
    if (response.data.wishlist) {
      response.data.wishlist = transformWishlistItems(response.data.wishlist);
    }

    return response.data;
  }

  /**
   * Ajouter un article à la liste d'envies
   * Responsabilité : Création d'un nouvel article dans la wishlist
   */
  static async addItem(starId: number): Promise<AddToWishlistResponse> {
    const response = await httpClient.post<AddToWishlistResponse>("/wishlist/add", { starId });
    return response.data;
  }

  /**
   * Supprimer un article de la liste d'envies
   * Responsabilité : Suppression d'un article spécifique
   */
  static async removeItem(starId: number): Promise<RemoveFromWishlistResponse> {
    const response = await httpClient.delete<RemoveFromWishlistResponse>(`/wishlist/remove/${starId}`);
    return response.data;
  }

  /**
   * Vérifier si un article est dans la liste d'envies
   * Responsabilité : Vérification d'appartenance
   */
  static async isItemInWishlist(starId: number): Promise<{ inWishlist: boolean }> {
    const response = await httpClient.get<{ inWishlist: boolean }>(`/wishlist/check/${starId}`);
    return response.data;
  }

  /**
   * Déplacer un article de la wishlist vers le panier
   * Responsabilité : Transfer entre collections
   */
  static async moveToCart(starId: number, quantity: number = 1): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await httpClient.post<{
      success: boolean;
      message: string;
    }>("/wishlist/move-to-cart", { starId, quantity });
    return response.data;
  }

  /**
   * Déplacer tous les articles de la wishlist vers le panier
   * Responsabilité : Transfer en lot
   */
  static async moveAllToCart(): Promise<{
    success: boolean;
    message: string;
    movedItems: number;
  }> {
    const response = await httpClient.post<{
      success: boolean;
      message: string;
      movedItems: number;
    }>("/wishlist/move-all-to-cart");
    return response.data;
  }

  /**
   * Vider complètement la liste d'envies
   * Responsabilité : Suppression de tous les articles
   */
  static async clearWishlist(): Promise<{ message: string; success: boolean }> {
    const response = await httpClient.delete<{ message: string; success: boolean }>("/wishlist/clear");
    return response.data;
  }

  /**
   * Obtenir le nombre d'articles dans la wishlist
   * Responsabilité : Comptage des articles
   */
  static async getItemCount(): Promise<{ count: number }> {
    const response = await httpClient.get<{ count: number }>("/wishlist/count");
    return response.data;
  }

  /**
   * Partager la liste d'envies (génération de lien)
   * Responsabilité : Génération de liens de partage
   */
  static async generateShareLink(): Promise<{
    shareLink: string;
    expiresAt: string;
  }> {
    const response = await httpClient.post<{
      shareLink: string;
      expiresAt: string;
    }>("/wishlist/share");
    return response.data;
  }

  /**
   * Importer des articles depuis une liste d'envies partagée
   * Responsabilité : Import depuis liens de partage
   */
  static async importFromShareLink(shareToken: string): Promise<{
    success: boolean;
    message: string;
    importedItems: number;
  }> {
    const response = await httpClient.post<{
      success: boolean;
      message: string;
      importedItems: number;
    }>("/wishlist/import", { shareToken });
    return response.data;
  }
}

// Exports nommés pour compatibilité avec l'API existante
export const getWishlist = WishlistService.getWishlist;
export const addToWishlist = WishlistService.addItem;
export const removeFromWishlist = WishlistService.removeItem;