// client/src/components/StarCard.tsx
// Responsabilité unique : Orchestration des StarCards par contexte

import { memo } from "react";
import CatalogStarCard from "./CatalogStarCard";
import CartStarCard from "./CartStarCard";
import WishlistStarCard from "./WishlistStarCard";
import DetailStarCard from "./DetailStarCard";
import { logger } from "../utils/logger";
import type { Star } from "../types";

interface StarCardProps {
  star: Star;
  context?: "catalog" | "cart" | "wishlist";
  quantity?: number;
  onRemove?: (starId: number) => void;
  isDetailedView?: boolean;
  showAddToCartButton?: boolean;
}

const StarCard: React.FC<StarCardProps> = ({
  star,
  context = "catalog",
  quantity,
  onRemove,
  isDetailedView = false,
}) => {
  // Vue détaillée a priorité sur le contexte
  if (isDetailedView) {
    return <DetailStarCard star={star} />;
  }

  // Délégation au composant spécialisé selon le contexte
  switch (context) {
    case "cart":
      if (!onRemove || quantity === undefined) {
        logger.warn("CartStarCard requires onRemove and quantity props", { starId: star.starid }, "StarCard");
        return null;
      }
      return <CartStarCard star={star} quantity={quantity} onRemove={onRemove} />;

    case "wishlist":
      if (!onRemove) {
        logger.warn("WishlistStarCard requires onRemove prop", { starId: star.starid }, "StarCard");
        return null;
      }
      return <WishlistStarCard star={star} onRemove={onRemove} />;

    case "catalog":
    default:
      return <CatalogStarCard star={star} />;
  }
};

export default memo(StarCard);
