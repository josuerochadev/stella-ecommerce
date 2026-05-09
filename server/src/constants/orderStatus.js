// server/src/constants/orderStatus.js
// Centralized order status constants

/**
 * Order status enum values
 * Must match the Order model ENUM definition
 */
const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  SHIPPED: "shipped",
  CANCELLED: "cancelled",
  PAYMENT_FAILED: "payment_failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
  DISPUTED: "disputed",
};

/**
 * All valid order status values as array
 * Used for validation schemas
 */
const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);

/**
 * Status values that can be updated by admin
 * Excludes automatic/system statuses like payment_failed
 */
const UPDATABLE_ORDER_STATUS = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PAID,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.CANCELLED,
];

module.exports = {
  ORDER_STATUS,
  ORDER_STATUS_VALUES,
  UPDATABLE_ORDER_STATUS,
};
