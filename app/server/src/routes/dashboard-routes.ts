import { Router } from 'express';
import { handleAdminDashboard, handleUserDashboard } from '../controllers/dashboard-controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requireRole } from '../middlewares/require-role.js';
import { asyncHandler } from '../utils/async-handler.js';

export const dashboardRoutes = Router();

dashboardRoutes.get('/dashboard/me', asyncHandler(requireAuth), asyncHandler(handleUserDashboard));
dashboardRoutes.get(
  '/admin/dashboard',
  asyncHandler(requireAuth),
  requireRole(['admin']),
  asyncHandler(handleAdminDashboard),
);
