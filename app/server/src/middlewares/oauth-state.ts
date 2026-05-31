import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/app-error.js';

const oauthStateCookie = 'todo_app_oauth_state';

function stateMatches(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export function setOAuthState(_request: Request, response: Response, next: NextFunction) {
  const state = randomBytes(24).toString('base64url');

  response.cookie(oauthStateCookie, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000,
    path: '/api/v1/auth/google',
  });
  response.locals.oauthState = state;

  next();
}

export function verifyOAuthState(request: Request, response: Response, next: NextFunction) {
  const expectedState = request.cookies?.[oauthStateCookie] as string | undefined;
  const actualState = typeof request.query.state === 'string' ? request.query.state : undefined;

  response.clearCookie(oauthStateCookie, { path: '/api/v1/auth/google' });

  if (!expectedState || !actualState || !stateMatches(expectedState, actualState)) {
    return next(new AppError(400, 'VALIDATION_FAILED', 'Invalid OAuth state'));
  }

  return next();
}
