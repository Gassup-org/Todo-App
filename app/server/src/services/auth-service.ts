import { createGoogleUser, createTestUser, findUserByEmail, findUserByGoogleSub, updateGoogleUser } from '../repositories/user-repository.js';
import type { AuthenticatedUser } from '../types/authenticated-request.js';
import { AppError } from '../utils/app-error.js';
import { isUniqueConstraintError } from '../utils/prisma-errors.js';

export type GoogleProfileInput = {
  googleSub: string;
  email: string;
  emailVerified: boolean;
  name: string;
  avatarUrl?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
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

export async function findOrCreateGoogleUser(input: GoogleProfileInput) {
  if (!input.emailVerified) {
    throw new AppError(400, 'VALIDATION_FAILED', 'Google email must be verified');
  }

  const normalizedInput = { ...input, email: normalizeEmail(input.email) };
  const existingByGoogleSub = await findUserByGoogleSub(normalizedInput.googleSub);

  if (existingByGoogleSub) {
    return toAuthenticatedUser(await updateGoogleUser(existingByGoogleSub.id, normalizedInput));
  }

  const existingByEmail = await findUserByEmail(normalizedInput.email);
  if (existingByEmail) {
    if (existingByEmail.googleSub) {
      throw new AppError(409, 'CONFLICT', 'Email already linked to another Google account');
    }

    return toAuthenticatedUser(await updateGoogleUser(existingByEmail.id, normalizedInput));
  }

  try {
    return toAuthenticatedUser(await createGoogleUser(normalizedInput));
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new AppError(409, 'CONFLICT', 'Google account could not be linked safely');
    }

    throw error;
  }
}

export async function createTestAuthenticatedUser(role: 'user' | 'admin') {
  const user = await createTestUser({
    email: `${role}@example.test`,
    name: `Test ${role}`,
    role,
  });

  return toAuthenticatedUser(user);
}
