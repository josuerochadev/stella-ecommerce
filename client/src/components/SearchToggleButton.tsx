// client/src/components/SearchToggleButton.tsx
// Responsabilité unique : Bouton de bascule pour la recherche

import React from 'react';
import { SearchIcon } from "@/utils/icons";
import { ARIA_LABELS } from "@/utils/accessibility";

interface SearchToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Composant bouton de toggle de recherche
 * Responsabilité unique : Affichage et interaction du bouton de bascule
 */
const SearchToggleButton: React.FC<SearchToggleButtonProps> = ({
  isVisible,
  onToggle,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
      aria-label={isVisible ? 'Fermer la recherche' : ARIA_LABELS.SEARCH}
      aria-expanded={isVisible}
      aria-controls={isVisible ? 'main-search' : undefined}
    >
      <SearchIcon className="text-xl" />
    </button>
  );
};

export default SearchToggleButton;