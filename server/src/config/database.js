// config/database.js

require("dotenv").config();
const testConfig = require("./database.test.config");

const defaultConfig = {
  dialect: "postgres",
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
  },
};

module.exports = {
  development: {
    ...defaultConfig,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "stella_dev",
    host: process.env.DB_HOST || "localhost",
  },
  test: {
    ...defaultConfig,
    ...testConfig.test,
  },
  production: {
    ...defaultConfig,
    ...(process.env.DATABASE_URL
      ? {
          use_env_variable: 'DATABASE_URL',
        }
      : {
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          host: process.env.DB_HOST,
        }),
    pool: {
      min: 2,
      max: 20,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
      },
    },
  },
};
