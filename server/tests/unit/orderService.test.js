const { OrderService } = require("../../src/services/OrderService");

// Mock sequelize and OrderStar
jest.mock("../../src/models", () => {
  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };
  return {
    sequelize: {
      transaction: jest.fn(() => Promise.resolve(mockTransaction)),
    },
    OrderStar: {
      bulkCreate: jest.fn(),
    },
  };
});

function createMockOrderRepository() {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    belongsToUser: jest.fn(),
    updateStatus: jest.fn(),
  };
}

function createMockStarRepository() {
  return {
    findAll: jest.fn(),
    exists: jest.fn(),
  };
}

function createMockUserRepository() {
  return {
    findById: jest.fn(),
  };
}

describe("OrderService", () => {
  let orderService;
  let orderRepo;
  let starRepo;
  let userRepo;

  beforeEach(() => {
    jest.clearAllMocks();
    orderRepo = createMockOrderRepository();
    starRepo = createMockStarRepository();
    userRepo = createMockUserRepository();
    orderService = new OrderService(orderRepo, starRepo, userRepo);
  });

  describe("createOrder", () => {
    const validItems = [{ starId: 1, quantity: 2 }];

    beforeEach(() => {
      userRepo.findById.mockResolvedValue({ id: 1, role: "user" });
      starRepo.findAll.mockResolvedValue([{ starid: 1, price: "49.99" }]);
      orderRepo.create.mockResolvedValue({
        id: 10,
        status: "pending",
        totalAmount: 99.98,
      });
    });

    it("creates order with correct total", async () => {
      const result = await orderService.createOrder(
        1,
        validItems,
        "123 Rue de Paris",
        "credit_card",
      );
      expect(result.orderId).toBe(10);
      expect(result.total).toBeCloseTo(99.98);
      expect(result.status).toBe("pending");
    });

    it("throws on invalid userId", async () => {
      await expect(
        orderService.createOrder(null, validItems, "123 Rue", "credit_card"),
      ).rejects.toThrow("User ID must be a valid number");
    });

    it("throws on empty items array", async () => {
      await expect(orderService.createOrder(1, [], "123 Rue", "credit_card")).rejects.toThrow(
        "Items must be a non-empty array",
      );
    });

    it("throws on missing shipping address", async () => {
      await expect(orderService.createOrder(1, validItems, "", "credit_card")).rejects.toThrow(
        "Shipping address is required",
      );
    });

    it("throws on missing payment method", async () => {
      await expect(orderService.createOrder(1, validItems, "123 Rue", "")).rejects.toThrow(
        "Payment method is required",
      );
    });

    it("throws when user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      await expect(
        orderService.createOrder(999, validItems, "123 Rue", "credit_card"),
      ).rejects.toThrow("User with id 999 not found");
    });

    it("throws when star not found", async () => {
      starRepo.findAll.mockResolvedValue([]);

      await expect(
        orderService.createOrder(1, validItems, "123 Rue", "credit_card"),
      ).rejects.toThrow("Stars not found");
    });
  });

  describe("getUserOrders", () => {
    it("returns user orders", async () => {
      const mockOrders = [
        { id: 1, status: "paid" },
        { id: 2, status: "pending" },
      ];
      orderRepo.findByUserId.mockResolvedValue(mockOrders);

      const result = await orderService.getUserOrders(1);
      expect(result).toEqual(mockOrders);
    });

    it("throws on invalid userId", async () => {
      await expect(orderService.getUserOrders("abc")).rejects.toThrow(
        "User ID must be a valid number",
      );
    });
  });

  describe("getOrderDetails", () => {
    it("returns order details when user owns the order", async () => {
      orderRepo.belongsToUser.mockResolvedValue(true);
      orderRepo.findById.mockResolvedValue({
        id: 1,
        status: "paid",
        totalAmount: 99.99,
      });

      const result = await orderService.getOrderDetails(1, 1);
      expect(result.id).toBe(1);
    });

    it("throws when order does not belong to user", async () => {
      orderRepo.belongsToUser.mockResolvedValue(false);

      await expect(orderService.getOrderDetails(1, 2)).rejects.toThrow("Order not found");
    });
  });

  describe("cancelOrder", () => {
    it("cancels a pending order", async () => {
      orderRepo.belongsToUser.mockResolvedValue(true);
      orderRepo.findById.mockResolvedValue({ id: 1, status: "pending" });
      orderRepo.updateStatus.mockResolvedValue({
        id: 1,
        status: "cancelled",
      });

      const result = await orderService.cancelOrder(1, 1);
      expect(result.status).toBe("cancelled");
    });

    it("throws when order is not pending", async () => {
      orderRepo.belongsToUser.mockResolvedValue(true);
      orderRepo.findById.mockResolvedValue({ id: 1, status: "paid" });

      await expect(orderService.cancelOrder(1, 1)).rejects.toThrow(
        "Only pending orders can be cancelled",
      );
    });

    it("throws when order not found", async () => {
      orderRepo.belongsToUser.mockResolvedValue(false);

      await expect(orderService.cancelOrder(999, 1)).rejects.toThrow("Order not found");
    });
  });

  describe("getUserOrderStats", () => {
    it("computes correct stats", async () => {
      orderRepo.findByUserId.mockResolvedValue([
        { id: 1, status: "paid", total: "49.99" },
        { id: 2, status: "paid", total: "25.00" },
        { id: 3, status: "pending", total: "10.00" },
      ]);

      const stats = await orderService.getUserOrderStats(1);
      expect(stats.totalOrders).toBe(3);
      expect(stats.totalSpent).toBeCloseTo(84.99);
      expect(stats.ordersByStatus.paid).toBe(2);
      expect(stats.ordersByStatus.pending).toBe(1);
    });

    it("returns empty stats for no orders", async () => {
      orderRepo.findByUserId.mockResolvedValue([]);

      const stats = await orderService.getUserOrderStats(1);
      expect(stats.totalOrders).toBe(0);
      expect(stats.totalSpent).toBe(0);
    });
  });
});
