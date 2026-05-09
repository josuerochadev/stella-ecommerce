// server/src/middlewares/errorStrategies.js
// Pattern Strategy pour la gestion d'erreurs - responsabilité unique par type d'erreur

const { HTTP_STATUS } = require("../constants/app");

/**
 * Classe de base pour les stratégies d'erreur
 */
class ErrorStrategy {
  /**
   * Méthode abstraite - doit être implémentée par les sous-classes
   * @param {Error} error - L'erreur à traiter
   * @returns {AppError} - L'erreur formatée
   */
  handle(_error) {
    throw new Error("La méthode handle() doit être implémentée par la sous-classe");
  }

  /**
   * Vérifier si cette stratégie peut traiter l'erreur
   * @param {Error} error - L'erreur à vérifier
   * @returns {boolean} - True si la stratégie peut traiter l'erreur
   */
  canHandle(_error) {
    throw new Error("La méthode canHandle() doit être implémentée par la sous-classe");
  }
}

/**
 * Stratégie pour les erreurs de validation Sequelize
 */
class SequelizeValidationErrorStrategy extends ErrorStrategy {
  canHandle(error) {
    return error.name === "SequelizeValidationError";
  }

  handle(error) {
    const { AppError } = require("./errorHandler");
    const messages = error.errors.map((err) => err.message);
    return new AppError(messages.join(". "), HTTP_STATUS.BAD_REQUEST);
  }
}

/**
 * Stratégie pour les erreurs de contrainte unique Sequelize
 */
class SequelizeUniqueConstraintErrorStrategy extends ErrorStrategy {
  canHandle(error) {
    return error.name === "SequelizeUniqueConstraintError";
  }

  handle(error) {
    const { AppError } = require("./errorHandler");
    const value = error.errors[0].value;
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }
}

/**
 * Stratégie pour les erreurs de base de données Sequelize
 */
class SequelizeDatabaseErrorStrategy extends ErrorStrategy {
  canHandle(error) {
    return error.name === "SequelizeDatabaseError";
  }

  handle(error) {
    const { AppError } = require("./errorHandler");
    const message = error.message || "Database operation failed";
    return new AppError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Stratégie pour les erreurs JWT invalides
 */
class JWTErrorStrategy extends ErrorStrategy {
  canHandle(error) {
    return error.name === "JsonWebTokenError";
  }

  handle() {
    const { AppError } = require("./errorHandler");
    return new AppError("Invalid token. Please log in again!", HTTP_STATUS.UNAUTHORIZED);
  }
}

/**
 * Stratégie pour les tokens JWT expirés
 */
class TokenExpiredErrorStrategy extends ErrorStrategy {
  canHandle(error) {
    return error.name === "TokenExpiredError";
  }

  handle() {
    const { AppError } = require("./errorHandler");
    return new AppError("Your token has expired! Please log in again.", HTTP_STATUS.UNAUTHORIZED);
  }
}

/**
 * Stratégie pour les erreurs de validation générale
 */
class ValidationErrorStrategy extends ErrorStrategy {
  canHandle(error) {
    return error.name === "ValidationError";
  }

  handle(error) {
    const { AppError } = require("./errorHandler");
    const errors = {};
    if (error.details) {
      error.details.forEach((detail) => {
        const key = detail.path.join(".");
        errors[key] = detail.message;
      });
    }
    return new AppError("Validation failed", HTTP_STATUS.BAD_REQUEST, errors);
  }
}

/**
 * Stratégie pour les erreurs de rate limiting
 */
class RateLimitErrorStrategy extends ErrorStrategy {
  canHandle(error) {
    return error.message?.includes("Too Many Requests");
  }

  handle() {
    const { AppError } = require("./errorHandler");
    return new AppError("Too many requests. Please try again later.", 429);
  }
}

/**
 * Stratégie par défaut pour les erreurs non reconnues
 */
class DefaultErrorStrategy extends ErrorStrategy {
  canHandle() {
    return true; // Toujours applicable en dernier recours
  }

  handle(error) {
    // Retourner l'erreur telle quelle si elle est déjà formatée
    return error;
  }
}

/**
 * Manager des stratégies d'erreur - Pattern Strategy
 */
class ErrorStrategyManager {
  constructor() {
    // Ordre important : du plus spécifique au plus générique
    this.strategies = [
      new SequelizeValidationErrorStrategy(),
      new SequelizeUniqueConstraintErrorStrategy(),
      new SequelizeDatabaseErrorStrategy(),
      new JWTErrorStrategy(),
      new TokenExpiredErrorStrategy(),
      new ValidationErrorStrategy(),
      new RateLimitErrorStrategy(),
      new DefaultErrorStrategy(), // Toujours en dernier
    ];
  }

  /**
   * Traiter une erreur en utilisant la stratégie appropriée
   * @param {Error} error - L'erreur à traiter
   * @returns {AppError} - L'erreur formatée
   */
  handleError(error) {
    const strategy = this.strategies.find((strategy) => strategy.canHandle(error));
    return strategy.handle(error);
  }

  /**
   * Ajouter une stratégie personnalisée
   * @param {ErrorStrategy} strategy - La stratégie à ajouter
   * @param {number} index - Position dans la liste (optionnel)
   */
  addStrategy(strategy, index = -1) {
    if (!(strategy instanceof ErrorStrategy)) {
      throw new Error("La stratégie doit hériter de ErrorStrategy");
    }

    if (index === -1) {
      // Insérer avant la stratégie par défaut
      this.strategies.splice(-1, 0, strategy);
    } else {
      this.strategies.splice(index, 0, strategy);
    }
  }
}

module.exports = {
  ErrorStrategy,
  ErrorStrategyManager,
  SequelizeValidationErrorStrategy,
  SequelizeUniqueConstraintErrorStrategy,
  SequelizeDatabaseErrorStrategy,
  JWTErrorStrategy,
  TokenExpiredErrorStrategy,
  ValidationErrorStrategy,
  RateLimitErrorStrategy,
  DefaultErrorStrategy,
};
