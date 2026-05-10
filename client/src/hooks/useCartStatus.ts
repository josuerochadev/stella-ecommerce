import { addToCart, getCart } from "@/services/api";
import type { CartItem } from "@/types";
// hooks/useCartStatus.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { useErrorHandler } from "./useErrorHandler";

/**
 * Hook that tracks whether a specific star is in the user's cart
 * and provides a handler to add it. Automatically checks cart status on mount.
 *
 * @param starid - The star ID to check/add
 * @returns {object} inCart (boolean), loading, error, handleAddToCart(), refetch()
 */
export const useCartStatus = (starid: number) => {
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError, formatError } = useErrorHandler();

  // Auth is now cookie-based; assume authenticated if we can fetch cart
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const checkIfInCart = useCallback(async () => {
    if (!isAuthenticated || !starid) return;

    try {
      const cart = await getCart();
      const isInCart = cart?.cartItems?.some((item: CartItem) => item.starId === starid);
      setInCart(!!isInCart);
      setError(null);
    } catch (err) {
      setIsAuthenticated(false);
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
    refetch: checkIfInCart,
  };
};
