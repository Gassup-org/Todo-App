import { AppError } from '../utils/app-error.js';
import {
  countActiveAdmins,
  createAdminAuditLog,
  createAdminUser,
  findAdminUserById,
  listAdminUsers,
  lockAdminMutationRows,
  setUserStatus,
  softDeleteUser,
  updateAdminUser,
  withAdminTransaction,
} from '../repositories/admin-repository.js';
import type { AdminRepositoryTx } from '../repositories/admin-repository.js';
import type { AdminUserCreateInput, AdminUserUpdateInput } from '../validators/admin-validator.js';

function toPage<T extends { id: string }>(items: T[], limit: number) {
  const hasNextPage = items.length > limit;
  const visibleItems = hasNextPage ? items.slice(0, limit) : items;
  const nextCursor = hasNextPage ? visibleItems.at(-1)?.id : null;

  return { items: visibleItems, pageInfo: { cursor: null, nextCursor, hasNextPage } };
}

function getUpdateAction(input: AdminUserUpdateInput) {
  if (input.status === 'inactive') return 'deactivate';
  if (input.role === 'user') return 'demote';
  return 'update';
}

function isDestructiveAction(action: string) {
  return ['deactivate', 'delete', 'demote'].includes(action);
}

async function assertCanMutateAdmin(actorUserId: string, targetUserId: string, action: string, tx: AdminRepositoryTx) {
  if (isDestructiveAction(action)) {
    await lockAdminMutationRows(tx, targetUserId);
  }

  const target = await findAdminUserById(targetUserId, tx);
  if (!target) throw new AppError(404, 'NOT_FOUND', 'User not found');

  if (target.id === actorUserId && ['deactivate', 'delete', 'demote'].includes(action)) {
    throw new AppError(409, 'CONFLICT', 'Admins cannot lock themselves out');
  }

  if (target.role === 'admin' && target.status === 'active') {
    const activeAdminCount = await countActiveAdmins(tx);
    if (activeAdminCount <= 1 && isDestructiveAction(action)) {
      throw new AppError(409, 'CONFLICT', 'Cannot mutate the last active admin');
    }
  }

  return target;
}

export async function listUsersForAdmin(cursor: string | undefined, limit: number) {
  return toPage(await listAdminUsers({ cursor, limit }), limit);
}

export async function createUserAsAdmin(actorUserId: string, input: AdminUserCreateInput) {
  return withAdminTransaction(async (tx) => {
    const user = await createAdminUser(input, tx);
    await createAdminAuditLog({ actorUserId, targetUserId: user.id, action: 'create-user', newValues: user, reason: input.reason }, tx);

    return user;
  });
}

export async function updateUserAsAdmin(actorUserId: string, targetUserId: string, input: AdminUserUpdateInput) {
  return withAdminTransaction(async (tx) => {
    const current = await assertCanMutateAdmin(actorUserId, targetUserId, getUpdateAction(input), tx);
    const user = await updateAdminUser(targetUserId, input, tx);
    await createAdminAuditLog({ actorUserId, targetUserId, action: 'update-user', oldValues: current, newValues: user, reason: input.reason }, tx);

    return user;
  });
}

export async function deactivateUserAsAdmin(actorUserId: string, targetUserId: string, reason: string) {
  return withAdminTransaction(async (tx) => {
    const current = await assertCanMutateAdmin(actorUserId, targetUserId, 'deactivate', tx);
    const user = await setUserStatus(targetUserId, 'inactive', tx);
    await createAdminAuditLog({ actorUserId, targetUserId, action: 'deactivate-user', oldValues: current, newValues: user, reason }, tx);

    return user;
  });
}

export async function reactivateUserAsAdmin(actorUserId: string, targetUserId: string, reason: string) {
  return withAdminTransaction(async (tx) => {
    const current = await findAdminUserById(targetUserId, tx);
    if (!current) throw new AppError(404, 'NOT_FOUND', 'User not found');

    const user = await setUserStatus(targetUserId, 'active', tx);
    await createAdminAuditLog({ actorUserId, targetUserId, action: 'reactivate-user', oldValues: current, newValues: user, reason }, tx);

    return user;
  });
}

export async function deleteUserAsAdmin(actorUserId: string, targetUserId: string, reason: string) {
  return withAdminTransaction(async (tx) => {
    const current = await assertCanMutateAdmin(actorUserId, targetUserId, 'delete', tx);
    const user = await softDeleteUser(targetUserId, tx);
    await createAdminAuditLog({ actorUserId, targetUserId, action: 'delete-user', oldValues: current, newValues: user, reason }, tx);

    return { ok: true };
  });
}
