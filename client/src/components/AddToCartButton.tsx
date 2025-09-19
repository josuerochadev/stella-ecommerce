// client/src/components/AddToCartButton.tsx

import { useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useAuth } from "../context/AuthContext";
import { ShoppingCartIcon } from "../utils/icons";
import type React from "react";

interface AddToCartButtonProps {
  starId: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ starId }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.cartItems);
  const addItem = useCartStore((state) => state.addItem);

  const inCart = cartItems.some((item) => item.starId === starId);

  const loading = useCartStore((state) => state.loading);
  const error = useCartStore((state) => state.error);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: "/cart",
          message: "Veuillez vous connecter pour ajouter des articles au panier.",
        },
      });
      return;
    }

    try {
      await addItem(starId, 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        className={`btn mt-2 ${inCart ? "bg-gray-500 cursor-not-allowed" : ""}`}
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

export default AddToCartButton;
