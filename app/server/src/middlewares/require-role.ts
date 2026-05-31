import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { sendError } from '../utils/api-response.js';

export function requireRole(allowedRoles: Array<'user' | 'admin'>) {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = (request as AuthenticatedRequest).authenticatedUser;

    if (!user || !allowedRoles.includes(user.role)) {
      return sendError(response, 403, 'FORBIDDEN', 'Insufficient permissions');
    }

    return next();
  };
}
