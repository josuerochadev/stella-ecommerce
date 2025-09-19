import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, UserIcon, ShoppingCartIcon, HeartIcon, StoreIcon, BarsIcon, TimesIcon } from '../utils/icons';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../stores/useCartStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import { TouchButton } from './TouchButton';

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const cartItemCount = useCartStore((state) => state.cartItems.length);
  const wishlistItemCount = useWishlistStore((state) => state.wishlistItems.length);

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', icon: HomeIcon, label: 'Accueil' },
    { path: '/catalog', icon: StoreIcon, label: 'Catalogue' },
    { path: '/search', icon: SearchIcon, label: 'Recherche' },
    ...(isAuthenticated ? [
      { path: '/profile', icon: UserIcon, label: 'Profil' },
    ] : [
      { path: '/auth', icon: UserIcon, label: 'Connexion' },
    ])
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
      <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t border-primary/20 ${className} md:hidden`}>
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
                  ${isActive(item.path)
                    ? 'text-special bg-primary/10'
                    : 'text-text hover:text-special'
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
              ${isMenuOpen ? 'text-special bg-primary/10' : ''}
            `}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <TimesIcon size={20} /> : <BarsIcon size={20} />}
            <span className="text-xs mt-1 font-medium">Menu</span>
          </TouchButton>
        </div>

        {/* Quick Actions Floating */}
        {isAuthenticated && (
          <div className="absolute -top-16 right-4 flex space-x-2">
            <Link
              to="/cart"
              className={`
                relative touch-target bg-special text-primary rounded-full p-3 shadow-lg
                transition-transform duration-200 hover:scale-110
                ${isActive('/cart') ? 'scale-110' : ''}
              `}
            >
              <ShoppingCartIcon size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            <Link
              to="/wishlist"
              className={`
                relative touch-target bg-primary text-text rounded-full p-3 shadow-lg
                transition-transform duration-200 hover:scale-110
                ${isActive('/wishlist') ? 'scale-110' : ''}
              `}
            >
              <HeartIcon size={20} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-special text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </nav>

      {/* Slide-up Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-secondary rounded-t-2xl p-6 pb-24 transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-display text-text">Menu</h3>
                <div className="w-12 h-1 bg-primary rounded mx-auto mt-2"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { path: '/about', label: 'À propos', icon: '🌟' },
                  { path: '/contact', label: 'Contact', icon: '📞' },
                  { path: '/faq', label: 'FAQ', icon: '❓' },
                  { path: '/legal', label: 'Mentions légales', icon: '📋' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className="mobile-card bg-primary/10 hover:bg-primary/20 transition-colors duration-200 text-center"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-sm font-medium text-text">{item.label}</div>
                  </Link>
                ))}
              </div>

              {isAuthenticated && (
                <div className="border-t border-primary/20 pt-4 mt-6">
                  <div className="flex justify-around">
                    <Link
                      to="/orders"
                      onClick={closeMenu}
                      className="flex items-center space-x-2 text-text hover:text-special transition-colors"
                    >
                      <span>📦</span>
                      <span>Mes commandes</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={closeMenu}
                      className="flex items-center space-x-2 text-text hover:text-special transition-colors"
                    >
                      <span>⚙️</span>
                      <span>Paramètres</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};