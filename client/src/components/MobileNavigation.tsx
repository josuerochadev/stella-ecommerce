// client/src/components/MobileNavigation.tsx
// Responsabilité unique : Navigation principale mobile avec orchestration

import { useAuth } from "@/context/AuthContext";
import { BarsIcon, HomeIcon, SearchIcon, StoreIcon, TimesIcon, UserIcon } from "@/utils/icons";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FloatingActions from "./FloatingActions";
import MobileMenuOverlay from "./MobileMenuOverlay";
import { TouchButton } from "./TouchButton";

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = "" }) => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", icon: HomeIcon, label: "Accueil" },
    { path: "/catalog", icon: StoreIcon, label: "Catalogue" },
    { path: "/catalog", icon: SearchIcon, label: "Recherche" },
    ...(isAuthenticated
      ? [{ path: "/profile", icon: UserIcon, label: "Profil" }]
      : [{ path: "/auth", icon: UserIcon, label: "Connexion" }]),
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar - Toujours visible sur mobile */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-primary/20 ${className} md:hidden`}
      >
        <div className="grid grid-cols-5 h-16">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  touch-target flex flex-col items-center justify-center
                  transition-colors duration-200
                  ${
                    isActive(item.path)
                      ? "text-special bg-primary/10"
                      : "text-text hover:text-special"
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Menu Button */}
          <TouchButton
            variant="ghost"
            className={`
              flex flex-col items-center justify-center text-text hover:text-special
              ${isMenuOpen ? "text-special bg-primary/10" : ""}
            `}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <TimesIcon size={20} /> : <BarsIcon size={20} />}
            <span className="text-xs mt-1 font-medium">Menu</span>
          </TouchButton>
        </div>

        {/* Quick Actions Floating */}
        {isAuthenticated && <FloatingActions />}
      </nav>

      {/* Slide-up Menu Overlay */}
      <MobileMenuOverlay isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
};

// Hook pour détecter si on est sur mobile
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
};
