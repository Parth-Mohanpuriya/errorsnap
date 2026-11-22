/**
 * index.js - The main entry point for the errormap package.
 * Exports the core error-handling utilities for use in Express applications.
 */

const AppError = require("./src/AppError");
const errorHandler = require("./src/errorHandler");
const formatError = require("./src/formatError");

// Export all utilities so users can import them easily
module.exports = {
  AppError,
  errorHandler,
  formatError,
};

module.exports.AppError = AppError;
module.exports.errorHandler = errorHandler;
module.exports.formatError = formatError;