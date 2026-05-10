import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { HeartIcon, ShoppingCartIcon, StoreIcon, UserIcon } from "@/utils/icons";
import { Link } from "react-router-dom";

const UserMenu: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const cartItemCount = useCartStore((state) => state.cartItems.length);
  const wishlistItemCount = useWishlistStore((state) => state.wishlistItems.length);

  const CartIcon = () => (
    <Link
      to="/cart"
      className="relative text-lg text-text/70 hover:text-white transition-colors duration-200"
      aria-label="Panier"
    >
      <ShoppingCartIcon />
      {cartItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-special text-primary rounded-full text-xs w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold font-sans">
          {cartItemCount}
        </span>
      )}
    </Link>
  );

  const WishlistIcon = () => (
    <Link
      to="/wishlist"
      className="relative text-lg text-text/70 hover:text-white transition-colors duration-200"
      aria-label="Wishlist"
    >
      <HeartIcon />
      {wishlistItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-special text-primary rounded-full text-xs w-[14px] h-[14px] flex items-center justify-center text-[8px] font-bold font-sans">
          {wishlistItemCount}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Catalog link */}
      <Link
        to="/catalog"
        className="text-lg text-text/70 hover:text-white transition-colors duration-200"
        aria-label="Catalogue"
      >
        <StoreIcon className="text-xl" />
      </Link>

      <CartIcon />
      <WishlistIcon />

      {isAuthenticated ? (
        <Link
          to="/profile"
          className="text-lg text-text/70 hover:text-white transition-colors duration-200"
          aria-label="Profil"
        >
          <UserIcon />
        </Link>
      ) : (
        <Link
          to="/auth"
          className="text-lg text-text/70 hover:text-white transition-colors duration-200"
          aria-label="Authentification"
        >
          <UserIcon />
        </Link>
      )}
    </>
  );
};

export default UserMenu;
