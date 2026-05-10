// server/src/interfaces/IHashingService.js
// Interface pour les services de hachage de mots de passe
// Responsabilité unique : abstraction des opérations de hachage

/**
 * Interface pour les services de hachage de mots de passe
 * Permet l'injection de dépendances et facilite les tests
 */
class IHashingService {
  /**
   * Hache un mot de passe en texte clair
   * @param {string} password - Mot de passe en texte clair
   * @returns {Promise<string>} Mot de passe haché
   * @throws {Error} Si le hachage échoue
   */
  async hash(_password) {
    throw new Error("Method hash() must be implemented");
  }

  /**
   * Compare un mot de passe en texte clair avec un hachage
   * @param {string} password - Mot de passe en texte clair
   * @param {string} hash - Hachage à comparer
   * @returns {Promise<boolean>} True si le mot de passe correspond
   * @throws {Error} Si la comparaison échoue
   */
  async compare(_password, _hash) {
    throw new Error("Method compare() must be implemented");
  }

  /**
   * Valide la force d'un mot de passe
   * @param {string} password - Mot de passe à valider
   * @returns {Promise<{isValid: boolean, errors: string[]}>} Résultat de validation
   */
  async validatePasswordStrength(_password) {
    throw new Error("Method validatePasswordStrength() must be implemented");
  }

  /**
   * Génère un sel aléatoire pour le hachage
   * @param {number} rounds - Nombre de rounds pour le sel (optionnel)
   * @returns {Promise<string>} Sel généré
   */
  async generateSalt(_rounds = 10) {
    throw new Error("Method generateSalt() must be implemented");
  }
}

module.exports = { IHashingService };
