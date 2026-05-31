import { apiRequest } from './apiClient';
import type { TodoItem, TodoPriority, TodoStats } from '../types/todo';

interface TodosResponse {
  items: TodoItem[];
}

interface TodoResponse {
  item: TodoItem;
}

interface StatsResponse {
  stats: TodoStats;
}

export interface SaveTodoPayload {
  title: string;
  description?: string;
  scheduledDate: string;
  dueTime?: string;
  priority: TodoPriority;
  reminderEmailEnabled: boolean;
  reminderAt?: string;
  status?: TodoItem['status'];
}

export function getTodosByDate(date: string) {
  return apiRequest<TodosResponse>(`/todos?date=${encodeURIComponent(date)}`);
}

export function createTodo(payload: SaveTodoPayload) {
  const { status: _status, ...createPayload } = payload;
  return apiRequest<TodoResponse>('/todos', { method: 'POST', body: createPayload });
}

export function updateTodo(id: string, payload: Partial<SaveTodoPayload>) {
  return apiRequest<TodoResponse>(`/todos/${id}`, { method: 'PUT', body: payload });
}

export function deleteTodo(id: string) {
  return apiRequest<{ deleted: boolean }>(`/todos/${id}`, { method: 'DELETE' });
}

export function toggleTodoCompleted(id: string) {
  return apiRequest<TodoResponse>(`/todos/${id}/toggle`, { method: 'PATCH' });
}

export function getTodoStats() {
  return apiRequest<StatsResponse>('/dashboard/me');
}
