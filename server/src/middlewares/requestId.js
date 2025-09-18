// src/middlewares/requestId.js
// Middleware pour générer des IDs de requête uniques pour le tracking

const crypto = require('crypto');

/**
 * Middleware qui génère un ID unique pour chaque requête
 * Utile pour tracer les erreurs et le debugging
 */
const generateRequestId = (req, res, next) => {
  // Générer un ID unique basé sur timestamp + random
  const requestId = `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  // Stocker l'ID dans res.locals pour utilisation dans les erreurs
  res.locals.requestId = requestId;

  // Ajouter l'ID dans les headers de réponse pour debugging
  res.setHeader('X-Request-ID', requestId);

  next();
};

module.exports = { generateRequestId };