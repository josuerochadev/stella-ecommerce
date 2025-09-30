// server/src/interfaces/IUserRepository.js
// Interface pour les opérations de persistance des utilisateurs
// Responsabilité unique : abstraction des opérations de données utilisateur

/**
 * Interface pour le repository des utilisateurs
 * Abstrait les opérations de base de données pour faciliter les tests et le DIP
 */
class IUserRepository {
  /**
   * Trouve un utilisateur par son email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   * @throws {Error} Si la recherche échoue
   */
  async findByEmail(email) {
    throw new Error('Method findByEmail() must be implemented');
  }

  /**
   * Trouve un utilisateur par son ID
   * @param {number} id - ID de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   * @throws {Error} Si la recherche échoue
   */
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @param {string} userData.firstName - Prénom
   * @param {string} userData.lastName - Nom
   * @param {string} userData.email - Email
   * @param {string} userData.password - Mot de passe haché
   * @param {string} [userData.role='client'] - Rôle de l'utilisateur
   * @returns {Promise<Object>} Utilisateur créé
   * @throws {Error} Si la création échoue
   */
  async create(userData) {
    throw new Error('Method create() must be implemented');
  }

  /**
   * Met à jour un utilisateur existant
   * @param {number} id - ID de l'utilisateur
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Utilisateur mis à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async update(id, updateData) {
    throw new Error('Method update() must be implemented');
  }

  /**
   * Supprime un utilisateur
   * @param {number} id - ID de l'utilisateur
   * @returns {Promise<boolean>} True si supprimé avec succès
   * @throws {Error} Si la suppression échoue
   */
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  /**
   * Vérifie si un email existe déjà
   * @param {string} email - Email à vérifier
   * @param {number} [excludeId] - ID à exclure de la recherche (pour les mises à jour)
   * @returns {Promise<boolean>} True si l'email existe
   * @throws {Error} Si la vérification échoue
   */
  async emailExists(email, excludeId = null) {
    throw new Error('Method emailExists() must be implemented');
  }

  /**
   * Récupère une liste d'utilisateurs avec pagination
   * @param {Object} options - Options de recherche
   * @param {Object} options.where - Conditions de recherche
   * @param {number} options.limit - Limite de résultats
   * @param {number} options.offset - Décalage pour la pagination
   * @param {Array} options.order - Ordre de tri
   * @param {Array} [options.attributes] - Attributs à sélectionner
   * @returns {Promise<{count: number, rows: Array}>} Résultats paginés
   * @throws {Error} Si la recherche échoue
   */
  async findAndCountAll(options) {
    throw new Error('Method findAndCountAll() must be implemented');
  }

  /**
   * Trouve tous les utilisateurs selon des critères
   * @param {Object} where - Conditions de recherche
   * @param {Object} [options] - Options supplémentaires (order, limit, etc.)
   * @returns {Promise<Array>} Liste des utilisateurs
   * @throws {Error} Si la recherche échoue
   */
  async findAll(where = {}, options = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  /**
   * Compte le nombre d'utilisateurs selon des critères
   * @param {Object} where - Conditions de recherche
   * @returns {Promise<number>} Nombre d'utilisateurs
   * @throws {Error} Si le comptage échoue
   */
  async count(where = {}) {
    throw new Error('Method count() must be implemented');
  }
}

module.exports = { IUserRepository };