import { createHash, randomBytes } from 'node:crypto';
import type { Response } from 'express';
import { env } from '../config/env.js';
import { createSessionRecord, findActiveSessionByHash, revokeSessionByHash } from '../repositories/session-repository.js';
import type { AuthenticatedUser } from '../types/authenticated-request.js';

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function toAuthenticatedUser(user: {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  timezone: string;
}): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    timezone: user.timezone,
  };
}

export async function createSession(input: { userId: string; userAgent?: string; ipAddress?: string }) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await createSessionRecord({
    userId: input.userId,
    tokenHash: hashSessionToken(token),
    expiresAt,
    userAgent: input.userAgent,
    ipAddress: input.ipAddress,
  });

  return { token, expiresAt };
}

export async function getUserFromSessionToken(token?: string): Promise<AuthenticatedUser | null> {
  if (!token) return null;

  const session = await findActiveSessionByHash(hashSessionToken(token));
  if (!session) return null;

  return toAuthenticatedUser(session.user);
}

export async function revokeSessionToken(token?: string) {
  if (!token) return;
  await revokeSessionByHash(hashSessionToken(token));
}

export function setSessionCookie(response: Response, token: string, expiresAt: Date) {
  response.cookie(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export function clearSessionCookie(response: Response) {
  response.clearCookie(env.SESSION_COOKIE_NAME, { path: '/' });
}
