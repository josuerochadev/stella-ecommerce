// client/src/components/WishlistStarCard.tsx
// Responsabilité unique : Affichage d'une étoile dans la wishlist

import type { Star } from "@/types";
import { EyeIcon, TrashIcon } from "@/utils/icons";
import { getStarImagePath } from "@/utils/pathHelpers";
import { memo } from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import FadeInSection from "./FadeInSection";

interface WishlistStarCardProps {
  star: Star;
  onRemove: (starId: number) => void;
}

const WishlistStarCard: React.FC<WishlistStarCardProps> = ({ star, onRemove }) => {
  const handleRemoveClick = () => {
    onRemove(star.starid);
  };

  return (
    <FadeInSection>
      <div className="bg-surface-1 text-text rounded-lg shadow-lg flex flex-row h-full mb-4 overflow-hidden border border-text/[0.07] transition-all duration-300 hover:border-text/20">
        <img
          src={getStarImagePath(star)}
          alt={star.name}
          width={200}
          height={200}
          loading="lazy"
          className="w-1/4 flex-shrink-0 object-cover"
        />
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h2 className="text-xl font-display mb-2 text-text">{star.name}</h2>
          <p className="text-sm mb-4">{star.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{star.price} €</span>
          </div>

          <div className="flex mt-4">
            <Link to={`/star/${star.starid}`} className="btn mt-2">
              <EyeIcon className="text-xl" />
              <span className="sr-only">Découvrir</span>
            </Link>
            <AddToCartButton starId={star.starid} />
            <button type="button" onClick={handleRemoveClick} className="btn mt-2">
              <TrashIcon className="text-xl" />
              <span className="sr-only">Retirer de la liste d'envies</span>
            </button>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default memo(WishlistStarCard);
