import DOMPurify from "dompurify";

/**
 * Nettoie le texte brut (supprime les balises HTML)
 */
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
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
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule");
  }

  if (!/\d/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial");
  }

  if (password.length > 128) {
    errors.push("Le mot de passe ne peut pas dépasser 128 caractères");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valide les entrées de recherche pour éviter l'injection
 */
export const sanitizeSearchQuery = (query: string): string => {
  // Supprimer les caractères dangereux et limiter la longueur
  return query
    .replace(/[<>'"&]/g, "") // Supprimer les caractères potentiellement dangereux
    .trim()
    .substring(0, 100); // Limiter à 100 caractères
};

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
    /<embed/i,
  ];

  return dangerousPatterns.some((pattern) => pattern.test(input));
};
