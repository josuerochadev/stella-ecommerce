// client/src/hooks/useSearchLogic.ts
// Responsabilité unique : Logique métier de recherche et suggestions

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchStars } from "@/services/api";
import { sanitizeSearchQuery, detectInjectionAttempt } from "@/utils/security";
import { debounce } from "@/utils/debounce";
import { logger } from "@/utils/logger";
import type { Star } from "@/types";

/**
 * Hook personnalisé pour la logique de recherche
 * Responsabilité unique : Gestion des recherches et suggestions
 */
export const useSearchLogic = () => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<Star[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  /**
   * Recherche debounced avec sécurité
   * Responsabilité : Exécution sécurisée des recherches API
   */
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchStars(query);
        setSuggestions(results.slice(0, 8)); // Limite à 8 suggestions
        setShowSuggestions(results.length > 0);
      } catch (error) {
        logger.error('Erreur lors de la recherche:', error, 'useSearchLogic');
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  /**
   * Gérer les changements de saisie avec sécurité
   * Responsabilité : Validation et sanitisation des entrées
   */
  const handleSearchChange = useCallback((value: string) => {
    // Vérifier les tentatives d'injection
    if (detectInjectionAttempt(value)) {
      logger.warn('Tentative d\'injection détectée dans la recherche', value, 'useSearchLogic');
      return false; // Entrée refusée
    }

    const sanitizedValue = sanitizeSearchQuery(value);
    setSearchValue(sanitizedValue);
    debouncedSearch(sanitizedValue);
    return true; // Entrée acceptée
  }, [debouncedSearch]);

  /**
   * Naviguer vers une étoile spécifique
   * Responsabilité : Navigation vers détail d'étoile
   */
  const navigateToStar = useCallback((starId: number) => {
    navigate(`/star/${starId}`);
  }, [navigate]);

  /**
   * Effectuer une recherche complète
   * Responsabilité : Navigation vers page de résultats
   */
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    const sanitizedQuery = sanitizeSearchQuery(query.trim());
    navigate(`/catalog?q=${encodeURIComponent(sanitizedQuery)}`);
  }, [navigate]);

  /**
   * Réinitialiser la recherche
   * Responsabilité : Nettoyage de l'état de recherche
   */
  const clearSearch = useCallback(() => {
    setSearchValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  /**
   * Gérer le focus sur l'input
   * Responsabilité : Affichage des suggestions existantes
   */
  const handleFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  /**
   * Gérer la perte de focus
   * Responsabilité : Masquage des suggestions avec délai
   */
  const handleBlur = useCallback((e: React.FocusEvent) => {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => {
      // Vérifier que l'élément existe encore dans le DOM
      if (e.currentTarget && e.currentTarget.contains && document.activeElement) {
        if (!e.currentTarget.contains(document.activeElement)) {
          setShowSuggestions(false);
        }
      } else {
        // Si l'élément n'existe plus, masquer les suggestions
        setShowSuggestions(false);
      }
    }, 150);
  }, []);

  /**
   * Sélectionner une suggestion
   * Responsabilité : Action de sélection et navigation
   */
  const selectSuggestion = useCallback((index: number) => {
    if (suggestions[index]) {
      navigateToStar(suggestions[index].starid);
      clearSearch();
    }
  }, [suggestions, navigateToStar, clearSearch]);

  return {
    // État
    searchValue,
    suggestions,
    isLoading,
    showSuggestions,

    // Actions
    handleSearchChange,
    performSearch,
    clearSearch,
    selectSuggestion,
    handleFocus,
    handleBlur,

    // Contrôles des suggestions
    setSuggestions,
    setShowSuggestions,
  };
};