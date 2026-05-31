// client/src/components/WishlistStarCard.tsx
// Responsabilité unique : Affichage d'une étoile dans la wishlist

import type { Star } from "@/types";
import { EyeIcon, TrashIcon } from "@/utils/icons";
import { getStarImagePath, getStarImagePathWebP } from "@/utils/pathHelpers";
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
        <picture className="w-1/3 sm:w-1/4 flex-shrink-0">
          <source srcSet={getStarImagePathWebP(star)} type="image/webp" />
          <img
            src={getStarImagePath(star)}
            alt={star.name}
            width={200}
            height={200}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h2 className="text-xl font-display mb-2 text-text">{star.name}</h2>
          <p className="text-sm mb-4">{star.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{star.price} €</span>
          </div>

          <div className="flex items-center mt-4 gap-2">
            <Link to={`/star/${star.starid}`} className="btn">
              <EyeIcon className="text-xl" />
              <span className="sr-only">Découvrir</span>
            </Link>
            <AddToCartButton starId={star.starid} />
            <button type="button" onClick={handleRemoveClick} className="btn">
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
