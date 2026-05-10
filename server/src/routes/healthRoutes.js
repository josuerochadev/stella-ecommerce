const { Router } = require("express");
const { sequelize } = require("../models");

const router = Router();

router.get("/", async (_, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  };

  try {
    await sequelize.authenticate();
    health.database = "connected";
  } catch {
    health.status = "degraded";
    health.database = "disconnected";
    return res.status(503).json(health);
  }

  res.json(health);
});

module.exports = router;
