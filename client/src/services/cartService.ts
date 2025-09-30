// client/src/services/cartService.ts
// Responsabilité unique : Gestion du panier d'achat

import { httpClient } from "./httpClient";
import { transformCartItems } from "@/utils/dataTransformers";
import type { Cart, ApiResponse } from "@/types";

/**
 * Interface pour l'ajout d'article au panier
 */
interface AddToCartData {
  starId: number;
  quantity: number;
}

/**
 * Interface pour la mise à jour d'article du panier
 */
interface UpdateCartItemData {
  cartItemId: number;
  quantity: number;
}

/**
 * Service de gestion du panier d'achat
 * Responsabilité unique : CRUD des articles du panier
 */
export class CartService {
  /**
   * Récupérer le panier de l'utilisateur
   * Responsabilité : Lecture du contenu du panier
   */
  static async getCart(): Promise<Cart> {
    const response = await httpClient.get<Cart>("/cart");

    // Normalisation des données via transformateur
    if (response.data.cartItems) {
      response.data.cartItems = transformCartItems(response.data.cartItems);
    }

    return response.data;
  }

  /**
   * Ajouter un article au panier
   * Responsabilité : Création d'un nouvel article dans le panier
   */
  static async addItem(starId: number, quantity: number): Promise<ApiResponse<Cart>> {
    const data: AddToCartData = { starId, quantity };
    const response = await httpClient.post<ApiResponse<Cart>>("/cart/add", data);

    // Normalisation des données de réponse
    if (response.data.data?.cartItems) {
      response.data.data.cartItems = transformCartItems(response.data.data.cartItems);
    }

    return response.data;
  }

  /**
   * Mettre à jour la quantité d'un article du panier
   * Responsabilité : Modification de la quantité d'un article existant
   */
  static async updateItem(cartItemId: number, quantity: number): Promise<ApiResponse<Cart>> {
    const data: UpdateCartItemData = { cartItemId, quantity };
    const response = await httpClient.put<ApiResponse<Cart>>("/cart/update", data);

    // Normalisation des données de réponse
    if (response.data.data?.cartItems) {
      response.data.data.cartItems = transformCartItems(response.data.data.cartItems);
    }

    return response.data;
  }

  /**
   * Supprimer un article du panier
   * Responsabilité : Suppression d'un article spécifique
   */
  static async removeItem(cartItemId: number): Promise<ApiResponse<Cart>> {
    const response = await httpClient.delete<ApiResponse<Cart>>(`/cart/remove/${cartItemId}`);

    // Normalisation des données de réponse
    if (response.data.data?.cartItems) {
      response.data.data.cartItems = transformCartItems(response.data.data.cartItems);
    }

    return response.data;
  }

  /**
   * Vider complètement le panier
   * Responsabilité : Suppression de tous les articles
   */
  static async clearCart(): Promise<ApiResponse<null>> {
    const response = await httpClient.delete<ApiResponse<null>>("/cart/clear");
    return response.data;
  }

  /**
   * Calculer le total du panier
   * Responsabilité : Calcul du montant total
   */
  static async getCartTotal(): Promise<{ total: number; itemCount: number }> {
    const response = await httpClient.get<{ total: number; itemCount: number }>("/cart/total");
    return response.data;
  }

  /**
   * Appliquer un code promo au panier
   * Responsabilité : Gestion des réductions
   */
  static async applyPromoCode(promoCode: string): Promise<ApiResponse<Cart>> {
    const response = await httpClient.post<ApiResponse<Cart>>("/cart/promo", { promoCode });

    // Normalisation des données de réponse
    if (response.data.data?.cartItems) {
      response.data.data.cartItems = transformCartItems(response.data.data.cartItems);
    }

    return response.data;
  }

  /**
   * Supprimer un code promo du panier
   * Responsabilité : Annulation des réductions
   */
  static async removePromoCode(): Promise<ApiResponse<Cart>> {
    const response = await httpClient.delete<ApiResponse<Cart>>("/cart/promo");

    // Normalisation des données de réponse
    if (response.data.data?.cartItems) {
      response.data.data.cartItems = transformCartItems(response.data.data.cartItems);
    }

    return response.data;
  }

  /**
   * Valider la disponibilité des articles du panier
   * Responsabilité : Vérification de stock avant commande
   */
  static async validateCartItems(): Promise<{
    valid: boolean;
    unavailableItems: number[];
  }> {
    const response = await httpClient.get<{
      valid: boolean;
      unavailableItems: number[];
    }>("/cart/validate");
    return response.data;
  }
}

// Exports nommés pour compatibilité avec l'API existante
export const getCart = CartService.getCart;
export const addToCart = CartService.addItem;
export const updateCartItem = CartService.updateItem;
export const removeFromCart = CartService.removeItem;