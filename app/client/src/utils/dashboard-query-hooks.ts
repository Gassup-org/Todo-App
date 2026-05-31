import { useQuery } from '@tanstack/react-query';
import { apiRequest } from './api-client';

type UserDashboard = {
  openTodos: number;
  completedTodos: number;
  overdueTodos: number;
  upcomingReminders: number;
};

type AdminDashboard = {
  userCount: number;
  activeTodoCount: number;
  completionRate: number;
  failedReminderCount: number;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'deleted';
};

export function useUserDashboard() {
  return useQuery({ queryKey: ['dashboard', 'me'], queryFn: () => apiRequest<UserDashboard>('/dashboard/me') });
}

export function useAdminDashboard() {
  return useQuery({ queryKey: ['admin', 'dashboard'], queryFn: () => apiRequest<AdminDashboard>('/admin/dashboard') });
}

type PageInfo = {
  cursor: string | null;
  nextCursor: string | null;
  hasNextPage: boolean;
};

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => apiRequest<{ items: AdminUser[]; pageInfo: PageInfo }>('/admin/users'),
  });
}
