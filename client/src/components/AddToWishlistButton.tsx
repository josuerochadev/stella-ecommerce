// client/src/components/AddToWishlistButton.tsx

import { useAuth } from "@/context/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { HeartIcon } from "@/utils/icons";
import { memo, useCallback, useEffect } from "react";

interface AddToWishlistButtonProps {
  starId: number;
}

const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({ starId }) => {
  const { isAuthenticated } = useAuth();
  const { redirectToLogin } = useAuthRedirect();

  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const loading = useWishlistStore((state) => state.loading);
  const error = useWishlistStore((state) => state.error);
  const { showSuccess } = useNotificationStore();

  const inWishlist = wishlistItems.some((item) => item && item.starId === starId);

  useEffect(() => {
    if (isAuthenticated && wishlistItems.length === 0) {
      fetchWishlist();
    }
  }, [isAuthenticated, wishlistItems.length, fetchWishlist]);

  const handleAddToWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      redirectToLogin({
        from: "/wishlist",
        message: "Veuillez vous connecter pour ajouter des articles à la liste de souhaits.",
      });
      return;
    }

    try {
      await addItemToWishlist(starId);
      showSuccess("Ajouté aux favoris", "L'étoile a été ajoutée à votre liste de souhaits.");
    } catch (_err) {
      // L'erreur est gérée par le store useWishlistStore
    }
  }, [isAuthenticated, redirectToLogin, addItemToWishlist, starId, showSuccess]);

  return (
    <>
      <button
        type="button"
        onClick={handleAddToWishlist}
        className={`btn ${inWishlist ? "bg-gray-500 cursor-not-allowed" : ""}`}
        disabled={loading || inWishlist}
        aria-live="polite"
        aria-label={
          inWishlist
            ? "Produit déjà ajouté à la liste de souhaits"
            : "Ajouter à la liste de souhaits"
        }
      >
        <HeartIcon className="text-xl" />
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </>
  );
};

export default memo(AddToWishlistButton);
