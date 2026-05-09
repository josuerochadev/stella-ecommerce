// client/src/components/SearchInputField.tsx
// Responsabilité unique : Champ de saisie de recherche

import { SearchIcon } from "@/utils/icons";
import type React from "react";
import { forwardRef } from "react";

interface SearchInputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  showSuggestions: boolean;
  searchId: string;
  suggestionsId: string;
  autoFocus?: boolean;
}

/**
 * Composant de champ de saisie de recherche
 * Responsabilité unique : Interface de saisie et validation
 */
const SearchInputField = forwardRef<HTMLInputElement, SearchInputFieldProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onFocus,
      onBlur,
      onKeyDown,
      isLoading,
      showSuggestions,
      searchId,
      suggestionsId,
      autoFocus: _autoFocus = false,
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // La validation de sécurité sera gérée par le hook parent
      onChange(e);
    };

    return (
      <form onSubmit={onSubmit} role="search">
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">
            Rechercher des étoiles
          </label>

          <input
            ref={ref}
            id={searchId}
            type="search"
            value={value}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="w-full p-3 pr-10 rounded-md bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Rechercher une étoile..."
            autoComplete="off"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
            aria-owns={showSuggestions ? suggestionsId : undefined}
            aria-describedby={`${searchId}-description`}
          />

          <div id={`${searchId}-description`} className="sr-only">
            Tapez au moins 2 caractères pour voir les suggestions. Utilisez les flèches pour
            naviguer.
          </div>

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
              <span className="animate-spin">⟳</span>
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-text hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded"
            aria-label="Lancer la recherche"
          >
            <SearchIcon className="text-sm" />
          </button>
        </div>
      </form>
    );
  },
);

SearchInputField.displayName = "SearchInputField";

export default SearchInputField;
