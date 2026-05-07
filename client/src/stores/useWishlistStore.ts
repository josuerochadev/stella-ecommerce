/**
 * Zustand store for wishlist state management.
 * Uses the repository pattern via DI for data access.
 * All wishlist data is normalized through transformWishlistItems before being stored.
 * Provides local fallbacks for count/search/isInWishlist when API calls fail.
 *
 * @module useWishlistStore
 */

import { getService } from "@/di/container";
import type { WishlistRepository } from "@/interfaces/WishlistRepository";
import type { WishlistItem } from "@/types";
import { transformWishlistItem, transformWishlistItems } from "@/utils/dataTransformers";
import { getErrorMessage } from "@/utils/errorHelpers";
import { create } from "zustand";

interface WishlistState {
  wishlistItems: WishlistItem[];
  loading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addItemToWishlist: (starId: number) => Promise<void>;
  removeItemFromWishlist: (starId: number) => Promise<void>;
  resetWishlist: () => void;
  clearWishlist: () => Promise<void>;
  getWishlistCount: () => Promise<number>;
  isInWishlist: (starId: number) => Promise<boolean>;
  searchWishlist: (query: string) => Promise<WishlistItem[]>;
}

/**
 * Factory function pour créer le store de la wishlist avec injection de dépendances
 * @param wishlistRepository - Repository pour les opérations de wishlist
 */
export const createWishlistStore = (wishlistRepository: WishlistRepository) =>
  create<WishlistState>((set, get) => ({
    wishlistItems: [],
    loading: false,
    error: null,

    fetchWishlist: async () => {
      set({ loading: true, error: null });
      try {
        const { wishlist } = await wishlistRepository.getWishlist();
        // Délégation au transformateur spécialisé
        const transformedWishlist = transformWishlistItems(wishlist || []);
        set({ wishlistItems: transformedWishlist, loading: false });
      } catch (error) {
        const errorMessage = getErrorMessage(
          error,
          "Erreur lors de la récupération de la wishlist.",
        );
        set({ error: errorMessage, loading: false });
      }
    },

    addItemToWishlist: async (starId: number) => {
      set({ loading: true, error: null });
      try {
        const { wishlistItem } = await wishlistRepository.addToWishlist(starId);
        const transformedWishlistItem = transformWishlistItem(wishlistItem);
        set((state) => ({
          wishlistItems: [...state.wishlistItems, transformedWishlistItem],
          loading: false,
          error: null,
        }));
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de l'ajout à la wishlist.");
        set({ error: errorMessage, loading: false });
      }
    },

    removeItemFromWishlist: async (starId: number) => {
      set({ loading: true, error: null });
      try {
        await wishlistRepository.removeFromWishlist(starId);
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((item) => item.starId !== starId),
          loading: false,
          error: null,
        }));
      } catch (error) {
        const errorMessage = getErrorMessage(
          error,
          "Erreur lors de la suppression de la wishlist.",
        );
        set({ error: errorMessage, loading: false });
      }
    },

    resetWishlist: () => set({ wishlistItems: [], loading: false, error: null }),

    // Nouvelles méthodes utilisant les capacités du repository
    clearWishlist: async () => {
      set({ loading: true, error: null });
      try {
        await wishlistRepository.clearWishlist();
        set({ wishlistItems: [], loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors du vidage de la wishlist.");
        set({ error: errorMessage, loading: false });
      }
    },

    getWishlistCount: async () => {
      try {
        return await wishlistRepository.getWishlistCount();
      } catch {
        // En cas d'erreur, compter localement
        const { wishlistItems } = get();
        return wishlistItems.length;
      }
    },

    isInWishlist: async (starId: number) => {
      try {
        return await wishlistRepository.isInWishlist(starId);
      } catch {
        // En cas d'erreur, vérifier localement
        const { wishlistItems } = get();
        return wishlistItems.some((item) => item.starId === starId);
      }
    },

    searchWishlist: async (query: string) => {
      try {
        return await wishlistRepository.searchWishlist(query);
      } catch {
        // En cas d'erreur, rechercher localement
        const { wishlistItems } = get();
        const lowercaseQuery = query.toLowerCase().trim();

        return wishlistItems.filter((item) => {
          const starName = item.Star?.name?.toLowerCase() || "";
          const starDescription = item.Star?.description?.toLowerCase() || "";
          const constellation = item.Star?.constellation?.toLowerCase() || "";

          return (
            starName.includes(lowercaseQuery) ||
            starDescription.includes(lowercaseQuery) ||
            constellation.includes(lowercaseQuery)
          );
        });
      }
    },
  }));

// Instance par défaut avec injection de dépendances
export const useWishlistStore = createWishlistStore(getService("wishlistRepository"));
