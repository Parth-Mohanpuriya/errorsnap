/**
 * example/app.js - A small Express application demonstrating error-snap.
 * 
 * This app shows how to use the error-snap package in an Express application:
 * - Successful routes return JSON responses
 * - AppError is used for custom errors with specific status codes
 * - The errorHandler middleware handles errors consistently
 */

const express = require("express");
const { AppError, errorHandler, formatError } = require("../index");

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route: GET /success - Return a successful JSON response
app.get("/success", (req, res) => {
  res.json({
    success: true,
    message: "Operation successful!",
    data: { user: "John Doe" },
  });
});

// Route: GET /error - Throw a normal JavaScript error
app.get("/error", (req, res, next) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    next(err);
  }
});

// Route: GET /users - Throw an AppError with status code 404
app.get("/users", (req, res, next) => {
  const error = new AppError("User not found", 404);
  next(error);
});

// Route: GET /invalid - Throw an AppError with status code 400
app.get("/invalid", (req, res, next) => {
  const error = new AppError("Invalid input data", 400);
  next(error);
});

// Add errorHandler as the final middleware (always add this at the bottom!)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Example server running on http://localhost:${PORT}`);
  console.log("Available routes:");
  console.log("  GET /success - Successful response");
  console.log("  GET /error - Normal JavaScript error (returns 500)");
  console.log("  GET /users - AppError with status 404");
  console.log("  GET /invalid - AppError with status 400");
  console.log("");

  // Print the formatted error example for the terminal
  const exampleError = new AppError("User not found", 404);
  console.log(formatError(exampleError));
});

module.exports = app;