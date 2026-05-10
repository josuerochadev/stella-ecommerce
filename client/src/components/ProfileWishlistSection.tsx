// client/src/components/ProfileWishlistSection.tsx
// Responsabilité unique : Affichage de la wishlist dans le profil

import type { WishlistItem } from "@/types";
import { memo } from "react";

interface ProfileWishlistSectionProps {
  wishlistItems: WishlistItem[];
}

const ProfileWishlistSection: React.FC<ProfileWishlistSectionProps> = ({ wishlistItems }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-text">Votre liste d'envies</h2>
      {wishlistItems && wishlistItems.length > 0 ? (
        wishlistItems.map((item) =>
          item.Star ? (
            <div key={item.id} className="mb-4">
              <h3 className="text-xl text-text">{item.Star.name}</h3>
            </div>
          ) : (
            <div key={item.id}>
              <p className="text-text">L'étoile associée à cet article est introuvable.</p>
            </div>
          ),
        )
      ) : (
        <p className="text-text">Votre liste d'envies est vide.</p>
      )}
    </div>
  );
};

export default memo(ProfileWishlistSection);
