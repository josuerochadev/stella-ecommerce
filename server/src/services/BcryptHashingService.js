// server/src/services/BcryptHashingService.js
// Implémentation du service de hachage utilisant bcrypt
// Responsabilité unique : hachage et vérification des mots de passe avec bcrypt

const bcrypt = require('bcrypt');
const { IHashingService } = require('../interfaces/IHashingService');

/**
 * Service de hachage utilisant la librairie bcrypt
 * Implémente IHashingService pour respecter le principe d'inversion de dépendances
 */
class BcryptHashingService extends IHashingService {
  constructor(saltRounds = 10) {
    super();
    this.saltRounds = saltRounds;
  }

  /**
   * Hache un mot de passe en utilisant bcrypt
   * @param {string} password - Mot de passe en texte clair
   * @returns {Promise<string>} Mot de passe haché
   * @throws {Error} Si le hachage échoue
   */
  async hash(password) {
    try {
      if (!password || typeof password !== 'string') {
        throw new Error('Password must be a non-empty string');
      }

      if (password.length < 1) {
        throw new Error('Password cannot be empty');
      }

      if (password.length > 72) {
        throw new Error('Password too long (bcrypt max 72 characters)');
      }

      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  /**
   * Compare un mot de passe en texte clair avec un hachage bcrypt
   * @param {string} password - Mot de passe en texte clair
   * @param {string} hash - Hachage bcrypt à comparer
   * @returns {Promise<boolean>} True si le mot de passe correspond
   * @throws {Error} Si la comparaison échoue
   */
  async compare(password, hash) {
    try {
      if (!password || typeof password !== 'string') {
        throw new Error('Password must be a non-empty string');
      }

      if (!hash || typeof hash !== 'string') {
        throw new Error('Hash must be a non-empty string');
      }

      // Vérification basique du format bcrypt
      if (!hash.startsWith('$2a$') && !hash.startsWith('$2b$') && !hash.startsWith('$2y$')) {
        throw new Error('Invalid bcrypt hash format');
      }

      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error(`Password comparison failed: ${error.message}`);
    }
  }

  /**
   * Valide la force d'un mot de passe selon des critères de sécurité
   * @param {string} password - Mot de passe à valider
   * @returns {Promise<{isValid: boolean, errors: string[]}>} Résultat de validation
   */
  async validatePasswordStrength(password) {
    const errors = [];

    if (!password || typeof password !== 'string') {
      errors.push('Password must be a string');
      return { isValid: false, errors };
    }

    // Longueur minimale
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Longueur maximale (bcrypt limitation)
    if (password.length > 72) {
      errors.push('Password must be no more than 72 characters long');
    }

    // Au moins une lettre minuscule
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Au moins une lettre majuscule
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Au moins un chiffre
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Au moins un caractère spécial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Vérification contre les mots de passe communs
    const commonPasswords = [
      'password', '123456', '123456789', '12345678', 'qwerty',
      'abc123', 'password123', 'admin', 'letmein', 'welcome',
      'monkey', 'dragon', 'master', 'login', 'princess',
      'football', 'shadow', 'sunshine', 'trustno1', 'iloveyou',
      '1234567', '1234567890', '000000', 'access', 'hello',
      'charlie', 'donald', 'passw0rd', 'whatever', 'qazwsx',
      'michael', 'baseball', 'starwars', 'superman', 'batman',
      'azerty', 'motdepasse', 'bonjour', 'soleil', 'chocolat'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Génère un sel aléatoire pour le hachage
   * @param {number} rounds - Nombre de rounds pour le sel
   * @returns {Promise<string>} Sel généré
   * @throws {Error} Si la génération échoue
   */
  async generateSalt(rounds = this.saltRounds) {
    try {
      if (typeof rounds !== 'number' || rounds < 4 || rounds > 31) {
        throw new Error('Salt rounds must be a number between 4 and 31');
      }

      return await bcrypt.genSalt(rounds);
    } catch (error) {
      throw new Error(`Salt generation failed: ${error.message}`);
    }
  }

  /**
   * Obtient les informations sur le hachage (rounds, version)
   * @param {string} hash - Hachage bcrypt
   * @returns {Object} Informations sur le hachage
   */
  getHashInfo(hash) {
    try {
      if (!hash || typeof hash !== 'string') {
        throw new Error('Hash must be a non-empty string');
      }

      const parts = hash.split('$');
      if (parts.length < 4) {
        throw new Error('Invalid bcrypt hash format');
      }

      return {
        algorithm: parts[1], // 2a, 2b, 2y
        rounds: parseInt(parts[2], 10),
        salt: parts[3],
        isValid: parts.length === 4 && parts[3].length === 53
      };
    } catch (error) {
      return {
        algorithm: null,
        rounds: null,
        salt: null,
        isValid: false,
        error: error.message
      };
    }
  }

  /**
   * Vérifie si un hachage nécessite un re-hachage (rounds trop faibles)
   * @param {string} hash - Hachage à vérifier
   * @param {number} [minRounds] - Nombre minimum de rounds requis
   * @returns {boolean} True si re-hachage nécessaire
   */
  needsRehash(hash, minRounds = this.saltRounds) {
    try {
      const info = this.getHashInfo(hash);
      return !info.isValid || info.rounds < minRounds;
    } catch (error) {
      return true; // En cas de doute, recommander le re-hachage
    }
  }
}

module.exports = { BcryptHashingService };