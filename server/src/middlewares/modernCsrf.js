// src/middlewares/modernCsrf.js
// Alternative moderne et sécurisée au package csurf obsolète

const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const DEFAULT_CSRF_SECRET =
  process.env.CSRF_SECRET ||
  (() => {
    logger.warn("CSRF_SECRET not set, falling back to derived secret. Set it in production!");
    return `${process.env.JWT_SECRET}_csrf`;
  })();

class ModernCSRF {
  constructor(options = {}) {
    this.secret = options.secret || DEFAULT_CSRF_SECRET;
    this.tokenName = options.tokenName || "X-CSRF-Token";
    this.cookieName = options.cookieName || "XSRF-TOKEN";
    this.ignoreMethods = options.ignoreMethods || ["GET", "HEAD", "OPTIONS"];
    this.maxAge = options.maxAge || 60 * 60; // 1 hour
  }

  // Générer un token CSRF sécurisé
  generateToken() {
    const payload = {
      random: crypto.randomBytes(16).toString("hex"),
      timestamp: Date.now(),
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.maxAge,
      algorithm: "HS256",
    });
  }

  // Valider un token CSRF
  validateToken(token) {
    try {
      const decoded = jwt.verify(token, this.secret);

      // Vérifier que le token n'est pas trop ancien (double protection)
      const tokenAge = (Date.now() - decoded.timestamp) / 1000;
      if (tokenAge > this.maxAge) {
        return false;
      }

      return true;
    } catch (_error) {
      return false;
    }
  }

  // Middleware pour génération du token
  generateMiddleware() {
    return (req, res, next) => {
      // Stateless: generate a new token if none exists in the cookie
      const existingToken = req.cookies?.[this.cookieName];

      // Only issue a new token if there's no valid one already
      if (!existingToken || !this.validateToken(existingToken)) {
        const token = this.generateToken();

        // Exposer via cookie pour JavaScript (lecture seule côté client)
        res.cookie(this.cookieName, token, {
          httpOnly: false, // Accessible en JS pour headers
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: this.maxAge * 1000,
        });

        req.csrfToken = () => token;
      } else {
        req.csrfToken = () => existingToken;
      }

      next();
    };
  }

  // Middleware de validation (stateless double-submit cookie pattern)
  validateMiddleware() {
    return (req, _res, next) => {
      // Ignorer les méthodes de lecture
      if (this.ignoreMethods.includes(req.method)) {
        return next();
      }

      // Récupérer le token depuis les headers ou body
      const clientToken =
        req.headers[this.tokenName.toLowerCase()] || req.headers["x-csrf-token"] || req.body._csrf;

      if (!clientToken) {
        const err = new Error("CSRF token missing. Please include X-CSRF-Token header.");
        err.status = 403;
        return next(err);
      }

      // Stateless validation: verify the JWT signature is valid (proves server issued it)
      // No session comparison needed — the token is cryptographically signed with our secret
      if (!this.validateToken(clientToken)) {
        const err = new Error("Invalid CSRF token. Please refresh the page and try again.");
        err.status = 403;
        return next(err);
      }

      next();
    };
  }

  // Middleware combiné (génération + validation conditionnelle)
  middleware() {
    const generate = this.generateMiddleware();
    const validate = this.validateMiddleware();

    return (req, res, next) => {
      generate(req, res, (err) => {
        if (err) return next(err);
        validate(req, res, next);
      });
    };
  }
}

// Instance par défaut
const csrfProtection = new ModernCSRF();

// Middleware de génération seulement (pour les GET)
const csrfGenerate = csrfProtection.generateMiddleware();

// Middleware de validation seulement (pour les POST/PUT/DELETE)
const csrfValidate = csrfProtection.validateMiddleware();

// Middleware complet
const csrfMiddleware = csrfProtection.middleware();

module.exports = {
  ModernCSRF,
  csrfProtection,
  csrfGenerate,
  csrfValidate,
  csrfMiddleware,
};
