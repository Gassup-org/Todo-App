import { apiRequest } from './apiClient';
import type { AdminOverview, AdminUser } from '../types/admin';

interface AdminOverviewResponse {
  overview: AdminOverview;
}

interface AdminUsersResponse {
  users: AdminUser[];
}

export function getAdminOverview() {
  return apiRequest<AdminOverviewResponse>('/admin/overview');
}

export function getAdminUsers() {
  return apiRequest<AdminUsersResponse>('/admin/users');
}

export function updateUserRole(id: string, role: 'user' | 'admin') {
  return apiRequest<AdminUser>(`/admin/users/${id}/role`, {
    method: 'PATCH',
    body: { role }
  });
}

export function toggleUserStatus(id: string, status: 'active' | 'blocked') {
  return apiRequest<AdminUser>(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: { status }
  });
}