// client/src/components/SearchSuggestionsList.tsx
// Responsabilité unique : Affichage des suggestions de recherche

import type { Star } from "@/types";
import { ARIA_DESCRIPTIONS } from "@/utils/accessibility";
import type React from "react";
import { forwardRef } from "react";

interface SearchSuggestionsListProps {
  suggestions: Star[];
  activeIndex: number;
  searchValue: string;
  isLoading: boolean;
  showSuggestions: boolean;
  suggestionsId: string;
  onSelectSuggestion: (index: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Composant de liste des suggestions de recherche
 * Responsabilité unique : Rendu et interaction avec les suggestions
 */
const SearchSuggestionsList = forwardRef<HTMLDivElement, SearchSuggestionsListProps>(
  (
    {
      suggestions,
      activeIndex,
      searchValue,
      isLoading,
      showSuggestions,
      suggestionsId,
      onSelectSuggestion,
      onKeyDown,
    },
    ref,
  ) => {
    // Ne pas afficher si pas de suggestions à montrer
    if (!showSuggestions) {
      return null;
    }

    // Liste des suggestions
    if (suggestions.length > 0) {
      return (
        <div
          ref={ref}
          id={suggestionsId}
          role="listbox"
          aria-label={ARIA_DESCRIPTIONS.SEARCH_RESULTS(suggestions.length)}
          className="mt-2 max-h-64 overflow-y-auto"
          onKeyDown={onKeyDown}
        >
          {suggestions.map((star, index) => (
            <SearchSuggestionItem
              key={star.starid}
              star={star}
              index={index}
              isActive={index === activeIndex}
              onClick={() => onSelectSuggestion(index)}
            />
          ))}
        </div>
      );
    }

    // Message "aucun résultat" si recherche suffisamment longue
    if (searchValue.length >= 2 && !isLoading) {
      return (
        <div className="mt-2 p-3 text-text/70 text-center italic" role="status" aria-live="polite">
          Aucune étoile trouvée pour "{searchValue}"
        </div>
      );
    }

    return null;
  },
);

SearchSuggestionsList.displayName = "SearchSuggestionsList";

/**
 * Composant d'élément de suggestion individuel
 * Responsabilité unique : Rendu d'une suggestion spécifique
 */
interface SearchSuggestionItemProps {
  star: Star;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const SearchSuggestionItem: React.FC<SearchSuggestionItemProps> = ({ star, isActive, onClick }) => {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      className={`w-full text-left p-3 hover:bg-primary/50 focus:bg-primary/50 focus:outline-none border-b border-primary/10 last:border-b-0 ${
        isActive ? "bg-primary/50" : ""
      }`}
    >
      <div className="font-medium text-text">{star.name}</div>
      <div className="text-sm text-text/70">
        {star.constellation} • {ARIA_DESCRIPTIONS.PRICE(star.price)}
      </div>
      {star.magnitude && <div className="text-xs text-text/50">Magnitude: {star.magnitude}</div>}
    </button>
  );
};

export default SearchSuggestionsList;
