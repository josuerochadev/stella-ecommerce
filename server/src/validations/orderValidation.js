// src/validations/orderValidation.js
const Joi = require("joi");
const { UPDATABLE_ORDER_STATUS, PAYMENT_METHODS } = require("../constants/orderStatus");

const createOrderSchema = Joi.object({
  shippingAddress: Joi.alternatives()
    .try(
      Joi.string().max(500),
      Joi.object({
        street: Joi.string().max(200).required(),
        city: Joi.string().max(100).required(),
        state: Joi.string().max(100).allow(""),
        zipCode: Joi.string().max(20).required(),
        country: Joi.string().max(100).required(),
      }),
    )
    .required(),
  paymentMethod: Joi.string()
    .valid(...PAYMENT_METHODS)
    .required(),
  items: Joi.array()
    .items(
      Joi.object({
        starId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().max(99).required(),
      }),
    )
    .required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...UPDATABLE_ORDER_STATUS)
    .required(),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
