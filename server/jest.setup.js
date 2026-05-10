// jest.setup.js
// Shared setup for integration tests that need a database connection.
// Unit tests (tests/unit/) should NOT rely on this setup — use mocks instead.

const { sequelize, User } = require("./src/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Shared test context — avoids global variable pollution
const testContext = {
  token: null,
  userId: null,
  sequelize,
};

let isDBSynced = false;

global.beforeAll(async () => {
  if (!isDBSynced) {
    try {
      await sequelize.sync({ force: true });

      const hashedPassword = await bcrypt.hash("testpassword", 10);
      const user = await User.create({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: hashedPassword,
      });

      testContext.userId = user.id;
      testContext.token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      isDBSynced = true;
    } catch (error) {
      console.error("Failed to sync database:", error);
      throw error;
    }
  }
});

global.beforeEach(async () => {
  try {
    await Promise.all(
      Object.values(sequelize.models).map((model) =>
        model.destroy({ truncate: true, force: true }),
      ),
    );
  } catch (error) {
    console.error("Failed to clear database:", error);
    throw error;
  }
});

global.afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error("Failed to close database connection:", error);
  }
});

module.exports = { testContext };
