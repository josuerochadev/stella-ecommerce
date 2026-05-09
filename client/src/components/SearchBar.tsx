// client/src/components/SearchBar.tsx
// Responsabilité unique : Barre de recherche standard (consolidée avec la version accessible)

import { APP_CONSTANTS } from "@/constants/app";
import { useSearchLogic } from "@/hooks/useSearchLogic";
import { SearchIcon } from "@/utils/icons";
import { useRef } from "react";

interface SearchBarProps {
  isVisible: boolean;
  onToggle: () => void;
}

/**
 * Composant de barre de recherche standard
 * Responsabilité unique : Interface de recherche simplifiée réutilisant la logique commune
 */
const SearchBar: React.FC<SearchBarProps> = ({ isVisible, onToggle }) => {
  const searchRef = useRef<HTMLInputElement>(null);

  // Réutilisation de la logique de recherche communes
  const {
    searchValue,
    suggestions,
    isLoading,
    showSuggestions,
    handleSearchChange,
    performSearch,
    clearSearch,
    selectSuggestion,
    handleFocus,
    handleBlur,
  } = useSearchLogic();

  /**
   * Gérer les changements de saisie
   * Responsabilité : Interface entre UI simple et logique métier
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const accepted = handleSearchChange(e.target.value);
    if (!accepted) {
      // Entrée refusée pour des raisons de sécurité
      e.preventDefault();
    }
  };

  /**
   * Gérer la soumission du formulaire
   * Responsabilité : Exécution de la recherche et fermeture
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      performSearch(searchValue);
      clearSearch();
      onToggle();
    }
  };

  /**
   * Gérer la sélection d'une suggestion
   * Responsabilité : Navigation vers étoile et fermeture
   */
  const handleSuggestionClick = (index: number) => {
    selectSuggestion(index);
    onToggle();
  };

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={isVisible ? "Fermer la recherche" : "Ouvrir la recherche"}
      >
        <SearchIcon className="text-xl" />
      </button>

      {/* Search panel */}
      {isVisible && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-secondary border border-primary/20 rounded-lg shadow-lg p-4 z-50">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={(input) => {
                (searchRef as React.MutableRefObject<HTMLInputElement | null>).current = input;
                input?.focus();
              }}
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="w-full p-3 pr-10 rounded-md bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Rechercher une étoile..."
            />

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="motion-safe:animate-spin">⟳</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-text hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded"
              aria-label="Rechercher"
            >
              <SearchIcon className="text-sm" />
            </button>
          </form>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto">
              {suggestions.slice(0, APP_CONSTANTS.MAX_SEARCH_SUGGESTIONS).map((star, index) => (
                <button
                  key={star.starid}
                  type="button"
                  onClick={() => handleSuggestionClick(index)}
                  className="w-full text-left p-3 hover:bg-primary/50 focus:bg-primary/50 focus:outline-none border-b border-primary/10 last:border-b-0"
                >
                  <div className="font-medium text-text">{star.name}</div>
                  <div className="text-sm text-text/70">
                    {star.constellation} • {star.price.toFixed(2)} €
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {showSuggestions && suggestions.length === 0 && searchValue.length >= 2 && !isLoading && (
            <div className="mt-2 p-3 text-text/70 text-center italic">
              Aucune étoile trouvée pour "{searchValue}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
