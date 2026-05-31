import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../repositories/admin-repository.js', () => ({
  withAdminTransaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback({})),
  listAdminUsers: vi.fn(),
  createAdminUser: vi.fn(),
  updateAdminUser: vi.fn(),
  findAdminUserById: vi.fn(),
  countActiveAdmins: vi.fn(),
  lockAdminMutationRows: vi.fn(),
  setUserStatus: vi.fn(),
  softDeleteUser: vi.fn(),
  createAdminAuditLog: vi.fn(),
}));

import * as adminRepository from '../repositories/admin-repository.js';
import { deactivateUserAsAdmin, updateUserAsAdmin } from './admin-service.js';

describe('admin-service guardrails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks PATCH status=inactive when target is the last active admin', async () => {
    vi.mocked(adminRepository.findAdminUserById).mockResolvedValue({
      id: 'admin-target',
      email: 'target@example.com',
      name: 'Target',
      role: 'admin',
      status: 'active',
      timezone: 'Asia/Ho_Chi_Minh',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      googleSub: null,
      emailVerified: true,
      avatarUrl: null,
    });
    vi.mocked(adminRepository.countActiveAdmins).mockResolvedValue(1);

    await expect(
      updateUserAsAdmin('admin-actor', 'admin-target', { status: 'inactive', reason: 'maintenance' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });

    expect(adminRepository.lockAdminMutationRows).toHaveBeenCalledOnce();
    expect(adminRepository.updateAdminUser).not.toHaveBeenCalled();
  });

  it('blocks self deactivation lockout', async () => {
    vi.mocked(adminRepository.findAdminUserById).mockResolvedValue({
      id: 'same-admin',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
      status: 'active',
      timezone: 'Asia/Ho_Chi_Minh',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      googleSub: null,
      emailVerified: true,
      avatarUrl: null,
    });

    await expect(deactivateUserAsAdmin('same-admin', 'same-admin', 'self-block')).rejects.toMatchObject({
      code: 'CONFLICT',
    });

    expect(adminRepository.setUserStatus).not.toHaveBeenCalled();
  });

  it('blocks self demotion lockout', async () => {
    vi.mocked(adminRepository.findAdminUserById).mockResolvedValue({
      id: 'same-admin',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'admin',
      status: 'active',
      timezone: 'Asia/Ho_Chi_Minh',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      googleSub: null,
      emailVerified: true,
      avatarUrl: null,
    });
    vi.mocked(adminRepository.countActiveAdmins).mockResolvedValue(2);

    await expect(
      updateUserAsAdmin('same-admin', 'same-admin', { role: 'user', status: 'inactive', reason: 'self-demote' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });

    expect(adminRepository.updateAdminUser).not.toHaveBeenCalled();
  });

  it('allows demotion when another active admin exists', async () => {
    const before = {
      id: 'admin-target',
      email: 'target@example.com',
      name: 'Target',
      role: 'admin' as const,
      status: 'active' as const,
      timezone: 'Asia/Ho_Chi_Minh',
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      googleSub: null,
      emailVerified: true,
      avatarUrl: null,
    };
    const after = { ...before, role: 'user' as const };

    vi.mocked(adminRepository.findAdminUserById).mockResolvedValue(before);
    vi.mocked(adminRepository.countActiveAdmins).mockResolvedValue(2);
    vi.mocked(adminRepository.updateAdminUser).mockResolvedValue(after);

    const result = await updateUserAsAdmin('admin-actor', 'admin-target', { role: 'user', reason: 'handover' });

    expect(adminRepository.updateAdminUser).toHaveBeenCalledOnce();
    expect(adminRepository.createAdminAuditLog).toHaveBeenCalledOnce();
    expect(result.role).toBe('user');
  });
});
