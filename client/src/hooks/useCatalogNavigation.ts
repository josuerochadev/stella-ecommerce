// client/src/hooks/useCatalogNavigation.ts
// Responsabilité unique : Gestion de la navigation URL pour le catalogue

import type { Star } from "@/types";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SearchFilters } from "./useCatalogFilters";

/**
 * Lit tous les filtres actifs depuis les query params de l'URL.
 */
export const parseFiltersFromURL = (search: string): Partial<SearchFilters> => {
  const params = new URLSearchParams(search);

  const constellation = params.get("constellation");
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder");

  return {
    query: params.get("q") ?? "",
    constellation: constellation ? constellation.split(",").filter(Boolean) : [],
    priceMin: params.has("priceMin") ? Number(params.get("priceMin")) : null,
    priceMax: params.has("priceMax") ? Number(params.get("priceMax")) : null,
    magnitudeMin: params.has("magMin") ? Number(params.get("magMin")) : null,
    magnitudeMax: params.has("magMax") ? Number(params.get("magMax")) : null,
    sortBy: (sortBy as SearchFilters["sortBy"]) ?? "relevance",
    sortOrder: (sortOrder as SearchFilters["sortOrder"]) ?? "asc",
  };
};

/**
 * Hook pour la gestion de la navigation dans le catalogue
 * Responsabilité unique : Synchronisation URL et navigation vers détails
 */
export const useCatalogNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialFilters = parseFiltersFromURL(location.search);

  /**
   * Met à jour l'URL avec l'ensemble des filtres actifs.
   * Les filtres à valeur par défaut sont omis pour garder l'URL propre.
   */
  const updateFiltersURL = useCallback(
    (filters: SearchFilters) => {
      const params = new URLSearchParams();

      if (filters.query) params.set("q", filters.query);
      if (filters.constellation.length > 0)
        params.set("constellation", filters.constellation.join(","));
      if (filters.priceMin !== null) params.set("priceMin", String(filters.priceMin));
      if (filters.priceMax !== null) params.set("priceMax", String(filters.priceMax));
      if (filters.magnitudeMin !== null) params.set("magMin", String(filters.magnitudeMin));
      if (filters.magnitudeMax !== null) params.set("magMax", String(filters.magnitudeMax));
      if (filters.sortBy && filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy);
      if (filters.sortOrder && filters.sortOrder !== "asc")
        params.set("sortOrder", filters.sortOrder);

      const queryString = params.toString();
      navigate(queryString ? `/catalog?${queryString}` : "/catalog", { replace: true });
    },
    [navigate],
  );

  /**
   * Navigation vers le détail d'une étoile
   * Responsabilité : Navigation vers page étoile
   */
  const navigateToStar = useCallback(
    (star: Star) => {
      navigate(`/star/${star.starid}`);
    },
    [navigate],
  );

  return {
    initialFilters,
    updateFiltersURL,
    navigateToStar,
  };
};
