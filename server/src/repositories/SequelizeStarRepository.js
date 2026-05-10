// server/src/repositories/SequelizeStarRepository.js
// Implémentation du repository étoile avec Sequelize
// Responsabilité unique : opérations de persistance des données étoile

const { Star } = require("../models");
const { IStarRepository } = require("../interfaces/IStarRepository");
const { Op } = require("sequelize");
const { validateId } = require("../utils/validators");

/**
 * Repository pour les étoiles utilisant Sequelize ORM
 * Implémente IStarRepository pour respecter le principe d'inversion de dépendances
 */
class SequelizeStarRepository extends IStarRepository {
  constructor(starModel = Star) {
    super();
    this.Star = starModel;
  }

  /**
   * Trouve une étoile par son ID
   * @param {number} id - ID de l'étoile
   * @returns {Promise<Object|null>} Étoile trouvée ou null
   * @throws {Error} Si la recherche échoue
   */
  async findById(id) {
    try {
      validateId(id);

      const star = await this.Star.findByPk(id);
      return star ? star.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find star by ID: ${error.message}`);
    }
  }

  /**
   * Récupère toutes les étoiles avec filtres et pagination
   * @param {Object} options - Options de recherche
   * @returns {Promise<{count: number, rows: Array}>} Résultats paginés
   * @throws {Error} Si la recherche échoue
   */
  async findAndCountAll(options) {
    try {
      if (!options || typeof options !== "object") {
        throw new Error("Options must be an object");
      }

      const result = await this.Star.findAndCountAll(options);

      return {
        count: result.count,
        rows: result.rows.map((star) => star.toJSON()),
      };
    } catch (error) {
      throw new Error(`Failed to find and count stars: ${error.message}`);
    }
  }

  /**
   * Trouve toutes les étoiles selon des critères
   * @param {Object} where - Conditions de recherche
   * @param {Object} [options] - Options supplémentaires
   * @returns {Promise<Array>} Liste des étoiles
   * @throws {Error} Si la recherche échoue
   */
  async findAll(where = {}, options = {}) {
    try {
      const stars = await this.Star.findAll({
        where,
        ...options,
      });

      return stars.map((star) => star.toJSON());
    } catch (error) {
      throw new Error(`Failed to find stars: ${error.message}`);
    }
  }

  /**
   * Crée une nouvelle étoile
   * @param {Object} starData - Données de l'étoile
   * @returns {Promise<Object>} Étoile créée
   * @throws {Error} Si la création échoue
   */
  async create(starData) {
    try {
      this.validateStarData(starData);

      const star = await this.Star.create(starData);
      return star.toJSON();
    } catch (error) {
      throw new Error(`Failed to create star: ${error.message}`);
    }
  }

  /**
   * Met à jour une étoile existante
   * @param {number} id - ID de l'étoile
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Étoile mise à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async update(id, updateData) {
    try {
      validateId(id);

      if (!updateData || typeof updateData !== "object") {
        throw new Error("Update data must be an object");
      }

      const [updatedCount] = await this.Star.update(updateData, {
        where: { starid: id },
        returning: true,
      });

      if (updatedCount === 0) {
        throw new Error("Star not found or no changes made");
      }

      const updatedStar = await this.findById(id);
      return updatedStar;
    } catch (error) {
      throw new Error(`Failed to update star: ${error.message}`);
    }
  }

  /**
   * Supprime une étoile
   * @param {number} id - ID de l'étoile
   * @returns {Promise<boolean>} True si supprimé avec succès
   * @throws {Error} Si la suppression échoue
   */
  async delete(id) {
    try {
      validateId(id);

      const deletedCount = await this.Star.destroy({
        where: { starid: id },
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete star: ${error.message}`);
    }
  }

  /**
   * Compte le nombre d'étoiles selon des critères
   * @param {Object} where - Conditions de recherche
   * @returns {Promise<number>} Nombre d'étoiles
   * @throws {Error} Si le comptage échoue
   */
  async count(where = {}) {
    try {
      const count = await this.Star.count({ where });
      return count;
    } catch (error) {
      throw new Error(`Failed to count stars: ${error.message}`);
    }
  }

  /**
   * Recherche d'étoiles avec critères avancés
   * @param {Object} searchCriteria - Critères de recherche
   * @returns {Promise<{count: number, rows: Array}>} Étoiles trouvées avec pagination
   */
  async searchStars(searchCriteria) {
    try {
      const {
        search,
        constellation,
        minPrice,
        maxPrice,
        minMagnitude,
        maxMagnitude,
        minDistance,
        maxDistance,
        minLuminosity,
        maxLuminosity,
        limit = 20,
        offset = 0,
        orderBy = "name",
        orderDirection = "ASC",
      } = searchCriteria;

      const whereCondition = {};

      // Recherche textuelle
      if (search) {
        whereCondition[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { constellation: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Filtre constellation
      if (constellation) {
        whereCondition.constellation = constellation;
      }

      // Filtre prix
      if (minPrice !== undefined && minPrice !== null) {
        whereCondition.price = { [Op.gte]: minPrice };
      }
      if (maxPrice !== undefined && maxPrice !== null) {
        whereCondition.price = {
          ...whereCondition.price,
          [Op.lte]: maxPrice,
        };
      }

      // Filtre magnitude
      if (minMagnitude !== undefined && minMagnitude !== null) {
        whereCondition.magnitude = { [Op.gte]: minMagnitude };
      }
      if (maxMagnitude !== undefined && maxMagnitude !== null) {
        whereCondition.magnitude = {
          ...whereCondition.magnitude,
          [Op.lte]: maxMagnitude,
        };
      }

      // Filtre distance
      if (minDistance !== undefined && minDistance !== null) {
        whereCondition.distanceFromEarth = { [Op.gte]: minDistance };
      }
      if (maxDistance !== undefined && maxDistance !== null) {
        whereCondition.distanceFromEarth = {
          ...whereCondition.distanceFromEarth,
          [Op.lte]: maxDistance,
        };
      }

      // Filtre luminosité
      if (minLuminosity !== undefined && minLuminosity !== null) {
        whereCondition.luminosity = { [Op.gte]: minLuminosity };
      }
      if (maxLuminosity !== undefined && maxLuminosity !== null) {
        whereCondition.luminosity = {
          ...whereCondition.luminosity,
          [Op.lte]: maxLuminosity,
        };
      }

      // Validation de l'ordre
      const validOrderFields = [
        "name",
        "price",
        "magnitude",
        "distanceFromEarth",
        "luminosity",
        "createdAt",
      ];
      const validatedOrderBy = validOrderFields.includes(orderBy) ? orderBy : "name";
      const validatedOrderDirection = ["ASC", "DESC"].includes(orderDirection.toUpperCase())
        ? orderDirection.toUpperCase()
        : "ASC";

      const result = await this.Star.findAndCountAll({
        where: whereCondition,
        limit: Math.min(limit, 100),
        offset,
        order: [[validatedOrderBy, validatedOrderDirection]],
      });

      return {
        count: result.count,
        rows: result.rows.map((star) => star.toJSON()),
      };
    } catch (error) {
      throw new Error(`Failed to search stars: ${error.message}`);
    }
  }

  /**
   * Récupère toutes les constellations uniques
   * @returns {Promise<Array<string>>} Liste des constellations
   * @throws {Error} Si la recherche échoue
   */
  async getUniqueConstellations() {
    try {
      const stars = await this.Star.findAll({
        attributes: ["constellation"],
        group: ["constellation"],
        raw: true,
      });

      return stars.map((star) => star.constellation).filter(Boolean);
    } catch (error) {
      throw new Error(`Failed to get unique constellations: ${error.message}`);
    }
  }

  /**
   * Vérifie si une étoile existe
   * @param {number} id - ID de l'étoile
   * @returns {Promise<boolean>} True si l'étoile existe
   */
  async exists(id) {
    try {
      if (!id || typeof id !== "number") {
        return false;
      }

      const count = await this.Star.count({
        where: { starid: id },
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check star existence: ${error.message}`);
    }
  }

  /**
   * Valide les données étoile pour la création
   * @param {Object} starData - Données à valider
   * @throws {Error} Si les données sont invalides
   * @private
   */
  validateStarData(starData) {
    if (!starData || typeof starData !== "object") {
      throw new Error("Star data must be an object");
    }

    const requiredFields = ["name", "price", "magnitude"];
    const missingFields = requiredFields.filter((field) => !starData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validation prix
    if (typeof starData.price !== "number" || starData.price < 0) {
      throw new Error("Price must be a positive number");
    }

    // Validation magnitude
    if (typeof starData.magnitude !== "number") {
      throw new Error("Magnitude must be a number");
    }
  }
}

module.exports = { SequelizeStarRepository };
