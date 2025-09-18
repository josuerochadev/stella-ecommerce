// server/src/app.js

require("dotenv").config();
const express = require("express");
const { json, urlencoded } = express;
const expressStatic = express.static;
const morgan = require("morgan");
const { join } = require("node:path");
const cors = require("cors");
const { sequelize } = require("./models");
const { errorHandler, AppError } = require("./middlewares/errorHandler");
const routes = require("./routes");
const { NODE_ENV, PORT: _PORT } = require("./config/config");
const { info, error: _error } = require("./utils/logger");
const { serve, setup } = require("./utils/swagger");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { generalLimiter } = require("./middlewares/rateLimiter");
const { csrfGenerate } = require("./middlewares/modernCsrf");
const { scheduleTokenCleanup } = require("./utils/tokenCleanup");

const app = express();

// Use Helmet to secure the app by setting various HTTP headers
app.use(helmet());

// Apply rate limiting to all requests
app.use(generalLimiter);

// Add cookie-parser to read/write cookies
app.use(cookieParser());

// Configure session for CSRF protection
app.use(session({
	secret: process.env.SESSION_SECRET || process.env.JWT_SECRET + '_session',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		sameSite: 'strict'
	}
}));

// Modern CSRF protection (génération des tokens)
app.use(csrfGenerate);

// CORS configuration
const corsOptions = {
	origin: ["http://localhost:3001", "http://localhost:3002"],
	credentials: true, // Allow credentials (cookies)
	optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Logging middleware
if (NODE_ENV !== "test") {
	app.use(
		morgan("combined", {
			stream: { write: (message) => info(message.trim()) },
		}),
	);
}

// Middleware to parse JSON
app.use(json());

// Middleware to parse form data
app.use(urlencoded({ extended: true }));

// Swagger UI setup
app.use("/api-docs", serve, setup);

// Serve static files
app.use(expressStatic(join(__dirname, "public")));

// Centralized API routes
app.use("/api", routes);

// Route spécifique pour la démo admin
app.get("/admin-demo", (_, res) => {
	res.sendFile(join(__dirname, "public", "admin-demo.html"));
});

// Route to handle all non-API requests
app.get("*", (_, res) => {
	res.sendFile(join(__dirname, "public", "index.html"));
});

// Handle 404 errors for the API
app.use("/api", (req, _, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling
app.use(errorHandler);

const PORT = _PORT || 3000;

// Function to start the server
const startServer = async () => {
	try {
		await sequelize.sync({ force: false });
		info("Database synced");
		info(`Connected to database: ${sequelize.config.database}`);

		// Schedule token cleanup job
		scheduleTokenCleanup();
		info("Token cleanup job scheduled");

		app.listen(PORT, () => {
			info(`Server is running in ${NODE_ENV} mode on port ${PORT}`);
		});
	} catch (error) {
		_error("Unable to start server:", error);
		process.exit(1);
	}
};

if (require.main === module) {
	startServer();
}

module.exports = app;
