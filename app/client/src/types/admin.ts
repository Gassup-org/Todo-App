export interface AdminOverview {
  totalUsers: number;
  totalTodos: number;
  activeUsers: number;
  completionRate: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  todoCount: number;
}