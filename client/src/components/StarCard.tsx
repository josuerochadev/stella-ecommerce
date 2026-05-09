// client/src/components/StarCard.tsx
// Responsabilité unique : Orchestration des StarCards par contexte

import type { Star } from "@/types";
import { logger } from "@/utils/logger";
import { memo } from "react";
import CartStarCard from "./CartStarCard";
import CatalogStarCard from "./CatalogStarCard";
import DetailStarCard from "./DetailStarCard";
import WishlistStarCard from "./WishlistStarCard";

interface StarCardProps {
  star: Star;
  context?: "catalog" | "cart" | "wishlist";
  quantity?: number;
  onRemove?: (starId: number) => void;
  onUpdateQuantity?: (quantity: number) => void;
  isDetailedView?: boolean;
  showAddToCartButton?: boolean;
}

const StarCard: React.FC<StarCardProps> = ({
  star,
  context = "catalog",
  quantity,
  onRemove,
  onUpdateQuantity,
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
        logger.warn(
          "CartStarCard requires onRemove and quantity props",
          { starId: star.starid },
          "StarCard",
        );
        return null;
      }
      return (
        <CartStarCard
          star={star}
          quantity={quantity}
          onRemove={() => onRemove(star.starid)}
          onUpdateQuantity={onUpdateQuantity}
        />
      );

    case "wishlist":
      if (!onRemove) {
        logger.warn("WishlistStarCard requires onRemove prop", { starId: star.starid }, "StarCard");
        return null;
      }
      return <WishlistStarCard star={star} onRemove={onRemove} />;
    default:
      return <CatalogStarCard star={star} />;
  }
};

export default memo(StarCard);
