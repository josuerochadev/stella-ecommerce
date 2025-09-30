// client/src/components/CatalogSearchBar.tsx
// Responsabilité unique : Barre de recherche du catalogue avec suggestions

import { SearchIcon } from "@/utils/icons";
import type { Star } from "@/types";

interface CatalogSearchBarProps {
  query: string;
  suggestions: Star[];
  showSuggestions: boolean;
  showAdvancedFilters: boolean;
  onQueryChange: (query: string) => void;
  onSuggestionFocus: () => void;
  onSuggestionBlur: () => void;
  onSuggestionClick: (star: Star) => void;
  onToggleAdvancedFilters: () => void;
}

/**
 * Composant barre de recherche pour le catalogue
 * Responsabilité unique : Interface de recherche avec suggestions
 */
const CatalogSearchBar: React.FC<CatalogSearchBarProps> = ({
  query,
  suggestions,
  showSuggestions,
  showAdvancedFilters,
  onQueryChange,
  onSuggestionFocus,
  onSuggestionBlur,
  onSuggestionClick,
  onToggleAdvancedFilters,
}) => {
  return (
    <div className="relative mb-6">
      <div className="flex">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={onSuggestionFocus}
            onBlur={() => setTimeout(onSuggestionBlur, 200)}
            placeholder="Rechercher des étoiles par nom, constellation..."
            className="w-full p-4 pr-12 text-lg rounded-l-lg border-2 border-primary focus:outline-none focus:border-special bg-secondary text-text"
          />
          <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text" size={20} />

          {/* Dropdown des suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-secondary border-2 border-t-0 border-primary rounded-b-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {suggestions.map((star) => (
                <button
                  key={star.starid}
                  type="button"
                  onClick={() => onSuggestionClick(star)}
                  onKeyDown={(e) => e.key === 'Enter' && onSuggestionClick(star)}
                  className="w-full p-3 hover:bg-primary cursor-pointer flex justify-between items-center text-left"
                >
                  <span className="text-text">{star.name}</span>
                  <span className="text-sm text-text opacity-70">{star.constellation}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleAdvancedFilters}
          className={`px-6 rounded-r-lg border-2 border-l-0 border-primary ${
            showAdvancedFilters ? "bg-special text-primary" : "bg-primary text-text"
          } hover:bg-special hover:text-primary transition-colors`}
        >
          Filtres Avancés
        </button>
      </div>
    </div>
  );
};

export default CatalogSearchBar;