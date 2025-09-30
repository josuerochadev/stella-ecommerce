// server/src/controllers/adminController.js
// Contrôleur pour le panel d'administration
// Responsabilité unique : orchestration des services et gestion des erreurs HTTP

const { User, Order, Star, Review, sequelize } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { DashboardService } = require('../services/dashboardService');
const { UserSearchService } = require('../services/userSearchService');
const { UserStatsService } = require('../services/userStatsService');
const { UserResponseFormatter } = require('../formatters/userResponseFormatter');
const { Op } = require('sequelize');

/**
 * Dashboard général avec statistiques
 * Responsabilité unique : délégation au service et gestion des erreurs
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const { period = 30 } = req.query;

    // Délégation complète au service - respect du principe KISS
    const dashboard = await DashboardService.generateDashboard(period);

    res.json({
      success: true,
      dashboard
    });

  } catch (error) {
    next(new AppError(`Failed to get dashboard: ${error.message}`, 500));
  }
};

/**
 * Gestion des utilisateurs
 * Responsabilité unique : orchestration des services de recherche, stats et formatage
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, sortBy, order } = req.query;

    // Délégation à UserSearchService pour construire les options de requête
    const queryOptions = UserSearchService.buildQueryOptions({
      search, role, page, limit, sortBy, order
    });

    // Obtenir les utilisateurs avec pagination via le modèle
    const { count, rows: users } = await User.findAndCountAll(queryOptions);

    // Délégation à UserStatsService pour les statistiques
    const userIds = users.map(user => user.id);
    const statsMap = await UserStatsService.getUserOrderStats(userIds);

    // Délégation à UserResponseFormatter pour le formatage de la réponse
    const response = UserResponseFormatter.formatUsersResponse(
      users,
      statsMap,
      { page: queryOptions.offset / queryOptions.limit + 1, limit: queryOptions.limit },
      count
    );

    res.json(response);

  } catch (error) {
    next(new AppError(`Failed to get users: ${error.message}`, 500));
  }
};

/**
 * Mettre à jour le rôle d'un utilisateur
 * Responsabilité unique : validation et délégation du formatage de réponse
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validation des données d'entrée
    if (!['client', 'admin'].includes(role)) {
      return next(new AppError('Invalid role. Must be client or admin', 400));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Règles métier : empêcher de changer son propre rôle
    if (user.id === req.user.userId) {
      return next(new AppError('Cannot change your own role', 400));
    }

    // Mise à jour via le modèle
    user.role = role;
    await user.save();

    // Délégation du formatage de réponse
    const response = UserResponseFormatter.formatUserRoleUpdateResponse(
      user,
      `User role updated to ${role}`
    );

    res.json(response);

  } catch (error) {
    next(new AppError(`Failed to update user role: ${error.message}`, 500));
  }
};

/**
 * Gestion des étoiles
 */
exports.getStars = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, constellation, sortBy = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Conditions de recherche
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

    const { count, rows: stars } = await Star.findAndCountAll({
      where: whereCondition,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Obtenir les ventes pour chaque étoile
    const starsWithSales = await Promise.all(
      stars.map(async (star) => {
        const salesData = await sequelize.query(`
          SELECT COUNT(os.star_id) as sales_count, COALESCE(AVG(r.rating), 0) as avg_rating
          FROM stars s
          LEFT JOIN order_stars os ON s.starid = os.star_id
          LEFT JOIN orders o ON os.order_id = o.id AND o.status IN ('paid', 'shipped')
          LEFT JOIN reviews r ON s.starid = r.star_id
          WHERE s.starid = :starId
          GROUP BY s.starid
        `, {
          replacements: { starId: star.starid },
          type: sequelize.QueryTypes.SELECT
        });

        const stats = salesData[0] || { sales_count: 0, avg_rating: 0 };

        return {
          id: star.starid,
          name: star.name,
          constellation: star.constellation,
          price: parseFloat(star.price),
          magnitude: star.magnitude,
          distance: star.distanceFromEarth,
          createdAt: star.createdAt,
          stats: {
            salesCount: parseInt(stats.sales_count),
            averageRating: parseFloat(stats.avg_rating)
          }
        };
      })
    );

    res.json({
      success: true,
      stars: starsWithSales,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalStars: count,
        hasNext: page * limit < count,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    next(new AppError(`Failed to get stars: ${error.message}`, 500));
  }
};

/**
 * Mettre à jour le prix d'une étoile
 */
exports.updateStarPrice = async (req, res, next) => {
  try {
    const { starId } = req.params;
    const { price } = req.body;

    if (price <= 0) {
      return next(new AppError('Price must be positive', 400));
    }

    const star = await Star.findByPk(starId);
    if (!star) {
      return next(new AppError('Star not found', 404));
    }

    const oldPrice = star.price;
    star.price = price;
    await star.save();

    res.json({
      success: true,
      message: 'Star price updated successfully',
      star: {
        id: star.starid,
        name: star.name,
        oldPrice: parseFloat(oldPrice),
        newPrice: parseFloat(price)
      }
    });

  } catch (error) {
    next(new AppError(`Failed to update star price: ${error.message}`, 500));
  }
};

/**
 * Statistiques système
 */
exports.getSystemStats = async (req, res, next) => {
  try {
    // Informations sur la base de données
    const dbStats = await sequelize.query(`
      SELECT
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
      FROM pg_stat_user_tables
      ORDER BY n_tup_ins DESC
    `, { type: sequelize.QueryTypes.SELECT });

    // Index de performance
    const indexStats = await sequelize.query(`
      SELECT
        indexname,
        idx_tup_read,
        idx_tup_fetch
      FROM pg_stat_user_indexes
      WHERE idx_tup_read > 0
      ORDER BY idx_tup_read DESC
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      success: true,
      system: {
        database: {
          tables: dbStats,
          indexes: indexStats.slice(0, 10) // Top 10 index les plus utilisés
        },
        server: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: Math.floor(process.uptime()),
          memoryUsage: process.memoryUsage()
        },
        application: {
          environment: process.env.NODE_ENV,
          port: process.env.PORT || 3000
        }
      }
    });

  } catch (error) {
    next(new AppError(`Failed to get system stats: ${error.message}`, 500));
  }
};

module.exports = exports;