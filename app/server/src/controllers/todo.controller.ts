import { Todo } from '@prisma/client';
import { Request, Response } from 'express';
import { todoService } from '../services/todo.service';
import { created, fail, ok } from '../utils/http';

type TodoLike = Todo;

const formatDateOnly = (value: Date) => value.toISOString().slice(0, 10);

const toClientTodo = (todo: TodoLike) => ({
  id: todo.id,
  userId: todo.userId,
  title: todo.title,
  description: todo.description ?? undefined,
  scheduledDate: formatDateOnly(todo.scheduledDate),
  dueTime: todo.dueTime ?? undefined,
  priority: todo.priority.toLowerCase() as 'low' | 'medium' | 'high',
  status: todo.status.toLowerCase() as 'pending' | 'completed' | 'archived',
  reminderEmailEnabled: todo.reminderEmailEnabled,
  reminderAt: todo.reminderAt?.toISOString(),
  reminderSentAt: todo.reminderSentAt?.toISOString(),
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString()
});

export const todoController = {
  async create(req: Request, res: Response) {
    if (!req.user) {
      return fail(res, 401, 'Unauthorized');
    }

    const todo = await todoService.create(req.user.id, req.body);
    return created(res, { item: toClientTodo(todo) });
  },

  async listByDate(req: Request, res: Response) {
    if (!req.user) {
      return fail(res, 401, 'Unauthorized');
    }

    const date = String(req.query.date || '');
    if (!date) {
      return fail(res, 400, 'date query is required (YYYY-MM-DD)');
    }

    const todos = await todoService.listByDate(req.user.id, date);
    return ok(res, { items: todos.map(toClientTodo) });
  },

  async update(req: Request, res: Response) {
    if (!req.user) {
      return fail(res, 401, 'Unauthorized');
    }

    try {
      const todo = await todoService.update(req.user.id, req.params.id, req.body);
      return ok(res, { item: toClientTodo(todo) }, 'Updated');
    } catch {
      return fail(res, 404, 'Todo not found');
    }
  },

  async toggleCompleted(req: Request, res: Response) {
    if (!req.user) {
      return fail(res, 401, 'Unauthorized');
    }

    try {
      const todo = await todoService.toggleCompleted(req.user.id, req.params.id);
      return ok(res, { item: toClientTodo(todo) }, 'Toggled');
    } catch {
      return fail(res, 404, 'Todo not found');
    }
  },

  async remove(req: Request, res: Response) {
    if (!req.user) {
      return fail(res, 401, 'Unauthorized');
    }

    try {
      await todoService.remove(req.user.id, req.params.id);
      return ok(res, { deleted: true }, 'Deleted');
    } catch {
      return fail(res, 404, 'Todo not found');
    }
  }
};
