import { prisma } from '../db/prisma-client.js';

type UserRole = 'user' | 'admin';

export type GoogleUserInput = {
  googleSub: string;
  email: string;
  emailVerified: boolean;
  name: string;
  avatarUrl?: string;
};

export function findUserByGoogleSub(googleSub: string) {
  return prisma.user.findUnique({ where: { googleSub } });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function createGoogleUser(input: GoogleUserInput) {
  return prisma.user.create({
    data: {
      googleSub: input.googleSub,
      email: input.email,
      emailVerified: input.emailVerified,
      name: input.name,
      avatarUrl: input.avatarUrl,
    },
  });
}

export function updateGoogleUser(userId: string, input: GoogleUserInput) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      googleSub: input.googleSub,
      email: input.email,
      emailVerified: input.emailVerified,
      name: input.name,
      avatarUrl: input.avatarUrl,
    },
  });
}

export function createTestUser(input: { email: string; name: string; role: UserRole }) {
  return prisma.user.upsert({
    where: { email: input.email },
    update: { name: input.name, role: input.role, status: 'active' },
    create: { email: input.email, name: input.name, role: input.role, emailVerified: true },
  });
}
