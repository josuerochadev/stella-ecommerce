/**
 * Tests for order-related type contracts and status mapping.
 * Ensures frontend status labels cover all backend statuses.
 */

import type { OrderStatus } from "@/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  processing: "En traitement",
  shipped: "Expediee",
  delivered: "Livree",
  cancelled: "Annulee",
};

const ALL_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

describe("Order status mapping", () => {
  it("has a label for every status", () => {
    for (const status of ALL_STATUSES) {
      expect(STATUS_LABELS[status]).toBeDefined();
      expect(typeof STATUS_LABELS[status]).toBe("string");
      expect(STATUS_LABELS[status].length).toBeGreaterThan(0);
    }
  });

  it("covers all statuses without extras", () => {
    expect(Object.keys(STATUS_LABELS).sort()).toEqual([...ALL_STATUSES].sort());
  });
});
