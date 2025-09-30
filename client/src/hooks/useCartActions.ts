// client/src/hooks/useCartActions.ts
// Responsabilité unique : Actions et logique métier du panier

import { useCallback } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logger } from "../utils/logger";

/**
 * Hook personnalisé pour les actions du panier
 * Responsabilité unique : Orchestration des actions utilisateur sur le panier
 */
export const useCartActions = () => {
  const { cartItems, loading, error, fetchCart, removeItem } = useCartStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * Supprimer un article du panier avec gestion d'erreur
   * Responsabilité : Action de suppression sécurisée
   */
  const handleRemoveFromCart = useCallback(async (cartItemId: number) => {
    try {
      await removeItem(cartItemId);
      return { success: true };
    } catch (error) {
      logger.error("Erreur lors de la suppression du panier:", error, "useCartActions");
      return {
        success: false,
        error: "Impossible de supprimer l'article du panier"
      };
    }
  }, [removeItem]);

  /**
   * Initialiser le panier (fetch si authentifié)
   * Responsabilité : Chargement initial du panier
   */
  const initializeCart = useCallback(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [fetchCart, isAuthenticated]);

  /**
   * Naviguer vers la page d'authentification
   * Responsabilité : Redirection pour l'authentification
   */
  const navigateToAuth = useCallback((mode: 'login' | 'register') => {
    navigate('/auth', {
      state: {
        from: '/cart',
        mode
      }
    });
  }, [navigate]);

  /**
   * Naviguer vers le catalogue
   * Responsabilité : Redirection vers le shopping
   */
  const navigateToCatalog = useCallback(() => {
    navigate('/catalog');
  }, [navigate]);

  /**
   * Naviguer vers le checkout
   * Responsabilité : Progression vers la commande
   */
  const navigateToCheckout = useCallback(() => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  }, [navigate, cartItems.length]);

  return {
    // État du panier
    cartItems,
    loading,
    error,
    isAuthenticated,

    // Actions
    handleRemoveFromCart,
    initializeCart,
    navigateToAuth,
    navigateToCatalog,
    navigateToCheckout,
  };
};