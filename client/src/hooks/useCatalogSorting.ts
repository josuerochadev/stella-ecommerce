// client/src/hooks/useCatalogSorting.ts
// Responsabilité unique : Logique de tri des résultats de catalogue

import { useMemo } from 'react';
import type { Star } from '../types';
import type { SearchFilters } from './useCatalogFilters';

/**
 * Hook pour le tri des résultats du catalogue
 * Responsabilité unique : Logique de tri avec différents critères
 */
export const useCatalogSorting = (searchResults: Star[], filters: SearchFilters) => {
  const sortedResults = useMemo(() => {
    let sorted = [...searchResults];

    switch (filters.sortBy) {
      case "price":
        sorted.sort((a, b) => filters.sortOrder === "asc" ? a.price - b.price : b.price - a.price);
        break;

      case "name":
        sorted.sort((a, b) => filters.sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        break;

      case "magnitude":
        sorted.sort((a, b) => filters.sortOrder === "asc" ? a.magnitude - b.magnitude : b.magnitude - a.magnitude);
        break;

      case "distance":
        sorted.sort((a, b) => filters.sortOrder === "asc" ? a.distanceFromEarth - b.distanceFromEarth : b.distanceFromEarth - a.distanceFromEarth);
        break;

      case "luminosity":
        sorted.sort((a, b) => filters.sortOrder === "asc" ? a.luminosity - b.luminosity : b.luminosity - a.luminosity);
        break;

      case "popularity":
        // Tri par luminosité (magnitude plus faible = plus visible = plus populaire)
        sorted.sort((a, b) => filters.sortOrder === "asc" ? a.magnitude - b.magnitude : b.magnitude - a.magnitude);
        break;

      case "newest":
        // Tri par date de création
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        break;

      default: // relevance
        // Conserver l'ordre original pour la pertinence (ordre API de recherche)
        break;
    }

    return sorted;
  }, [searchResults, filters.sortBy, filters.sortOrder]);

  return { sortedResults };
};