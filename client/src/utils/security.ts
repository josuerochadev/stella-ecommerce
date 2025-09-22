import DOMPurify from 'dompurify';

// Configuration sécurisée pour DOMPurify
const sanitizerConfig = {
  ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'u', 'br', 'p'],
  ALLOWED_ATTR: [],
  FORBID_SCRIPT: true,
  KEEP_CONTENT: true,
  USE_PROFILES: { html: false }
};

/**
 * Nettoie et sécurise le contenu HTML contre les attaques XSS
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, sanitizerConfig);
};

/**
 * Nettoie le texte brut (supprime les balises HTML)
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Valide et nettoie une URL
 */
export const validateUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    // Autoriser seulement HTTP et HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
};

/**
 * Valide une adresse email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Valide un nom d'utilisateur
 */
export const validateUsername = (username: string): boolean => {
  // Autorise les lettres, chiffres, tirets et underscores, 3-30 caractères
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Valide la force d'un mot de passe
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }

  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }

  if (password.length > 128) {
    errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Échappe les caractères spéciaux pour les expressions régulières
 */
export const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Génère un token CSRF sécurisé (côté client pour validation)
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Valide les entrées de recherche pour éviter l'injection
 */
export const sanitizeSearchQuery = (query: string): string => {
  // Supprimer les caractères dangereux et limiter la longueur
  return query
    .replace(/[<>'"&]/g, '') // Supprimer les caractères potentiellement dangereux
    .trim()
    .substring(0, 100); // Limiter à 100 caractères
};

/**
 * Valide les données numériques avec limites
 */
export const validateNumericInput = (
  value: number,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): boolean => {
  return !Number.isNaN(value) && Number.isFinite(value) && value >= min && value <= max;
};

/**
 * Configuration de sécurité pour les en-têtes CSP (Content Security Policy)
 */
export const getCSPDirectives = () => ({
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Unsafe-inline nécessaire pour React
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'"],
  'connect-src': ["'self'", process.env.REACT_APP_API_URL || 'http://localhost:3000'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"]
});

/**
 * Fonction pour détecter les tentatives d'injection potentielles
 */
export const detectInjectionAttempt = (input: string): boolean => {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Nettoie les paramètres d'URL pour éviter l'injection
 */
export const sanitizeUrlParams = (params: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'number' && validateNumericInput(value)) {
      sanitized[key] = value;
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    }
    // Ignorer les autres types potentiellement dangereux
  }

  return sanitized;
};