// client/src/stores/useCartStore.ts
// Store du panier avec injection de dépendances
// Responsabilité unique : gestion de l'état du panier via repository

import { create } from "zustand";
import { transformCartItems, safeNumberTransform } from "@/utils/dataTransformers";
import { getService } from "@/di/container";
import type { CartItem } from "@/types";
import type { CartRepository } from "@/interfaces/CartRepository";
import { getErrorMessage } from "@/utils/errorHelpers";

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (starId: number, quantity: number) => Promise<void>;
  updateItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  resetCart: () => void;
  clearCart: () => Promise<void>;
  getCartSummary: () => Promise<{total: number, itemCount: number}>;
  isInCart: (starId: number) => Promise<boolean>;
}

/**
 * Factory function pour créer le store du panier avec injection de dépendances
 * @param cartRepository - Repository pour les opérations de panier
 */
export const createCartStore = (cartRepository: CartRepository) =>
  create<CartState>((set, get) => ({
    cartItems: [],
    loading: false,
    error: null,

    fetchCart: async () => {
      set({ loading: true, error: null });
      try {
        const cart = await cartRepository.getCart();
        // Normalisation des données via transformateur
        const transformedCartItems = transformCartItems(cart.cartItems || []);
        set({ cartItems: transformedCartItems, loading: false });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de la récupération du panier.");
        set({ error: errorMessage, loading: false });
      }
    },

    addItem: async (starId: number, quantity: number) => {
      set({ loading: true, error: null });
      try {
        await cartRepository.addToCart(starId, quantity);
        const cart = await cartRepository.getCart();
        // Normalisation cohérente des données
        const transformedCartItems = transformCartItems(cart.cartItems || []);
        set({ cartItems: transformedCartItems, loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de l'ajout au panier.");
        set({ error: errorMessage, loading: false });
      }
    },

    updateItem: async (cartItemId: number, quantity: number) => {
      set({ loading: true, error: null });
      try {
        await cartRepository.updateCartItemQuantity(cartItemId, quantity);
        const cart = await cartRepository.getCart();
        const transformedCartItems = transformCartItems(cart.cartItems || []);
        set({ cartItems: transformedCartItems, loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de la mise a jour de la quantite.");
        set({ error: errorMessage, loading: false });
      }
    },

    removeItem: async (cartItemId: number) => {
      set({ loading: true, error: null });
      try {
        await cartRepository.removeFromCart(cartItemId);
        const cart = await cartRepository.getCart();
        // Normalisation cohérente des données
        const transformedCartItems = transformCartItems(cart.cartItems || []);
        set({ cartItems: transformedCartItems, loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de la suppression de l'article du panier.");
        set({ error: errorMessage, loading: false });
      }
    },

    resetCart: () => set({ cartItems: [], loading: false, error: null }),

    // Nouvelles méthodes utilisant les capacités du repository
    clearCart: async () => {
      set({ loading: true, error: null });
      try {
        await cartRepository.clearCart();
        set({ cartItems: [], loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors du vidage du panier.");
        set({ error: errorMessage, loading: false });
      }
    },

    getCartSummary: async () => {
      try {
        return await cartRepository.getCartSummary();
      } catch (error) {
        // En cas d'erreur, calculer localement
        const { cartItems } = get();
        const total = cartItems.reduce((sum, item) => {
          const price = safeNumberTransform(item.Star.price, 0);
          return sum + (price * item.quantity);
        }, 0);
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        return { total: Math.round(total * 100) / 100, itemCount };
      }
    },

    isInCart: async (starId: number) => {
      try {
        return await cartRepository.isInCart(starId);
      } catch (error) {
        // En cas d'erreur, vérifier localement
        const { cartItems } = get();
        return cartItems.some(item => item.starId === starId);
      }
    }
  }));

// Instance par défaut avec injection de dépendances
export const useCartStore = createCartStore(getService('cartRepository'));
