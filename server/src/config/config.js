// server/src/config/config.js
// Configuration centralisee du serveur

require("dotenv").config();

const config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "24h",

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
  const required = ["JWT_SECRET", "DB_USERNAME", "DB_PASSWORD", "DB_DATABASE"];
  const missing = required.filter((key) => !config[key]);
  if (missing.length > 0 && config.NODE_ENV !== "test") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

validateConfig();

module.exports = config;
