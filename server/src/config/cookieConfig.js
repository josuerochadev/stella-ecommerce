// server/src/config/cookieConfig.js
// Centralized cookie configuration

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Access token cookie options
 * httpOnly prevents JavaScript access (XSS protection)
 */
const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/api',
};

/**
 * Refresh token cookie options
 * Used for authentication refresh tokens across all auth endpoints
 */
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

module.exports = {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS
};