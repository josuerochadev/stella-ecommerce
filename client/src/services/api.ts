import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
  User,
  UserProfileData,
  Star,
  OrderData,
  Order,
  OrderStatus,
  Cart,
  Review,
  GetWishlistResponse,
  AddToWishlistResponse,
  ApiResponse,
} from "../types";

// Utility function to read a cookie by its name
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

// Axios instance configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allows sending cookies
});

// Interceptor to add authentication and CSRF tokens to each request
api.interceptors.request.use(
  (config) => {
    // Add CSRF token from cookie
    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // Add authentication token if present
    const authToken = localStorage.getItem("token");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Function to fetch all stars
export const fetchStars = async (): Promise<ApiResponse<Star[]>> => {
  const response = await api.get<ApiResponse<Star[]>>("/stars");
  return response.data;
};

// Function to fetch a star by ID
export const fetchStarById = async (starid: number): Promise<Star> => {
  const response = await api.get(`/stars/${starid}`);
  return response.data;
};

// Function to filter stars
export const filterStars = async (params: {
  constellation?: string;
  minMagnitude?: number;
  maxMagnitude?: number;
}): Promise<ApiResponse<Star[]>> => {
  const response = await api.get<ApiResponse<Star[]>>("/stars/filter", { params });
  return response.data;
};

// Function to search stars
export const searchStars = async (query: string): Promise<Star[]> => {
  const response = await api.get<Star[]>("/stars/search", { params: { q: query } });
  return response.data;
};

// Authentication
export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<{ token: string; userId: number }> => {
  const response = await api.post<{ token: string; userId: number }>("/users/register", userData);
  return response.data;
};

export const loginUser = async (loginData: { email: string; password: string }): Promise<{
  data: User;
  token: string;
}> => {
  const response = await api.post<{ data: User; token: string }>("/users/login", loginData);
  return response.data;
};

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<User>("/users/profile");
  return response.data;
};

export const updateUserProfile = async (userData: UserProfileData): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>("/users/profile", userData);
  return response.data;
};

export const logoutUser = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/users/logout");
  return response.data;
};

export const deleteUserAccount = async (): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>("/users/me");
  return response.data;
};

// Cart management
export const getCart = async (): Promise<Cart> => {
  const response = await api.get<Cart>("/cart");
  return response.data;
};

export const addToCart = async (starId: number, quantity: number): Promise<ApiResponse<Cart>> => {
  const response = await api.post<ApiResponse<Cart>>("/cart/add", { starId, quantity });
  return response.data;
};

export const updateCartItem = async (
  cartItemId: number,
  quantity: number,
): Promise<ApiResponse<Cart>> => {
  const response = await api.put<ApiResponse<Cart>>("/cart/update", { cartItemId, quantity });
  return response.data;
};

export const removeFromCart = async (cartItemId: number): Promise<ApiResponse<Cart>> => {
  const response = await api.delete<ApiResponse<Cart>>(`/cart/remove/${cartItemId}`);
  return response.data;
};

// Wishlist
export const getWishlist = async (): Promise<GetWishlistResponse> => {
  const response = await api.get<GetWishlistResponse>("/wishlist");
  return response.data;
};

export const addToWishlist = async (starId: number): Promise<AddToWishlistResponse> => {
  const response = await api.post<AddToWishlistResponse>("/wishlist/add", { starId });
  return response.data;
};

export const removeFromWishlist = async (starId: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/wishlist/remove/${starId}`);
  return response.data;
};

// Orders
export const createOrder = async (orderData: OrderData): Promise<ApiResponse<Order>> => {
  const response = await api.post<ApiResponse<Order>>("/orders", orderData);
  return response.data;
};

export const getUserOrders = async (): Promise<ApiResponse<Order[]>> => {
  const response = await api.get<ApiResponse<Order[]>>("/orders");
  return response.data;
};

export const getOrderDetails = async (orderId: string): Promise<ApiResponse<Order>> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
): Promise<ApiResponse<Order>> => {
  const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/update-status`, {
    status,
  });
  return response.data;
};

// Reviews
export const getReviewsForStar = async (starId: number): Promise<ApiResponse<Review[]>> => {
  const response = await api.get<ApiResponse<Review[]>>("/reviews", { params: { starId } });
  return response.data;
};

export const addReview = async (reviewData: {
  starId: number;
  rating: number;
  comment: string;
}): Promise<ApiResponse<Review>> => {
  const response = await api.post<ApiResponse<Review>>("/reviews/add", reviewData);
  return response.data;
};

export const updateReview = async (
  reviewId: number,
  reviewData: { rating?: number; comment?: string },
): Promise<ApiResponse<Review>> => {
  const response = await api.put<ApiResponse<Review>>(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/reviews/${reviewId}`);
  return response.data;
};

export default api;
