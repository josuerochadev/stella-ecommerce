// client/src/components/CartSummary.tsx
// Responsabilité unique : Affichage du résumé et total du panier

import React from "react";
import { CartCalculations } from "../utils/cartCalculations";
import type { CartItem } from "../types";

interface CartSummaryProps {
  cartItems: CartItem[];
  onCheckout?: () => void;
}

/**
 * Composant de résumé du panier
 * Responsabilité unique : Affichage du total et boutons d'action
 */
const CartSummary: React.FC<CartSummaryProps> = ({ cartItems, onCheckout }) => {
  const stats = CartCalculations.getCartStats(cartItems);

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Articles ({stats.totalItems})</span>
          <span>{CartCalculations.formatPrice(stats.totalAmount)}</span>
        </div>

        {stats.totalItems > 1 && (
          <div className="flex justify-between text-sm text-gray-500">
            <span>Prix moyen par article</span>
            <span>{CartCalculations.formatPrice(stats.averageItemPrice)}</span>
          </div>
        )}
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>{stats.formattedTotal}</span>
      </div>

      {onCheckout && stats.totalItems > 0 && (
        <button
          onClick={onCheckout}
          className="w-full mt-4 btn btn-primary"
        >
          Procéder au paiement
        </button>
      )}
    </div>
  );
};

export default CartSummary;