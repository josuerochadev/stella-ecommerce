// server/src/config/cookieConfig.js
// Centralized cookie configuration

/**
 * Refresh token cookie options
 * Used for authentication refresh tokens across all auth endpoints
 */
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

module.exports = {
  REFRESH_TOKEN_COOKIE_OPTIONS
};