// server/src/utils/validators.js
// Fonctions de validation reutilisables pour les repositories

/**
 * Valide qu'une valeur est un nombre positif valide
 * @param {*} value - Valeur a valider
 * @param {string} label - Nom du champ pour le message d'erreur
 * @throws {Error} Si la valeur n'est pas un nombre valide
 */
function validateId(value, label = "ID") {
  if (!value || typeof value !== "number") {
    throw new Error(`${label} must be a valid number`);
  }
}

module.exports = { validateId };
