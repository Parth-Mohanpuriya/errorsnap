/**
 * errormap-demo-app
 * Interactive demonstration server for the errormap package.
 */

const express = require("express");
const path = require("path");
const { AppError, errorHandler, formatError, asyncHandler } = require("errormap");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Demonstration Routes ---

// 1. Success Route (200 OK)
app.get("/api/products", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: [
      { id: 1, name: "Mechanical Keyboard", price: 99.99 },
      { id: 2, name: "Wireless Mouse", price: 49.99 },
      { id: 3, name: "USB-C Hub", price: 29.99 }
    ]
  });
});

// 2. Client Validation Error with Details using AppError.badRequest()
app.post("/api/checkout", (req, res, next) => {
  const { items } = req.body || {};
  if (!items || !items.length) {
    return next(AppError.badRequest("Cart validation failed", [
      { field: "items", error: "Cart cannot be empty" },
      { field: "coupon", error: "Coupon code expired" }
    ]));
  }
  res.status(200).json({ success: true, message: "Checkout completed" });
});

// 3. Unauthorized Error using AppError.unauthorized()
app.get("/api/admin", (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(AppError.unauthorized("Authorization token is missing or expired."));
  }
  res.status(200).json({ success: true, message: "Welcome Admin" });
});

// 4. Resource Not Found Error using AppError.notFound()
app.get("/api/orders/:id", (req, res, next) => {
  const orderId = req.params.id;
  return next(AppError.notFound(`Order #${orderId} does not exist in the database.`));
});

// 5. Async Route using asyncHandler (Zero try/catch required!)
app.get("/api/async-user", asyncHandler(async (req, res) => {
  // Simulate an async database query delay
  await new Promise((resolve) => setTimeout(resolve, 60));
  // Unhandled async errors automatically forward to errorHandler via asyncHandler
  throw AppError.notFound("User profile not found in database", { userId: "usr_8231", queryTime: "60ms" });
}));

// 6. Live Custom Error Builder Endpoint
app.post("/api/custom-error", (req, res, next) => {
  const { message = "Custom error triggered", statusCode = 400, details = null } = req.body || {};
  return next(new AppError(message, parseInt(statusCode, 10), details));
});

// 7. Unhandled Server Exception (500 Internal Server Error)
app.get("/api/crash", (req, res, next) => {
  try {
    throw new Error("Database connection pool exhausted unexpectedly");
  } catch (err) {
    next(err);
  }
});

// Helper route to get formatError preview string for the web terminal view
app.get("/api/format-preview", (req, res) => {
  const message = req.query.message || "An unexpected error occurred";
  const statusCode = parseInt(req.query.statusCode, 10) || 500;
  const sampleError = new AppError(message, statusCode);
  res.json({ formatted: formatError(sampleError) });
});

// Catch-all route to serve dashboard for any non-API routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next(AppError.notFound(`Endpoint ${req.method} ${req.path} not found`));
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Register errormap Error Handler ---
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 errormap Demo App running at: http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to test interactive errors.\n`);
  
  const startupNotice = new AppError("Demo server initialized successfully", 200);
  console.log(formatError(startupNotice));
});
