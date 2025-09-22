import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../utils/icons";
import { searchStars } from "../services/api";
import { ARIA_LABELS, ARIA_DESCRIPTIONS } from "../utils/accessibility";
import { useKeyboardNavigation } from "../hooks/useFocusManagement";
import { sanitizeSearchQuery, detectInjectionAttempt } from "../utils/security";
import type { Star } from "../types";

interface AccessibleSearchBoxProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

const AccessibleSearchBox: React.FC<AccessibleSearchBoxProps> = ({
  isVisible,
  onToggle,
  className = "",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Star[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchId = "main-search";
  const suggestionsId = "search-suggestions";

  // Navigation au clavier pour les suggestions
  const { containerRef, activeIndex } = useKeyboardNavigation(
    suggestions,
    handleSelectSuggestion,
    showSuggestions
  );

  // Debounced search
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
        console.error("Erreur lors de la recherche:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Vérifier s'il y a des tentatives d'injection
    if (detectInjectionAttempt(value)) {
      console.warn("Tentative d'injection détectée dans la recherche");
      return; // Ignorer l'entrée potentiellement dangereuse
    }

    const sanitizedValue = sanitizeSearchQuery(value);
    setSearchValue(sanitizedValue);
    debouncedSearch(sanitizedValue);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      performSearch(searchValue.trim());
    }
  };

  function handleSelectSuggestion(index: number) {
    if (suggestions[index]) {
      navigate(`/star/${suggestions[index].starid}`);
      clearSearch();
    }
  }

  const performSearch = (query: string) => {
    // Sécuriser la requête avant navigation
    const sanitizedQuery = sanitizeSearchQuery(query);
    navigate(`/catalog?q=${encodeURIComponent(sanitizedQuery)}`);
    clearSearch();
  };

  const clearSearch = () => {
    setSearchValue("");
    setSuggestions([]);
    setShowSuggestions(false);
    onToggle();
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => {
      if (!e.currentTarget.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toggle search button */}
      <button
        type="button"
        onClick={onToggle}
        className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={isVisible ? "Fermer la recherche" : ARIA_LABELS.SEARCH}
        aria-expanded={isVisible}
        aria-controls={isVisible ? searchId : undefined}
      >
        <SearchIcon className="text-xl" />
      </button>

      {/* Search form */}
      {isVisible && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-secondary border border-primary/20 rounded-lg shadow-lg p-4 z-50">
          <form onSubmit={handleSearchSubmit} role="search">
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">
                Rechercher des étoiles
              </label>
              <input
                ref={searchInputRef}
                id={searchId}
                type="search"
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full p-3 pr-10 rounded-md bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Rechercher une étoile..."
                autoComplete="off"
                aria-expanded={showSuggestions}
                aria-haspopup="listbox"
                aria-owns={showSuggestions ? suggestionsId : undefined}
                aria-describedby={`${searchId}-description`}
                autoFocus
              />
              <div id={`${searchId}-description`} className="sr-only">
                Tapez au moins 2 caractères pour voir les suggestions. Utilisez les flèches pour naviguer.
              </div>

              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
                  <span className="animate-spin">⟳</span>
                </div>
              )}

              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-text hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded"
                aria-label="Lancer la recherche"
              >
                <SearchIcon className="text-sm" />
              </button>
            </div>
          </form>

          {/* Suggestions list */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={containerRef}
              id={suggestionsId}
              role="listbox"
              aria-label={ARIA_DESCRIPTIONS.SEARCH_RESULTS(suggestions.length)}
              className="mt-2 max-h-64 overflow-y-auto"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowSuggestions(false);
                  searchInputRef.current?.focus();
                }
              }}
            >
              {suggestions.map((star, index) => (
                <button
                  key={star.starid}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelectSuggestion(index)}
                  className={`w-full text-left p-3 hover:bg-primary/50 focus:bg-primary/50 focus:outline-none border-b border-primary/10 last:border-b-0 ${
                    index === activeIndex ? 'bg-primary/50' : ''
                  }`}
                >
                  <div className="font-medium text-text">{star.name}</div>
                  <div className="text-sm text-text/70">
                    {star.constellation} • {ARIA_DESCRIPTIONS.PRICE(star.price)}
                  </div>
                  {star.magnitude && (
                    <div className="text-xs text-text/50">
                      Magnitude: {star.magnitude}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {showSuggestions && suggestions.length === 0 && searchValue.length >= 2 && !isLoading && (
            <div
              className="mt-2 p-3 text-text/70 text-center italic"
              role="status"
              aria-live="polite"
            >
              Aucune étoile trouvée pour "{searchValue}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default AccessibleSearchBox;