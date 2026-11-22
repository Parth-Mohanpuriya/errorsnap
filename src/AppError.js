/**
 * AppError - A custom error class for Express applications.
 * Extends the built-in Error class to provide structured error handling.
 */
class AppError extends Error {
  /**
   * Create a new AppError instance.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code (default: 500).
   * @param {Array|object|null} details - Optional validation or error details.
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);

    // Set the error name to AppError
    this.name = "AppError";

    // Store the HTTP status code
    this.statusCode = statusCode;

    // Optional error details (e.g., validation field errors)
    if (details !== null) {
      this.details = details;
    }

    // Capture the stack trace correctly
    Error.captureStackTrace(this, this.constructor);
  }

  // --- Static Convenience Shortcuts ---

  static badRequest(message = "Bad Request", details = null) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = "Unauthorized", details = null) {
    return new AppError(message, 401, details);
  }

  static forbidden(message = "Forbidden", details = null) {
    return new AppError(message, 403, details);
  }

  static notFound(message = "Not Found", details = null) {
    return new AppError(message, 404, details);
  }

  static conflict(message = "Conflict", details = null) {
    return new AppError(message, 409, details);
  }

  static internal(message = "Internal Server Error", details = null) {
    return new AppError(message, 500, details);
  }
}

module.exports = AppError;
