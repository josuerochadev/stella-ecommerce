// server/src/middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler");

/**
 * Middleware to authenticate a user based on the JWT token in the Authorization header.
 * If the token is valid, the decoded user information is attached to the request object.
 * If the token is missing or invalid, the request proceeds without user information.
 *
 * @param {Object} req - The request object.
 * @param {Object} _res - The response object (not used).
 * @param {Function} next - The next middleware function.
 */
exports.authenticateUser = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  if (!authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError(`Error validating token: ${error.message}`, 401));
  }
};

/**
 * Middleware to ensure that the user is authenticated.
 * If the user is not authenticated, an error is passed to the next middleware.
 *
 * @param {Object} req - The request object.
 * @param {Object} _res - The response object (not used).
 * @param {Function} next - The next middleware function.
 */
exports.requireAuth = (req, _res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }
  next();
};
