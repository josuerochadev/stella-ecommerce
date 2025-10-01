// server/src/controllers/adminController.js
// Contrôleur pour le panel d'administration
// Responsabilité unique : orchestration des services et gestion des erreurs HTTP

const { User } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { DashboardService } = require('../services/dashboardService');
const { UserSearchService } = require('../services/userSearchService');
const { UserStatsService } = require('../services/userStatsService');
const { UserResponseFormatter } = require('../formatters/userResponseFormatter');
const { SystemStatsService } = require('../services/SystemStatsService');
const { getService } = require('../container/containerConfig');

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
 * Utilise StarAdminService pour encapsuler la logique métier
 */
exports.getStars = async (req, res, next) => {
  try {
    const starAdminService = getService('starAdminService');

    const { page, limit, search, constellation, sortBy, order } = req.query;

    const result = await starAdminService.getStarsWithStats({
      page,
      limit,
      search,
      constellation,
      sortBy,
      order
    });

    res.json({
      success: true,
      stars: result.stars,
      pagination: result.pagination
    });

  } catch (error) {
    next(new AppError(`Failed to get stars: ${error.message}`, 500));
  }
};

/**
 * Mettre à jour le prix d'une étoile
 * Utilise StarAdminService
 */
exports.updateStarPrice = async (req, res, next) => {
  try {
    const starAdminService = getService('starAdminService');

    const starId = parseInt(req.params.starId, 10);
    const { price } = req.body;

    // Validation
    if (isNaN(starId)) {
      return next(new AppError('Invalid star ID', 400));
    }

    if (!price || price <= 0) {
      return next(new AppError('Price must be positive', 400));
    }

    const result = await starAdminService.updateStarPrice(starId, price);

    res.json({
      success: true,
      message: 'Star price updated successfully',
      star: result.star
    });

  } catch (error) {
    if (error.message === 'Star not found') {
      return next(new AppError(error.message, 404));
    }
    next(new AppError(`Failed to update star price: ${error.message}`, 500));
  }
};

/**
 * Statistiques système
 * Utilise SystemStatsService pour encapsuler les requêtes SQL
 */
exports.getSystemStats = async (req, res, next) => {
  try {
    const systemStats = await SystemStatsService.getSystemStats();

    res.json({
      success: true,
      system: systemStats
    });

  } catch (error) {
    next(new AppError(`Failed to get system stats: ${error.message}`, 500));
  }
};

module.exports = exports;