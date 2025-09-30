// src/validations/orderValidation.js
const Joi = require("joi");
const { UPDATABLE_ORDER_STATUS } = require("../constants/orderStatus");

const createOrderSchema = Joi.object({
  shippingAddress: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        starId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
      }),
    )
    .required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid(...UPDATABLE_ORDER_STATUS).required(),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
