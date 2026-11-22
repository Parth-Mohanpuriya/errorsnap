# error-snap

A simple error-handling npm package for Express applications. Help developers create custom errors, display readable error messages, and handle Express errors in one place.

## Why should developers use it?

When building Express applications, error handling can become repetitive and inconsistent. error-snap provides a simple, consistent way to:

- Create custom errors with proper status codes
- Format errors for readable terminal output
- Handle errors in one place using Express middleware
- Send consistent JSON error responses to clients
- Avoid repeating error-handling code in every route

## Features

1. **Custom Error Class** (`AppError`) - Extends the built-in Error class with status code support
2. **Error Formatter** (`formatError`) - Formats errors into readable terminal messages
3. **Express Error Middleware** (`errorHandler`) - Handles errors consistently and sends JSON responses
4. **Full Export** - All utilities exported from the main entry point

## Installation

```bash
npm install error-snap
```

Or install locally from this repository:

```bash
npm install
```

## Basic usage

```javascript
const express = require("express");
const { AppError, errorHandler, formatError } = require("error-snap");

// Create a custom error
const error = new AppError("User not found", 404);

// Format for terminal display
console.log(formatError(error));
```

## How to create a custom error

```javascript
const { AppError } = require("error-snap");

// With message and status code
const error = new AppError("User not found", 404);

// Without status code (defaults to 500)
const error = new AppError("Something went wrong");
```

The `AppError` class:
- Sets `error.name` to `"AppError"`
- Stores the `message`
- Stores the `statusCode` (defaults to 500)
- Correctly captures the stack trace

## How to use errorHandler

```javascript
const express = require("express");
const { errorHandler } = require("error-snap");

const app = express();

// ... your routes ...

// Add errorHandler as the final middleware
app.use(errorHandler);
```

The `errorHandler` middleware:
1. Checks if the error has a status code (uses 500 if not)
2. Prints the formatted error in the terminal
3. Sends a JSON response to the client
4. Does not send stack traces to clients
5. Returns a generic message in production for unexpected errors
6. Handles already-sent responses using `next(err)`

**Example JSON response:**
```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404
}
```

## How to use formatError

```javascript
const { formatError } = require("error-snap");

const error = new AppError("User not found", 404);
const formatted = formatError(error);

console.log(formatted);
```

**Output:**
```
-------------------------------
          ERROR SNAP
-------------------------------
Error: User not found
Status Code: 404
Time: 15:30:20
-------------------------------
```

## Example Express application

See the `example/app.js` file for a complete demonstration of the package in use.

### Running the example

```bash
cd error-snap
npm install
npm start
```

The server will start on `http://localhost:3000`. Visit the following routes:

- `GET /success` - Returns a successful JSON response
- `GET /error` - Throws a normal JavaScript error (returns 500)
- `GET /users` - Throws an AppError with status code 404
- `GET /invalid` - Throws an AppError with status code 400

## How to run the example

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Visit `http://localhost:3000` in your browser or use curl/Postman

## Testing the package manually

Verify these scenarios:

- **Successful route works**: Visit `GET /success` - should return JSON with `success: true`
- **Normal JavaScript errors return status 500**: Visit `GET /error` - should return 500 status
- **AppError returns the supplied status code**: Visit `GET /users` - should return 404 status; `GET /invalid` - should return 400 status
- **Error messages are correctly displayed in the terminal**: Check the terminal output where the server is running
- **Stack traces are not exposed in API responses**: The JSON response should not contain stack trace information
- **Production responses do not expose internal error messages**: Set `NODE_ENV=production` to test
- **The server does not crash when an error occurs**: All errors should be handled gracefully

## License

MIT

Built with JavaScript and Express. No unnecessary dependencies.