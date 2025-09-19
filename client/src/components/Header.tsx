import { useState, useEffect, memo, useCallback } from "react";
import { HomeIcon, SearchIcon, UserIcon, ShoppingCartIcon, HeartIcon, StoreIcon } from "../utils/icons";
import { searchStars, getCart, getWishlist } from "../services/api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import type { Star } from "../types";
import { usePageTitleOnScroll } from "../hooks/usePageTitleOnScroll";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";


const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Star[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { isTitleVisible, pageTitle } = usePageTitleOnScroll();

  const cartItemCount = useCartStore((state) => state.cartItems.length);
  const wishlistItemCount = useWishlistStore((state) => state.wishlistItems.length);

  const navigate = useNavigate();
  const _location = useLocation();

  // Debounced search for suggestions
  const debouncedSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        try {
          const results = await searchStars(query);
          setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 200),
    []
  );

  useEffect(() => {
    debouncedSuggestions(searchValue);
  }, [searchValue, debouncedSuggestions]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 100);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchValue("");
    setSuggestions([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchVisible(false);
      setSearchValue("");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      handleSearchSubmit(e);
    }
  };

  const handleSelectSuggestion = (starid: number) => {
    setSearchValue("");
    setSuggestions([]);
    navigate(`/star/${starid}`);
  };

  return (
    <header className="bg-background-inverse text-text fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-20 shadow-lg h-12 transition-all duration-300 ease-in-out">
      <div className="flex items-center space-x-3">
        <Link to="/" className="text-lg text-text hover:text-white">
          <HomeIcon className="text-xl text-text" />
        </Link>
      </div>

      <div className="flex items-center space-x-3 relative">
        {/* Affiche le titre de la page seulement quand il n'est plus visible */}
        {!isTitleVisible && <span className="text-lg font-serif">{pageTitle}</span>}

        {/* Barre de recherche */}
        {isSearchVisible && (
          <div className="relative transition-opacity duration-300 ease-in-out">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                className="w-48 p-2 pl-4 pr-8 rounded-full bg-secondary text-text focus:outline-none h-8"
                placeholder="Rechercher des étoiles..."
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={handleKeyDown}
                aria-label="Rechercher une étoile"
                aria-expanded={isSearchVisible}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text hover:text-white focus:outline-none"
                aria-label="Rechercher"
              >
                <SearchIcon size={16} />
              </button>
            </form>

            {/* Suggestions de recherche */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute w-full mt-1 z-20">
                <ul className="bg-secondary text-text rounded-lg shadow-lg border border-primary max-h-60 overflow-y-auto">
                  {suggestions.map((star) => (
                    <li
                      key={star.starid}
                      className="px-4 py-2 hover:bg-primary hover:text-white transition-colors duration-300 ease-in-out"
                    >
                      <button
                        type="button"
                        onMouseDown={() => handleSelectSuggestion(star.starid)}
                        className="w-full text-left cursor-pointer focus:outline-none flex justify-between items-center"
                      >
                        <span>{star.name}</span>
                        <span className="text-sm opacity-70">{star.constellation}</span>
                      </button>
                    </li>
                  ))}
                  {searchValue.trim() && (
                    <li className="px-4 py-2 border-t border-primary">
                      <button
                        type="button"
                        onMouseDown={() => {
                          navigate(`/catalog?q=${encodeURIComponent(searchValue.trim())}`);
                          setIsSearchVisible(false);
                          setSearchValue("");
                          setSuggestions([]);
                        }}
                        className="w-full text-left cursor-pointer focus:outline-none text-sm text-special hover:text-white"
                      >
                        Recherche dans le catalogue pour "{searchValue}"
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Bouton pour afficher/masquer la recherche ou lien vers recherche avancée */}
        {!isSearchVisible ? (
          <button
            type="button"
            onClick={toggleSearch}
            aria-expanded={isSearchVisible}
            className="text-text hover:text-white focus:outline-none"
            title="Recherche rapide"
          >
            <SearchIcon className="text-xl" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleSearch}
            className="text-text hover:text-white focus:outline-none ml-2"
            title="Fermer la recherche"
          >
            ✕
          </button>
        )}


        {/* Icône du catalogue */}
        <Link to="/catalog" className="text-lg text-text hover:text-white" aria-label="Catalogue">
          <StoreIcon className="text-xl" />
        </Link>

        {/* Icônes selon l'état d'authentification */}
        {isAuthenticated ? (
          <>
            <Link
              to="/cart"
              className="relative text-lg text-text hover:text-white"
              aria-label="Panier"
            >
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              to="/wishlist"
              className="relative text-lg text-text hover:text-white"
              aria-label="Wishlist"
            >
              <HeartIcon />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-lg text-text hover:text-white" aria-label="Profil">
              <UserIcon />
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/cart"
              className="relative text-lg text-text hover:text-white"
              aria-label="Panier"
            >
              <ShoppingCartIcon />
            </Link>
            <Link
              to="/wishlist"
              className="relative text-lg text-text hover:text-white"
              aria-label="Wishlist"
            >
              <HeartIcon />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
            <Link
              to="/auth"
              className="text-lg text-text hover:text-white"
              aria-label="Authentification"
            >
              <UserIcon />
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default memo(Header);
