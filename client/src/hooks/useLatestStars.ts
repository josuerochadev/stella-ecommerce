// client/src/hooks/useLatestStars.ts

import { useState, useEffect, useCallback } from "react";
import { fetchStars } from "../services/api";
import { useErrorHandler } from "./useErrorHandler";
import type { Star } from "../types/index";

export const useLatestStars = (limit = 6) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleError } = useErrorHandler();
  const [hasLoaded, setHasLoaded] = useState(false);

  const getStars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchStars();

      if (Array.isArray(response.data)) {
        setStars(response.data.slice(0, limit));
      } else if (Array.isArray(response)) {
        setStars(response.slice(0, limit));
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inattendue est survenue";
      setError(errorMessage);
      handleError(err as Error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [limit, handleError]);

  // Charger seulement une fois au montage du composant
  useEffect(() => {
    if (!hasLoaded) {
      getStars();
    }
  }, [hasLoaded, getStars]); // Ajouter getStars pour respecter les dépendances exhaustives

  return { stars, loading, error, refetch: getStars };
};
