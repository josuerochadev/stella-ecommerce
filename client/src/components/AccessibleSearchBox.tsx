// client/src/components/AccessibleSearchBox.tsx
// Responsabilité unique : Orchestrateur de la boîte de recherche accessible

import { useRef } from 'react';
import { useKeyboardNavigation } from '../hooks/useFocusManagement';
import { useSearchLogic } from '../hooks/useSearchLogic';
import SearchToggleButton from './SearchToggleButton';
import SearchInputField from './SearchInputField';
import SearchSuggestionsList from './SearchSuggestionsList';

interface AccessibleSearchBoxProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Composant de boîte de recherche accessible
 * Responsabilité unique : Orchestration de l'interface de recherche
 */
const AccessibleSearchBox: React.FC<AccessibleSearchBoxProps> = ({
  isVisible,
  onToggle,
  className = '',
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchId = 'main-search';
  const suggestionsId = 'search-suggestions';

  // Logique métier de recherche
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
    setShowSuggestions,
  } = useSearchLogic();

  // Navigation au clavier pour les suggestions
  const { containerRef, activeIndex } = useKeyboardNavigation(
    suggestions,
    selectSuggestion,
    showSuggestions
  );

  /**
   * Gérer les changements de saisie avec validation
   * Responsabilité : Interface entre UI et logique métier
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
   * Responsabilité : Orchestration de la recherche et fermeture
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
   * Responsabilité : Coordination sélection + fermeture
   */
  const handleSuggestionSelect = (index: number) => {
    selectSuggestion(index);
    onToggle();
  };

  /**
   * Gérer les touches spéciales dans les suggestions
   * Responsabilité : Navigation clavier dans les suggestions
   */
  const handleSuggestionsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchInputRef.current?.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton de toggle */}
      <SearchToggleButton
        isVisible={isVisible}
        onToggle={onToggle}
      />

      {/* Panneau de recherche */}
      {isVisible && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-secondary border border-primary/20 rounded-lg shadow-lg p-4 z-50">
          {/* Champ de recherche */}
          <SearchInputField
            ref={searchInputRef}
            value={searchValue}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isLoading={isLoading}
            showSuggestions={showSuggestions}
            searchId={searchId}
            suggestionsId={suggestionsId}
            autoFocus={true}
          />

          {/* Liste des suggestions */}
          <SearchSuggestionsList
            ref={containerRef as any}
            suggestions={suggestions}
            activeIndex={activeIndex}
            searchValue={searchValue}
            isLoading={isLoading}
            showSuggestions={showSuggestions}
            suggestionsId={suggestionsId}
            onSelectSuggestion={handleSuggestionSelect}
            onKeyDown={handleSuggestionsKeyDown}
          />
        </div>
      )}
    </div>
  );
};

export default AccessibleSearchBox;