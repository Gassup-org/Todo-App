import { AppError } from '../utils/app-error.js';
import { getUtcDayRange } from '../utils/day-boundary-utils.js';
import { createTodo, findTodoById, listTodosForDay, softDeleteTodo, updateTodo } from '../repositories/todo-repository.js';
import type { TodoCreateInput, TodoUpdateInput } from '../validators/todo-validator.js';

export function getTodosForDate(userId: string, timezone: string, date: string) {
  const range = getUtcDayRange(date, timezone);
  return listTodosForDay(userId, range.start, range.end);
}

export function createUserTodo(userId: string, input: TodoCreateInput) {
  return createTodo(userId, input);
}

export async function updateUserTodo(userId: string, todoId: string, input: TodoUpdateInput) {
  const result = await updateTodo(userId, todoId, input);
  if (result.count === 0) {
    throw new AppError(404, 'NOT_FOUND', 'Todo not found');
  }

  const updatedTodo = await findTodoById(userId, todoId);
  if (!updatedTodo) {
    throw new AppError(404, 'NOT_FOUND', 'Todo not found');
  }

  return updatedTodo;
}

export async function deleteUserTodo(userId: string, todoId: string) {
  const result = await softDeleteTodo(userId, todoId);
  if (result.count === 0) {
    throw new AppError(404, 'NOT_FOUND', 'Todo not found');
  }

  return { ok: true };
}
