// client/src/context/AuthContext.tsx

import type { ReactNode } from "react";
import { createContext, useState, useEffect, useContext } from "react";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const resetCart = useCartStore((state) => state.resetCart);
  const resetWishlist = useWishlistStore((state) => state.resetWishlist);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      useCartStore.getState().fetchCart();
      useWishlistStore.getState().fetchWishlist();
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);

    // Différer les appels aux stores pour éviter les re-renders immédiats
    setTimeout(() => {
      try {
        useCartStore.getState().fetchCart();
        useWishlistStore.getState().fetchWishlist();
      } catch (error) {
        console.warn("Error fetching cart/wishlist after login:", error);
      }
    }, 100);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    resetCart();
    resetWishlist();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
