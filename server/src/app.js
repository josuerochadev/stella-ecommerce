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
const csurf = require("csurf");
const { generalLimiter } = require("./middlewares/rateLimiter");
const { scheduleTokenCleanup } = require("./utils/tokenCleanup");

const app = express();

// Use Helmet to secure the app by setting various HTTP headers
app.use(helmet());

// Apply rate limiting to all requests
app.use(generalLimiter);

// Add cookie-parser to read/write cookies
app.use(cookieParser());

// Add CSRF middleware
app.use(csurf({ 
	cookie: {
		httpOnly: true,
		secure: NODE_ENV === 'production',
		sameSite: 'strict'
	} 
}));

// Middleware to add the CSRF token to responses
app.use((req, res, next) => {
	const csrfToken = req.csrfToken();
	res.cookie("XSRF-TOKEN", csrfToken, { 
		httpOnly: false, 
		secure: NODE_ENV === 'production',
		sameSite: 'strict'
	});
	next();
});

// Handle CSRF errors
app.use((err, _req, res, next) => {
	if (err.code === "EBADCSRFTOKEN") {
		return res.status(403).json({ 
			success: false, 
			message: "Invalid CSRF token. Please refresh the page and try again." 
		});
	}
	next(err);
});

// CORS configuration
const corsOptions = {
	origin: "http://localhost:3001",
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
