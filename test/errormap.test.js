const { test, describe } = require("node:test");
const assert = require("node:assert");
const { AppError, errorHandler, formatError, asyncHandler } = require("../index");

describe("AppError Class", () => {
  test("creates AppError with message and custom status code", () => {
    const err = new AppError("Item not found", 404);
    assert.strictEqual(err.message, "Item not found");
    assert.strictEqual(err.statusCode, 404);
    assert.strictEqual(err.name, "AppError");
    assert.ok(err.stack);
  });

  test("defaults status code to 500 when omitted", () => {
    const err = new AppError("Unexpected problem");
    assert.strictEqual(err.statusCode, 500);
  });

  test("stores optional details array or object", () => {
    const details = [{ field: "email", error: "Required" }];
    const err = new AppError("Validation failed", 400, details);
    assert.deepStrictEqual(err.details, details);
  });

  test("static helpers create correct status codes", () => {
    assert.strictEqual(AppError.badRequest().statusCode, 400);
    assert.strictEqual(AppError.unauthorized().statusCode, 401);
    assert.strictEqual(AppError.forbidden().statusCode, 403);
    assert.strictEqual(AppError.notFound().statusCode, 404);
    assert.strictEqual(AppError.conflict().statusCode, 409);
    assert.strictEqual(AppError.internal().statusCode, 500);
  });
});

describe("asyncHandler Utility", () => {
  test("calls next(err) when an async function rejects", async () => {
    let capturedError = null;
    const next = (err) => { capturedError = err; };

    const failingRoute = asyncHandler(async () => {
      throw new AppError("Async failure", 400);
    });

    await failingRoute({}, {}, next);
    assert.ok(capturedError instanceof AppError);
    assert.strictEqual(capturedError.message, "Async failure");
    assert.strictEqual(capturedError.statusCode, 400);
  });

  test("executes successfully when no error is thrown", async () => {
    let nextCalled = false;
    let resJsonCalled = false;

    const fakeRes = {
      json: () => { resJsonCalled = true; }
    };
    const next = () => { nextCalled = true; };

    const successRoute = asyncHandler(async (req, res) => {
      res.json({ ok: true });
    });

    await successRoute({}, fakeRes, next);
    assert.strictEqual(resJsonCalled, true);
    assert.strictEqual(nextCalled, false);
  });
});

describe("formatError Utility", () => {
  test("formats error with banner, message, and status", () => {
    const err = new AppError("Test failure", 404);
    const formatted = formatError(err);

    assert.ok(formatted.includes("ERROR MAP"));
    assert.ok(formatted.includes("Status Code: 404"));
    assert.ok(formatted.includes("Error: Test failure"));
  });
});

describe("errorHandler Middleware", () => {
  test("sends structured JSON response with status code", () => {
    let sentStatus = null;
    let sentJson = null;

    const fakeRes = {
      headersSent: false,
      status: (code) => {
        sentStatus = code;
        return {
          json: (data) => { sentJson = data; }
        };
      }
    };

    const err = AppError.notFound("Resource missing", { id: 123 });
    errorHandler(err, {}, fakeRes, () => {});

    assert.strictEqual(sentStatus, 404);
    assert.strictEqual(sentJson.success, false);
    assert.strictEqual(sentJson.message, "Resource missing");
    assert.strictEqual(sentJson.statusCode, 404);
    assert.deepStrictEqual(sentJson.details, { id: 123 });
  });
});
