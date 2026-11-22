/**
 * AppError - A custom error class for Express applications.
 * Extends the built-in Error class to provide structured error handling.
 */
class AppError extends Error {
  /**
   * Create a new AppError instance.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code (default: 500).
   */
  constructor(message, statusCode) {
    super(message);

    // Set the error name to AppError
    this.name = "AppError";

    // Store the HTTP status code (default to 500 if not provided)
    this.statusCode = statusCode || 500;

    // Capture the stack trace correctly
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;