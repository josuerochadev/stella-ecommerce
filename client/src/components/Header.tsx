import { usePageTitleOnScroll } from "@/hooks/usePageTitleOnScroll";
import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const Header: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isTitleVisible, pageTitle } = usePageTitleOnScroll();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const isOnCatalogPage = location.pathname === "/catalog";
  const isHome = location.pathname === "/";

  const headerClasses = [
    "fixed top-0 left-0 right-0 z-50",
    "flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-20 h-[52px]",
    "transition-all duration-300 ease-in-out",
    scrolled
      ? "bg-purple-950/88 backdrop-blur-xl border-b border-text/[0.06]"
      : isHome
        ? "bg-transparent border-b border-transparent"
        : "bg-background-inverse border-b border-transparent shadow-lg",
  ].join(" ");

  return (
    <header id="navigation" className={headerClasses}>
      <Navigation pageTitle={pageTitle} isTitleVisible={isTitleVisible} />

      <div className="flex items-center space-x-4 relative">
        {!isOnCatalogPage && <SearchBar isVisible={isSearchVisible} onToggle={toggleSearch} />}
        <UserMenu />
      </div>
    </header>
  );
};

export default memo(Header);
