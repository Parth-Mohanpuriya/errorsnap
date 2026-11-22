/**
 * asyncHandler - Wraps an Express async route handler to catch unhandled promise rejections
 * and automatically forward them to Express next(err) middleware without manual try/catch.
 * 
 * @param {Function} fn - The asynchronous route handler (req, res, next) => Promise<any>
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
