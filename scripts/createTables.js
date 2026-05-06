// scripts/createTables.js
const { sequelize } = require("../server/src/models");

async function createTables() {
  if (process.env.NODE_ENV === "production") {
    console.error("ERROR: createTables cannot run in production (uses sync force: true).");
    process.exit(1);
  }

  try {
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

if (require.main === module) {
  createTables().then(() => sequelize.close());
}

module.exports = createTables;
