// client/src/components/CatalogStarCard.tsx
// Responsabilité unique : Affichage d'une étoile dans le catalogue

import { memo } from "react";
import { Link } from "react-router-dom";
import { EyeIcon } from "../utils/icons";
import AddToCartButton from "../components/AddToCartButton";
import AddToWishlistButton from "../components/AddToWishlistButton";
import FadeInSection from "./FadeInSection";
import type { Star } from "../types";

interface CatalogStarCardProps {
  star: Star;
}

const CatalogStarCard: React.FC<CatalogStarCardProps> = ({ star }) => {
  return (
    <FadeInSection>
      <div className="bg-secondary text-text rounded-lg shadow-lg flex flex-col h-full mb-4 overflow-hidden card-hover-effect">
        <img
          src={`/assets/images/stars/${star.name.toLowerCase().replace(/\s+/g, "")}.jpg`}
          alt={star.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h2 className="text-xl font-display mb-2">{star.name}</h2>
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
            <AddToWishlistButton starId={star.starid} />
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default memo(CatalogStarCard);