import type { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';

export function requestId(request: Request, response: Response, next: NextFunction) {
  const existingRequestId = request.header('x-request-id');
  const id = existingRequestId?.trim() || nanoid();

  response.locals.requestId = id;
  response.setHeader('x-request-id', id);
  next();
}
