require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { ValidationError } = require("express-validator");
const rateLimitMiddleware = require("./middlewares/rateLimitMiddleware");
const securityMiddleware = require("./middlewares/securityMiddleware");
const apiRoutes = require("./routes/apiRoutes");
const { registerMetrics, startMetricsServer } = require("./config/prometheus");
const logger = require("./utils/logger");

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Security Middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(securityMiddleware);

// Rate Limiting Middleware
app.use(rateLimitMiddleware);

// API Routes
app.use("/api", apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err.array() });
  }
  logger.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  startMetricsServer();
  registerMetrics();
});
