// src/validations/reviewValidation.js
const Joi = require("joi");

const addReviewSchema = Joi.object({
  starId: Joi.number().integer().positive().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500),
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().max(500),
}).min(1);

module.exports = { addReviewSchema, updateReviewSchema };
