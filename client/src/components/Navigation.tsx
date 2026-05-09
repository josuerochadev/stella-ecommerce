import { HomeIcon } from "@/utils/icons";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  pageTitle: string;
  isTitleVisible: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ pageTitle, isTitleVisible }) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="flex items-center space-x-3">
      {/* Home link */}
      <Link
        to="/"
        aria-label="Accueil"
        aria-current={isHome ? "page" : undefined}
        className="text-lg text-text hover:text-white"
      >
        <HomeIcon className="text-xl text-text" />
      </Link>

      {/* Page title when not visible in viewport */}
      {!isTitleVisible && <span className="text-lg font-serif">{pageTitle}</span>}
    </div>
  );
};

export default Navigation;
