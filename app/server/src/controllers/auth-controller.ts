import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { createTestAuthenticatedUser } from '../services/auth-service.js';
import { clearSessionCookie, createSession, revokeSessionToken, setSessionCookie } from '../services/session-service.js';
import type { AuthenticatedRequest, AuthenticatedUser } from '../types/authenticated-request.js';
import { sendData, sendError } from '../utils/api-response.js';

async function issueSession(response: Response, request: Request, user: AuthenticatedUser) {
  const session = await createSession({
    userId: user.id,
    userAgent: request.header('user-agent'),
    ipAddress: request.ip,
  });

  setSessionCookie(response, session.token, session.expiresAt);
}

export async function handleGoogleCallback(request: Request, response: Response) {
  const user = request.user as AuthenticatedUser | undefined;

  if (!user) {
    return sendError(response, 401, 'AUTH_REQUIRED', 'Google authentication failed');
  }

  await issueSession(response, request, user);
  return response.redirect(env.CLIENT_ORIGIN);
}

export async function handleLogout(request: Request, response: Response) {
  const token = request.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined;

  await revokeSessionToken(token);
  clearSessionCookie(response);

  return sendData(response, { ok: true });
}

export function handleCurrentUser(request: Request, response: Response) {
  return sendData(response, (request as AuthenticatedRequest).authenticatedUser);
}

export async function handleTestLogin(request: Request, response: Response) {
  if (!env.TEST_AUTH_ENABLED) {
    return sendError(response, 404, 'NOT_FOUND', 'Route not found');
  }

  const requestedRole = request.body?.role === 'admin' ? 'admin' : 'user';
  const user = await createTestAuthenticatedUser(requestedRole);

  await issueSession(response, request, user);
  return sendData(response, user);
}
