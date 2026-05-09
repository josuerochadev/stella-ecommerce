const winston = require("winston");
const { Writable } = require("node:stream");

const transports = [
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
];

// Only add Sentry transport when SENTRY_DSN is configured
if (process.env.SENTRY_DSN) {
  const Sentry = require("@sentry/node");
  const sentryStream = new Writable({
    write(chunk, _encoding, callback) {
      const message = chunk.toString();
      try {
        const parsed = JSON.parse(message);
        Sentry.captureMessage(parsed.message || message, {
          level: "error",
          extra: parsed,
        });
      } catch {
        Sentry.captureMessage(message, "error");
      }
      callback();
    },
  });
  transports.push(
    new winston.transports.Stream({
      level: "error",
      stream: sentryStream,
    }),
  );
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports,
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

module.exports = logger;
