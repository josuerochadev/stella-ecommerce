// client/src/types/index.ts

// User related types
export interface User {
  token: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "client" | "admin";
}

export interface UserProfileData {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Star related types
export interface Star {
  starid: number;
  name: string;
  description: string;
  constellation: string;
  distanceFromEarth: number;
  luminosity: number;
  mass: number;
  magnitude: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Order related types
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  starId: number;
  quantity: number;
}

export interface OrderData {
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: "credit_card" | "paypal" | "bank_transfer";
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Cart related types
export interface Cart {
  id: number;
  userId: number;
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
}
export interface CartItem {
  id: number;
  starId: number;
  quantity: number;
  Star: Star;
  createdAt: string;
  updatedAt: string;
  cartId: number;
}

// Review related types
export interface Review {
  id: number;
  userId: number;
  starId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// Wishlist related types
export interface GetWishlistResponse {
  message: string;
  wishlist: WishlistItem[];
}
export interface AddToWishlistResponse {
  message: string;
  wishlistItem: WishlistItem;
}

export interface WishlistItem {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  starId: number;
  Star: Star;
}

// API response types
export interface ApiResponse<T> {
  message: string;
  data: T;
  status: number;
}
