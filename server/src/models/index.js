// src/models/index.js
const fs = require("node:fs");
const path = require("node:path");
const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const allConfig = require("../config/database.js");
const testConfig = require("../config/database.test.config.js");
const config = env === "test" ? testConfig.test : allConfig[env] || allConfig.development;

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      define: { underscored: true, timestamps: true },
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    })
  : new Sequelize({
      ...config,
      dialect: config.dialect,
      storage: config.storage,
    });

const models = {};

const files = fs
  .readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js");

for (const file of files) {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  models[model.name] = model;
}

for (const modelName of Object.keys(models)) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
}

module.exports = {
  sequelize,
  ...models,
};
