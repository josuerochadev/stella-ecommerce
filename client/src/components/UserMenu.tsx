import { Link } from "react-router-dom";
import { UserIcon, ShoppingCartIcon, HeartIcon } from "../utils/icons";
import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";

const UserMenu: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const cartItemCount = useCartStore((state) => state.cartItems.length);
  const wishlistItemCount = useWishlistStore((state) => state.wishlistItems.length);

  const CartIcon = () => (
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
  );

  const WishlistIcon = () => (
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
  );

  if (isAuthenticated) {
    return (
      <>
        <CartIcon />
        <WishlistIcon />
        <Link to="/profile" className="text-lg text-text hover:text-white" aria-label="Profil">
          <UserIcon />
        </Link>
      </>
    );
  }

  return (
    <>
      <CartIcon />
      <WishlistIcon />
      <Link
        to="/auth"
        className="text-lg text-text hover:text-white"
        aria-label="Authentification"
      >
        <UserIcon />
      </Link>
    </>
  );
};

export default UserMenu;