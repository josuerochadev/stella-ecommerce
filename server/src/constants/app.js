const APP_CONSTANTS = {
  // Server configuration
  DEFAULT_PORT: 3000,
  FRONTEND_URLS: [
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    process.env.FRONTEND_URL,
  ].filter(Boolean),

  // Session and security
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  TOKEN_EXPIRY_DAYS: 7, // Token expires in 7 days

  // Email retry and delays
  EMAIL_RETRY_BASE_DELAY: 5000, // 5 seconds base delay for email retry
  EMAIL_PROCESSING_DELAY: 1000, // 1 second delay for email processing

  // Cron jobs
  CLEANUP_CRON_SCHEDULE: "0 2 * * *", // Daily at 2 AM

  // Payment processing
  PAYMENT_MIN_DELAY: 1000, // 1 second minimum
  PAYMENT_COMPLETION_DELAY: 24 * 60 * 60 * 1000, // 24 hours
  SHIPPING_DELAY: 5 * 24 * 60 * 60 * 1000, // 5 days

  // Pagination defaults
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Rate limiting
  GENERAL_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  GENERAL_LIMIT_MAX: 100, // 100 requests per window

  // Statistics and analytics
  STATS_DEFAULT_DAYS: 7,
  CONVERSION_RATE_PRECISION: 100, // For percentage calculations
  AMOUNT_PRECISION: 100, // For currency calculations

  // Admin dashboard
  RECENT_ACTIVITIES_LIMIT: 10,
  TOP_INDEXES_LIMIT: 10,

  // Validation limits
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_REASON_LENGTH: 5,
  MAX_REASON_LENGTH: 500,
  MIN_RATING: 1,
  MAX_RATING: 5,

  // Default skeleton width
  SKELETON_DEFAULT_WIDTH: "100%",
  SKELETON_LAST_LINE_WIDTH: "75%",
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const CORS_OPTIONS = {
  origin: APP_CONSTANTS.FRONTEND_URLS,
  credentials: true,
  optionsSuccessStatus: HTTP_STATUS.OK,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-CSRF-Token",
    "Accept",
    "Origin",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
};

const SESSION_CONFIG = {
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: APP_CONSTANTS.SESSION_MAX_AGE,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  },
};

module.exports = {
  APP_CONSTANTS,
  HTTP_STATUS,
  CORS_OPTIONS,
  SESSION_CONFIG,
};
