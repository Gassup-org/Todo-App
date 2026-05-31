import { prisma } from '../db/prisma-client.js';

export function createSessionRecord(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}) {
  return prisma.session.create({ data });
}

export function findActiveSessionByHash(tokenHash: string, now = new Date()) {
  return prisma.session.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: now },
      user: { deletedAt: null, status: 'active' },
    },
    include: { user: true },
  });
}

export function revokeSessionByHash(tokenHash: string) {
  return prisma.session.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
