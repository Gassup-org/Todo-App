import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { getUserFromSessionToken } from '../services/session-service.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { sendError } from '../utils/api-response.js';

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const sessionToken = request.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined;
  const user = await getUserFromSessionToken(sessionToken);

  if (!user) {
    return sendError(response, 401, 'AUTH_REQUIRED', 'Authentication required');
  }

  (request as AuthenticatedRequest).authenticatedUser = user;
  return next();
}
