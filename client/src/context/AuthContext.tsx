// client/src/context/AuthContext.tsx

import { setUserAuthenticated } from "@/services/httpClient";
import { useCartStore } from "@/stores/useCartStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useUserStore } from "@/stores/useUserStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { logger } from "@/utils/logger";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const resetCart = useCartStore((state) => state.resetCart);
  const resetWishlist = useWishlistStore((state) => state.resetWishlist);
  const resetUser = useUserStore((state) => state.resetUser);

  useEffect(() => {
    // Try to fetch profile to check if httpOnly cookie is valid
    useUserStore
      .getState()
      .fetchProfile()
      .then(() => {
        if (useUserStore.getState().user !== null) {
          setIsAuthenticated(true);
          setUserAuthenticated(true);
          return Promise.all([
            useCartStore.getState().fetchCart(),
            useWishlistStore.getState().fetchWishlist(),
          ]);
        }
      })
      .catch(() => {
        // No valid session — user is not authenticated
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async () => {
    // Access token is now in httpOnly cookie, set by the server
    setIsLoading(true);

    try {
      await Promise.all([
        useCartStore.getState().fetchCart(),
        useWishlistStore.getState().fetchWishlist(),
        useUserStore.getState().fetchProfile(),
      ]);
      setIsAuthenticated(true);
      setUserAuthenticated(true);
    } catch (error) {
      logger.warn("Error fetching user data after login:", error, "AuthContext");
      setIsAuthenticated(true);
      setUserAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserAuthenticated(false);
    setIsLoading(false);
    resetCart();
    resetWishlist();
    resetUser();
    useNotificationStore.setState({ toasts: [], modals: [] });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
