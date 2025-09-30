// client/src/hooks/useCatalogNavigation.ts
// Responsabilité unique : Gestion de la navigation URL pour le catalogue

import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Star } from '../types';

/**
 * Hook pour la gestion de la navigation dans le catalogue
 * Responsabilité unique : Synchronisation URL et navigation vers détails
 */
export const useCatalogNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";

  /**
   * Met à jour l'URL avec la requête de recherche
   * Responsabilité : Synchronisation état <-> URL
   */
  const updateSearchURL = useCallback((query: string) => {
    if (query) {
      navigate(`/catalog?q=${encodeURIComponent(query)}`, { replace: true });
    } else {
      navigate("/catalog", { replace: true });
    }
  }, [navigate]);

  /**
   * Navigation vers le détail d'une étoile
   * Responsabilité : Navigation vers page étoile
   */
  const navigateToStar = useCallback((star: Star) => {
    navigate(`/star/${star.starid}`);
  }, [navigate]);

  return {
    initialQuery,
    updateSearchURL,
    navigateToStar,
  };
};