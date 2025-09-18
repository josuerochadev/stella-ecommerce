// src/middlewares/sanitization.js
// Middleware pour la sanitisation des entrées utilisateur

const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Configuration JSDOM pour DOMPurify côté serveur
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Configuration de sanitisation pour différents contextes
 */
const sanitizeConfigs = {
  // Configuration stricte pour les champs de texte sensibles
  strict: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },

  // Configuration pour le contenu HTML basique (commentaires, descriptions)
  basicHtml: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },

  // Configuration pour URLs
  url: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  }
};

/**
 * Sanitise récursivement un objet
 * @param {any} data - Données à sanitiser
 * @param {string} mode - Mode de sanitisation ('strict', 'basicHtml', 'url')
 * @returns {any} Données sanitisées
 */
const sanitizeData = (data, mode = 'strict') => {
  if (typeof data === 'string') {
    // Appliquer la sanitisation selon le mode
    return purify.sanitize(data, sanitizeConfigs[mode]);
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, mode));
  }

  if (data && typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      // Certains champs peuvent avoir des modes spécifiques
      let fieldMode = mode;

      // Champs qui acceptent du HTML basique
      if (['description', 'comment', 'review', 'bio'].includes(key.toLowerCase())) {
        fieldMode = 'basicHtml';
      }

      // Champs URL
      if (['url', 'website', 'avatar', 'image'].includes(key.toLowerCase())) {
        fieldMode = 'url';
      }

      sanitized[key] = sanitizeData(value, fieldMode);
    }
    return sanitized;
  }

  return data;
};

/**
 * Middleware de sanitisation pour les requêtes
 * Sanitise automatiquement req.body, req.query, et req.params
 */
const sanitizeInput = (mode = 'strict') => {
  return (req, res, next) => {
    try {
      // Sanitiser le body de la requête
      if (req.body && typeof req.body === 'object') {
        req.body = sanitizeData(req.body, mode);
      }

      // Sanitiser les query parameters
      if (req.query && typeof req.query === 'object') {
        req.query = sanitizeData(req.query, mode);
      }

      // Sanitiser les paramètres de route
      if (req.params && typeof req.params === 'object') {
        req.params = sanitizeData(req.params, mode);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Fonction utilitaire pour sanitiser manuellement des données
 * @param {any} data - Données à sanitiser
 * @param {string} mode - Mode de sanitisation
 * @returns {any} Données sanitisées
 */
const sanitize = (data, mode = 'strict') => {
  return sanitizeData(data, mode);
};

/**
 * Middleware spécialisé pour les champs de recherche
 * Applique une sanitisation plus permissive pour la recherche
 */
const sanitizeSearch = (req, res, next) => {
  if (req.query.search || req.query.q || req.query.query) {
    const searchField = req.query.search || req.query.q || req.query.query;

    // Sanitisation légère pour les termes de recherche
    const sanitized = purify.sanitize(searchField, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      FORBID_ATTR: ['style', 'onclick', 'onerror'],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed']
    });

    if (req.query.search) req.query.search = sanitized;
    if (req.query.q) req.query.q = sanitized;
    if (req.query.query) req.query.query = sanitized;
  }

  next();
};

module.exports = {
  sanitizeInput,
  sanitizeSearch,
  sanitize,
  sanitizeData
};