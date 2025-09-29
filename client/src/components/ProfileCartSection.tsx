// client/src/components/ProfileCartSection.tsx
// Responsabilité unique : Affichage du panier dans le profil

import { memo } from "react";
import type { CartItem } from "../types";

interface ProfileCartSectionProps {
  cartItems: CartItem[];
}

const ProfileCartSection: React.FC<ProfileCartSectionProps> = ({ cartItems }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">Votre Panier</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) =>
          item.Star ? (
            <div key={item.id} className="mb-4">
              <h3 className="text-xl">{item.Star.name}</h3>
              <p>
                {item.quantity} x {item.Star.price} €
              </p>
            </div>
          ) : (
            <div key={item.id}>
              <p>L'étoile associée à cet article est introuvable.</p>
            </div>
          ),
        )
      ) : (
        <p>Votre panier est vide.</p>
      )}
    </div>
  );
};

export default memo(ProfileCartSection);