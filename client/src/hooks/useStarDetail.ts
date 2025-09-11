// client/src/hooks/useStarDetail.ts
import { useState, useEffect } from "react";
import { fetchStarById, fetchStars } from "../services/api";
import type { Star } from "../types";

export const useStarDetail = (id: number | undefined) => {
  const [star, setStar] = useState<Star | null>(null);
  const [relatedStars, setRelatedStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID de l'étoile manquant");
      setLoading(false);
      return;
    }

    const getStarDetail = async () => {
      try {
        setLoading(true);

        const starResponse = await fetchStarById(id);
        if (starResponse) {
          setStar(starResponse);
        } else {
          throw new Error("Erreur lors de la récupération des détails de l'étoile.");
        }

        const relatedStarsResponse = await fetchStars();
        if (relatedStarsResponse?.data) {
          const filteredStars = relatedStarsResponse.data.filter(
            (relatedStar: Star) => String(relatedStar.starid) !== String(id), // Convertir pour comparer correctement
          );
          setRelatedStars(filteredStars);
        } else {
          throw new Error("Erreur lors de la récupération des étoiles similaires.");
        }

        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des détails de l'étoile:", err);
        setError("Impossible de charger les détails de l'étoile pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    getStarDetail();
  }, [id]);

  return { star, relatedStars, loading, error };
};
