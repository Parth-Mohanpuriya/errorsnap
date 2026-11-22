# errormap

A lightweight, production-ready error-handling npm package for Express applications. Create custom errors, eliminate async boilerplate, display formatted terminal logs, and handle Express errors in one place.

## Why should developers use it?

When building Express applications, error handling can become repetitive and inconsistent. `errormap` provides a clean, unified standard:

- **Eliminate `try/catch` boilerplate** with `asyncHandler`
- **Semantic HTTP errors** using `AppError` shortcuts (`.badRequest()`, `.notFound()`, etc.)
- **Validation details support** for field-level errors
- **Zero vulnerability risk**: 0 external dependencies
- **Safe in production**: Automatically suppresses internal server stack traces to clients
- **Built-in TypeScript declarations** (`index.d.ts`)

---

## Installation

```bash
npm install errormap
```

---

## Features & API

### 1. `asyncHandler` — Eliminate Async `try/catch`

Wraps asynchronous Express route handlers to catch unhandled promise rejections automatically without repetitive `try/catch` blocks:

```javascript
const { asyncHandler, AppError } = require("errormap");

app.get("/users/:id", asyncHandler(async (req, res) => {
  const user = await database.findUser(req.params.id);
  if (!user) {
    throw AppError.notFound("User not found");
  }
  res.json({ success: true, data: user });
}));
```

---

### 2. `AppError` — Structured Custom Errors

`AppError` extends JavaScript's built-in `Error` class and preserves the stack trace while adding HTTP status codes and optional details.

#### Static Convenience Shortcuts:
```javascript
const { AppError } = require("errormap");

throw AppError.badRequest("Invalid input data");         // 400
throw AppError.unauthorized("Authentication required");  // 401
throw AppError.forbidden("Access denied");               // 403
throw AppError.notFound("Resource not found");           // 404
throw AppError.conflict("Email already in use");         // 409
throw AppError.internal("Unexpected database error");    // 500
```

#### Field Validation Details:
```javascript
throw AppError.badRequest("Validation failed", [
  { field: "email", error: "Valid email address required" },
  { field: "password", error: "Password must be at least 8 characters" }
]);
```

---

### 3. `errorHandler` — Central Express Middleware

Mount `errorHandler` as the last middleware in your Express app:

```javascript
const express = require("express");
const { errorHandler } = require("errormap");

const app = express();

// ... your route definitions ...

// Mount as the final middleware:
app.use(errorHandler);
```

#### Client JSON Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "details": [
    { "field": "email", "error": "Valid email address required" }
  ]
}
```

*In production (`process.env.NODE_ENV === "production"`), status 500 errors are masked to `"Internal Server Error"` to protect sensitive infrastructure details.*

---

### 4. `formatError` — Terminal Logging Utility

```javascript
const { formatError, AppError } = require("errormap");

console.log(formatError(AppError.notFound("Order #999 not found")));
```

**Output:**
```text
-------------------------------
           ERROR MAP
-------------------------------
Error: Order #999 not found
Status Code: 404
Time: 15:30:20
-------------------------------
```

---

## Running Unit Tests

`errormap` includes zero-dependency unit tests powered by Node.js's native test runner (`node --test`):

```bash
npm test
```

---

## Example Application

A demonstration Express server is included in `example/app.js`:

```bash
npm start
```
The server will start on `http://localhost:3000` with example routes demonstrating `asyncHandler`, `AppError.notFound()`, and `errorHandler`.

---

## License

MIT © Parth Mohanpuriya
