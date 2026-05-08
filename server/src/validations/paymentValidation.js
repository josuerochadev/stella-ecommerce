// server/src/validations/paymentValidation.js
// Schemas de validation Joi pour les paiements

const Joi = require("joi");

const initiatePaymentSchema = Joi.object({
  orderId: Joi.number().integer().positive().required(),
  method: Joi.string()
    .valid("credit_card", "paypal", "bank_transfer", "apple_pay", "google_pay")
    .required(),
  // Payment tokenization: only accept gateway tokens, never raw card numbers
  paymentToken: Joi.when("method", {
    is: "credit_card",
    then: Joi.object({
      token: Joi.string().min(10).max(500).required()
        .messages({ "string.min": "Invalid payment token" }),
      last4: Joi.string().pattern(/^\d{4}$/).required(),
      brand: Joi.string().valid("visa", "mastercard", "amex", "discover").required(),
    }).required(),
    otherwise: Joi.optional(),
  }),
});

const refundSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  reason: Joi.string().min(5).max(500).required(),
});

const webhookSchema = Joi.object({
  transactionId: Joi.string().required(),
  eventType: Joi.string()
    .valid("payment.completed", "payment.failed", "refund.processed")
    .optional(),
});

module.exports = {
  initiatePaymentSchema,
  refundSchema,
  webhookSchema,
};
