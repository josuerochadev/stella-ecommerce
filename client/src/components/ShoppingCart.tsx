// client/src/components/ShoppingCart.tsx
// Responsabilité unique : Orchestrateur et affichage principal du panier

import { useEffect, memo } from "react";
import { useCartActions } from "../hooks/useCartActions";
import { CartCalculations } from "../utils/cartCalculations";
import CartEmptyState from "./CartEmptyState";
import CartItemsList from "./CartItemsList";
import CartSummary from "./CartSummary";

/**
 * Composant principal du panier d'achat
 * Responsabilité unique : Orchestration de l'affichage du panier
 */
const ShoppingCart: React.FC = () => {
  const {
    cartItems,
    loading,
    error,
    isAuthenticated,
    handleRemoveFromCart,
    initializeCart,
    navigateToAuth,
    navigateToCheckout,
  } = useCartActions();

  // Initialiser le panier au chargement
  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <p>Chargement du panier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // États vides du panier
  if (!isAuthenticated || CartCalculations.isEmpty(cartItems)) {
    return (
      <CartEmptyState
        isAuthenticated={isAuthenticated}
        onLoginClick={() => navigateToAuth('login')}
        onRegisterClick={() => navigateToAuth('register')}
      />
    );
  }

  // Panier avec articles
  return (
    <div className="container mx-auto pt-20 px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-text">Votre Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2">
          <CartItemsList
            cartItems={cartItems}
            onRemoveItem={handleRemoveFromCart}
          />
        </div>

        {/* Résumé du panier */}
        <div className="lg:col-span-1">
          <CartSummary
            cartItems={cartItems}
            onCheckout={navigateToCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ShoppingCart);
