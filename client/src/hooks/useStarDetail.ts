import { fetchStars, getStarById } from "@/services/api";
import type { Star } from "@/types";
import { logger } from "@/utils/logger";
// client/src/hooks/useStarDetail.ts
import { useCallback, useEffect, useMemo, useState } from "react";

export const useStarDetail = (id: number | undefined) => {
  const [star, setStar] = useState<Star | null>(null);
  const [relatedStars, setRelatedStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isValidId = useMemo(() => {
    return id !== undefined && !Number.isNaN(id) && id > 0;
  }, [id]);

  const getStarDetail = useCallback(async () => {
    if (!isValidId) {
      setError("ID de l'étoile manquant ou invalide");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer les détails de l'étoile et toutes les étoiles en parallèle
      const [starResponse, allStarsResponse] = await Promise.all([
        getStarById(id as number),
        fetchStars(),
      ]);

      if (!starResponse) {
        throw new Error("Étoile non trouvée");
      }

      setStar(starResponse);

      if (allStarsResponse?.data) {
        const filteredStars = allStarsResponse.data.filter(
          (relatedStar: Star) => relatedStar.starid !== id,
        );
        setRelatedStars(filteredStars);
      }
    } catch (err) {
      logger.error("Erreur lors du chargement des détails de l'étoile", err, "useStarDetail");
      setError("Impossible de charger les détails de l'étoile");
    } finally {
      setLoading(false);
    }
  }, [id, isValidId]);

  useEffect(() => {
    getStarDetail();
  }, [getStarDetail]);

  return {
    star,
    relatedStars,
    loading,
    error,
    refetch: getStarDetail,
    isValidId,
  };
};
