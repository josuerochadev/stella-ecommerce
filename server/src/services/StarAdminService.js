// server/src/services/StarAdminService.js
// Service métier pour l'administration des étoiles
// Responsabilité unique : logique métier et statistiques des étoiles

const { sequelize } = require('../models');

/**
 * Service pour l'administration des étoiles
 * Encapsule les requêtes SQL complexes et la logique métier
 */
class StarAdminService {
  /**
   * @param {IStarRepository} starRepository - Repository des étoiles
   */
  constructor(starRepository) {
    this.starRepository = starRepository;
  }

  /**
   * Récupère les statistiques d'une étoile
   * Élimine la requête SQL brute du contrôleur
   * @param {number} starId - ID de l'étoile
   * @returns {Promise<Object>} Statistiques de l'étoile
   */
  async getStarStats(starId) {
    try {
      if (!starId || typeof starId !== 'number') {
        throw new Error('Star ID must be a valid number');
      }

      const salesData = await sequelize.query(`
        SELECT
          COUNT(os.star_id) as sales_count,
          COALESCE(AVG(r.rating), 0) as avg_rating
        FROM stars s
        LEFT JOIN order_stars os ON s.starid = os.star_id
        LEFT JOIN orders o ON os.order_id = o.id AND o.status IN ('paid', 'shipped')
        LEFT JOIN reviews r ON s.starid = r.star_id
        WHERE s.starid = :starId
        GROUP BY s.starid
      `, {
        replacements: { starId },
        type: sequelize.QueryTypes.SELECT
      });

      const stats = salesData[0] || { sales_count: 0, avg_rating: 0 };

      return {
        salesCount: parseInt(stats.sales_count),
        averageRating: parseFloat(stats.avg_rating)
      };
    } catch (error) {
      throw new Error(`Failed to get star stats: ${error.message}`);
    }
  }

  /**
   * Récupère les statistiques pour plusieurs étoiles
   * Optimisé pour éviter N+1 queries
   * @param {Array<number>} starIds - IDs des étoiles
   * @returns {Promise<Map<number, Object>>} Map des statistiques par ID d'étoile
   */
  async getMultipleStarStats(starIds) {
    try {
      if (!Array.isArray(starIds) || starIds.length === 0) {
        return new Map();
      }

      const salesData = await sequelize.query(`
        SELECT
          s.starid,
          COUNT(os.star_id) as sales_count,
          COALESCE(AVG(r.rating), 0) as avg_rating
        FROM stars s
        LEFT JOIN order_stars os ON s.starid = os.star_id
        LEFT JOIN orders o ON os.order_id = o.id AND o.status IN ('paid', 'shipped')
        LEFT JOIN reviews r ON s.starid = r.star_id
        WHERE s.starid IN (:starIds)
        GROUP BY s.starid
      `, {
        replacements: { starIds },
        type: sequelize.QueryTypes.SELECT
      });

      // Créer une Map pour accès O(1)
      const statsMap = new Map();

      for (const stat of salesData) {
        statsMap.set(stat.starid, {
          salesCount: parseInt(stat.sales_count),
          averageRating: parseFloat(stat.avg_rating)
        });
      }

      // Ajouter des stats par défaut pour les étoiles sans données
      for (const starId of starIds) {
        if (!statsMap.has(starId)) {
          statsMap.set(starId, {
            salesCount: 0,
            averageRating: 0
          });
        }
      }

      return statsMap;
    } catch (error) {
      throw new Error(`Failed to get multiple star stats: ${error.message}`);
    }
  }

  /**
   * Récupère les étoiles avec recherche et statistiques
   * @param {Object} searchCriteria - Critères de recherche
   * @returns {Promise<{stars: Array, pagination: Object}>} Étoiles avec pagination
   */
  async getStarsWithStats(searchCriteria) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        constellation,
        sortBy = 'createdAt',
        order = 'DESC'
      } = searchCriteria;

      // Validation
      const validatedLimit = Math.min(Math.max(parseInt(limit), 1), 100);
      const validatedPage = Math.max(parseInt(page), 1);
      const offset = (validatedPage - 1) * validatedLimit;

      // Utiliser le repository pour la recherche
      const { count, rows: stars } = await this.starRepository.findAndCountAll({
        where: this._buildWhereCondition(search, constellation),
        order: [[sortBy, order.toUpperCase()]],
        limit: validatedLimit,
        offset
      });

      // Récupérer les statistiques pour toutes les étoiles
      const starIds = stars.map(star => star.starid);
      const statsMap = await this.getMultipleStarStats(starIds);

      // Formater les étoiles avec leurs stats
      const starsWithStats = stars.map(star => ({
        id: star.starid,
        name: star.name,
        constellation: star.constellation,
        price: parseFloat(star.price),
        magnitude: star.magnitude,
        distance: star.distanceFromEarth,
        createdAt: star.createdAt,
        stats: statsMap.get(star.starid) || { salesCount: 0, averageRating: 0 }
      }));

      return {
        stars: starsWithStats,
        pagination: {
          currentPage: validatedPage,
          totalPages: Math.ceil(count / validatedLimit),
          totalStars: count,
          hasNext: validatedPage * validatedLimit < count,
          hasPrev: validatedPage > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to get stars with stats: ${error.message}`);
    }
  }

  /**
   * Met à jour le prix d'une étoile
   * @param {number} starId - ID de l'étoile
   * @param {number} newPrice - Nouveau prix
   * @returns {Promise<{star: Object, oldPrice: number, newPrice: number}>}
   */
  async updateStarPrice(starId, newPrice) {
    try {
      // Validation
      if (!starId || typeof starId !== 'number') {
        throw new Error('Star ID must be a valid number');
      }

      if (typeof newPrice !== 'number' || newPrice <= 0) {
        throw new Error('Price must be a positive number');
      }

      // Récupérer l'étoile
      const star = await this.starRepository.findById(starId);
      if (!star) {
        throw new Error('Star not found');
      }

      const oldPrice = parseFloat(star.price);

      // Mettre à jour le prix
      const updatedStar = await this.starRepository.update(starId, { price: newPrice });

      return {
        star: {
          id: updatedStar.starid,
          name: updatedStar.name,
          oldPrice,
          newPrice: parseFloat(newPrice)
        },
        oldPrice,
        newPrice: parseFloat(newPrice)
      };
    } catch (error) {
      throw new Error(`Failed to update star price: ${error.message}`);
    }
  }

  /**
   * Récupère les étoiles les plus vendues
   * @param {number} limit - Nombre d'étoiles à récupérer
   * @returns {Promise<Array>} Étoiles les plus vendues
   */
  async getTopSellingStars(limit = 10) {
    try {
      const validatedLimit = Math.min(Math.max(parseInt(limit), 1), 50);

      const topStars = await sequelize.query(`
        SELECT
          s.starid,
          s.name,
          s.constellation,
          s.price,
          COUNT(os.star_id) as sales_count,
          COALESCE(AVG(r.rating), 0) as avg_rating
        FROM stars s
        INNER JOIN order_stars os ON s.starid = os.star_id
        INNER JOIN orders o ON os.order_id = o.id AND o.status IN ('paid', 'shipped')
        LEFT JOIN reviews r ON s.starid = r.star_id
        GROUP BY s.starid, s.name, s.constellation, s.price
        ORDER BY sales_count DESC
        LIMIT :limit
      `, {
        replacements: { limit: validatedLimit },
        type: sequelize.QueryTypes.SELECT
      });

      return topStars.map(star => ({
        id: star.starid,
        name: star.name,
        constellation: star.constellation,
        price: parseFloat(star.price),
        stats: {
          salesCount: parseInt(star.sales_count),
          averageRating: parseFloat(star.avg_rating)
        }
      }));
    } catch (error) {
      throw new Error(`Failed to get top selling stars: ${error.message}`);
    }
  }

  /**
   * Récupère les statistiques de ventes par constellation
   * @returns {Promise<Array>} Statistiques par constellation
   */
  async getSalesByConstellation() {
    try {
      const constellationStats = await sequelize.query(`
        SELECT
          s.constellation,
          COUNT(DISTINCT os.order_id) as order_count,
          COUNT(os.star_id) as stars_sold,
          SUM(s.price) as total_revenue,
          COALESCE(AVG(r.rating), 0) as avg_rating
        FROM stars s
        LEFT JOIN order_stars os ON s.starid = os.star_id
        LEFT JOIN orders o ON os.order_id = o.id AND o.status IN ('paid', 'shipped')
        LEFT JOIN reviews r ON s.starid = r.star_id
        WHERE s.constellation IS NOT NULL
        GROUP BY s.constellation
        ORDER BY stars_sold DESC
      `, { type: sequelize.QueryTypes.SELECT });

      return constellationStats.map(stat => ({
        constellation: stat.constellation,
        orderCount: parseInt(stat.order_count) || 0,
        starsSold: parseInt(stat.stars_sold) || 0,
        totalRevenue: parseFloat(stat.total_revenue) || 0,
        averageRating: parseFloat(stat.avg_rating) || 0
      }));
    } catch (error) {
      throw new Error(`Failed to get sales by constellation: ${error.message}`);
    }
  }

  /**
   * Construit la condition WHERE pour la recherche
   * @param {string} search - Terme de recherche
   * @param {string} constellation - Constellation à filtrer
   * @returns {Object} Condition WHERE Sequelize
   * @private
   */
  _buildWhereCondition(search, constellation) {
    const { Op } = require('sequelize');
    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (constellation) {
      whereCondition.constellation = constellation;
    }

    return whereCondition;
  }
}

module.exports = { StarAdminService };