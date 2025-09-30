// client/src/stores/useUserStore.ts
// Store du profil utilisateur avec injection de dépendances
// Responsabilité unique : gestion de l'état du profil utilisateur via repository

import { create } from "zustand";
import { getService } from "@/di/container";
import type { User, UserProfileData, ApiResponse } from "@/types";
import type { UserRepository } from "@/interfaces/UserRepository";
import { getErrorMessage } from "@/utils/errorHelpers";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (userData: UserProfileData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updatePreferences: (preferences: {
    emailNotifications?: boolean;
    language?: string;
    theme?: string;
  }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  resetUser: () => void;
  setUser: (user: User | null) => void;
}

/**
 * Factory function pour créer le store utilisateur avec injection de dépendances
 * @param userRepository - Repository pour les opérations utilisateur
 */
export const createUserStore = (userRepository: UserRepository) =>
  create<UserState>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    fetchProfile: async () => {
      set({ loading: true, error: null });
      try {
        const userData = await userRepository.getProfile();
        set({ user: userData, loading: false });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de la récupération du profil.");
        set({ error: errorMessage, loading: false });
      }
    },

    updateProfile: async (userData: UserProfileData) => {
      set({ loading: true, error: null });
      try {
        const response: ApiResponse<User> = await userRepository.updateProfile(userData);
        set({ user: response.data, loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de la mise à jour du profil.");
        set({ error: errorMessage, loading: false });
      }
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      set({ loading: true, error: null });
      try {
        await userRepository.changePassword(currentPassword, newPassword);
        set({ loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors du changement de mot de passe.");
        set({ error: errorMessage, loading: false });
      }
    },

    updatePreferences: async (preferences) => {
      set({ loading: true, error: null });
      try {
        const response: ApiResponse<User> = await userRepository.updatePreferences(preferences);
        set({ user: response.data, loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de la mise à jour des préférences.");
        set({ error: errorMessage, loading: false });
      }
    },

    deleteAccount: async () => {
      set({ loading: true, error: null });
      try {
        await userRepository.deleteAccount();
        set({ user: null, loading: false, error: null });
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Erreur lors de la suppression du compte.");
        set({ error: errorMessage, loading: false });
      }
    },

    resetUser: () => set({ user: null, loading: false, error: null }),

    setUser: (user: User | null) => set({ user })
  }));

// Instance par défaut avec injection de dépendances
export const useUserStore = createUserStore(getService('userRepository'));