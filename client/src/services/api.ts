// client/src/services/api.ts
// Responsabilité unique : Orchestrateur et point d'entrée unifié pour tous les services API

// Import des services spécialisés suivant le principe SRP
export * from "./httpClient";
export * from "./authService";
export * from "./userService";
export * from "./cartService";
export * from "./wishlistService";
export * from "./orderService";
export * from "./starService";
export * from "./reviewService";

// Réexport des types pour compatibilité
export type {
  User,
  UserProfileData,
  Star,
  StarFromServer,
  OrderData,
  Order,
  OrderStatus,
  Cart,
  Review,
  GetWishlistResponse,
  AddToWishlistResponse,
  ApiResponse,
} from "../types";

/**
 * Service API unifié - Point d'entrée principal
 *
 * Ce fichier sert d'orchestrateur pour tous les services API spécialisés.
 * Chaque service a une responsabilité unique selon le principe SRP :
 *
 * - httpClient.ts     : Configuration HTTP et interceptors
 * - authService.ts    : Authentification des utilisateurs
 * - userService.ts    : Gestion des profils utilisateurs
 * - cartService.ts    : CRUD du panier d'achat
 * - wishlistService.ts : CRUD de la liste d'envies
 * - orderService.ts   : Gestion des commandes
 * - starService.ts    : Catalogue et recherche d'étoiles
 * - reviewService.ts  : Gestion des avis clients
 *
 * Usage:
 * import { AuthService, CartService, StarService } from './services/api';
 *
 * Ou imports nommés pour compatibilité:
 * import { loginUser, addToCart, fetchStars } from './services/api';
 */