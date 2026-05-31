import type { Response } from 'express';

export type ApiErrorCode =
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'VALIDATION_FAILED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL';

type ApiError = {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
  requestId: string;
};

export function sendData<T>(response: Response, data: T, status = 200) {
  return response.status(status).json({ data, error: null });
}

export function sendError(
  response: Response,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: unknown,
) {
  const requestId = response.locals.requestId ?? 'unknown';
  const error: ApiError = { code, message, details, requestId };

  return response.status(status).json({ data: null, error });
}
