import { CartCalculations } from "@/utils/cartCalculations";
import type { CartItem, Star } from "@/types";

const makeStar = (overrides: Partial<Star> = {}): Star => ({
  starid: 1,
  name: "Sirius",
  description: "Brightest star",
  constellation: "Canis Major",
  distanceFromEarth: 8.6,
  luminosity: 25.4,
  mass: 2.1,
  magnitude: -1.46,
  price: 99.99,
  createdAt: "",
  updatedAt: "",
  ...overrides,
});

const makeCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 1,
  starId: 1,
  quantity: 1,
  Star: makeStar(),
  createdAt: "",
  updatedAt: "",
  cartId: 1,
  ...overrides,
});

describe("CartCalculations", () => {
  describe("calculateItemTotal", () => {
    it("returns price * quantity", () => {
      expect(CartCalculations.calculateItemTotal(10, 3)).toBe(30);
    });

    it("handles decimal prices", () => {
      expect(CartCalculations.calculateItemTotal(19.99, 2)).toBeCloseTo(39.98);
    });
  });

  describe("calculateCartTotal", () => {
    it("returns 0 for empty cart", () => {
      expect(CartCalculations.calculateCartTotal([])).toBe(0);
    });

    it("sums all items correctly", () => {
      const items = [
        makeCartItem({ quantity: 2, Star: makeStar({ price: 10 }) }),
        makeCartItem({ id: 2, quantity: 1, Star: makeStar({ price: 25 }) }),
      ];
      expect(CartCalculations.calculateCartTotal(items)).toBe(45);
    });
  });

  describe("formatPrice", () => {
    it("formats with 2 decimals and euro sign", () => {
      expect(CartCalculations.formatPrice(99.9)).toBe("99.90 €");
    });

    it("formats zero", () => {
      expect(CartCalculations.formatPrice(0)).toBe("0.00 €");
    });
  });

  describe("getCartStats", () => {
    it("returns correct stats for multiple items", () => {
      const items = [
        makeCartItem({ quantity: 3, Star: makeStar({ price: 10 }) }),
        makeCartItem({ id: 2, quantity: 2, Star: makeStar({ price: 20 }) }),
      ];
      const stats = CartCalculations.getCartStats(items);

      expect(stats.totalItems).toBe(5);
      expect(stats.totalAmount).toBe(70);
      expect(stats.averageItemPrice).toBe(14);
      expect(stats.formattedTotal).toBe("70.00 €");
    });

    it("handles empty cart", () => {
      const stats = CartCalculations.getCartStats([]);
      expect(stats.totalItems).toBe(0);
      expect(stats.totalAmount).toBe(0);
      expect(stats.averageItemPrice).toBe(0);
    });
  });

  describe("isEmpty", () => {
    it("returns true for empty array", () => {
      expect(CartCalculations.isEmpty([])).toBe(true);
    });

    it("returns false for non-empty array", () => {
      expect(CartCalculations.isEmpty([makeCartItem()])).toBe(false);
    });
  });

  describe("getTotalItemCount", () => {
    it("sums quantities across items", () => {
      const items = [
        makeCartItem({ quantity: 3 }),
        makeCartItem({ id: 2, quantity: 5 }),
      ];
      expect(CartCalculations.getTotalItemCount(items)).toBe(8);
    });
  });
});
