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
  // If the response was already sent, don't try to send another
  if (res.headersSent) {
    return next(err);
  }

  // Send a JSON response to the client
  // Do not send stack traces to clients
  // Return a generic message for unexpected errors in production
  const message =
    process.env.NODE_ENV === "production" && statusCode >= 500
      ? "Internal Server Error"
      : err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
}

module.exports = errorHandler;