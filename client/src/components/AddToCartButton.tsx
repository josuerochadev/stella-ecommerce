// client/src/components/AddToCartButton.tsx

import { useAuth } from "@/context/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useCartStore } from "@/stores/useCartStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { ShoppingCartIcon } from "@/utils/icons";
import type React from "react";
import { memo } from "react";

interface AddToCartButtonProps {
  starId: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ starId }) => {
  const { isAuthenticated } = useAuth();
  const { redirectToLogin } = useAuthRedirect();

  const cartItems = useCartStore((state) => state.cartItems);
  const addItem = useCartStore((state) => state.addItem);

  const inCart = cartItems.some((item) => item.starId === starId);

  const loading = useCartStore((state) => state.loading);
  const error = useCartStore((state) => state.error);
  const { showSuccess } = useNotificationStore();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      redirectToLogin({
        from: "/cart",
        message: "Veuillez vous connecter pour ajouter des articles au panier.",
      });
      return;
    }

    try {
      await addItem(starId, 1);
      showSuccess("Ajouté au panier", "L'étoile a été ajoutée à votre panier.");
    } catch (_err) {
      // L'erreur est gérée par le store useCartStore
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        className={`btn ${inCart ? "bg-gray-500 cursor-not-allowed" : ""}`}
        disabled={loading || inCart}
        aria-live="polite"
        aria-label={inCart ? "Produit déjà ajouté au panier" : "Ajouter au panier"}
      >
        <ShoppingCartIcon className="text-xl" />
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </>
  );
};

export default memo(AddToCartButton);
