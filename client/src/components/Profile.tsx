// client/src/components/Profile.tsx
// Responsabilité unique : Orchestration des sections du profil

import { useEffect, memo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useUserStore } from "@/stores/useUserStore";
import FadeInSection from "./FadeInSection";
import { SkeletonProfile } from "./Skeleton";
import UserProfileSection from "./UserProfileSection";
import ChangePasswordForm from "./ChangePasswordForm";
import ProfileCartSection from "./ProfileCartSection";
import ProfileWishlistSection from "./ProfileWishlistSection";

const Profile: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { redirectToLogin, redirectToRegister } = useAuthRedirect();
  const { cartItems } = useCartStore();
  const { wishlistItems, fetchWishlist } = useWishlistStore();
  const { user, loading: loadingProfile, error, fetchProfile } = useUserStore();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, authLoading, fetchProfile]);


  if (authLoading || (loadingProfile && !user)) {
    return (
      <div className="container mx-auto pt-20 px-4 max-w-md">
        <FadeInSection>
          <SkeletonProfile />
        </FadeInSection>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Veuillez vous connecter pour accéder à votre profil</h1>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => redirectToLogin({ from: "/profile" })}
            className="btn"
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => redirectToRegister({ from: "/profile" })}
            className="btn"
          >
            S'inscrire
          </button>
        </div>
      </div>
    );
  }

  // Afficher une erreur si le chargement échoue
  if (error) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Erreur</h1>
        <p className="text-lg mb-6">{error}</p>
        <button
          type="button"
          onClick={() => fetchProfile()}
          className="btn"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Afficher un message si aucun utilisateur n'est chargé
  if (!user) {
    return (
      <div className="container mx-auto pt-20 px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Chargement du profil...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-20 px-4 max-w-md">
      <h1 className="text-4xl font-display mb-8 text-center">
        Bonjour, {user.firstName}
      </h1>

      <FadeInSection>
        <UserProfileSection
          user={user}
        />

        <ChangePasswordForm />

        <ProfileCartSection cartItems={cartItems} />

        <ProfileWishlistSection wishlistItems={wishlistItems} />
      </FadeInSection>
    </div>
  );
};

export default memo(Profile);
