// client/src/utils/pathHelpers.ts
// Responsabilité unique : Génération de chemins d'accès aux ressources

import type { Star } from "@/types";

/**
 * Génère le chemin d'accès à l'image d'une étoile
 * Responsabilité : Normalisation des chemins d'images d'étoiles
 *
 * @param star - L'étoile ou son nom
 * @returns Le chemin relatif vers l'image de l'étoile
 *
 * @example
 * getStarImagePath({ name: "Sirius", ... })
 * // => "/assets/images/stars/sirius.jpg"
 *
 * getStarImagePath("Alpha Centauri")
 * // => "/assets/images/stars/alphacentauri.jpg"
 */
export const getStarImagePath = (star: Star | string): string => {
  const starName = typeof star === "string" ? star : star.name;
  const normalizedName = starName.toLowerCase().replace(/\s+/g, "");
  return `/assets/images/stars/${normalizedName}.jpg`;
};