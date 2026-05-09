// client/src/components/CatalogResultsGrid.tsx
// Responsabilité unique : Affichage des résultats de recherche du catalogue

import type { Star } from "@/types";
import { SearchIcon } from "@/utils/icons";
import { SkeletonGrid } from "./Skeleton";
import StarCard from "./StarCard";

interface CatalogResultsGridProps {
  stars: Star[];
  query: string;
  isLoading: boolean;
  onClearFilters: () => void;
}

/**
 * Composant d'affichage des résultats du catalogue
 * Responsabilité unique : Rendu de la grille de résultats avec états
 */
const CatalogResultsGrid: React.FC<CatalogResultsGridProps> = ({
  stars,
  query,
  isLoading,
  onClearFilters,
}) => {
  return (
    <div>
      {/* En-tête des résultats */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display">
          {query ? `Résultats pour "${query}"` : "Toutes les étoiles"}
        </h2>
        <span className="text-text">
          {stars.length} étoile{stars.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Contenu des résultats */}
      {isLoading ? (
        <SkeletonGrid count={8} columns={4} />
      ) : stars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stars.map((star) => (
            <StarCard key={star.starid} star={star} />
          ))}
        </div>
      ) : (
        /* État vide */
        <div className="text-center py-12">
          <SearchIcon size={48} className="mx-auto mb-4 text-text opacity-50" />
          <h3 className="text-xl font-display mb-2">Aucun résultat trouvé</h3>
          <p className="text-text opacity-70 mb-4">Essayez de modifier vos critères de recherche</p>
          <button onClick={onClearFilters} className="btn">
            Réinitialiser la recherche
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogResultsGrid;
