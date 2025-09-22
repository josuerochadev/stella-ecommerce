// client/src/hooks/useLatestStars.ts

import { useState, useEffect, useCallback } from "react";
import { fetchStars } from "../services/api";
import { useErrorHandler } from "./useErrorHandler";
import type { Star } from "../types/index";

export const useLatestStars = (limit = 6) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleError, formatError } = useErrorHandler();

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
      const apiError = handleError(err as Error);
      if (apiError) {
        setError(formatError(apiError));
      } else {
        setError("Une erreur inattendue est survenue");
      }
    } finally {
      setLoading(false);
    }
  }, [limit, handleError, formatError]);

  useEffect(() => {
    getStars();
  }, [getStars]);

  return { stars, loading, error, refetch: getStars };
};
