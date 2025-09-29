// client/src/components/Profile.tsx
// Responsabilité unique : Orchestration des sections du profil

import { useState, useEffect, memo } from "react";
import { getUserProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import FadeInSection from "./FadeInSection";
import { SkeletonProfile } from "./Skeleton";
import { useLoadingState } from "../hooks/useLoadingState";
import UserProfileSection from "./UserProfileSection";
import ProfileCartSection from "./ProfileCartSection";
import ProfileWishlistSection from "./ProfileWishlistSection";

const Profile: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems } = useCartStore();
  const { wishlistItems, fetchWishlist } = useWishlistStore();
  const [user, setUser] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { isLoading: isLoadingProfile, setLoading, setSuccess, setError } = useLoadingState({
    minLoadingTime: 600
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading();
        const userData: User = await getUserProfile();
        setUser(userData);
        setLoadingProfile(false);
        setSuccess();
      } catch (error) {
        console.error("Erreur lors de la récupération du profil utilisateur", error);
        setLoadingProfile(false);
        setError();
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist, setLoading, setSuccess, setError]);

  const handleProfileUpdate = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  if (loadingProfile || isLoadingProfile) {
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
            onClick={() => navigate("/auth", { state: { from: "/profile", mode: "login" } })}
            className="btn"
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => navigate("/auth", { state: { from: "/profile", mode: "register" } })}
            className="btn"
          >
            S'inscrire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div role="contentinfo" className="container mx-auto pt-20 px-4 max-w-md">
      <h1 className="text-4xl font-display mb-8 text-center">
        Bonjour, {user?.firstName}
      </h1>

      <FadeInSection>
        {user && (
          <UserProfileSection
            user={user}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        <ProfileCartSection cartItems={cartItems} />

        <ProfileWishlistSection wishlistItems={wishlistItems} />
      </FadeInSection>
    </div>
  );
};

export default memo(Profile);
