import type { Prisma, UserStatus } from '@prisma/client';
import type { AdminUserCreateInput, AdminUserUpdateInput } from '../validators/admin-validator.js';
import { prisma } from '../db/prisma-client.js';

export type AdminRepositoryTx = Prisma.TransactionClient;

type AdminDbClient = Prisma.TransactionClient | typeof prisma;

function getClient(tx?: AdminRepositoryTx): AdminDbClient {
  return tx ?? prisma;
}

export function withAdminTransaction<T>(callback: (tx: AdminRepositoryTx) => Promise<T>) {
  return prisma.$transaction((tx) => callback(tx));
}

export function listAdminUsers(input: { cursor?: string; limit: number }, tx?: AdminRepositoryTx) {
  return getClient(tx).user.findMany({
    where: { deletedAt: null },
    take: input.limit + 1,
    ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
  });
}

export function createAdminUser(input: AdminUserCreateInput, tx?: AdminRepositoryTx) {
  return getClient(tx).user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name,
      role: input.role,
      timezone: input.timezone,
      emailVerified: false,
    },
  });
}

export function updateAdminUser(userId: string, input: AdminUserUpdateInput, tx?: AdminRepositoryTx) {
  return getClient(tx).user.update({
    where: { id: userId },
    data: {
      email: input.email?.toLowerCase(),
      name: input.name,
      role: input.role,
      status: input.status,
      timezone: input.timezone,
    },
  });
}

export function findAdminUserById(userId: string, tx?: AdminRepositoryTx) {
  return getClient(tx).user.findFirst({ where: { id: userId, deletedAt: null } });
}

export function countActiveAdmins(tx?: AdminRepositoryTx) {
  return getClient(tx).user.count({ where: { role: 'admin', status: 'active', deletedAt: null } });
}

export async function lockAdminMutationRows(tx: AdminRepositoryTx, targetUserId: string) {
  await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${targetUserId} AND "deletedAt" IS NULL FOR UPDATE`;
  await tx.$queryRaw`SELECT id FROM "User" WHERE role = 'admin' AND status = 'active' AND "deletedAt" IS NULL FOR UPDATE`;
}

export function setUserStatus(userId: string, status: UserStatus, tx?: AdminRepositoryTx) {
  return getClient(tx).user.update({ where: { id: userId }, data: { status } });
}

export function softDeleteUser(userId: string, tx?: AdminRepositoryTx) {
  return getClient(tx).user.update({ where: { id: userId }, data: { status: 'deleted', deletedAt: new Date() } });
}

export function createAdminAuditLog(
  input: {
    actorUserId: string;
    targetUserId?: string;
    action: string;
    oldValues?: unknown;
    newValues?: unknown;
    reason?: string;
  },
  tx?: AdminRepositoryTx,
) {
  return getClient(tx).adminAuditLog.create({
    data: {
      actorUserId: input.actorUserId,
      targetUserId: input.targetUserId,
      action: input.action,
      oldValues: input.oldValues === undefined ? undefined : JSON.parse(JSON.stringify(input.oldValues)),
      newValues: input.newValues === undefined ? undefined : JSON.parse(JSON.stringify(input.newValues)),
      reason: input.reason,
    },
  });
}
