const winston = require("winston");
const Sentry = require("@sentry/node");

const sentryTransport = new winston.transports.Stream({
  level: "error",
  stream: {
    write: (message) => {
      try {
        const parsed = JSON.parse(message);
        Sentry.captureMessage(parsed.message || message, {
          level: "error",
          extra: parsed,
        });
      } catch {
        Sentry.captureMessage(message, "error");
      }
    },
  },
});

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
    sentryTransport,
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

module.exports = logger;
