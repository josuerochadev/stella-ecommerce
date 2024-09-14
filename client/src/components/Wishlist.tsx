// client/src/components/Wishlist.tsx

import { useEffect, memo, useCallback } from "react";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import StarCard from "./StarCard";
import FadeInSection from "./FadeInSection";

const Wishlist: React.FC = () => {
  const { wishlistItems, loading, error, fetchWishlist, removeItemFromWishlist } =
    useWishlistStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [fetchWishlist, isAuthenticated]);

  const handleRemoveFromWishlist = useCallback(
    async (starId: number) => {
      try {
        await removeItemFromWishlist(starId);
      } catch (error) {
        console.error("Erreur lors de la suppression de la wishlist:", error);
      }
    },
    [removeItemFromWishlist],
  );

  // Si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre liste des souhaits est vide</h1>
        <p className="text-lg mb-6 font-serif">
          Vous n'êtes pas connecté. Connectez-vous ou inscrivez-vous pour commencer à ajouter des
          étoiles à votre liste !
        </p>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => navigate("/auth", { state: { from: "/wishlist", mode: "login" } })}
            className="btn"
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => navigate("/auth", { state: { from: "/wishlist", mode: "register" } })}
            className="btn"
          >
            S'inscrire
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p>Chargement de la liste d'envies...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre liste d'envies est vide</h1>
        <p className="text-lg mb-6 font-serif">
          Vous n'avez pas encore ajouté d'étoiles à votre liste d'envies. Explorez notre catalogue
          pour en ajouter !
        </p>
        <Link to="/catalog" className="btn">
          Voir notre catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-20 px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Votre liste d'envies</h1>
      <FadeInSection>
        <div className="space-y-6">
          {wishlistItems.map((item) =>
            item?.starId && item?.Star ? (
              <StarCard
                key={item.id}
                star={item.Star}
                context="wishlist"
                onRemove={() => handleRemoveFromWishlist(item.starId)}
              />
            ) : (
              <div key={item?.id || Math.random()} className="mb-4">
                <p>L'étoile associée à cet article est introuvable.</p>
              </div>
            ),
          )}
        </div>
      </FadeInSection>
    </div>
  );
};

export default memo(Wishlist);
