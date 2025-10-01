// client/src/utils/dataTransformers.ts
// Responsabilité unique : Transformations de données réutilisables

import type { Star, CartItem, WishlistItem } from "@/types";

/**
 * Transformateur pour normaliser les prix des étoiles
 * Responsabilité : Conversion string → number pour les prix
 */
export const transformStarPrice = (star: Star): Star => {
  return {
    ...star,
    price: typeof star.price === "string" ? Number.parseFloat(star.price) : star.price,
  };
};

/**
 * Transformateur pour les items de la wishlist
 * Responsabilité : Normalisation des étoiles dans les items wishlist
 */
export const transformWishlistItem = (item: WishlistItem): WishlistItem => {
  if (!item.Star) {
    return item;
  }

  return {
    ...item,
    Star: transformStarPrice(item.Star),
  };
};

/**
 * Transformateur pour les items du panier
 * Responsabilité : Normalisation des étoiles dans les items panier
 */
export const transformCartItem = (item: CartItem): CartItem => {
  if (!item.Star) {
    return item;
  }

  return {
    ...item,
    Star: transformStarPrice(item.Star),
  };
};

/**
 * Transformateur en lot pour les listes de wishlist
 * Responsabilité : Transformation optimisée pour les listes
 */
export const transformWishlistItems = (items: WishlistItem[]): WishlistItem[] => {
  return items.map(transformWishlistItem);
};

/**
 * Transformateur en lot pour les listes de panier
 * Responsabilité : Transformation optimisée pour les listes
 */
export const transformCartItems = (items: CartItem[]): CartItem[] => {
  return items.map(transformCartItem);
};

/**
 * Utilitaire pour normaliser les prix dans toute structure contenant une étoile
 * Responsabilité : Transformation générique pour objets avec propriété Star
 */
export const normalizeStarPrices = <T extends { Star?: Star }>(
  items: T[]
): T[] => {
  return items.map(item => {
    if (!item.Star) {
      return item;
    }

    return {
      ...item,
      Star: transformStarPrice(item.Star),
    };
  });
};

/**
 * Validation et transformation sécurisée des nombres
 * Responsabilité : Conversion string → number avec validation
 */
export const safeNumberTransform = (value: string | number, fallback: number = 0): number => {
  if (typeof value === "number") {
    return isNaN(value) ? fallback : value;
  }

  const parsed = Number.parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};