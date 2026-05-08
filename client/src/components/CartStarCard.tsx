// client/src/components/CartStarCard.tsx
// Responsabilité unique : Affichage d'une étoile dans le panier

import type { Star } from "@/types";
import { EyeIcon, TrashIcon } from "@/utils/icons";
import { getStarImagePath, getStarImagePathWebP } from "@/utils/pathHelpers";
import { memo } from "react";
import { Link } from "react-router-dom";
import FadeInSection from "./FadeInSection";

interface CartStarCardProps {
  star: Star;
  quantity: number;
  onRemove: () => void;
  onUpdateQuantity?: (quantity: number) => void;
}

const CartStarCard: React.FC<CartStarCardProps> = ({
  star,
  quantity,
  onRemove,
  onUpdateQuantity,
}) => {
  return (
    <FadeInSection>
      <div className="bg-surface-1 text-text rounded-lg shadow-lg flex flex-row h-full mb-4 overflow-hidden border border-text/[0.07] transition-all duration-300 hover:border-text/20">
        <picture className="w-1/4 flex-shrink-0">
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
            {onUpdateQuantity ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-md bg-primary text-text flex items-center justify-center disabled:opacity-30"
                  aria-label="Reduire la quantite"
                >
                  -
                </button>
                <span className="text-sm w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-md bg-primary text-text flex items-center justify-center"
                  aria-label="Augmenter la quantite"
                >
                  +
                </button>
              </div>
            ) : (
              <span className="text-sm">Quantite : {quantity}</span>
            )}
          </div>

          <div className="flex mt-4">
            <Link to={`/star/${star.starid}`} className="btn mt-2">
              <EyeIcon className="text-xl" />
              <span className="sr-only">Decouvrir</span>
            </Link>
            <button type="button" onClick={onRemove} className="btn mt-2">
              <TrashIcon className="text-xl" />
              <span className="sr-only">Retirer du panier</span>
            </button>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default memo(CartStarCard);
