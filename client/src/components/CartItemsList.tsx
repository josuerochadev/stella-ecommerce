// client/src/components/CartItemsList.tsx
// Responsabilité unique : Affichage de la liste des articles du panier

import React from "react";
import { logger } from "@/utils/logger";
import StarCard from "./StarCard";
import type { CartItem } from "@/types";

interface CartItemsListProps {
  cartItems: CartItem[];
  onRemoveItem: (cartItemId: number) => Promise<{ success: boolean; error?: string }>;
  onUpdateQuantity?: (cartItemId: number, quantity: number) => void;
}

/**
 * Composant de liste des articles du panier
 * Responsabilité unique : Rendu de la liste des articles
 */
const CartItemsList: React.FC<CartItemsListProps> = ({ cartItems, onRemoveItem, onUpdateQuantity }) => {
  const handleRemove = async (cartItemId: number) => {
    const result = await onRemoveItem(cartItemId);
    if (!result.success && result.error) {
      // En production, afficher une notification toast
      logger.error(result.error, undefined, "CartItemsList");
    }
  };

  return (
    <div>
      {cartItems.map((item) => (
        item.Star && (
          <StarCard
            key={item.id}
            star={item.Star}
            quantity={item.quantity}
            context="cart"
            onRemove={() => handleRemove(item.id)}
            onUpdateQuantity={onUpdateQuantity ? (qty: number) => onUpdateQuantity(item.id, qty) : undefined}
          />
        )
      ))}
    </div>
  );
};

export default CartItemsList;