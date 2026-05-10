// client/src/components/CatalogStarCard.tsx
// Responsabilite unique : Affichage d'une etoile dans le catalogue

import type { Star } from "@/types";
import { cn } from "@/utils/classNames";
import { EyeIcon } from "@/utils/icons";
import { getStarImagePath, getStarImagePathWebP } from "@/utils/pathHelpers";
import { memo } from "react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";
import FadeInSection from "./FadeInSection";

interface CatalogStarCardProps {
  star: Star;
}

const CatalogStarCard: React.FC<CatalogStarCardProps> = ({ star }) => {
  const cardClass = cn(
    "bg-surface-1 text-text rounded-lg overflow-hidden",
    "flex flex-col h-full mb-4",
    "border border-text/[0.07]",
    "motion-safe:transition-all motion-safe:duration-300 ease-out",
    "motion-safe:hover:scale-[1.02] motion-safe:hover:-translate-y-1 hover:border-special/25",
    "hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,179,71,0.15)]",
    "shadow-lg",
  );

  return (
    <FadeInSection>
      <div className={cardClass}>
        <div className="relative overflow-hidden">
          <picture>
            <source srcSet={getStarImagePathWebP(star)} type="image/webp" />
            <img
              src={getStarImagePath(star)}
              alt={star.name}
              width={400}
              height={192}
              loading="lazy"
              className="w-full h-48 object-cover motion-safe:transition-transform motion-safe:duration-300 ease-out motion-safe:hover:scale-105 brightness-75 saturate-90"
            />
          </picture>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-surface-0/90 to-transparent" />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-text/40 mb-1">
              {star.constellation}
            </p>
            <h2 className="text-xl font-display mb-2 text-periwinkle-100 leading-tight">
              {star.name}
            </h2>
            <p className="text-sm text-text/55 leading-relaxed mb-4">{star.description}</p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-action tracking-wide text-special">
              {star.price} &euro;
            </span>
          </div>

          <div className="flex mt-4 gap-1">
            <Link to={`/star/${star.starid}`} className="btn text-sm py-1.5 px-3">
              <EyeIcon className="text-lg" />
              <span className="sr-only">Decouvrir</span>
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
