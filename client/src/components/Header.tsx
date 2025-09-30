import { useState, memo } from "react";
import { useLocation } from "react-router-dom";
import { usePageTitleOnScroll } from "@/hooks/usePageTitleOnScroll";
import SearchBar from "./SearchBar";
import Navigation from "./Navigation";
import UserMenu from "./UserMenu";

const Header: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { isTitleVisible, pageTitle } = usePageTitleOnScroll();
  const location = useLocation();

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  // Masquer la barre de recherche sur la page Catalogue
  const isOnCatalogPage = location.pathname === "/catalog";

  return (
    <header className="bg-background-inverse text-text fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-20 shadow-lg h-12 transition-all duration-300 ease-in-out">
      <Navigation pageTitle={pageTitle} isTitleVisible={isTitleVisible} />

      <div className="flex items-center space-x-3 relative">
        {!isOnCatalogPage && (
          <SearchBar isVisible={isSearchVisible} onToggle={toggleSearch} />
        )}
        <UserMenu />
      </div>
    </header>
  );
};

export default memo(Header);
