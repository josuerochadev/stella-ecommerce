// client/src/repositories/ApiUserRepository.ts
// Implémentation du repository utilisateur utilisant l'API REST
// Responsabilité unique : communication avec l'API pour les opérations utilisateur

import type { ActivityItem, UserRepository } from "@/interfaces/UserRepository";
import { UserService } from "@/services/userService";
import type { ApiResponse, User, UserProfileData } from "@/types";
import { createFormattedError } from "@/utils/errorHelpers";

/**
 * Repository pour l'utilisateur utilisant l'API REST
 * Implémente UserRepository pour respecter le principe d'inversion de dépendances
 */
export class ApiUserRepository implements UserRepository {
  /**
   * Récupère le profil de l'utilisateur connecté
   * @returns {Promise<User>} Profil utilisateur
   * @throws {Error} Si la récupération échoue
   */
  async getProfile(): Promise<User> {
    try {
      return await UserService.getProfile();
    } catch (error) {
      throw createFormattedError(error, "Failed to fetch user profile");
    }
  }

  /**
   * Met à jour le profil de l'utilisateur
   * @param {UserProfileData} userData - Données à mettre à jour
   * @returns {Promise<ApiResponse<User>>} Profil mis à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async updateProfile(userData: UserProfileData): Promise<ApiResponse<User>> {
    try {
      if (!userData || Object.keys(userData).length === 0) {
        throw new Error("User data cannot be empty");
      }

      return await UserService.updateProfile(userData);
    } catch (error) {
      throw createFormattedError(error, "Failed to update user profile");
    }
  }

  /**
   * Supprime le compte utilisateur
   * @returns {Promise<ApiResponse<null>>} Confirmation de suppression
   * @throws {Error} Si la suppression échoue
   */
  async deleteAccount(password: string): Promise<ApiResponse<null>> {
    try {
      return await UserService.deleteAccount(password);
    } catch (error) {
      throw createFormattedError(error, "Failed to delete user account");
    }
  }

  /**
   * Change le mot de passe de l'utilisateur
   * @param {string} currentPassword - Mot de passe actuel
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Promise<ApiResponse<null>>} Confirmation du changement
   * @throws {Error} Si le changement échoue
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error("Current password and new password are required");
      }

      if (currentPassword === newPassword) {
        throw new Error("New password must be different from current password");
      }

      return await UserService.changePassword({ currentPassword, newPassword });
    } catch (error) {
      throw createFormattedError(error, "Failed to change password");
    }
  }

  /**
   * Met à jour les préférences utilisateur
   * @param {object} preferences - Préférences à mettre à jour
   * @returns {Promise<ApiResponse<User>>} Profil avec préférences mises à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async updatePreferences(preferences: {
    emailNotifications?: boolean;
    language?: string;
    theme?: string;
  }): Promise<ApiResponse<User>> {
    try {
      if (!preferences || Object.keys(preferences).length === 0) {
        throw new Error("Preferences cannot be empty");
      }

      return await UserService.updatePreferences(preferences);
    } catch (error) {
      throw createFormattedError(error, "Failed to update preferences");
    }
  }

  /**
   * Récupère l'historique des activités utilisateur
   * @param {object} params - Paramètres de pagination et filtrage
   * @returns {Promise<ApiResponse<any[]>>} Liste des activités
   * @throws {Error} Si la récupération échoue
   */
  async getActivityHistory(params?: {
    limit?: number;
    offset?: number;
    type?: string;
  }): Promise<ApiResponse<ActivityItem[]>> {
    try {
      return await UserService.getActivityHistory(params);
    } catch (error) {
      throw createFormattedError(error, "Failed to fetch activity history");
    }
  }

  /**
   * Vérifie la disponibilité d'un nom d'utilisateur
   * @param {string} username - Nom d'utilisateur à vérifier
   * @returns {Promise<{ available: boolean }>} Disponibilité du nom
   * @throws {Error} Si la vérification échoue
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    try {
      if (!username || username.trim().length < 3) {
        throw new Error("Username must be at least 3 characters long");
      }

      return await UserService.checkUsernameAvailability(username);
    } catch (error) {
      throw createFormattedError(error, "Failed to check username availability");
    }
  }

  /**
   * Demande une réinitialisation de mot de passe
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<ApiResponse<null>>} Confirmation de l'envoi
   * @throws {Error} Si la demande échoue
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    try {
      if (!email || !email.includes("@")) {
        throw new Error("Valid email is required");
      }

      return await UserService.requestPasswordReset(email);
    } catch (error) {
      throw createFormattedError(error, "Failed to request password reset");
    }
  }

  /**
   * Confirme la réinitialisation de mot de passe
   * @param {string} token - Token de réinitialisation
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Promise<ApiResponse<null>>} Confirmation de la réinitialisation
   * @throws {Error} Si la confirmation échoue
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      if (!token || !newPassword) {
        throw new Error("Token and new password are required");
      }

      return await UserService.confirmPasswordReset({ token, newPassword });
    } catch (error) {
      throw createFormattedError(error, "Failed to confirm password reset");
    }
  }
}
