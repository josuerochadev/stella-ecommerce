// server/src/repositories/SequelizeUserRepository.js
// Implémentation du repository utilisateur avec Sequelize
// Responsabilité unique : opérations de persistance des données utilisateur

const { User } = require('../models');
const { IUserRepository } = require('../interfaces/IUserRepository');
const { Op } = require('sequelize');
const { validateId } = require('../utils/validators');

/**
 * Repository pour les utilisateurs utilisant Sequelize ORM
 * Implémente IUserRepository pour respecter le principe d'inversion de dépendances
 */
class SequelizeUserRepository extends IUserRepository {
  constructor(userModel = User) {
    super();
    this.User = userModel;
  }

  /**
   * Trouve un utilisateur par son email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   * @throws {Error} Si la recherche échoue
   */
  async findByEmail(email) {
    try {
      if (!email || typeof email !== 'string') {
        throw new Error('Email must be a non-empty string');
      }

      const user = await this.User.findOne({
        where: {
          email: email.toLowerCase().trim()
        }
      });

      return user ? user.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  /**
   * Trouve un utilisateur par son ID
   * @param {number} id - ID de l'utilisateur
   * @returns {Promise<Object|null>} Utilisateur trouvé ou null
   * @throws {Error} Si la recherche échoue
   */
  async findById(id) {
    try {
      validateId(id);

      const user = await this.User.findByPk(id);
      return user ? user.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} Utilisateur créé
   * @throws {Error} Si la création échoue
   */
  async create(userData) {
    try {
      this.validateUserData(userData);

      // Préparation des données avec valeurs par défaut
      const userToCreate = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        role: userData.role || 'client'
      };

      const user = await this.User.create(userToCreate);
      return user.toJSON();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Met à jour un utilisateur existant
   * @param {number} id - ID de l'utilisateur
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Utilisateur mis à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async update(id, updateData) {
    try {
      validateId(id);

      if (!updateData || typeof updateData !== 'object') {
        throw new Error('Update data must be an object');
      }

      // Préparation des données à mettre à jour
      const dataToUpdate = {};

      if (updateData.firstName) {
        dataToUpdate.firstName = updateData.firstName.trim();
      }

      if (updateData.lastName) {
        dataToUpdate.lastName = updateData.lastName.trim();
      }

      if (updateData.email) {
        dataToUpdate.email = updateData.email.toLowerCase().trim();
      }

      if (updateData.password) {
        dataToUpdate.password = updateData.password;
      }

      if (updateData.role) {
        dataToUpdate.role = updateData.role;
      }

      const [updatedCount] = await this.User.update(dataToUpdate, {
        where: { id },
        returning: true
      });

      if (updatedCount === 0) {
        throw new Error('User not found or no changes made');
      }

      // Récupérer l'utilisateur mis à jour
      const updatedUser = await this.findById(id);
      return updatedUser;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  /**
   * Supprime un utilisateur
   * @param {number} id - ID de l'utilisateur
   * @returns {Promise<boolean>} True si supprimé avec succès
   * @throws {Error} Si la suppression échoue
   */
  async delete(id) {
    try {
      validateId(id);

      const deletedCount = await this.User.destroy({
        where: { id }
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Vérifie si un email existe déjà
   * @param {string} email - Email à vérifier
   * @param {number} [excludeId] - ID à exclure de la recherche
   * @returns {Promise<boolean>} True si l'email existe
   * @throws {Error} Si la vérification échoue
   */
  async emailExists(email, excludeId = null) {
    try {
      if (!email || typeof email !== 'string') {
        throw new Error('Email must be a non-empty string');
      }

      const whereCondition = {
        email: email.toLowerCase().trim()
      };

      if (excludeId) {
        whereCondition.id = {
          [Op.ne]: excludeId
        };
      }

      const count = await this.User.count({
        where: whereCondition
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check email existence: ${error.message}`);
    }
  }

  /**
   * Récupère une liste d'utilisateurs avec pagination
   * @param {Object} options - Options de recherche
   * @returns {Promise<{count: number, rows: Array}>} Résultats paginés
   * @throws {Error} Si la recherche échoue
   */
  async findAndCountAll(options) {
    try {
      if (!options || typeof options !== 'object') {
        throw new Error('Options must be an object');
      }

      const result = await this.User.findAndCountAll(options);

      return {
        count: result.count,
        rows: result.rows.map(user => user.toJSON())
      };
    } catch (error) {
      throw new Error(`Failed to find and count users: ${error.message}`);
    }
  }

  /**
   * Trouve tous les utilisateurs selon des critères
   * @param {Object} where - Conditions de recherche
   * @param {Object} [options] - Options supplémentaires
   * @returns {Promise<Array>} Liste des utilisateurs
   * @throws {Error} Si la recherche échoue
   */
  async findAll(where = {}, options = {}) {
    try {
      const users = await this.User.findAll({
        where,
        ...options
      });

      return users.map(user => user.toJSON());
    } catch (error) {
      throw new Error(`Failed to find users: ${error.message}`);
    }
  }

  /**
   * Compte le nombre d'utilisateurs selon des critères
   * @param {Object} where - Conditions de recherche
   * @returns {Promise<number>} Nombre d'utilisateurs
   * @throws {Error} Si le comptage échoue
   */
  async count(where = {}) {
    try {
      const count = await this.User.count({ where });
      return count;
    } catch (error) {
      throw new Error(`Failed to count users: ${error.message}`);
    }
  }

  /**
   * Valide les données utilisateur pour la création
   * @param {Object} userData - Données à valider
   * @throws {Error} Si les données sont invalides
   * @private
   */
  validateUserData(userData) {
    if (!userData || typeof userData !== 'object') {
      throw new Error('User data must be an object');
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validation rôle
    if (userData.role && !['client', 'admin'].includes(userData.role)) {
      throw new Error('Invalid role. Must be client or admin');
    }
  }

  /**
   * Recherche d'utilisateurs avec critères avancés
   * @param {Object} searchCriteria - Critères de recherche
   * @returns {Promise<Array>} Utilisateurs trouvés
   */
  async searchUsers(searchCriteria) {
    try {
      const { search, role, limit = 50, offset = 0 } = searchCriteria;

      const whereCondition = {};

      if (search) {
        whereCondition[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (role) {
        whereCondition.role = role;
      }

      const users = await this.User.findAll({
        where: whereCondition,
        limit: Math.min(limit, 100), // Limite de sécurité
        offset,
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] } // Exclure le mot de passe
      });

      return users.map(user => user.toJSON());
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }
}

module.exports = { SequelizeUserRepository };