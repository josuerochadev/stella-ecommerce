// src/middlewares/modernCsrf.js
// Alternative moderne et sécurisée au package csurf obsolète

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class ModernCSRF {
  constructor(options = {}) {
    this.secret = options.secret || process.env.CSRF_SECRET || process.env.JWT_SECRET + '_csrf';
    this.tokenName = options.tokenName || 'X-CSRF-Token';
    this.cookieName = options.cookieName || 'XSRF-TOKEN';
    this.ignoreMethods = options.ignoreMethods || ['GET', 'HEAD', 'OPTIONS'];
    this.maxAge = options.maxAge || 60 * 60; // 1 hour
  }

  // Générer un token CSRF sécurisé
  generateToken() {
    const payload = {
      random: crypto.randomBytes(16).toString('hex'),
      timestamp: Date.now()
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.maxAge,
      algorithm: 'HS256'
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
    } catch (error) {
      return false;
    }
  }

  // Middleware pour génération du token
  generateMiddleware() {
    return (req, res, next) => {
      // Générer un nouveau token pour chaque session
      if (!req.session?.csrfToken) {
        const token = this.generateToken();

        // Stocker en session (plus sécurisé)
        if (req.session) {
          req.session.csrfToken = token;
        }

        // Exposer via cookie pour JavaScript (lecture seule côté client)
        res.cookie(this.cookieName, token, {
          httpOnly: false, // Accessible en JS pour headers
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: this.maxAge * 1000
        });

        // Disponible dans req pour usage serveur
        req.csrfToken = () => token;
      } else {
        req.csrfToken = () => req.session.csrfToken;
      }

      next();
    };
  }

  // Middleware de validation
  validateMiddleware() {
    return (req, res, next) => {
      // Ignorer les méthodes de lecture
      if (this.ignoreMethods.includes(req.method)) {
        return next();
      }

      // Récupérer le token depuis les headers ou body
      const clientToken = req.headers[this.tokenName.toLowerCase()] ||
                         req.headers['x-csrf-token'] ||
                         req.body._csrf;

      // Récupérer le token de référence depuis la session
      const sessionToken = req.session?.csrfToken;

      if (!clientToken) {
        return res.status(403).json({
          success: false,
          message: 'CSRF token missing. Please include X-CSRF-Token header.'
        });
      }

      if (!sessionToken) {
        return res.status(403).json({
          success: false,
          message: 'No CSRF session found. Please refresh the page.'
        });
      }

      // Validation double : JWT + correspondance session
      if (!this.validateToken(clientToken) || clientToken !== sessionToken) {
        return res.status(403).json({
          success: false,
          message: 'Invalid CSRF token. Please refresh the page and try again.'
        });
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
  csrfMiddleware
};