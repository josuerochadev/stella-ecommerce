// server/src/controllers/adminController.js
// Contrôleur pour le panel d'administration

const { User, Order, Star, Review, sequelize } = require('../models');
const { AppError } = require('../middlewares/errorHandler');
const { paymentService } = require('../services/paymentService');
const { Op } = require('sequelize');

/**
 * Dashboard général avec statistiques
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const { period = 30 } = req.query;
    const days = parseInt(period);
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Statistiques parallèles pour performance
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      totalStars,
      recentOrders,
      topStars,
      userGrowth,
      paymentStats
    ] = await Promise.all([
      // Nombre total d'utilisateurs
      User.count(),

      // Nombre total de commandes dans la période
      Order.count({
        where: { createdAt: { [Op.gte]: fromDate } }
      }),

      // Revenus totaux
      Order.sum('total_amount', {
        where: {
          status: ['paid', 'shipped'],
          createdAt: { [Op.gte]: fromDate }
        }
      }),

      // Nombre total d'étoiles
      Star.count(),

      // Commandes récentes avec détails
      Order.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName', 'email']
          }
        ],
        attributes: ['id', 'status', 'total_amount', 'payment_method', 'createdAt']
      }),

      // Étoiles les plus populaires
      sequelize.query(`
        SELECT s.name, s.constellation, s.price, COUNT(os.star_id) as sales_count
        FROM stars s
        LEFT JOIN order_stars os ON s.starid = os.star_id
        LEFT JOIN orders o ON os.order_id = o.id AND o.status IN ('paid', 'shipped')
        WHERE o.created_at >= :fromDate
        GROUP BY s.starid, s.name, s.constellation, s.price
        ORDER BY sales_count DESC
        LIMIT 5
      `, {
        replacements: { fromDate },
        type: sequelize.QueryTypes.SELECT
      }),

      // Croissance des utilisateurs (par jour sur les 7 derniers jours)
      sequelize.query(`
        SELECT DATE(created_at) as date, COUNT(*) as new_users
        FROM users
        WHERE created_at >= :sevenDaysAgo
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `, {
        replacements: { sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        type: sequelize.QueryTypes.SELECT
      }),

      // Statistiques de paiement simulées
      paymentService.generatePaymentStats(days)
    ]);

    // Calculer les métriques clés
    const averageOrderValue = totalOrders > 0 ? (totalRevenue || 0) / totalOrders : 0;

    // Répartition des commandes par statut
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', '*'), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total']
      ],
      where: { createdAt: { [Op.gte]: fromDate } },
      group: ['status']
    });

    const dashboard = {
      period: `${days} days`,
      overview: {
        totalUsers,
        totalOrders,
        totalRevenue: parseFloat(totalRevenue) || 0,
        totalStars,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        conversionRate: totalUsers > 0 ? Math.round((totalOrders / totalUsers) * 100 * 100) / 100 : 0
      },
      recentActivity: {
        orders: recentOrders.map(order => ({
          id: order.id,
          customer: `${order.User.firstName} ${order.User.lastName}`,
          email: order.User.email,
          amount: parseFloat(order.total_amount),
          status: order.status,
          paymentMethod: order.payment_method,
          date: order.createdAt
        })),
        topStars: topStars.map(star => ({
          name: star.name,
          constellation: star.constellation,
          price: parseFloat(star.price),
          salesCount: parseInt(star.sales_count)
        }))
      },
      analytics: {
        userGrowth: userGrowth.map(day => ({
          date: day.date,
          newUsers: parseInt(day.new_users)
        })),
        ordersByStatus: ordersByStatus.map(status => ({
          status: status.status,
          count: parseInt(status.dataValues.count),
          total: parseFloat(status.dataValues.total) || 0
        })),
        paymentStats: paymentStats
      }
    };

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
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role, sortBy = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Construire les conditions de recherche
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

    // Obtenir les utilisateurs avec pagination
    const { count, rows: users } = await User.findAndCountAll({
      where: whereCondition,
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Obtenir les statistiques de commandes pour ces utilisateurs
    const userIds = users.map(user => user.id);
    const orderStats = await sequelize.query(`
      SELECT
        user_id,
        COUNT(*) as order_count,
        COALESCE(SUM(total_amount), 0) as total_spent
      FROM orders
      WHERE user_id IN (:userIds)
      GROUP BY user_id
    `, {
      replacements: { userIds },
      type: sequelize.QueryTypes.SELECT
    });

    // Créer un map des stats pour accès rapide
    const statsMap = new Map(orderStats.map(stat => [stat.user_id, stat]));

    res.json({
      success: true,
      users: users.map(user => {
        const stats = statsMap.get(user.id) || { order_count: 0, total_spent: 0 };
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          joinDate: user.createdAt,
          stats: {
            orderCount: parseInt(stats.order_count),
            totalSpent: parseFloat(stats.total_spent)
          }
        };
      }),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
        hasNext: page * limit < count,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    next(new AppError(`Failed to get users: ${error.message}`, 500));
  }
};

/**
 * Mettre à jour le rôle d'un utilisateur
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['client', 'admin'].includes(role)) {
      return next(new AppError('Invalid role. Must be client or admin', 400));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Empêcher de changer son propre rôle
    if (user.id === req.user.userId) {
      return next(new AppError('Cannot change your own role', 400));
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    });

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