// client/src/services/userService.ts
// Responsabilité unique : Gestion des profils utilisateurs

import type { ApiResponse, User, UserProfileData } from "@/types";
import { httpClient } from "./httpClient";

/**
 * Service de gestion des profils utilisateurs
 * Responsabilité unique : CRUD des données de profil utilisateur
 */
export class UserService {
  /**
   * Récupérer le profil de l'utilisateur connecté
   * Responsabilité : Lecture des données de profil
   */
  static async getProfile(): Promise<User> {
    const response = await httpClient.get<User>("/users/profile");
    return response.data;
  }

  /**
   * Mettre à jour le profil de l'utilisateur
   * Responsabilité : Modification des données de profil
   */
  static async updateProfile(userData: UserProfileData): Promise<ApiResponse<User>> {
    const response = await httpClient.put<ApiResponse<User>>("/users/profile", userData);
    return response.data;
  }

  /**
   * Supprimer le compte utilisateur
   * Responsabilité : Suppression définitive du compte
   */
  static async deleteAccount(password: string): Promise<ApiResponse<null>> {
    const response = await httpClient.delete<ApiResponse<null>>("/users/me", {
      data: { password },
    });
    return response.data;
  }

  /**
   * Changer le mot de passe de l'utilisateur
   * Responsabilité : Modification sécurisée du mot de passe
   */
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> {
    const response = await httpClient.put<ApiResponse<null>>("/users/change-password", data);
    return response.data;
  }

  /**
   * Mettre à jour les préférences utilisateur
   * Responsabilité : Gestion des paramètres personnalisés
   */
  static async updatePreferences(preferences: {
    emailNotifications?: boolean;
    language?: string;
    theme?: string;
  }): Promise<ApiResponse<User>> {
    const response = await httpClient.put<ApiResponse<User>>("/users/preferences", preferences);
    return response.data;
  }

  /**
   * Récupérer l'historique des activités utilisateur
   * Responsabilité : Lecture de l'historique d'activité
   */
  static async getActivityHistory(params?: {
    limit?: number;
    offset?: number;
    type?: string;
  }): Promise<ApiResponse<any[]>> {
    const response = await httpClient.get<ApiResponse<any[]>>("/users/activity", { params });
    return response.data;
  }

  /**
   * Vérifier la disponibilité d'un nom d'utilisateur
   * Responsabilité : Validation de l'unicité des identifiants
   */
  static async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    const response = await httpClient.get<{ available: boolean }>("/users/check-username", {
      params: { username },
    });
    return response.data;
  }

  /**
   * Demander une réinitialisation de mot de passe
   * Responsabilité : Initiation de la récupération de compte
   */
  static async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    const response = await httpClient.post<ApiResponse<null>>("/users/forgot-password", { email });
    return response.data;
  }

  /**
   * Confirmer la réinitialisation de mot de passe
   * Responsabilité : Finalisation de la récupération de compte
   */
  static async confirmPasswordReset(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> {
    const response = await httpClient.post<ApiResponse<null>>("/users/reset-password", data);
    return response.data;
  }

  /**
   * Exporter toutes les données personnelles (RGPD — droit à la portabilité)
   */
  static async exportData(): Promise<object> {
    const response = await httpClient.get("/users/me/export");
    return response.data;
  }
}

// Exports nommés pour compatibilité avec l'API existante
export const getUserProfile = UserService.getProfile;
export const updateUserProfile = UserService.updateProfile;
export const deleteUserAccount = UserService.deleteAccount;
