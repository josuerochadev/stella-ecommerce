const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      maxsize: 20 * 1024 * 1024, // 20 MB
      maxFiles: 5,
      tailable: true,
    }),
    new winston.transports.File({
      filename: "combined.log",
      maxsize: 20 * 1024 * 1024, // 20 MB
      maxFiles: 5,
      tailable: true,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

module.exports = logger;
