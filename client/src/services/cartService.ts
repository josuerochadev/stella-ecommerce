// client/src/services/cartService.ts
// Responsabilité unique : Gestion du panier d'achat

import type { ApiResponse, Cart } from "@/types";
import { transformCartItems } from "@/utils/dataTransformers";
import { httpClient } from "./httpClient";

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
/**
 * Normalise les cartItems d'une reponse API
 */
function normalizeCartResponse<T extends ApiResponse<Cart>>(response: T): T {
  if (response.data?.cartItems) {
    response.data.cartItems = transformCartItems(response.data.cartItems);
  }
  return response;
}

// biome-ignore lint/complexity/noStaticOnlyClass: service pattern for API grouping
export class CartService {
  static async getCart(): Promise<Cart> {
    const response = await httpClient.get<{ success: boolean; cart: Cart }>("/cart");
    const cart = response.data.cart;
    if (cart.cartItems) {
      cart.cartItems = transformCartItems(cart.cartItems);
    }
    return cart;
  }

  static async addItem(starId: number, quantity: number): Promise<ApiResponse<Cart>> {
    const data: AddToCartData = { starId, quantity };
    const response = await httpClient.post<ApiResponse<Cart>>("/cart/add", data);
    return normalizeCartResponse(response.data);
  }

  static async updateItem(cartItemId: number, quantity: number): Promise<ApiResponse<Cart>> {
    const data: UpdateCartItemData = { cartItemId, quantity };
    const response = await httpClient.put<ApiResponse<Cart>>("/cart/update", data);
    return normalizeCartResponse(response.data);
  }

  static async removeItem(cartItemId: number): Promise<ApiResponse<Cart>> {
    const response = await httpClient.delete<ApiResponse<Cart>>(`/cart/remove/${cartItemId}`);
    return normalizeCartResponse(response.data);
  }

  static async clearCart(): Promise<ApiResponse<null>> {
    const response = await httpClient.delete<ApiResponse<null>>("/cart/clear");
    return response.data;
  }

  static async getCartTotal(): Promise<{ total: number; itemCount: number }> {
    const response = await httpClient.get<{ total: number; itemCount: number }>("/cart/total");
    return response.data;
  }

  static async applyPromoCode(promoCode: string): Promise<ApiResponse<Cart>> {
    const response = await httpClient.post<ApiResponse<Cart>>("/cart/promo", { promoCode });
    return normalizeCartResponse(response.data);
  }

  static async removePromoCode(): Promise<ApiResponse<Cart>> {
    const response = await httpClient.delete<ApiResponse<Cart>>("/cart/promo");
    return normalizeCartResponse(response.data);
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
