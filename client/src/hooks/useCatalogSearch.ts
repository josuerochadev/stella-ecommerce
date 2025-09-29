// client/src/hooks/useCatalogSearch.ts
// Responsabilité unique : Logique de recherche et API du catalogue

import { useState, useCallback, useEffect } from 'react';
import { fetchStars, searchStars, filterStars } from '../services/api';
import { useLoadingState } from './useLoadingState';
import { debounce } from '../utils/debounce';
import type { Star } from '../types';
import type { SearchFilters } from './useCatalogFilters';

/**
 * Applique les filtres côté client aux résultats de recherche
 * Responsabilité unique : Logique de filtrage
 */
const applyFilters = (stars: Star[], filters: SearchFilters): Star[] => {
  let filtered = [...stars];

  // Filtre constellation
  if (filters.constellation.length > 0) {
    filtered = filtered.filter(star => filters.constellation.includes(star.constellation));
  }

  // Filtre prix
  if (filters.priceMin !== null) {
    filtered = filtered.filter(star => star.price >= filters.priceMin!);
  }
  if (filters.priceMax !== null) {
    filtered = filtered.filter(star => star.price <= filters.priceMax!);
  }

  // Filtre magnitude
  if (filters.magnitudeMin !== null) {
    filtered = filtered.filter(star => star.magnitude >= filters.magnitudeMin!);
  }
  if (filters.magnitudeMax !== null) {
    filtered = filtered.filter(star => star.magnitude <= filters.magnitudeMax!);
  }

  return filtered;
};

/**
 * Hook pour la logique de recherche du catalogue
 * Responsabilité unique : Orchestration des appels API et gestion des résultats
 */
export const useCatalogSearch = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [searchResults, setSearchResults] = useState<Star[]>([]);
  const [suggestions, setSuggestions] = useState<Star[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uniqueConstellations, setUniqueConstellations] = useState<string[]>([]);
  const [hasInitialSearched, setHasInitialSearched] = useState(false);

  const { isLoading, setLoading, setSuccess, setError } = useLoadingState({
    minLoadingTime: 300
  });

  /**
   * Recherche avec debouncing
   * Responsabilité : Orchestration recherche/filtrage avec gestion d'erreur
   */
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: SearchFilters) => {
      try {
        setLoading();

        if (!searchFilters.query.trim()) {
          // Pas de requête : utilise l'API de filtrage avancé
          const response = await filterStars({
            constellation: searchFilters.constellation.length > 0 ? searchFilters.constellation : undefined,
            minPrice: searchFilters.priceMin ?? undefined,
            maxPrice: searchFilters.priceMax ?? undefined,
            minMagnitude: searchFilters.magnitudeMin ?? undefined,
            maxMagnitude: searchFilters.magnitudeMax ?? undefined,
            sortBy: searchFilters.sortBy === "relevance" ? "name" :
                   searchFilters.sortBy === "distance" ? "distanceFromEarth" :
                   searchFilters.sortBy === "popularity" ? "magnitude" :
                   searchFilters.sortBy === "newest" ? "createdAt" :
                   searchFilters.sortBy,
            sortOrder: searchFilters.sortOrder.toUpperCase() as 'ASC' | 'DESC',
            limit: 100
          });
          setSearchResults(response.data);
        } else {
          // Recherche avec requête, puis filtrage côté client
          const searchResponse = await searchStars(searchFilters.query);
          const results = applyFilters(searchResponse, searchFilters);
          setSearchResults(results);
        }

        setSuccess();
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        setError();
        setSearchResults([]);
      }
    }, 300),
    [setLoading, setSuccess, setError]
  );

  /**
   * Suggestions avec debouncing
   * Responsabilité : Gestion des suggestions de recherche
   */
  const debouncedSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        try {
          const results = await searchStars(query);
          setSuggestions(results.slice(0, 5));
        } catch (error) {
          console.error("Erreur suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 150),
    []
  );

  /**
   * Chargement des données initiales
   * Responsabilité : Initialisation des étoiles et constellations
   */
  const loadInitialData = useCallback(async () => {
    try {
      const response = await fetchStars();
      setStars(response.data);

      // Extraction des constellations uniques
      const constellations = Array.from(
        new Set(response.data.map((star: Star) => star.constellation))
      ).sort();
      setUniqueConstellations(constellations);

      // Résultats initiaux
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erreur chargement initial:", error);
      setError();
    }
  }, [setError]);

  /**
   * Effectuer une recherche
   * Responsabilité : Interface publique pour déclencher une recherche
   */
  const performSearch = useCallback((filters: SearchFilters) => {
    debouncedSearch(filters);
  }, [debouncedSearch]);

  /**
   * Effectuer des suggestions
   * Responsabilité : Interface publique pour déclencher les suggestions
   */
  const performSuggestions = useCallback((query: string) => {
    debouncedSuggestions(query);
  }, [debouncedSuggestions]);

  /**
   * Marquer la recherche initiale comme effectuée
   */
  const markInitialSearchComplete = useCallback(() => {
    setHasInitialSearched(true);
  }, []);

  // Chargement initial au montage
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    // État
    stars,
    searchResults,
    suggestions,
    showSuggestions,
    uniqueConstellations,
    hasInitialSearched,
    isLoading,

    // Actions
    performSearch,
    performSuggestions,
    markInitialSearchComplete,
    setShowSuggestions,
  };
};