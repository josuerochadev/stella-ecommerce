import { Link } from "react-router-dom";
import { HomeIcon, StoreIcon } from "../utils/icons";

interface NavigationProps {
  pageTitle: string;
  isTitleVisible: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ pageTitle, isTitleVisible }) => {
  return (
    <>
      {/* Home link */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="text-lg text-text hover:text-white">
          <HomeIcon className="text-xl text-text" />
        </Link>
      </div>

      {/* Page title when not visible in viewport */}
      <div className="flex items-center space-x-3">
        {!isTitleVisible && <span className="text-lg font-serif">{pageTitle}</span>}
      </div>

      {/* Catalog link */}
      <Link to="/catalog" className="text-lg text-text hover:text-white" aria-label="Catalogue">
        <StoreIcon className="text-xl" />
      </Link>
    </>
  );
};

export default Navigation;