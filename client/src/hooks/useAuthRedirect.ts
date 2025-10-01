// client/src/hooks/useAuthRedirect.ts
// Responsabilité unique : Gestion centralisée des redirections d'authentification

import { useCallback } from "react";
import { useNavigate, type NavigateOptions } from "react-router-dom";

/**
 * Options pour la redirection d'authentification
 */
interface AuthRedirectOptions {
  /** Mode d'authentification (login ou register) */
  mode?: 'login' | 'register';
  /** URL de provenance pour la redirection après connexion */
  from?: string;
  /** Message optionnel à afficher sur la page d'auth */
  message?: string;
}

/**
 * Hook personnalisé pour gérer les redirections vers la page d'authentification
 * Responsabilité : Centralisation de la logique de navigation vers /auth
 *
 * @returns Fonctions de navigation vers l'authentification
 *
 * @example
 * const { redirectToLogin, redirectToRegister, redirectToAuth } = useAuthRedirect();
 *
 * // Redirection simple vers login
 * redirectToLogin();
 *
 * // Redirection vers login avec message
 * redirectToLogin({ message: "Veuillez vous connecter" });
 *
 * // Redirection vers register depuis une page spécifique
 * redirectToRegister({ from: "/cart" });
 *
 * // Redirection personnalisée
 * redirectToAuth({ mode: "login", from: "/wishlist", message: "Connexion requise" });
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();

  /**
   * Redirection vers la page d'authentification
   * @param options - Options de redirection
   */
  const redirectToAuth = useCallback((options: AuthRedirectOptions = {}) => {
    const { mode, from, message } = options;

    const navigateOptions: NavigateOptions = {
      state: {
        ...(mode && { mode }),
        ...(from && { from }),
        ...(message && { message })
      }
    };

    navigate("/auth", navigateOptions);
  }, [navigate]);

  /**
   * Redirection vers la page de connexion
   * @param options - Options de redirection (sans mode, toujours 'login')
   */
  const redirectToLogin = useCallback((options: Omit<AuthRedirectOptions, 'mode'> = {}) => {
    redirectToAuth({ ...options, mode: 'login' });
  }, [redirectToAuth]);

  /**
   * Redirection vers la page d'inscription
   * @param options - Options de redirection (sans mode, toujours 'register')
   */
  const redirectToRegister = useCallback((options: Omit<AuthRedirectOptions, 'mode'> = {}) => {
    redirectToAuth({ ...options, mode: 'register' });
  }, [redirectToAuth]);

  return {
    redirectToAuth,
    redirectToLogin,
    redirectToRegister
  };
};