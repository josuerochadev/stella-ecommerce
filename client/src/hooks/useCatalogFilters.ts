// client/src/hooks/useCatalogFilters.ts
// Responsabilité unique : Gestion de l'état et logique des filtres du catalogue

import { useState, useCallback } from 'react';

export interface SearchFilters {
  query: string;
  constellation: string[];
  priceMin: number | null;
  priceMax: number | null;
  magnitudeMin: number | null;
  magnitudeMax: number | null;
  sortBy: "relevance" | "price" | "name" | "magnitude" | "distance" | "luminosity" | "popularity" | "newest";
  sortOrder: "asc" | "desc";
}

export interface UseCatalogFiltersOptions {
  initialQuery?: string;
}

/**
 * Hook pour la gestion des filtres du catalogue
 * Responsabilité unique : État et mutations des filtres
 */
export const useCatalogFilters = ({ initialQuery = '' }: UseCatalogFiltersOptions = {}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    constellation: [],
    priceMin: null,
    priceMax: null,
    magnitudeMin: null,
    magnitudeMax: null,
    sortBy: "relevance",
    sortOrder: "asc"
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  /**
   * Mise à jour d'un filtre spécifique
   * Responsabilité : Mutation d'état typée
   */
  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Réinitialisation de tous les filtres
   * Responsabilité : État par défaut
   */
  const clearFilters = useCallback(() => {
    setFilters({
      query: "",
      constellation: [],
      priceMin: null,
      priceMax: null,
      magnitudeMin: null,
      magnitudeMax: null,
      sortBy: "relevance",
      sortOrder: "asc"
    });
  }, []);

  /**
   * Toggle d'une constellation
   * Responsabilité : Logique de sélection multiple
   */
  const toggleConstellation = useCallback((constellation: string) => {
    const current = filters.constellation;
    const updated = current.includes(constellation)
      ? current.filter(c => c !== constellation)
      : [...current, constellation];
    updateFilter("constellation", updated);
  }, [filters.constellation, updateFilter]);

  /**
   * Toggle des filtres avancés
   */
  const toggleAdvancedFilters = useCallback(() => {
    setShowAdvancedFilters(prev => !prev);
  }, []);

  /**
   * Inversion de l'ordre de tri
   * Responsabilité : Logique de tri
   */
  const toggleSortOrder = useCallback(() => {
    updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
  }, [filters.sortOrder, updateFilter]);

  return {
    filters,
    showAdvancedFilters,
    updateFilter,
    clearFilters,
    toggleConstellation,
    toggleAdvancedFilters,
    toggleSortOrder,
  };
};