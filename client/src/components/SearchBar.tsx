import { useState, useEffect, useCallback } from "react";
import { SearchIcon } from "../utils/icons";
import { searchStars } from "../services/api";
import { useNavigate } from "react-router-dom";
import type { Star } from "../types";

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

interface SearchBarProps {
  isVisible: boolean;
  onToggle: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isVisible, onToggle }) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Star[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchValue.trim())}`);
      onToggle();
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

  const handleCatalogSearch = () => {
    navigate(`/catalog?q=${encodeURIComponent(searchValue.trim())}`);
    onToggle();
    setSearchValue("");
    setSuggestions([]);
  };

  return (
    <>
      {/* Search input */}
      {isVisible && (
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
              aria-expanded={isVisible}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text hover:text-white focus:outline-none"
              aria-label="Rechercher"
            >
              <SearchIcon size={16} />
            </button>
          </form>

          {/* Search suggestions */}
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
                      onMouseDown={handleCatalogSearch}
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

      {/* Search toggle button */}
      {!isVisible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isVisible}
          className="text-text hover:text-white focus:outline-none"
          title="Recherche rapide"
        >
          <SearchIcon className="text-xl" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className="text-text hover:text-white focus:outline-none ml-2"
          title="Fermer la recherche"
        >
          ✕
        </button>
      )}
    </>
  );
};

export default SearchBar;