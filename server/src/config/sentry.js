const Sentry = require("@sentry/node");

function initSentry(app) {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
    beforeSend(event) {
      if (process.env.NODE_ENV === "test") {
        return null;
      }
      return event;
    },
  });

  Sentry.setupExpressErrorHandler(app);
}

module.exports = { initSentry };
