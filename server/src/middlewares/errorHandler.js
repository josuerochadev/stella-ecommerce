// src/middlewares/errorHandler.js

const { createLogger, format, transports } = require("winston");
const { HTTP_STATUS } = require("../constants/app");

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
    requestId: res.locals.requestId || "unknown",
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
      requestId: res.locals.requestId || "unknown",
    });
  } else {
    logger.error("ERROR 💥", {
      message: err.message,
      stack: err.stack,
      requestId: res.locals.requestId,
      timestamp: new Date().toISOString(),
      ...err,
    });
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: "error",
      message: "Something went very wrong!",
      timestamp: new Date().toISOString(),
      requestId: res.locals.requestId || "unknown",
    });
  }
};

// Import du Strategy Manager
const { ErrorStrategyManager } = require("./errorStrategies");

// Instance singleton du gestionnaire de stratégies
const errorStrategyManager = new ErrorStrategyManager();

const errorHandler = (err, _req, res, _next) => {
  logger.error("Error caught in errorHandler:", {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Délégation au Strategy Manager - élimination de la logique conditionnelle
    error = errorStrategyManager.handleError(error);

    sendErrorProd(error, res);
  }
};

module.exports = {
  AppError,
  errorHandler,
  errorStrategyManager,
};
