// server/src/controllers/starController.js
// Contrôleur pour la gestion des étoiles
// Responsabilité unique : orchestration du StarRepository et gestion des erreurs HTTP

const { AppError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");
const { getService } = require("../container/containerConfig");
const cacheService = require("../utils/cacheService");

/**
 * Contrôleur des étoiles utilisant l'injection de dépendances
 * Délègue toute la logique métier au StarRepository
 */
class StarController {
  constructor(starRepository) {
    this.starRepository = starRepository;
  }

  /**
   * Récupère toutes les étoiles
   */
  getAllStars = async (req, res, next) => {
    try {
      const page = Math.max(1, Number.parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit) || 50));
      const offset = (page - 1) * limit;
      const cacheKey = `stars:all:${page}:${limit}`;

      const stars = await cacheService.getOrSet(cacheKey, () =>
        this.starRepository.findAll({}, { limit, offset, order: [["name", "ASC"]] }),
      );

      res.json({
        success: true,
        data: stars,
        pagination: { page, limit, offset },
      });
    } catch (error) {
      logger.error("Error in getAllStars:", error);
      next(new AppError(`Error retrieving stars: ${error.message}`, 500));
    }
  };

  /**
   * Récupère une étoile par son ID
   */
  getStarById = async (req, res, next) => {
    try {
      const starId = Number.parseInt(req.params.starid);

      if (!starId || Number.isNaN(starId)) {
        return next(new AppError("Invalid star ID", 400));
      }

      const cacheKey = `stars:id:${starId}`;
      const star = await cacheService.getOrSet(cacheKey, () =>
        this.starRepository.findById(starId),
      );

      if (!star) {
        return next(new AppError("Star not found", 404));
      }

      res.json({
        success: true,
        data: star,
      });
    } catch (error) {
      logger.error("Error in getStarById:", error);
      next(new AppError(`Error retrieving star: ${error.message}`, 500));
    }
  };

  /**
   * Recherche d'étoiles par texte
   */
  searchStars = async (req, res, next) => {
    try {
      const { q, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: "Query parameter 'q' is required",
        });
      }

      const stars = await this.starRepository.searchStars({
        search: q,
        limit: Number.parseInt(limit),
        orderBy: "name",
        orderDirection: "ASC",
      });

      res.json({
        success: true,
        data: stars.rows,
        count: stars.count,
      });
    } catch (error) {
      logger.error("Error in searchStars:", error);
      next(new AppError(`Error searching for stars: ${error.message}`, 500));
    }
  };

  /**
   * Filtre les étoiles avec critères avancés
   */
  filterStars = async (req, res, next) => {
    try {
      const {
        constellation,
        minPrice,
        maxPrice,
        minMagnitude,
        maxMagnitude,
        minDistance,
        maxDistance,
        minLuminosity,
        maxLuminosity,
        sortBy = "name",
        sortOrder = "ASC",
        limit = 50,
      } = req.query;

      // Construire les critères de recherche
      const searchCriteria = {
        limit: Number.parseInt(limit),
        orderBy: sortBy,
        orderDirection: sortOrder.toUpperCase(),
      };

      // Support constellations multiples
      if (constellation) {
        const constellations = Array.isArray(constellation)
          ? constellation
          : constellation.split(",").map((c) => c.trim());

        searchCriteria.constellation =
          constellations.length === 1 ? constellations[0] : constellations;
      }

      // Filtres de prix
      if (minPrice) searchCriteria.minPrice = Number.parseFloat(minPrice);
      if (maxPrice) searchCriteria.maxPrice = Number.parseFloat(maxPrice);

      // Filtres de magnitude
      if (minMagnitude) searchCriteria.minMagnitude = Number.parseFloat(minMagnitude);
      if (maxMagnitude) searchCriteria.maxMagnitude = Number.parseFloat(maxMagnitude);

      // Filtres de distance
      if (minDistance) searchCriteria.minDistance = Number.parseFloat(minDistance);
      if (maxDistance) searchCriteria.maxDistance = Number.parseFloat(maxDistance);

      // Filtres de luminosité
      if (minLuminosity) searchCriteria.minLuminosity = Number.parseFloat(minLuminosity);
      if (maxLuminosity) searchCriteria.maxLuminosity = Number.parseFloat(maxLuminosity);

      const result = await this.starRepository.searchStars(searchCriteria);

      res.json({
        success: true,
        data: result.rows,
        count: result.count,
      });
    } catch (error) {
      logger.error("Error in filterStars function:", error);
      next(new AppError(`Error filtering stars: ${error.message}`, 500));
    }
  };

  /**
   * Récupère les constellations uniques
   */
  getConstellations = async (_req, res, next) => {
    try {
      const constellations = await cacheService.getOrSet("stars:constellations", () =>
        this.starRepository.getUniqueConstellations(),
      );

      res.json({
        success: true,
        data: constellations,
      });
    } catch (error) {
      logger.error("Error in getConstellations:", error);
      next(new AppError(`Error retrieving constellations: ${error.message}`, 500));
    }
  };
}

// Instance du contrôleur avec injection de dépendances
const starRepository = getService("starRepository");
const starControllerInstance = new StarController(starRepository);

// Export des méthodes pour compatibilité avec les routes existantes
module.exports = {
  getAllStars: starControllerInstance.getAllStars,
  getStarById: starControllerInstance.getStarById,
  searchStars: starControllerInstance.searchStars,
  filterStars: starControllerInstance.filterStars,
  getConstellations: starControllerInstance.getConstellations,
  StarController,
};
