// client/src/context/AuthContext.tsx

import { useCartStore } from "@/stores/useCartStore";
import { useUserStore } from "@/stores/useUserStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { logger } from "@/utils/logger";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
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
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      Promise.all([
        useCartStore.getState().fetchCart(),
        useWishlistStore.getState().fetchWishlist(),
        useUserStore.getState().fetchProfile(),
      ]).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setIsLoading(true);

    Promise.all([
      useCartStore.getState().fetchCart(),
      useWishlistStore.getState().fetchWishlist(),
      useUserStore.getState().fetchProfile(),
    ])
      .catch((error) => {
        logger.warn("Error fetching user data after login:", error, "AuthContext");
      })
      .finally(() => setIsLoading(false));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsLoading(false);
    resetCart();
    resetWishlist();
    resetUser();
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
