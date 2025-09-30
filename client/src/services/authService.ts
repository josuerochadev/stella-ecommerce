// client/src/services/authService.ts
// Responsabilité unique : Authentification des utilisateurs

import { httpClient } from "./httpClient";
import type { ApiResponse } from "../types";

/**
 * Interface pour les données d'inscription
 */
interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Interface pour les données de connexion
 */
interface LoginUserData {
  email: string;
  password: string;
}

/**
 * Interface pour la réponse d'inscription
 */
interface RegisterResponse {
  token: string;
  userId: number;
}

/**
 * Interface pour la réponse de connexion
 */
interface LoginResponse {
  accessToken: string;
  userId: number;
  role: string;
}

/**
 * Service d'authentification
 * Responsabilité unique : Gestion de l'authentification des utilisateurs
 */
export class AuthService {
  /**
   * Inscrire un nouvel utilisateur
   * Responsabilité : Création de compte utilisateur
   */
  static async register(userData: RegisterUserData): Promise<RegisterResponse> {
    const response = await httpClient.post<RegisterResponse>("/auth/register", userData);
    return response.data;
  }

  /**
   * Connecter un utilisateur existant
   * Responsabilité : Authentification utilisateur
   */
  static async login(loginData: LoginUserData): Promise<LoginResponse> {
    const response = await httpClient.post<{
      success: boolean;
      message: string;
      accessToken: string;
      userId: number;
      role: string;
    }>("/auth/login", loginData);
    return response.data;
  }

  /**
   * Déconnecter l'utilisateur actuel
   * Responsabilité : Invalidation de session
   */
  static async logout(): Promise<ApiResponse<null>> {
    const response = await httpClient.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  }

  /**
   * Vérifier la validité du token actuel
   * Responsabilité : Validation du token d'authentification
   */
  static async validateToken(): Promise<boolean> {
    try {
      // Tentative d'accès à un endpoint protégé pour valider le token
      await httpClient.get("/users/profile");
      return true;
    } catch (error) {
      // Token invalide ou expiré
      return false;
    }
  }

  /**
   * Récupérer le token stocké localement
   * Responsabilité : Gestion du stockage des tokens
   */
  static getStoredToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Stocker le token d'authentification
   * Responsabilité : Persistance sécurisée des tokens
   */
  static storeToken(token: string): void {
    localStorage.setItem("token", token);
  }

  /**
   * Supprimer le token stocké
   * Responsabilité : Nettoyage sécurisé des tokens
   */
  static removeToken(): void {
    localStorage.removeItem("token");
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   * Responsabilité : Vérification de l'état d'authentification
   */
  static isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return token !== null && token.length > 0;
  }
}

// Exports nommés pour compatibilité avec l'API existante
export const registerUser = AuthService.register;
export const loginUser = AuthService.login;
export const logoutUser = AuthService.logout;