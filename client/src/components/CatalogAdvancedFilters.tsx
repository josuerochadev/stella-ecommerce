// client/src/components/CatalogAdvancedFilters.tsx
// Responsabilité unique : Panneau des filtres avancés du catalogue

import { ArrowUpIcon, ArrowDownIcon, TimesIcon } from '../utils/icons';
import type { SearchFilters } from '../hooks/useCatalogFilters';

interface CatalogAdvancedFiltersProps {
  isVisible: boolean;
  filters: SearchFilters;
  uniqueConstellations: string[];
  resultsCount: number;
  onUpdateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  onToggleConstellation: (constellation: string) => void;
  onToggleSortOrder: () => void;
  onClearFilters: () => void;
}

/**
 * Composant des filtres avancés pour le catalogue
 * Responsabilité unique : Interface de filtrage avancé
 */
const CatalogAdvancedFilters: React.FC<CatalogAdvancedFiltersProps> = ({
  isVisible,
  filters,
  uniqueConstellations,
  resultsCount,
  onUpdateFilter,
  onToggleConstellation,
  onToggleSortOrder,
  onClearFilters,
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-primary rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Fourchette de prix */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Prix (€)</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ""}
              onChange={(e) => onUpdateFilter("priceMin", e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 rounded bg-secondary text-text"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ""}
              onChange={(e) => onUpdateFilter("priceMax", e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 rounded bg-secondary text-text"
            />
          </div>
        </div>

        {/* Fourchette de magnitude */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Magnitude</label>
          <div className="flex space-x-2">
            <input
              type="number"
              step="0.1"
              placeholder="Min"
              value={filters.magnitudeMin || ""}
              onChange={(e) => onUpdateFilter("magnitudeMin", e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 rounded bg-secondary text-text"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Max"
              value={filters.magnitudeMax || ""}
              onChange={(e) => onUpdateFilter("magnitudeMax", e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 rounded bg-secondary text-text"
            />
          </div>
        </div>

        {/* Options de tri */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Trier par</label>
          <div className="flex space-x-2">
            <select
              value={filters.sortBy}
              onChange={(e) => onUpdateFilter("sortBy", e.target.value as SearchFilters['sortBy'])}
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
              onClick={onToggleSortOrder}
              className="p-2 bg-secondary text-text rounded hover:bg-special hover:text-primary"
            >
              {filters.sortOrder === "asc" ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Filtre par constellation */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-text mb-2">Constellations</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
          {uniqueConstellations.map((constellation) => (
            <label key={constellation} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.constellation.includes(constellation)}
                onChange={() => onToggleConstellation(constellation)}
                className="rounded text-special"
              />
              <span className="text-sm text-text">{constellation}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions et compteur */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-text">
          {resultsCount} résultat{resultsCount !== 1 ? "s" : ""} trouvé{resultsCount !== 1 ? "s" : ""}
        </span>
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-2 px-4 py-2 bg-secondary text-text rounded hover:bg-special hover:text-primary transition-colors"
        >
          <TimesIcon size={16} />
          <span>Effacer les filtres</span>
        </button>
      </div>
    </div>
  );
};

export default CatalogAdvancedFilters;