// Barrel file — components

// Layout
export { default as Header } from "./Header";
export { default as Footer } from "./Footer";
export { default as Navigation } from "./Navigation";
export { default as HeroSection } from "./HeroSection";
export { default as FadeInSection } from "./FadeInSection";
export { default as FloatingActions } from "./FloatingActions";
export { default as SkipLinks } from "./SkipLinks";
export { MobileNavigation, useIsMobile } from "./MobileNavigation";
export { default as MobileMenuOverlay } from "./MobileMenuOverlay";

// Forms
export { default as FormInput } from "./FormInput";
export { default as FormContainer } from "./FormContainer";
export { default as Login } from "./Login";
export { default as Register } from "./Register";
export { default as ChangePasswordForm } from "./ChangePasswordForm";

// Auth
export { default as AuthContainer } from "./AuthContainer";

// Stars
export { default as StarCard } from "./StarCard";
export { default as CatalogStarCard } from "./CatalogStarCard";
export { default as DetailStarCard } from "./DetailStarCard";
export { default as CartStarCard } from "./CartStarCard";
export { default as WishlistStarCard } from "./WishlistStarCard";

// Cart
export { default as ShoppingCart } from "./ShoppingCart";
export { default as CartItemsList } from "./CartItemsList";
export { default as CartSummary } from "./CartSummary";
export { default as CartEmptyState } from "./CartEmptyState";
export { default as AddToCartButton } from "./AddToCartButton";

// Wishlist
export { default as Wishlist } from "./Wishlist";
export { default as AddToWishlistButton } from "./AddToWishlistButton";

// Catalog
export { default as CatalogSearchBar } from "./CatalogSearchBar";
export { default as CatalogAdvancedFilters } from "./CatalogAdvancedFilters";
export { default as CatalogResultsGrid } from "./CatalogResultsGrid";
export { default as SearchBar } from "./SearchBar";
export { default as SearchInputField } from "./SearchInputField";
export { default as SearchSuggestionsList } from "./SearchSuggestionsList";
export { default as SearchToggleButton } from "./SearchToggleButton";

// Profile
export { default as Profile } from "./Profile";
export { default as UserProfileSection } from "./UserProfileSection";
export { default as ProfileCartSection } from "./ProfileCartSection";
export { default as ProfileWishlistSection } from "./ProfileWishlistSection";
export { default as UserMenu } from "./UserMenu";

// Reviews
export { default as ReviewSection } from "./ReviewSection";

// Collections
export { default as CollectionButton } from "./CollectionButton";

// Modals
export { default as AccessibleModal } from "./AccessibleModal";
export { default as ModalActions } from "./ModalActions";
export { default as ModalContent } from "./ModalContent";
export { default as ModalIcon } from "./ModalIcon";

// Accessibility
export { default as AccessibilityButton } from "./AccessibilityButton";
export { default as AccessibilityPanel } from "./AccessibilityPanel";
export { default as AccessibleHeader } from "./AccessibleHeader";
export { default as AccessiblePageLayout } from "./AccessiblePageLayout";
export { default as AccessibleSearchBox } from "./AccessibleSearchBox";

// UI primitives
export { default as Button } from "./Button";
export { default as StatusMessage } from "./StatusMessage";
export { default as Toast } from "./Toast";
export { default as CookieBanner } from "./CookieBanner";
export { default as NotificationProvider } from "./NotificationProvider";
export { TouchButton } from "./TouchButton";
export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonGrid,
  SkeletonProfile,
  SkeletonList,
} from "./Skeleton";
export { ResponsiveGrid, MobileCarousel, AdaptiveLayout } from "./ResponsiveGrid";

// Error handling
export { default as ErrorBoundary } from "./ErrorBoundary";
export { default as FeatureErrorBoundary } from "./FeatureErrorBoundary";
