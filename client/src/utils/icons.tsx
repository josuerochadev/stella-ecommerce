import React from 'react';
import {
  FaShoppingCart,
  FaHeart,
  FaHome,
  FaSearch,
  FaStore,
  FaUser,
  FaTimes,
  FaBars,
  FaArrowLeft,
  FaEye,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';

// Interfaces pour les props des icônes
interface IconProps {
  className?: string;
  size?: number | string;
  [key: string]: any;
}

// Wrapper simplifié pour corriger les problèmes de types TypeScript
const createIconWrapper = (OriginalIcon: any) => {
  const WrappedIcon: React.FC<IconProps> = (props) => {
    return React.createElement(OriginalIcon, props);
  };
  return WrappedIcon;
};

// Export des icônes avec les types corrigés
export const ShoppingCartIcon = createIconWrapper(FaShoppingCart);
export const HeartIcon = createIconWrapper(FaHeart);
export const HomeIcon = createIconWrapper(FaHome);
export const SearchIcon = createIconWrapper(FaSearch);
export const StoreIcon = createIconWrapper(FaStore);
export const UserIcon = createIconWrapper(FaUser);
export const TimesIcon = createIconWrapper(FaTimes);
export const BarsIcon = createIconWrapper(FaBars);
export const ArrowLeftIcon = createIconWrapper(FaArrowLeft);
export const EyeIcon = createIconWrapper(FaEye);
export const TrashIcon = createIconWrapper(FaTrash);
export const ArrowUpIcon = createIconWrapper(FaArrowUp);
export const ArrowDownIcon = createIconWrapper(FaArrowDown);