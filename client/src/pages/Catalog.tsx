// client/src/pages/Catalog.tsx
// Responsabilité unique : Orchestrateur principal de la page catalogue

import { useEffect, memo } from "react";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import { useCatalogSearch } from "../hooks/useCatalogSearch";
import { useCatalogSorting } from "../hooks/useCatalogSorting";
import { useCatalogNavigation } from "../hooks/useCatalogNavigation";
import CatalogSearchBar from "../components/CatalogSearchBar";
import CatalogAdvancedFilters from "../components/CatalogAdvancedFilters";
import CatalogResultsGrid from "../components/CatalogResultsGrid";
import FadeInSection from "../components/FadeInSection";

/**
 * Page principale du catalogue
 * Responsabilité unique : Orchestration des composants et hooks du catalogue
 */
const Catalogue: React.FC = () => {
  // Navigation et URL
  const { initialQuery, updateSearchURL, navigateToStar } = useCatalogNavigation();

  // Gestion des filtres
  const {
    filters,
    showAdvancedFilters,
    updateFilter,
    clearFilters,
    toggleConstellation,
    toggleAdvancedFilters,
    toggleSortOrder,
  } = useCatalogFilters({ initialQuery });

  // Logique de recherche et données
  const {
    searchResults,
    suggestions,
    showSuggestions,
    uniqueConstellations,
    hasInitialSearched,
    isLoading,
    performSearch,
    performSuggestions,
    markInitialSearchComplete,
    setShowSuggestions,
  } = useCatalogSearch();

  // Tri des résultats
  const { sortedResults } = useCatalogSorting(searchResults, filters);

  // Synchronisation URL avec query
  useEffect(() => {
    updateSearchURL(filters.query);
  }, [filters.query, updateSearchURL]);

  // Recherche initiale et mise à jour sur changement de filtres
  useEffect(() => {
    if (!hasInitialSearched) {
      performSearch(filters);
      markInitialSearchComplete();
    } else {
      performSearch(filters);
    }
  }, [
    filters.query,
    filters.constellation,
    filters.priceMin,
    filters.priceMax,
    filters.magnitudeMin,
    filters.magnitudeMax,
    filters.sortBy,
    filters.sortOrder,
    hasInitialSearched,
    performSearch,
    markInitialSearchComplete
  ]);

  // Suggestions lors du changement de requête
  useEffect(() => {
    if (filters.query !== initialQuery) {
      performSuggestions(filters.query);
    }
  }, [filters.query, initialQuery, performSuggestions]);

  /**
   * Gestionnaires d'événements
   */
  const handleQueryChange = (query: string) => {
    updateFilter("query", query);
  };

  const handleSuggestionClick = (star: any) => {
    navigateToStar(star);
    setShowSuggestions(false);
  };

  const handleSuggestionFocus = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionBlur = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="container mx-auto pt-12 px-4">
      <FadeInSection>
        <section className="my-8">
          <div className="max-w-4xl mx-auto">
            {/* En-tête */}
            <div className="flex justify-center items-center mb-6">
              <h1 className="text-4xl font-display">Catalogue</h1>
              <span className="ml-4 text-lg font-serif text-text animate-pulse">
                Illuminez votre vie
              </span>
            </div>

            {/* Barre de recherche */}
            <CatalogSearchBar
              query={filters.query}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              showAdvancedFilters={showAdvancedFilters}
              onQueryChange={handleQueryChange}
              onSuggestionFocus={handleSuggestionFocus}
              onSuggestionBlur={handleSuggestionBlur}
              onSuggestionClick={handleSuggestionClick}
              onToggleAdvancedFilters={toggleAdvancedFilters}
            />

            {/* Filtres avancés */}
            <CatalogAdvancedFilters
              isVisible={showAdvancedFilters}
              filters={filters}
              uniqueConstellations={uniqueConstellations}
              resultsCount={sortedResults.length}
              onUpdateFilter={updateFilter}
              onToggleConstellation={toggleConstellation}
              onToggleSortOrder={toggleSortOrder}
              onClearFilters={clearFilters}
            />

            {/* Grille de résultats */}
            <CatalogResultsGrid
              stars={sortedResults}
              query={filters.query}
              isLoading={isLoading}
              onClearFilters={clearFilters}
            />
          </div>
        </section>
      </FadeInSection>
    </div>
  );
};

export default memo(Catalogue);
