// src/validations/userValidation.js
const Joi = require("joi");

/**
 * Schema for validating user registration data.
 *
 * @typedef {Object} RegisterSchema
 * @property {string} username - The username of the user. Must be alphanumeric and between 3 to 30 characters.
 * @property {string} email - The email address of the user. Must be a valid email format.
 * @property {string} password - The password of the user. Must be alphanumeric and between 3 to 30 characters.
 * @property {string} firstName - The first name of the user. This field is required.
 * @property {string} lastName - The last name of the user. This field is required.
 */
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
