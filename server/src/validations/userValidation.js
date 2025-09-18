// src/validations/userValidation.js
const Joi = require("joi");

/**
 * Schema for validating user registration data.
 *
 * @typedef {Object} RegisterSchema
 * @property {string} username - The username of the user. Must be alphanumeric and between 3 to 30 characters.
 * @property {string} email - The email address of the user. Must be a valid email format.
 * @property {string} password - The password of the user. Must be at least 8 characters with uppercase, lowercase, digit, and special character.
 * @property {string} firstName - The first name of the user. This field is required.
 * @property {string} lastName - The last name of the user. This field is required.
 */
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must not exceed 128 characters'
    }),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
