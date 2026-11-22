/**
 * errorHandler - Express error-handling middleware.
 * Handles errors in one place, prints formatted errors to terminal,
 * and sends consistent JSON responses to clients.
 * @param {Error} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next function.
 */
function errorHandler(err, req, res, next) {
  // Check whether the error has a status code; use 500 if not
  const statusCode = err.statusCode || 500;

  // Print the formatted error in the terminal
  const formatError = require("./formatError");
  console.error(formatError(err));

  // Handle already-sent responses using next(err)
  if (res.headersSent) {
    return next(err);
  }

  // Send a JSON response to the client
  // Return a generic message for unexpected errors in production to avoid leaking sensitive information
  const isProd = process.env.NODE_ENV === "production";
  const message =
    isProd && statusCode >= 500
      ? "Internal Server Error"
      : err.message || "Something went wrong";

  const response = {
    success: false,
    message,
    statusCode,
  };

  // Include validation details if provided (unless masked in production 500s)
  if (err.details && !(isProd && statusCode >= 500)) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
