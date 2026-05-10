// client/src/pages/Catalog.tsx
// Responsabilité unique : Orchestrateur principal de la page catalogue

import CatalogAdvancedFilters from "@/components/CatalogAdvancedFilters";
import CatalogResultsGrid from "@/components/CatalogResultsGrid";
import CatalogSearchBar from "@/components/CatalogSearchBar";
import FadeInSection from "@/components/FadeInSection";
import SEO from "@/components/SEO";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { useCatalogNavigation } from "@/hooks/useCatalogNavigation";
import { useCatalogSearch } from "@/hooks/useCatalogSearch";
import { useCatalogSorting } from "@/hooks/useCatalogSorting";
import type { Star } from "@/types";
import { memo, useEffect } from "react";
import { Helmet } from "react-helmet-async";

/**
 * Page principale du catalogue
 * Responsabilité unique : Orchestration des composants et hooks du catalogue
 */
const Catalogue: React.FC = () => {
  // Navigation et URL
  const { initialFilters, updateFiltersURL, navigateToStar } = useCatalogNavigation();

  // Gestion des filtres
  const {
    filters,
    showAdvancedFilters,
    updateFilter,
    clearFilters,
    toggleConstellation,
    toggleAdvancedFilters,
    toggleSortOrder,
  } = useCatalogFilters({ initialFilters });

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

  // Synchronisation URL avec tous les filtres actifs
  // biome-ignore lint/correctness/useExhaustiveDependencies: individual filter fields listed to control re-run granularity
  useEffect(() => {
    updateFiltersURL(filters);
  }, [
    filters.query,
    filters.constellation,
    filters.priceMin,
    filters.priceMax,
    filters.magnitudeMin,
    filters.magnitudeMax,
    filters.sortBy,
    filters.sortOrder,
    updateFiltersURL,
  ]);

  // Recherche initiale au montage seulement
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — run once on mount
  useEffect(() => {
    if (!hasInitialSearched) {
      performSearch(filters);
      markInitialSearchComplete();
    }
  }, [hasInitialSearched, performSearch, markInitialSearchComplete]);

  // Recherche uniquement sur changement de filtres (après initialisation)
  // biome-ignore lint/correctness/useExhaustiveDependencies: individual filter fields listed to control re-run granularity
  useEffect(() => {
    if (hasInitialSearched) {
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
  ]);

  // Suggestions lors du changement de requête
  useEffect(() => {
    performSuggestions(filters.query);
  }, [filters.query, performSuggestions]);

  /**
   * Gestionnaires d'événements
   */
  const handleQueryChange = (query: string) => {
    updateFilter("query", query);
  };

  const handleSuggestionClick = (star: Star) => {
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
      <SEO
        title="Catalogue"
        description="Explorez notre catalogue d'etoiles. Filtrez par constellation, prix et magnitude."
        path="/catalog"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Catalogue d'étoiles — Stella",
            description:
              "Explorez notre catalogue d'étoiles personnalisables. Filtrez par constellation, prix et magnitude.",
            url: "https://stella-ecommerce.fr/catalog",
          })}
        </script>
      </Helmet>
      <FadeInSection>
        <section className="my-8">
          <div className="max-w-4xl mx-auto">
            {/* En-tête */}
            <div className="flex justify-center items-center mb-6">
              <h1 className="text-4xl font-display">Catalogue</h1>
              <span className="ml-4 text-lg font-serif text-text motion-safe:animate-pulse">
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
