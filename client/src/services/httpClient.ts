// client/src/services/httpClient.ts
// Responsabilité unique : Configuration HTTP et interceptors Axios

import axios from "axios";
import type { AxiosInstance } from "axios";

/**
 * Utilitaire pour lire un cookie par son nom
 * Responsabilité : Lecture sécurisée des cookies
 */
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

/**
 * Configuration de l'instance Axios centralisée
 * Responsabilité unique : Configuration HTTP globale
 */
const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Permet l'envoi de cookies
  });

  // Interceptor pour ajouter les tokens d'authentification et CSRF
  client.interceptors.request.use(
    (config) => {
      // Ajouter le token CSRF depuis les cookies
      const csrfToken = getCookie("XSRF-TOKEN");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }

      // Ajouter le token d'authentification si présent
      const authToken = localStorage.getItem("token");
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Interceptor de réponse pour gestion globale des erreurs
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Gestion globale des erreurs d'authentification
      if (error.response?.status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }

      return Promise.reject(error);
    },
  );

  return client;
};

/**
 * Instance HTTP client singleton
 * Export par défaut pour utilisation dans les services
 */
export const httpClient = createHttpClient();

/**
 * Factory pour créer un nouveau client HTTP si nécessaire
 * Utile pour les tests ou configurations spéciales
 */
export const createNewHttpClient = createHttpClient;

/**
 * Utilitaires de cookies réexportés pour les services
 */
export { getCookie };