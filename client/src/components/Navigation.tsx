import { Link } from "react-router-dom";
import { HomeIcon } from "../utils/icons";

interface NavigationProps {
  pageTitle: string;
  isTitleVisible: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ pageTitle, isTitleVisible }) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Home link */}
      <Link to="/" className="text-lg text-text hover:text-white">
        <HomeIcon className="text-xl text-text" />
      </Link>

      {/* Page title when not visible in viewport */}
      {!isTitleVisible && <span className="text-lg font-serif">{pageTitle}</span>}
    </div>
  );
};

export default Navigation;