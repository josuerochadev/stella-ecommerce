// client/src/stores/useWishlistStore.ts
import { create } from "zustand";
import { getWishlist, addToWishlist, removeFromWishlist } from "../services/api";
import type { WishlistItem } from "../types";

interface WishlistState {
  wishlistItems: WishlistItem[];
  loading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addItemToWishlist: (starId: number) => Promise<void>;
  removeItemFromWishlist: (starId: number) => Promise<void>;
  resetWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlistItems: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true, error: null });
    try {
      const { wishlist } = await getWishlist();
      const transformedWishlist = wishlist.map((item) => ({
        ...item,
        Star: {
          ...item.Star,
          price: typeof item.Star.price === "string" ? Number.parseFloat(item.Star.price) : item.Star.price,
        },
      }));
      set({ wishlistItems: transformedWishlist || [], loading: false });
    } catch (_error) {
      set({ error: "Erreur lors de la récupération de la wishlist.", loading: false });
    }
  },

  addItemToWishlist: async (starId: number) => {
    set({ loading: true, error: null });
    try {
      const { wishlistItem } = await addToWishlist(starId);
      const transformedWishlistItem = {
        ...wishlistItem,
        Star: {
          ...wishlistItem.Star,
          price: typeof wishlistItem.Star.price === "string" ? Number.parseFloat(wishlistItem.Star.price) : wishlistItem.Star.price,
        },
      };
      set((state) => ({
        wishlistItems: [...state.wishlistItems, transformedWishlistItem],
        loading: false,
      }));
    } catch (_error) {
      set({ error: "Erreur lors de l'ajout à la wishlist.", loading: false });
    }
  },

  removeItemFromWishlist: async (starId: number) => {
    set({ loading: true, error: null });
    try {
      await removeFromWishlist(starId);
      set((state) => ({
        wishlistItems: state.wishlistItems.filter((item) => item.starId !== starId),
        loading: false,
      }));
    } catch (_error) {
      set({ error: "Erreur lors de la suppression de la wishlist.", loading: false });
    }
  },

  resetWishlist: () => set({ wishlistItems: [], loading: false, error: null }),
}));
