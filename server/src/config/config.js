// server/src/config/config.js
// Configuration centralisee du serveur

require("dotenv").config();

const config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "24h",

  // CSRF
  CSRF_SECRET: process.env.CSRF_SECRET,

  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || process.env.JWT_SECRET,

  // Database
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USERNAME: process.env.DB_USERNAME || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_DATABASE: process.env.DB_DATABASE || "stella_dev",
};

// Validation des variables critiques au demarrage
function validateConfig() {
  const missing = [];
  if (!config.JWT_SECRET) missing.push("JWT_SECRET");
  // Accept either DATABASE_URL (Neon/Railway) or individual DB vars
  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  const hasDbVars = config.DB_USERNAME && config.DB_PASSWORD && config.DB_DATABASE;
  if (!hasDbUrl && !hasDbVars)
    missing.push("DATABASE_URL (or DB_USERNAME + DB_PASSWORD + DB_DATABASE)");
  if (missing.length > 0 && config.NODE_ENV !== "test") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
  // Warn about missing dedicated secrets in production (fallbacks will be used)
  if (config.NODE_ENV === "production") {
    const warnings = [];
    if (!config.JWT_REFRESH_SECRET) warnings.push("JWT_REFRESH_SECRET");
    if (!config.CSRF_SECRET) warnings.push("CSRF_SECRET");
    if (warnings.length > 0) {
      console.warn(
        `⚠️  Missing recommended env vars: ${warnings.join(", ")}. Using derived fallbacks. Set these for better security.`,
      );
    }
  }
}

validateConfig();

module.exports = config;
