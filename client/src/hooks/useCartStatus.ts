// hooks/useCartStatus.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import { getCart, addToCart } from "../services/api";
import { useErrorHandler } from "./useErrorHandler";
import type { CartItem } from "../types";

export const useCartStatus = (starid: number) => {
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError, formatError } = useErrorHandler();

  const isAuthenticated = useMemo(() => {
    return !!localStorage.getItem("token");
  }, []);

  const checkIfInCart = useCallback(async () => {
    if (!isAuthenticated || !starid) return;

    try {
      const cart = await getCart();
      const isInCart = cart?.cartItems?.some((item: CartItem) => item.starId === starid);
      setInCart(!!isInCart);
      setError(null);
    } catch (err) {
      const apiError = handleError(err as Error);
      if (apiError) {
        setError(formatError(apiError));
      }
    }
  }, [starid, isAuthenticated, handleError, formatError]);

  useEffect(() => {
    checkIfInCart();
  }, [checkIfInCart]);

  const handleAddToCart = useCallback(async () => {
    if (!starid || typeof starid !== "number") {
      setError("ID d'étoile invalide");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addToCart(starid, 1);
      setInCart(true);
    } catch (err) {
      const apiError = handleError(err as Error);
      if (apiError) {
        setError(formatError(apiError));
      }
    } finally {
      setLoading(false);
    }
  }, [starid, handleError, formatError]);

  return {
    inCart,
    loading,
    error,
    handleAddToCart,
    refetch: checkIfInCart
  };
};
