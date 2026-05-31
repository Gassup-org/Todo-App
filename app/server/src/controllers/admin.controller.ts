import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { ok } from '../utils/http';

const toAdminUser = (user: { id: string; email: string; name?: string | null; role: Role; isActive: boolean }) => ({
  id: user.id,
  email: user.email,
  name: user.name ?? user.email,
  role: user.role.toLowerCase(),
  status: user.isActive ? 'active' : 'blocked',
  todoCount: 0
});

export const adminController = {
  async users(_req: Request, res: Response) {
    const users = await adminService.listUsers();
    return ok(res, { users });
  },

  async dashboard(_req: Request, res: Response) {
    const overview = await adminService.getDashboard();
    return ok(res, { overview });
  },

  async updateRole(req: Request, res: Response) {
    const role = String(req.body.role).toUpperCase() as Role;
    const user = await adminService.updateRole(req.params.id, role);
    return ok(res, toAdminUser(user), 'Role updated');
  },

  async setStatus(req: Request, res: Response) {
    const status = String(req.body.status);
    const user = await adminService.setUserActive(req.params.id, status === 'active');
    return ok(res, toAdminUser(user), 'User status updated');
  }
};
