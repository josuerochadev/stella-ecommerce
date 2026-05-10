const { PaymentValidator } = require("../../src/services/paymentValidator");

describe("PaymentValidator", () => {
  describe("validatePaymentData", () => {
    it("accepts valid payment data", () => {
      const result = PaymentValidator.validatePaymentData({
        amount: 99.99,
        currency: "EUR",
        method: "credit_card",
        orderId: 1,
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects missing amount", () => {
      const result = PaymentValidator.validatePaymentData({
        currency: "EUR",
        method: "credit_card",
        orderId: 1,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid amount");
    });

    it("rejects zero amount", () => {
      const result = PaymentValidator.validatePaymentData({
        amount: 0,
        currency: "EUR",
        method: "credit_card",
        orderId: 1,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid amount");
    });

    it("rejects negative amount", () => {
      const result = PaymentValidator.validatePaymentData({
        amount: -10,
        currency: "EUR",
        method: "credit_card",
        orderId: 1,
      });
      expect(result.isValid).toBe(false);
    });

    it("rejects unsupported currency", () => {
      const result = PaymentValidator.validatePaymentData({
        amount: 50,
        currency: "BTC",
        method: "credit_card",
        orderId: 1,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Unsupported currency");
    });

    it("rejects unsupported payment method", () => {
      const result = PaymentValidator.validatePaymentData({
        amount: 50,
        currency: "EUR",
        method: "bitcoin",
        orderId: 1,
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Unsupported payment method");
    });

    it("rejects missing orderId", () => {
      const result = PaymentValidator.validatePaymentData({
        amount: 50,
        currency: "EUR",
        method: "paypal",
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Order ID is required");
    });

    it("collects multiple errors", () => {
      const result = PaymentValidator.validatePaymentData({});
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe("detectCardBrand", () => {
    it("detects Visa", () => {
      expect(PaymentValidator.detectCardBrand("4111111111111111")).toBe("Visa");
    });

    it("detects MasterCard", () => {
      expect(PaymentValidator.detectCardBrand("5555555555554444")).toBe("MasterCard");
    });

    it("detects American Express", () => {
      expect(PaymentValidator.detectCardBrand("371449635398431")).toBe("American Express");
    });

    it("returns Unknown for unrecognized cards", () => {
      expect(PaymentValidator.detectCardBrand("9999999999999999")).toBe("Unknown");
    });
  });

  describe("validateCreditCard", () => {
    it("validates known test card (Visa success)", () => {
      const result = PaymentValidator.validateCreditCard({
        number: "4111111111111111",
        expiry: "12/25",
        cvv: "123",
        name: "Test User",
      });
      expect(result.isValid).toBe(true);
      expect(result.brand).toBe("Visa");
      expect(result.last4).toBe("1111");
    });

    it("rejects known declining card", () => {
      const result = PaymentValidator.validateCreditCard({
        number: "4000000000000002",
        expiry: "12/25",
        cvv: "123",
        name: "Test User",
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Card declined");
    });

    it("rejects insufficient funds card", () => {
      const result = PaymentValidator.validateCreditCard({
        number: "4000000000009995",
        expiry: "12/25",
        cvv: "123",
        name: "Test User",
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Insufficient funds");
    });
  });

  describe("getSupportedPaymentMethods", () => {
    it("returns all 5 payment methods", () => {
      const methods = PaymentValidator.getSupportedPaymentMethods();
      expect(methods).toHaveLength(5);
    });

    it("each method has required fields", () => {
      const methods = PaymentValidator.getSupportedPaymentMethods();
      for (const method of methods) {
        expect(method).toHaveProperty("id");
        expect(method).toHaveProperty("name");
        expect(method).toHaveProperty("description");
        expect(method).toHaveProperty("processingFee");
        expect(typeof method.processingFee).toBe("number");
      }
    });

    it("includes credit_card and paypal", () => {
      const methods = PaymentValidator.getSupportedPaymentMethods();
      const ids = methods.map((m) => m.id);
      expect(ids).toContain("credit_card");
      expect(ids).toContain("paypal");
    });
  });

  describe("getSupportedCurrencies", () => {
    it("returns EUR, USD, GBP", () => {
      const currencies = PaymentValidator.getSupportedCurrencies();
      expect(currencies).toEqual(["EUR", "USD", "GBP"]);
    });
  });
});
