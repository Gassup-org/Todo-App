import type { Request, Response } from 'express';
import { getAdminDashboard, getUserDashboard } from '../services/dashboard-service.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';
import { sendData } from '../utils/api-response.js';

export async function handleUserDashboard(request: Request, response: Response) {
  const user = (request as AuthenticatedRequest).authenticatedUser;
  const dashboard = await getUserDashboard(user.id);

  return sendData(response, dashboard);
}

export async function handleAdminDashboard(_request: Request, response: Response) {
  const dashboard = await getAdminDashboard();

  return sendData(response, dashboard);
}
