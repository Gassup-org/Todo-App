import { getAdminDashboardStats, getUserDashboardStats } from '../repositories/dashboard-repository.js';

export function getUserDashboard(userId: string) {
  return getUserDashboardStats(userId);
}

export function getAdminDashboard() {
  return getAdminDashboardStats();
}
