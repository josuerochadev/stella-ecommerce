import { useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UserIcon, ShoppingCartIcon, HeartIcon } from "@/utils/icons";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { usePageTitleOnScroll } from "@/hooks/usePageTitleOnScroll";
import { ARIA_LABELS, ARIA_DESCRIPTIONS } from "@/utils/accessibility";
import SkipLinks from "./SkipLinks";
import AccessibleSearchBox from "./AccessibleSearchBox";

const AccessibleHeader: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const location = useLocation();
  const { isTitleVisible, pageTitle } = usePageTitleOnScroll();

  const cartItemCount = useCartStore((state) => state.cartItems.length);
  const wishlistItemCount = useWishlistStore((state) => state.wishlistItems.length);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const isCurrentPage = (path: string) => location.pathname === path;

  return (
    <>
      <SkipLinks />

      <header
        className="bg-background-inverse text-text fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300 ease-in-out"
        role="banner"
      >
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-20 h-12">

          {/* Logo and Home Link */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Stella - Retour à l'accueil"
              aria-current={isCurrentPage('/') ? 'page' : undefined}
            >
              <HomeIcon className="text-xl text-text hover:text-accent transition-colors" />
              <span className="ml-2 font-display text-lg hidden sm:inline">
                Stella
              </span>
            </Link>
          </div>

          {/* Page Title (shown when scrolled) */}
          <div className="flex-1 text-center">
            {!isTitleVisible && (
              <h1 className="text-lg font-serif text-text" aria-live="polite">
                {pageTitle}
              </h1>
            )}
          </div>

          {/* Main Navigation */}
          <nav
            className="flex items-center space-x-2"
            role="navigation"
            aria-label={ARIA_LABELS.MAIN_NAVIGATION}
            id="navigation"
          >

            {/* Search */}
            <AccessibleSearchBox
              isVisible={isSearchVisible}
              onToggle={toggleSearch}
            />

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent hover:text-accent transition-colors"
                aria-label={`Liste de souhaits, ${ARIA_DESCRIPTIONS.WISHLIST_ITEMS(wishlistItemCount)}`}
                aria-current={isCurrentPage('/wishlist') ? 'page' : undefined}
              >
                <HeartIcon className="text-xl" />
                {wishlistItemCount > 0 && (
                  <>
                    <span
                      className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                    </span>
                    <span className="sr-only">
                      {wishlistItemCount} {wishlistItemCount > 1 ? 'articles' : 'article'} en favoris
                    </span>
                  </>
                )}
              </Link>
            )}

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent hover:text-accent transition-colors"
              aria-label={`Panier, ${ARIA_DESCRIPTIONS.CART_ITEMS(cartItemCount)}`}
              aria-current={isCurrentPage('/cart') ? 'page' : undefined}
            >
              <ShoppingCartIcon className="text-xl" />
              {cartItemCount > 0 && (
                <>
                  <span
                    className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                  <span className="sr-only">
                    {cartItemCount} {cartItemCount > 1 ? 'articles' : 'article'} dans le panier
                  </span>
                </>
              )}
            </Link>

            {/* User Profile/Login */}
            <Link
              to={isAuthenticated ? "/profile" : "/auth"}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent hover:text-accent transition-colors"
              aria-label={isAuthenticated ? "Mon profil" : "Se connecter"}
              aria-current={isCurrentPage(isAuthenticated ? '/profile' : '/auth') ? 'page' : undefined}
            >
              <UserIcon className="text-xl" />
              <span className="sr-only">
                {isAuthenticated ? 'Accéder à mon profil' : 'Se connecter ou créer un compte'}
              </span>
            </Link>

          </nav>
        </div>

        {/* Breadcrumb Navigation (if needed) */}
        {location.pathname !== '/' && (
          <nav
            aria-label={ARIA_LABELS.BREADCRUMB}
            className="px-4 sm:px-6 lg:px-20 py-2 bg-background-inverse/90 border-t border-primary/10"
          >
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-text/70 hover:text-accent focus:outline-none focus:underline"
                >
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true" className="text-text/50">/</li>
              <li>
                <span className="text-text font-medium" aria-current="page">
                  {getBreadcrumbName(location.pathname)}
                </span>
              </li>
            </ol>
          </nav>
        )}

      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className={`${location.pathname !== '/' ? 'h-20' : 'h-12'}`} aria-hidden="true" />
    </>
  );
};

// Helper function to get breadcrumb names
function getBreadcrumbName(pathname: string): string {
  const routes: Record<string, string> = {
    '/catalog': 'Catalogue',
    '/cart': 'Panier',
    '/profile': 'Profil',
    '/wishlist': 'Favoris',
    '/auth': 'Connexion',
    '/contact': 'Contact',
    '/about': 'À propos',
    '/legal': 'Mentions légales',
    '/privacy': 'Confidentialité',
  };

  // Handle dynamic routes like /star/123
  if (pathname.startsWith('/star/')) {
    return 'Détails de l\'étoile';
  }

  return routes[pathname] || 'Page';
}

export default memo(AccessibleHeader);