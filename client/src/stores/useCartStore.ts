// client/src/stores/useCartStore.ts
import { create } from "zustand";
import { getCart, addToCart, removeFromCart } from "../services/api";
import { transformCartItems } from "../utils/dataTransformers";
import type { CartItem } from "../types";

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (starId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  resetCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const cart = await getCart();
      // Normalisation des données via transformateur
      const transformedCartItems = transformCartItems(cart.cartItems || []);
      set({ cartItems: transformedCartItems, loading: false });
    } catch (_error) {
      set({ error: "Erreur lors de la récupération du panier.", loading: false });
    }
  },

  addItem: async (starId: number, quantity: number) => {
    try {
      await addToCart(starId, quantity);
      const cart = await getCart();
      // Normalisation cohérente des données
      const transformedCartItems = transformCartItems(cart.cartItems || []);
      set({ cartItems: transformedCartItems, error: null });
    } catch (_error) {
      set({ error: "Erreur lors de l'ajout au panier." });
    }
  },

  removeItem: async (cartItemId: number) => {
    try {
      await removeFromCart(cartItemId);
      const cart = await getCart();
      // Normalisation cohérente des données
      const transformedCartItems = transformCartItems(cart.cartItems || []);
      set({ cartItems: transformedCartItems, error: null });
    } catch (_error) {
      set({ error: "Erreur lors de la suppression de l'article du panier." });
    }
  },

  resetCart: () => set({ cartItems: [], loading: false, error: null }),
}));
