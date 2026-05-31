import { Role } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { adminController } from '../controllers/admin.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { validateBody } from '../middlewares/validate.middleware';

const roleSchema = z.object({
  role: z.enum(['user', 'admin']).transform((value) => value.toUpperCase() as Role)
});

const statusSchema = z.object({
  status: z.enum(['active', 'blocked'])
});

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN));
router.get('/users', adminController.users);
router.get('/overview', adminController.dashboard);
router.patch('/users/:id/role', validateBody(roleSchema), adminController.updateRole);
router.patch('/users/:id/status', validateBody(statusSchema), adminController.setStatus);

export default router;
