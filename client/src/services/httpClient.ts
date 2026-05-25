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
 * Flag indiquant si l'utilisateur est authentifié.
 * Utilisé pour ne déclencher auth:unauthorized que lors d'une expiration de session,
 * pas lors des vérifications de session initiales.
 */
let _isUserAuthenticated = false;
export const setUserAuthenticated = (val: boolean) => {
  _isUserAuthenticated = val;
};

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

  // Interceptor pour ajouter le token CSRF
  // Note: access token is sent automatically via httpOnly cookie (withCredentials: true)
  client.interceptors.request.use(
    (config) => {
      // Ajouter le token CSRF depuis les cookies
      const csrfToken = getCookie("XSRF-TOKEN");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Flag pour éviter les boucles de refresh
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: unknown | null) => {
    for (const prom of failedQueue) {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    }
    failedQueue = [];
  };

  // Interceptor de réponse pour gestion globale des erreurs
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Si 401 et pas déjà un retry, tenter un refresh du token
      if (
        error.response?.status === 401 &&
        _isUserAuthenticated &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/refresh")
      ) {
        if (isRefreshing) {
          // Attendre que le refresh en cours se termine
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => client(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await client.post("/auth/refresh");
          processQueue(null);
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          // Refresh échoué — session expirée
          window.dispatchEvent(
            new CustomEvent("auth:unauthorized", {
              detail: { redirectTo: "/auth" },
            }),
          );
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 401 sans auth préalable (vérification initiale)
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
 * Creates an AbortController-backed cancel token for API calls.
 * Use with httpClient requests to cancel them on component unmount.
 *
 * @example
 * const { signal, cancel } = createCancelToken();
 * httpClient.get("/stars", { signal });
 * // on cleanup:
 * cancel();
 */
export const createCancelToken = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
  };
};

/**
 * Utilitaires de cookies réexportés pour les services
 */
export { getCookie };
