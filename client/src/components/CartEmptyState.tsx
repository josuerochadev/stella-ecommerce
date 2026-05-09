// client/src/components/CartEmptyState.tsx
// Responsabilité unique : Affichage des états vides du panier

import type React from "react";
import { Link } from "react-router-dom";

interface CartEmptyStateProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

/**
 * Composant d'état vide du panier
 * Responsabilité unique : Affichage des différents états vides
 */
const CartEmptyState: React.FC<CartEmptyStateProps> = ({
  isAuthenticated,
  onLoginClick,
  onRegisterClick,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-lg mb-6 font-serif">
          Vous n'êtes pas connecté. Connectez-vous ou inscrivez-vous pour commencer à ajouter des
          étoiles à votre panier !
        </p>
        <div className="flex justify-center space-x-4">
          <button type="button" onClick={onLoginClick} className="btn">
            Se connecter
          </button>
          <button type="button" onClick={onRegisterClick} className="btn">
            S'inscrire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-20 px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
      <p className="text-lg mb-6 font-serif">
        Votre panier est actuellement vide. Parcourez notre catalogue pour ajouter des étoiles à
        votre panier !
      </p>
      <Link to="/catalog" className="btn">
        Parcourir le catalogue
      </Link>
    </div>
  );
};

export default CartEmptyState;
