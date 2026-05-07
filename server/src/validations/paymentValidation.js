// server/src/validations/paymentValidation.js
// Schemas de validation Joi pour les paiements

const Joi = require("joi");

const initiatePaymentSchema = Joi.object({
  orderId: Joi.number().integer().positive().required(),
  method: Joi.string()
    .valid("credit_card", "paypal", "bank_transfer", "apple_pay", "google_pay")
    .required(),
  cardData: Joi.when("method", {
    is: "credit_card",
    then: Joi.object({
      number: Joi.string().pattern(/^\d{13,19}$/).required(),
      expiry: Joi.string().pattern(/^\d{2}\/\d{2}$/).required(),
      cvv: Joi.string().pattern(/^\d{3,4}$/).required(),
      name: Joi.string().min(2).max(100).required(),
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
