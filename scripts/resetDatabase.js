// scripts/resetDatabase.js
const { sequelize } = require("../server/src/models");
const createTables = require("./createTables");
const generateSampleData = require("./sampleData");

async function resetDatabase() {
  if (process.env.NODE_ENV === "production") {
    console.error("ERROR: resetDatabase cannot run in production.");
    process.exit(1);
  }

  try {
    // Supprime toutes les tables existantes
    await sequelize.query("DROP SCHEMA public CASCADE;");
    await sequelize.query("CREATE SCHEMA public;");

    // Recrée les tables
    await createTables();

    // Génère les données d'exemple
    await generateSampleData();

  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
