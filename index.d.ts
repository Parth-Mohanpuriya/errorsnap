import type { Request, Response, NextFunction } from "express";

/**
 * Custom application error class with HTTP status code and optional details.
 */
export class AppError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode?: number, details?: any);

  static badRequest(message?: string, details?: any): AppError;
  static unauthorized(message?: string, details?: any): AppError;
  static forbidden(message?: string, details?: any): AppError;
  static notFound(message?: string, details?: any): AppError;
  static conflict(message?: string, details?: any): AppError;
  static internal(message?: string, details?: any): AppError;
}

/**
 * Express error-handling middleware that formats and returns standard JSON error responses.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void;

/**
 * Formats an error into a readable ASCII terminal banner for console logging.
 */
export function formatError(error: Error | AppError): string;

/**
 * Wraps an asynchronous Express route handler to catch unhandled promise rejections.
 */
export function asyncHandler<T = any>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
): (req: Request, res: Response, next: NextFunction) => void;
