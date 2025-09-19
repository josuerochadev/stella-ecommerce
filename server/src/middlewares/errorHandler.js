// src/middlewares/errorHandler.js

const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "error",
  format: format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleSequelizeValidationError = (error) => {
  const messages = error.errors.map((err) => err.message);
  return new AppError(messages.join(". "), 400);
};

const handleDuplicateFieldsDB = (error) => {
  const value = error.errors[0].value;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const handleSequelizeDatabaseError = (error) => {
  const message = error.message || 'Database operation failed';
  return new AppError(message, 500);
};

const handleValidationError = (error) => {
  const errors = {};
  if (error.details) {
    error.details.forEach(detail => {
      const key = detail.path.join('.');
      errors[key] = detail.message;
    });
  }
  return new AppError('Validation failed', 400, errors);
};

const handleRateLimitError = () =>
  new AppError('Too many requests. Please try again later.', 429);

const sendErrorDev = (err, res) => {
  const filteredError = {
    success: false,
    status: err.status,
    message: err.message,
    errors: err.errors || {},
    stack: err.stack,
    error: {
      name: err.name,
      code: err.code,
      isOperational: err.isOperational,
      path: err.path,
    },
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId || 'unknown'
  };

  res.status(err.statusCode).json(filteredError);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      errors: err.errors || {},
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown'
    });
  } else {
    logger.error("ERROR 💥", {
      message: err.message,
      stack: err.stack,
      requestId: res.locals.requestId,
      timestamp: new Date().toISOString(),
      ...err,
    });
    res.status(500).json({
      success: false,
      status: "error",
      message: "Something went very wrong!",
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || 'unknown'
    });
  }
};

const errorHandler = (err, _req, res, _next) => {
  console.error("Error caught in errorHandler:", err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "SequelizeValidationError") {
      error = handleSequelizeValidationError(error);
    } else if (error.name === "SequelizeUniqueConstraintError") {
      error = handleDuplicateFieldsDB(error);
    } else if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    } else if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    } else if (error.name === "SequelizeDatabaseError") {
      error = handleSequelizeDatabaseError(error);
    } else if (error.name === "ValidationError") {
      error = handleValidationError(error);
    } else if (error.message && error.message.includes('Too Many Requests')) {
      error = handleRateLimitError();
    }

    sendErrorProd(error, res);
  }
};

module.exports = {
  AppError,
  errorHandler,
  handleSequelizeValidationError,
  handleDuplicateFieldsDB,
  handleJWTError,
  handleJWTExpiredError,
  handleSequelizeDatabaseError,
  handleValidationError,
  handleRateLimitError,
};
