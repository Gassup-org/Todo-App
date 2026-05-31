export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoStatus = 'pending' | 'completed' | 'archived';

export interface TodoItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  scheduledDate: string;
  dueTime?: string;
  priority: TodoPriority;
  status: TodoStatus;
  reminderEmailEnabled: boolean;
  reminderAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  byPriority: Record<TodoPriority, number>;
  upcomingReminders: number;
}