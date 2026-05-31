import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './api-client';

export type Todo = {
  id: string;
  title: string;
  description?: string | null;
  status: 'active' | 'completed';
  priority: 'low' | 'normal' | 'high';
  dueAt: string;
  reminderAt?: string | null;
};

export type TodoCreate = Omit<Todo, 'id'>;

export function useTodos(date: string) {
  return useQuery({
    queryKey: ['todos', date],
    queryFn: () => apiRequest<Todo[]>(`/todos?date=${encodeURIComponent(date)}`),
  });
}

export function useCreateTodo(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TodoCreate) =>
      apiRequest<Todo>('/todos', { method: 'POST', body: JSON.stringify(input) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos', date] }),
  });
}
