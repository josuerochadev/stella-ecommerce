// client/src/interfaces/UserRepository.ts
// Interface du repository utilisateur suivant le principe d'inversion de dépendances (DIP)
// Responsabilité unique : Définir le contrat pour les opérations utilisateur

import type { ApiResponse, User, UserProfileData } from "@/types";

/**
 * Représente une activité utilisateur dans l'historique
 */
export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

/**
 * Interface définissant les opérations sur les données utilisateur
 * Permet l'injection de dépendances et facilite les tests
 */
export interface UserRepository {
  /**
   * Récupère le profil de l'utilisateur connecté
   * @returns Promise<User> Données du profil utilisateur
   * @throws {Error} Si la récupération échoue
   */
  getProfile(): Promise<User>;

  /**
   * Met à jour le profil de l'utilisateur
   * @param userData Données du profil à mettre à jour
   * @returns Promise<ApiResponse<User>> Profil mis à jour
   * @throws {Error} Si la mise à jour échoue
   */
  updateProfile(userData: UserProfileData): Promise<ApiResponse<User>>;

  /**
   * Supprime le compte utilisateur
   * @returns Promise<ApiResponse<null>> Confirmation de suppression
   * @throws {Error} Si la suppression échoue
   */
  deleteAccount(): Promise<ApiResponse<null>>;

  /**
   * Change le mot de passe de l'utilisateur
   * @param currentPassword Mot de passe actuel
   * @param newPassword Nouveau mot de passe
   * @returns Promise<ApiResponse<null>> Confirmation du changement
   * @throws {Error} Si le changement échoue
   */
  changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>>;

  /**
   * Met à jour les préférences utilisateur
   * @param preferences Préférences à mettre à jour
   * @returns Promise<ApiResponse<User>> Profil avec préférences mises à jour
   * @throws {Error} Si la mise à jour échoue
   */
  updatePreferences(preferences: {
    emailNotifications?: boolean;
    language?: string;
    theme?: string;
  }): Promise<ApiResponse<User>>;

  /**
   * Récupère l'historique des activités utilisateur
   * @param params Paramètres de pagination et filtrage
   * @returns Promise<ApiResponse<ActivityItem[]>> Liste des activités
   * @throws {Error} Si la récupération échoue
   */
  getActivityHistory(params?: {
    limit?: number;
    offset?: number;
    type?: string;
  }): Promise<ApiResponse<ActivityItem[]>>;

  /**
   * Vérifie la disponibilité d'un nom d'utilisateur
   * @param username Nom d'utilisateur à vérifier
   * @returns Promise<{ available: boolean }> Disponibilité du nom
   * @throws {Error} Si la vérification échoue
   */
  checkUsernameAvailability(username: string): Promise<{ available: boolean }>;

  /**
   * Demande une réinitialisation de mot de passe
   * @param email Email de l'utilisateur
   * @returns Promise<ApiResponse<null>> Confirmation de l'envoi
   * @throws {Error} Si la demande échoue
   */
  requestPasswordReset(email: string): Promise<ApiResponse<null>>;

  /**
   * Confirme la réinitialisation de mot de passe
   * @param token Token de réinitialisation
   * @param newPassword Nouveau mot de passe
   * @returns Promise<ApiResponse<null>> Confirmation de la réinitialisation
   * @throws {Error} Si la confirmation échoue
   */
  confirmPasswordReset(token: string, newPassword: string): Promise<ApiResponse<null>>;
}
