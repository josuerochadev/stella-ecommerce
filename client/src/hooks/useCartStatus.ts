// hooks/useCartStatus.ts
import { useEffect, useState } from "react";
import { getCart, addToCart } from "../services/api";
import type { CartItem } from "../types";

export const useCartStatus = (starid: number) => {
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkIfInCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const cart = await getCart();
        const isInCart = cart?.cartItems?.some((item: CartItem) => item.starId === starid);
        setInCart(!!isInCart);
      } catch (_err) {
        setError("Erreur de récupération du panier");
      }
    };

    if (starid) checkIfInCart();
  }, [starid]);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      if (typeof starid === "number") {
        await addToCart(starid, 1);
      } else {
        setError("Invalid star ID");
      }
      setInCart(true);
    } catch (err) {
      setError(`Erreur lors de l'ajout au panier: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return { inCart, loading, error, handleAddToCart };
};
