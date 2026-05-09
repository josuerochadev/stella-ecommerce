// server/src/repositories/SequelizeReviewRepository.js
// Implémentation du repository avis avec Sequelize
// Responsabilité unique : opérations de persistance des données avis

const { Review, User, Star } = require("../models");
const { IReviewRepository } = require("../interfaces/IReviewRepository");
const { Op } = require("sequelize");
const { validateId } = require("../utils/validators");

/**
 * Repository pour les avis utilisant Sequelize ORM
 * Implémente IReviewRepository pour respecter le principe d'inversion de dépendances
 */
class SequelizeReviewRepository extends IReviewRepository {
  constructor(reviewModel = Review) {
    super();
    this.Review = reviewModel;
  }

  /**
   * Trouve un avis par son ID
   * @param {number} id - ID de l'avis
   * @returns {Promise<Object|null>} Avis trouvé ou null
   * @throws {Error} Si la recherche échoue
   */
  async findById(id) {
    try {
      validateId(id);

      const review = await this.Review.findByPk(id, {
        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: Star,
            as: "Star",
            attributes: ["starid", "name"],
          },
        ],
      });

      return review ? review.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find review by ID: ${error.message}`);
    }
  }

  /**
   * Trouve tous les avis d'une étoile
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<Array>} Liste des avis
   * @throws {Error} Si la recherche échoue
   */
  async findByStarId(starId) {
    try {
      validateId(starId, "Star ID");

      const reviews = await this.Review.findAll({
        where: { starId },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return reviews.map((review) => review.toJSON());
    } catch (error) {
      throw new Error(`Failed to find reviews by star ID: ${error.message}`);
    }
  }

  /**
   * Trouve tous les avis d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des avis
   * @throws {Error} Si la recherche échoue
   */
  async findByUserId(userId) {
    try {
      validateId(userId, "User ID");

      const reviews = await this.Review.findAll({
        where: { userId },
        include: [
          {
            model: Star,
            as: "Star",
            attributes: ["starid", "name", "image"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return reviews.map((review) => review.toJSON());
    } catch (error) {
      throw new Error(`Failed to find reviews by user ID: ${error.message}`);
    }
  }

  /**
   * Crée un nouvel avis
   * @param {Object} reviewData - Données de l'avis
   * @returns {Promise<Object>} Avis créé
   * @throws {Error} Si la création échoue
   */
  async create(reviewData) {
    try {
      this.validateReviewData(reviewData);

      const review = await this.Review.create(reviewData);

      // Récupérer l'avis avec les relations
      const createdReview = await this.findById(review.id);
      return createdReview;
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("You have already reviewed this star");
      }
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  /**
   * Met à jour un avis existant
   * @param {number} id - ID de l'avis
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Avis mis à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async update(id, updateData) {
    try {
      validateId(id);

      if (!updateData || typeof updateData !== "object") {
        throw new Error("Update data must be an object");
      }

      // Validation des données
      const dataToUpdate = {};

      if (updateData.rating !== undefined) {
        if (
          typeof updateData.rating !== "number" ||
          updateData.rating < 1 ||
          updateData.rating > 5
        ) {
          throw new Error("Rating must be between 1 and 5");
        }
        dataToUpdate.rating = updateData.rating;
      }

      if (updateData.comment !== undefined) {
        dataToUpdate.comment = updateData.comment;
      }

      const [updatedCount] = await this.Review.update(dataToUpdate, {
        where: { id },
        returning: true,
      });

      if (updatedCount === 0) {
        throw new Error("Review not found or no changes made");
      }

      const updatedReview = await this.findById(id);
      return updatedReview;
    } catch (error) {
      throw new Error(`Failed to update review: ${error.message}`);
    }
  }

  /**
   * Supprime un avis
   * @param {number} id - ID de l'avis
   * @returns {Promise<boolean>} True si supprimé avec succès
   * @throws {Error} Si la suppression échoue
   */
  async delete(id) {
    try {
      validateId(id);

      const deletedCount = await this.Review.destroy({
        where: { id },
      });

      return deletedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete review: ${error.message}`);
    }
  }

  /**
   * Compte le nombre d'avis selon des critères
   * @param {Object} where - Conditions de recherche
   * @returns {Promise<number>} Nombre d'avis
   * @throws {Error} Si le comptage échoue
   */
  async count(where = {}) {
    try {
      const count = await this.Review.count({ where });
      return count;
    } catch (error) {
      throw new Error(`Failed to count reviews: ${error.message}`);
    }
  }

  /**
   * Trouve toutes les avis selon des critères
   * @param {Object} where - Conditions de recherche
   * @param {Object} [options] - Options supplémentaires
   * @returns {Promise<Array>} Liste des avis
   * @throws {Error} Si la recherche échoue
   */
  async findAll(where = {}, options = {}) {
    try {
      const reviews = await this.Review.findAll({
        where,
        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: Star,
            as: "Star",
            attributes: ["starid", "name", "image"],
          },
        ],
        order: [["createdAt", "DESC"]],
        ...options,
      });

      return reviews.map((review) => review.toJSON());
    } catch (error) {
      throw new Error(`Failed to find reviews: ${error.message}`);
    }
  }

  /**
   * Calcule la note moyenne d'une étoile
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<number|null>} Note moyenne ou null
   */
  async getAverageRating(starId) {
    try {
      validateId(starId, "Star ID");

      const result = await this.Review.findOne({
        where: { starId },
        attributes: [
          [require("sequelize").fn("AVG", require("sequelize").col("rating")), "avgRating"],
        ],
        raw: true,
      });

      if (!result || !result.avgRating) {
        return null;
      }

      return Number.parseFloat(result.avgRating);
    } catch (error) {
      throw new Error(`Failed to get average rating: ${error.message}`);
    }
  }

  /**
   * Vérifie si un utilisateur a déjà évalué une étoile
   * @param {number} userId - ID de l'utilisateur
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<boolean>} True si un avis existe
   */
  async hasUserReviewedStar(userId, starId) {
    try {
      if (!userId || !starId) {
        return false;
      }

      const count = await this.Review.count({
        where: {
          userId,
          starId,
        },
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check user review: ${error.message}`);
    }
  }

  /**
   * Trouve un avis spécifique d'un utilisateur pour une étoile
   * @param {number} userId - ID de l'utilisateur
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<Object|null>} Avis trouvé ou null
   */
  async findUserReviewForStar(userId, starId) {
    try {
      if (!userId || !starId) {
        throw new Error("User ID and Star ID are required");
      }

      const review = await this.Review.findOne({
        where: {
          userId,
          starId,
        },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: Star,
            as: "Star",
            attributes: ["starid", "name"],
          },
        ],
      });

      return review ? review.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find user review for star: ${error.message}`);
    }
  }

  /**
   * Recherche d'avis avec critères avancés
   * @param {Object} searchCriteria - Critères de recherche
   * @returns {Promise<{count: number, rows: Array}>} Avis trouvés avec pagination
   */
  async searchReviews(searchCriteria) {
    try {
      const { starId, userId, minRating, maxRating, limit = 20, offset = 0 } = searchCriteria;

      const whereCondition = {};

      if (starId) {
        whereCondition.starId = starId;
      }

      if (userId) {
        whereCondition.userId = userId;
      }

      if (minRating !== undefined && minRating !== null) {
        whereCondition.rating = { [Op.gte]: minRating };
      }

      if (maxRating !== undefined && maxRating !== null) {
        whereCondition.rating = {
          ...whereCondition.rating,
          [Op.lte]: maxRating,
        };
      }

      const result = await this.Review.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: Star,
            as: "Star",
            attributes: ["starid", "name", "image"],
          },
        ],
        limit: Math.min(limit, 100),
        offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        count: result.count,
        rows: result.rows.map((review) => review.toJSON()),
      };
    } catch (error) {
      throw new Error(`Failed to search reviews: ${error.message}`);
    }
  }

  /**
   * Valide les données avis pour la création
   * @param {Object} reviewData - Données à valider
   * @throws {Error} Si les données sont invalides
   * @private
   */
  validateReviewData(reviewData) {
    if (!reviewData || typeof reviewData !== "object") {
      throw new Error("Review data must be an object");
    }

    const requiredFields = ["userId", "starId", "rating"];
    const missingFields = requiredFields.filter((field) => reviewData[field] === undefined);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validation rating
    if (typeof reviewData.rating !== "number" || reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error("Rating must be a number between 1 and 5");
    }

    // Validation IDs
    if (typeof reviewData.userId !== "number") {
      throw new Error("User ID must be a number");
    }

    if (typeof reviewData.starId !== "number") {
      throw new Error("Star ID must be a number");
    }
  }
}

module.exports = { SequelizeReviewRepository };
