// client/src/services/authService.ts
// Responsabilité unique : Authentification des utilisateurs

import type { ApiResponse } from "@/types";
import { httpClient } from "./httpClient";

/**
 * Interface pour les données d'inscription
 */
export interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Interface pour les données de connexion
 */
export interface LoginUserData {
  email: string;
  password: string;
}

/**
 * Interface pour la réponse d'inscription
 */
export interface RegisterResponse {
  success: boolean;
  userId: number;
}

/**
 * Interface pour la réponse de connexion
 */
export interface LoginResponse {
  success: boolean;
  userId: number;
  role: string;
}

/**
 * Service d'authentification
 * Responsabilité unique : Gestion de l'authentification des utilisateurs
 */
async function register(userData: RegisterUserData): Promise<RegisterResponse> {
  const response = await httpClient.post<RegisterResponse>("/auth/register", userData);
  return response.data;
}

async function login(loginData: LoginUserData): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>("/auth/login", loginData);
  return response.data;
}

async function logout(): Promise<ApiResponse<null>> {
  const response = await httpClient.post<ApiResponse<null>>("/auth/logout");
  return response.data;
}

async function validateToken(): Promise<boolean> {
  try {
    await httpClient.get("/users/profile");
    return true;
  } catch {
    return false;
  }
}

export const AuthService = { register, login, logout, validateToken };

// Exports nommes pour compatibilite avec l'API existante
export const registerUser = register;
export const loginUser = login;
export const logoutUser = logout;
