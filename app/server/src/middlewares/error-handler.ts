import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/api-response.js';
import { isAppError } from '../utils/app-error.js';

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  void _next;
  if (isAppError(error)) {
    return sendError(response, error.status, error.code, error.message, error.details);
  }

  if (error instanceof ZodError) {
    return sendError(response, 400, 'VALIDATION_FAILED', 'Validation failed', error.flatten());
  }

  console.error(error);
  return sendError(response, 500, 'INTERNAL', 'Unexpected server error');
}
