const { CartService } = require("../../src/services/CartService");

// Mock sequelize.transaction
jest.mock("../../src/models", () => ({
  sequelize: {
    transaction: jest.fn((callback) =>
      callback({ commit: jest.fn(), rollback: jest.fn() }),
    ),
  },
}));

function createMockCartRepository() {
  return {
    findByUserId: jest.fn(),
    create: jest.fn(),
    findCartItem: jest.fn(),
    addCartItem: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    removeCartItem: jest.fn(),
    clearCart: jest.fn(),
    countCartItems: jest.fn(),
  };
}

function createMockStarRepository() {
  return {
    exists: jest.fn(),
  };
}

describe("CartService", () => {
  let cartService;
  let cartRepo;
  let starRepo;

  beforeEach(() => {
    cartRepo = createMockCartRepository();
    starRepo = createMockStarRepository();
    cartService = new CartService(cartRepo, starRepo);
  });

  describe("getCart", () => {
    it("returns cart when it exists", async () => {
      const mockCart = {
        id: 1,
        userId: 1,
        cartItems: [{ id: 1, starId: 10, quantity: 2 }],
      };
      cartRepo.findByUserId.mockResolvedValue(mockCart);

      const result = await cartService.getCart(1);
      expect(result).toEqual(mockCart);
      expect(cartRepo.findByUserId).toHaveBeenCalledWith(1);
    });

    it("returns empty cart when none exists", async () => {
      cartRepo.findByUserId.mockResolvedValue(null);

      const result = await cartService.getCart(1);
      expect(result).toEqual({ cartItems: [] });
    });

    it("throws on invalid userId", async () => {
      await expect(cartService.getCart(null)).rejects.toThrow(
        "User ID must be a valid number",
      );
      await expect(cartService.getCart("abc")).rejects.toThrow(
        "User ID must be a valid number",
      );
    });
  });

  describe("addToCart", () => {
    it("creates new cart item when item does not exist", async () => {
      starRepo.exists.mockResolvedValue(true);
      cartRepo.findByUserId.mockResolvedValue({ id: 1, userId: 1 });
      cartRepo.findCartItem.mockResolvedValue(null);
      cartRepo.addCartItem.mockResolvedValue({
        id: 1,
        cartId: 1,
        starId: 10,
        quantity: 1,
      });

      const result = await cartService.addToCart(1, 10, 1);
      expect(result).toEqual({ id: 1, cartId: 1, starId: 10, quantity: 1 });
    });

    it("updates quantity when item already exists", async () => {
      starRepo.exists.mockResolvedValue(true);
      cartRepo.findByUserId.mockResolvedValue({ id: 1, userId: 1 });
      cartRepo.findCartItem.mockResolvedValue({
        id: 5,
        starId: 10,
        quantity: 2,
      });
      cartRepo.updateCartItemQuantity.mockResolvedValue({
        id: 5,
        starId: 10,
        quantity: 3,
      });

      const result = await cartService.addToCart(1, 10, 1);
      expect(result.quantity).toBe(3);
      expect(cartRepo.updateCartItemQuantity).toHaveBeenCalledWith(
        5,
        3,
        expect.anything(),
      );
    });

    it("throws when star does not exist", async () => {
      starRepo.exists.mockResolvedValue(false);

      await expect(cartService.addToCart(1, 999, 1)).rejects.toThrow(
        "Star not found",
      );
    });

    it("throws when userId or starId is missing", async () => {
      await expect(cartService.addToCart(null, 10, 1)).rejects.toThrow(
        "User ID and Star ID are required",
      );
      await expect(cartService.addToCart(1, null, 1)).rejects.toThrow(
        "User ID and Star ID are required",
      );
    });

    it("throws when quantity is invalid", async () => {
      await expect(cartService.addToCart(1, 10, 0)).rejects.toThrow(
        "Quantity must be a positive number",
      );
      await expect(cartService.addToCart(1, 10, -1)).rejects.toThrow(
        "Quantity must be a positive number",
      );
    });
  });

  describe("removeFromCart", () => {
    it("removes an existing cart item", async () => {
      cartRepo.findByUserId.mockResolvedValue({
        id: 1,
        cartItems: [{ id: 5, starId: 10 }],
      });
      cartRepo.removeCartItem.mockResolvedValue(true);

      const result = await cartService.removeFromCart(1, 5);
      expect(result).toBe(true);
      expect(cartRepo.removeCartItem).toHaveBeenCalledWith(5);
    });

    it("throws when cart does not exist", async () => {
      cartRepo.findByUserId.mockResolvedValue(null);

      await expect(cartService.removeFromCart(1, 5)).rejects.toThrow(
        "Cart not found",
      );
    });

    it("throws when cart item not in cart", async () => {
      cartRepo.findByUserId.mockResolvedValue({
        id: 1,
        cartItems: [{ id: 3, starId: 5 }],
      });

      await expect(cartService.removeFromCart(1, 99)).rejects.toThrow(
        "Cart item not found",
      );
    });
  });

  describe("clearCart", () => {
    it("clears existing cart", async () => {
      cartRepo.findByUserId.mockResolvedValue({ id: 1 });
      cartRepo.clearCart.mockResolvedValue(true);

      const result = await cartService.clearCart(1);
      expect(result).toBe(true);
    });

    it("returns true when cart does not exist", async () => {
      cartRepo.findByUserId.mockResolvedValue(null);

      const result = await cartService.clearCart(1);
      expect(result).toBe(true);
    });
  });

  describe("calculateCartTotal", () => {
    it("calculates total from cart items", async () => {
      cartRepo.findByUserId.mockResolvedValue({
        id: 1,
        cartItems: [
          { id: 1, quantity: 2, Star: { price: 10.5 } },
          { id: 2, quantity: 1, Star: { price: 25.0 } },
        ],
      });

      const total = await cartService.calculateCartTotal(1);
      expect(total).toBeCloseTo(46.0);
    });

    it("returns 0 for empty cart", async () => {
      cartRepo.findByUserId.mockResolvedValue({ id: 1, cartItems: [] });

      const total = await cartService.calculateCartTotal(1);
      expect(total).toBe(0);
    });

    it("returns 0 when no cart exists", async () => {
      cartRepo.findByUserId.mockResolvedValue(null);

      const total = await cartService.calculateCartTotal(1);
      expect(total).toBe(0);
    });
  });

  describe("validateCart", () => {
    it("validates a cart with items", async () => {
      const mockCart = {
        id: 1,
        cartItems: [{ id: 1, starId: 10, Star: { name: "Sirius" } }],
      };
      cartRepo.findByUserId.mockResolvedValue(mockCart);

      const result = await cartService.validateCart(1);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.cart).toEqual(mockCart);
    });

    it("rejects empty cart", async () => {
      cartRepo.findByUserId.mockResolvedValue({ id: 1, cartItems: [] });

      const result = await cartService.validateCart(1);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Cart is empty");
    });

    it("rejects cart with missing stars", async () => {
      cartRepo.findByUserId.mockResolvedValue({
        id: 1,
        cartItems: [{ id: 1, starId: 999, Star: null }],
      });

      const result = await cartService.validateCart(1);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Star 999 not found/);
    });
  });
});
