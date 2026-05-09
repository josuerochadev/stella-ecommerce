import { useAuth } from "@/context/AuthContext";
import { useCollectionOperation } from "@/hooks/useApiCall";
import { ARIA_LABELS } from "@/utils/accessibility";
import { HeartIcon, ShoppingCartIcon } from "@/utils/icons";
import { useNavigate } from "react-router-dom";

interface CollectionButtonProps {
  type: "cart" | "wishlist";
  starId: number;
  isInCollection?: boolean;
  quantity?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  showLabel?: boolean;
}

const CollectionButton: React.FC<CollectionButtonProps> = ({
  type,
  starId,
  isInCollection = false,
  quantity = 1,
  onSuccess,
  onError,
  className = "",
  size = "md",
  variant = "default",
  showLabel = true,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { isLoading, execute } = useCollectionOperation(type, {
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });

  const config = {
    cart: {
      icon: ShoppingCartIcon,
      addLabel: "Ajouter au panier",
      removeLabel: "Retirer du panier",
      inCollectionLabel: "Dans le panier",
      loginMessage: "Connectez-vous pour ajouter au panier",
      ariaLabel: ARIA_LABELS.ADD_TO_CART,
    },
    wishlist: {
      icon: HeartIcon,
      addLabel: "Ajouter aux favoris",
      removeLabel: "Retirer des favoris",
      inCollectionLabel: "En favoris",
      loginMessage: "Connectez-vous pour ajouter aux favoris",
      ariaLabel: ARIA_LABELS.ADD_TO_WISHLIST,
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const variantClasses = {
    default: isInCollection
      ? "bg-accent text-white"
      : "bg-primary text-text hover:bg-accent hover:text-white",
    outline: isInCollection
      ? "border-2 border-accent text-accent bg-accent/10"
      : "border-2 border-primary text-text hover:border-accent hover:text-accent",
  };

  const baseClasses = `
    flex items-center justify-center space-x-2 rounded-md
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  const handleClick = async () => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: window.location.pathname,
          message: currentConfig.loginMessage,
        },
      });
      return;
    }

    // Import dynamic pour éviter les dépendances circulaires
    if (type === "cart") {
      const { addToCart, removeFromCart } = await import("../services/api");
      if (isInCollection) {
        await execute(() => removeFromCart(starId));
      } else {
        await execute(() => addToCart(starId, quantity));
      }
    } else {
      const { addToWishlist, removeFromWishlist } = await import("../services/api");
      if (isInCollection) {
        await execute(() => removeFromWishlist(starId));
      } else {
        await execute(() => addToWishlist(starId));
      }
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return isInCollection ? "Suppression..." : "Ajout...";
    }
    if (isInCollection) {
      return showLabel ? currentConfig.inCollectionLabel : "";
    }
    return showLabel ? currentConfig.addLabel : "";
  };

  const getAriaLabel = () => {
    if (isInCollection) {
      return type === "cart" ? ARIA_LABELS.REMOVE_FROM_CART : ARIA_LABELS.REMOVE_FROM_WISHLIST;
    }
    return currentConfig.ariaLabel;
  };

  return (
    <button
      type="button"
      className={baseClasses}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={getAriaLabel()}
    >
      {isLoading ? (
        <div className="motion-safe:animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <Icon className="h-4 w-4" />
      )}

      {showLabel && <span className="hidden sm:inline">{getButtonText()}</span>}
    </button>
  );
};

export default CollectionButton;
