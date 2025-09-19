// client/src/pages/Catalog.tsx

import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StarCard from "../components/StarCard";
import { fetchStars, searchStars, filterStars } from "../services/api";
import type { Star } from "../types";
import { ArrowUpIcon, ArrowDownIcon, SearchIcon, TimesIcon } from "../utils/icons";
import FadeInSection from "../components/FadeInSection";
import { SkeletonGrid } from "../components/Skeleton";
import { useLoadingState } from "../hooks/useLoadingState";

interface SearchFilters {
  query: string;
  constellation: string[];
  priceMin: number | null;
  priceMax: number | null;
  magnitudeMin: number | null;
  magnitudeMax: number | null;
  sortBy: "relevance" | "price" | "name" | "magnitude" | "distance" | "luminosity" | "popularity" | "newest";
  sortOrder: "asc" | "desc";
}

const Catalogue: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("q") || "";

  const [stars, setStars] = useState<Star[]>([]);
  const [searchResults, setSearchResults] = useState<Star[]>([]);
  const [suggestions, setSuggestions] = useState<Star[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [uniqueConstellations, setUniqueConstellations] = useState<string[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  const [filterHeight, setFilterHeight] = useState<number>(0);

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

  const { isLoading, setLoading, setSuccess, setError } = useLoadingState({
    minLoadingTime: 300
  });

  // Debounced search function with advanced filtering
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: SearchFilters) => {
      try {
        setLoading();

        if (!searchFilters.query.trim()) {
          // If no query, use advanced filter API with all filters
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
          // Search with query, then apply filters client-side
          const searchResponse = await searchStars(searchFilters.query);
          let results = searchResponse;

          // Apply additional filters client-side for search results
          results = applyFilters(results, searchFilters);

          setSearchResults(results);
        }

        setSuccess();
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        setError();
        setSearchResults([]);
      }
    }, 300),
    []
  );

  // Debounced suggestions
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

  // Load all stars and constellations on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetchStars();
        setStars(response.data);

        // Extract unique constellations
        const constellations = Array.from(
          new Set(response.data.map((star: Star) => star.constellation))
        ).sort();
        setUniqueConstellations(constellations);

        // Perform initial search if query exists
        if (initialQuery) {
          debouncedSearch(filters);
        } else {
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error("Erreur chargement initial:", error);
        setError();
      }
    };

    loadInitialData();
  }, []);

  // Search when filters change
  useEffect(() => {
    debouncedSearch(filters);
  }, [filters, debouncedSearch]);

  // Update suggestions when query changes
  useEffect(() => {
    if (filters.query !== initialQuery) {
      debouncedSuggestions(filters.query);
    }
  }, [filters.query, debouncedSuggestions, initialQuery]);

  // Update URL when search query changes
  useEffect(() => {
    if (filters.query) {
      navigate(`/catalog?q=${encodeURIComponent(filters.query)}`, { replace: true });
    } else {
      navigate("/catalog", { replace: true });
    }
  }, [filters.query, navigate]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
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
  };

  const handleSuggestionClick = (star: Star) => {
    navigate(`/star/${star.starid}`);
    setShowSuggestions(false);
  };

  const toggleConstellation = (constellation: string) => {
    const current = filters.constellation;
    const updated = current.includes(constellation)
      ? current.filter(c => c !== constellation)
      : [...current, constellation];
    updateFilter("constellation", updated);
  };

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
        // Sort by brightness (lower magnitude = more visible = more popular)
        sorted.sort((a, b) => filters.sortOrder === "asc" ? a.magnitude - b.magnitude : b.magnitude - a.magnitude);
        break;
      case "newest":
        // Sort by creation date
        sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        break;
      default: // relevance
        // Keep original order for relevance (search API order)
        break;
    }

    return sorted;
  }, [searchResults, filters.sortBy, filters.sortOrder]);


  useEffect(() => {
    const filterSection = document.querySelector("#filter-section") as HTMLElement | null;

    const handleScroll = () => {
      if (!filterSection) return;

      const topPosition = filterSection.getBoundingClientRect().top || 0;
      if (topPosition <= 0 && !isSticky) {
        setIsSticky(true);
        setFilterHeight(filterSection.offsetHeight);
      } else if (window.scrollY < (filterSection.offsetTop || 0)) {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSticky]);

  return (
    <div className="container mx-auto pt-12 px-4">
      <section className="my-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-4xl font-display">Catalogue</h1>
            <span className="ml-4 text-lg font-serif text-text animate-pulse">
              Illuminez votre vie
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => updateFilter("query", e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Rechercher des étoiles par nom, constellation..."
                  className="w-full p-4 pr-12 text-lg rounded-l-lg border-2 border-primary focus:outline-none focus:border-special bg-secondary text-text"
                />
                <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text" size={20} />

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-secondary border-2 border-t-0 border-primary rounded-b-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {suggestions.map((star) => (
                      <div
                        key={star.starid}
                        onClick={() => handleSuggestionClick(star)}
                        className="p-3 hover:bg-primary cursor-pointer flex justify-between items-center"
                      >
                        <span className="text-text">{star.name}</span>
                        <span className="text-sm text-text opacity-70">{star.constellation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-6 rounded-r-lg border-2 border-l-0 border-primary ${
                  showAdvancedFilters ? "bg-special text-primary" : "bg-primary text-text"
                } hover:bg-special hover:text-primary transition-colors`}
              >
                Filtres Avancés
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="bg-primary rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Prix (€)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin || ""}
                      onChange={(e) => updateFilter("priceMin", e.target.value ? Number(e.target.value) : null)}
                      className="w-full p-2 rounded bg-secondary text-text"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax || ""}
                      onChange={(e) => updateFilter("priceMax", e.target.value ? Number(e.target.value) : null)}
                      className="w-full p-2 rounded bg-secondary text-text"
                    />
                  </div>
                </div>

                {/* Magnitude Range */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Magnitude</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Min"
                      value={filters.magnitudeMin || ""}
                      onChange={(e) => updateFilter("magnitudeMin", e.target.value ? Number(e.target.value) : null)}
                      className="w-full p-2 rounded bg-secondary text-text"
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Max"
                      value={filters.magnitudeMax || ""}
                      onChange={(e) => updateFilter("magnitudeMax", e.target.value ? Number(e.target.value) : null)}
                      className="w-full p-2 rounded bg-secondary text-text"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Trier par</label>
                  <div className="flex space-x-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => updateFilter("sortBy", e.target.value)}
                      className="flex-1 p-2 rounded bg-secondary text-text"
                    >
                      <option value="relevance">Pertinence</option>
                      <option value="name">Nom</option>
                      <option value="price">Prix</option>
                      <option value="magnitude">Magnitude</option>
                      <option value="distance">Distance</option>
                      <option value="luminosity">Luminosité</option>
                      <option value="popularity">Popularité</option>
                      <option value="newest">Nouveauté</option>
                    </select>
                    <button
                      onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
                      className="p-2 bg-secondary text-text rounded hover:bg-special hover:text-primary"
                    >
                      {filters.sortOrder === "asc" ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Constellation Filter */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-text mb-2">Constellations</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                  {uniqueConstellations.map((constellation) => (
                    <label key={constellation} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.constellation.includes(constellation)}
                        onChange={() => toggleConstellation(constellation)}
                        className="rounded text-special"
                      />
                      <span className="text-sm text-text">{constellation}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-text">
                  {sortedResults.length} résultat{sortedResults.length !== 1 ? "s" : ""} trouvé{sortedResults.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary text-text rounded hover:bg-special hover:text-primary transition-colors"
                >
                  <TimesIcon size={16} />
                  <span>Effacer les filtres</span>
                </button>
              </div>
            </div>
          )}


          {/* Search Results */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display">
                {filters.query ? `Résultats pour "${filters.query}"` : "Toutes les étoiles"}
              </h2>
              <span className="text-text">
                {sortedResults.length} étoile{sortedResults.length !== 1 ? "s" : ""}
              </span>
            </div>

            {isLoading ? (
              <SkeletonGrid count={8} columns={4} />
            ) : sortedResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedResults.map((star) => (
                  <StarCard key={star.starid} star={star} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon size={48} className="mx-auto mb-4 text-text opacity-50" />
                <h3 className="text-xl font-display mb-2">Aucun résultat trouvé</h3>
                <p className="text-text opacity-70 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={clearFilters}
                  className="btn"
                >
                  Réinitialiser la recherche
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// Apply filters to search results
function applyFilters(stars: Star[], filters: SearchFilters): Star[] {
  let filtered = [...stars];

  // Constellation filter
  if (filters.constellation.length > 0) {
    filtered = filtered.filter(star => filters.constellation.includes(star.constellation));
  }

  // Price range filter
  if (filters.priceMin !== null) {
    filtered = filtered.filter(star => star.price >= filters.priceMin!);
  }
  if (filters.priceMax !== null) {
    filtered = filtered.filter(star => star.price <= filters.priceMax!);
  }

  // Magnitude range filter
  if (filters.magnitudeMin !== null) {
    filtered = filtered.filter(star => star.magnitude >= filters.magnitudeMin!);
  }
  if (filters.magnitudeMax !== null) {
    filtered = filtered.filter(star => star.magnitude <= filters.magnitudeMax!);
  }

  return filtered;
}

export default memo(Catalogue);
