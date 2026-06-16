require("dotenv").config(); // Load environment variables at the very top
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const ticketRoutes = require("./routes/tickets");

const app = express();

// 1. Security Middleware
app.use(helmet()); // Sets various HTTP headers to secure the app
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*", // In production, restrict this to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Request Logging & Parsing
app.use(morgan("dev")); // Logs requests to the console (e.g., GET /api/tickets 200 12ms)
app.use(express.json({ limit: "10kb" })); // Body parser, guarding against ridiculously large payloads

// 3. Application Routes
app.use("/api/tickets", ticketRoutes);

// Base Health Check Route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Support CRM API is up and running",
    environment: process.env.NODE_ENV
  });
});

// 4. Handle 404 (Not Found) Routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 5. Centralized Error Handling Middleware
// Every time a route throws an error, it will end up here instead of crashing the process
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`❌ Error: ${err.message}`);
  
  res.status(statusCode).json({
    status: "error",
    message: err.message,
    // Only show stack trace in development mode to prevent leaking system details
    stack: process.env.NODE_ENV === "development" ? err.stack : "🥞"
  });
});

// 6. Server Initialization
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections outside of Express
process.on("unhandledRejection", (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});