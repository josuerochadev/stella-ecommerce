// server/src/utils/cacheService.js
// Responsabilite unique : Cache applicatif in-memory avec TTL

const NodeCache = require("node-cache");
const logger = require("./logger");

const DEFAULT_TTL = 300; // 5 minutes

const cache = new NodeCache({
  stdTTL: DEFAULT_TTL,
  checkperiod: 60,
  useClones: false,
});

cache.on("expired", (key) => {
  logger.debug(`Cache key expired: ${key}`);
});

/**
 * Get a value from cache, or compute and store it if missing.
 * @param {string} key
 * @param {Function} fetchFn - async function that returns the data
 * @param {number} [ttl] - TTL in seconds (default: 300)
 */
const getOrSet = async (key, fetchFn, ttl = DEFAULT_TTL) => {
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const data = await fetchFn();
  cache.set(key, data, ttl);
  return data;
};

const invalidate = (key) => {
  cache.del(key);
};

const invalidatePattern = (pattern) => {
  const keys = cache.keys().filter((k) => k.startsWith(pattern));
  if (keys.length > 0) {
    cache.del(keys);
  }
};

const flush = () => {
  cache.flushAll();
};

module.exports = { getOrSet, invalidate, invalidatePattern, flush };
