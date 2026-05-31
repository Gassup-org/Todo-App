import { Router } from 'express';
import {
  handleCreateAdminUser,
  handleDeactivateAdminUser,
  handleDeleteAdminUser,
  handleListAdminUsers,
  handleReactivateAdminUser,
  handleUpdateAdminUser,
} from '../controllers/admin-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requireRole } from '../middlewares/require-role.js';
import { asyncHandler } from '../utils/async-handler.js';

export const adminRoutes = Router();

adminRoutes.use(asyncHandler(requireAuth), requireRole(['admin']));
adminRoutes.get('/admin/users', asyncHandler(handleListAdminUsers));
adminRoutes.post('/admin/users', asyncHandler(handleCreateAdminUser));
adminRoutes.patch('/admin/users/:id', asyncHandler(handleUpdateAdminUser));
adminRoutes.post('/admin/users/:id/deactivate', asyncHandler(handleDeactivateAdminUser));
adminRoutes.post('/admin/users/:id/reactivate', asyncHandler(handleReactivateAdminUser));
adminRoutes.delete('/admin/users/:id', asyncHandler(handleDeleteAdminUser));
