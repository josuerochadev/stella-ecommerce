// client/src/components/FloatingActions.tsx
// Responsabilité unique : Boutons d'actions flottants (panier/wishlist)

import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { HeartIcon, ShoppingCartIcon } from "@/utils/icons";
import type React from "react";
import { memo } from "react";
import { Link, useLocation } from "react-router-dom";

const FloatingActions: React.FC = () => {
  const location = useLocation();
  const cartItemCount = useCartStore((state) => state.cartItems.length);
  const wishlistItemCount = useWishlistStore((state) => state.wishlistItems.length);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="absolute -top-16 right-4 flex space-x-2">
      <Link
        to="/cart"
        className={`
          relative touch-target bg-special text-primary rounded-full p-3 shadow-lg
          transition-transform duration-200 hover:scale-110
          ${isActive("/cart") ? "scale-110" : ""}
        `}
      >
        <ShoppingCartIcon size={20} />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {cartItemCount > 9 ? "9+" : cartItemCount}
          </span>
        )}
      </Link>

      <Link
        to="/wishlist"
        className={`
          relative touch-target bg-primary text-text rounded-full p-3 shadow-lg
          transition-transform duration-200 hover:scale-110
          ${isActive("/wishlist") ? "scale-110" : ""}
        `}
      >
        <HeartIcon size={20} />
        {wishlistItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-special text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {wishlistItemCount > 9 ? "9+" : wishlistItemCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default memo(FloatingActions);
