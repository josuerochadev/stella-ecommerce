// Barrel file — services

export { httpClient } from "./httpClient";
export { AuthService, type LoginResponse, type RegisterResponse } from "./authService";
export { CartService, getCart, addToCart, updateCartItem, removeFromCart } from "./cartService";
export { OrderService } from "./orderService";
export { ReviewService } from "./reviewService";
export { StarService } from "./starService";
export { UserService } from "./userService";
export { WishlistService } from "./wishlistService";
export { errorService } from "./errorService";
export {
  FieldValidationService,
  FormValidationService,
  BusinessValidationService,
} from "./validationService";
