// server/src/services/SystemStatsService.js
// Service pour les statistiques système
// Responsabilité unique : collecte des métriques système et base de données

const { sequelize } = require("../models");

/**
 * Service pour les statistiques système
 * Encapsule les requêtes SQL complexes pour les métriques système
 */
class SystemStatsService {
  /**
   * Récupère les statistiques de la base de données
   * @returns {Promise<Array>} Statistiques des tables
   */
  static async getDatabaseTableStats() {
    try {
      const dbStats = await sequelize.query(
        `
        SELECT
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes
        FROM pg_stat_user_tables
        ORDER BY n_tup_ins DESC
      `,
        { type: sequelize.QueryTypes.SELECT },
      );

      return dbStats;
    } catch (error) {
      throw new Error(`Failed to get database table stats: ${error.message}`);
    }
  }

  /**
   * Récupère les statistiques des index
   * @param {number} limit - Nombre d'index à récupérer
   * @returns {Promise<Array>} Statistiques des index
   */
  static async getDatabaseIndexStats(limit = 10) {
    try {
      const validatedLimit = Math.min(Math.max(Number.parseInt(limit), 1), 50);

      const indexStats = await sequelize.query(
        `
        SELECT
          indexname,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes
        WHERE idx_tup_read > 0
        ORDER BY idx_tup_read DESC
        LIMIT :limit
      `,
        {
          replacements: { limit: validatedLimit },
          type: sequelize.QueryTypes.SELECT,
        },
      );

      return indexStats;
    } catch (error) {
      throw new Error(`Failed to get database index stats: ${error.message}`);
    }
  }

  /**
   * Récupère les informations serveur
   * @returns {Object} Informations du serveur Node.js
   */
  static getServerInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage(),
    };
  }

  /**
   * Récupère les informations de l'application
   * @returns {Object} Informations de configuration
   */
  static getApplicationInfo() {
    return {
      environment: process.env.NODE_ENV,
      port: process.env.PORT || 3000,
    };
  }

  /**
   * Récupère toutes les statistiques système
   * @returns {Promise<Object>} Toutes les statistiques système
   */
  static async getSystemStats() {
    try {
      const [tableStats, indexStats] = await Promise.all([
        SystemStatsService.getDatabaseTableStats(),
        SystemStatsService.getDatabaseIndexStats(10),
      ]);

      return {
        database: {
          tables: tableStats,
          indexes: indexStats,
        },
        server: SystemStatsService.getServerInfo(),
        application: SystemStatsService.getApplicationInfo(),
      };
    } catch (error) {
      throw new Error(`Failed to get system stats: ${error.message}`);
    }
  }

  /**
   * Récupère les statistiques de connexions à la base de données
   * @returns {Promise<Object>} Statistiques de connexions
   */
  static async getDatabaseConnectionStats() {
    try {
      const connectionStats = await sequelize.query(
        `
        SELECT
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `,
        { type: sequelize.QueryTypes.SELECT },
      );

      return (
        connectionStats[0] || {
          total_connections: 0,
          active_connections: 0,
          idle_connections: 0,
        }
      );
    } catch (error) {
      throw new Error(`Failed to get database connection stats: ${error.message}`);
    }
  }

  /**
   * Récupère la taille de la base de données
   * @returns {Promise<Object>} Taille de la base de données
   */
  static async getDatabaseSize() {
    try {
      const sizeData = await sequelize.query(
        `
        SELECT
          pg_size_pretty(pg_database_size(current_database())) as pretty_size,
          pg_database_size(current_database()) as size_bytes
      `,
        { type: sequelize.QueryTypes.SELECT },
      );

      return (
        sizeData[0] || {
          pretty_size: "0 bytes",
          size_bytes: 0,
        }
      );
    } catch (error) {
      throw new Error(`Failed to get database size: ${error.message}`);
    }
  }

  /**
   * Récupère les requêtes les plus lentes
   * @param {number} limit - Nombre de requêtes à récupérer
   * @returns {Promise<Array>} Requêtes les plus lentes
   */
  static async getSlowestQueries(limit = 10) {
    try {
      const validatedLimit = Math.min(Math.max(Number.parseInt(limit), 1), 50);

      const slowQueries = await sequelize.query(
        `
        SELECT
          query,
          calls,
          total_time,
          mean_time,
          max_time
        FROM pg_stat_statements
        WHERE query NOT LIKE '%pg_stat_statements%'
        ORDER BY mean_time DESC
        LIMIT :limit
      `,
        {
          replacements: { limit: validatedLimit },
          type: sequelize.QueryTypes.SELECT,
        },
      );

      return slowQueries;
    } catch (error) {
      // pg_stat_statements peut ne pas être activé
      if (error.message.includes('relation "pg_stat_statements" does not exist')) {
        return [];
      }
      throw new Error(`Failed to get slowest queries: ${error.message}`);
    }
  }

  /**
   * Récupère les statistiques détaillées
   * @returns {Promise<Object>} Statistiques détaillées
   */
  static async getDetailedStats() {
    try {
      const [systemStats, connectionStats, databaseSize, slowQueries] = await Promise.all([
        SystemStatsService.getSystemStats(),
        SystemStatsService.getDatabaseConnectionStats(),
        SystemStatsService.getDatabaseSize(),
        SystemStatsService.getSlowestQueries(10),
      ]);

      return {
        ...systemStats,
        database: {
          ...systemStats.database,
          connections: connectionStats,
          size: databaseSize,
          slowQueries,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get detailed stats: ${error.message}`);
    }
  }
}

module.exports = { SystemStatsService };
