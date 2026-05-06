// server/src/utils/tokenCleanup.js
const cron = require('node-cron');
const tokenService = require('../services/tokenService');
const { info, error: logError } = require('./logger');

// Run token cleanup every day at 2 AM
const scheduleTokenCleanup = () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      info('Starting token cleanup job...');
      await tokenService.cleanupExpiredTokens();
      info('Token cleanup completed successfully');
    } catch (error) {
      logError(`Token cleanup failed: ${error.message}`);
    }
  });
};

module.exports = { scheduleTokenCleanup };