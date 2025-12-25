import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error_code: err.error_code,
      message: err.message,
      field: err.field,
    });
  }

  console.error(err);

  return res.status(500).json({
    error_code: 'INTERNAL_ERROR',
    message: 'Unexpected server error',
  });
}
