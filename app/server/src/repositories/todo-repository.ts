import type { TodoCreateInput, TodoUpdateInput } from '../validators/todo-validator.js';
import { prisma } from '../db/prisma-client.js';

export function listTodosForDay(userId: string, start: Date, end: Date) {
  return prisma.todo.findMany({
    where: {
      userId,
      deletedAt: null,
      dueAt: { gte: start, lte: end },
    },
    orderBy: [{ dueAt: 'asc' }, { createdAt: 'asc' }],
  });
}

export function createTodo(userId: string, input: TodoCreateInput) {
  return prisma.todo.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueAt: new Date(input.dueAt),
      reminderAt: input.reminderAt ? new Date(input.reminderAt) : null,
    },
  });
}

export function updateTodo(userId: string, todoId: string, input: TodoUpdateInput) {
  return prisma.todo.updateMany({
    where: { id: todoId, userId, deletedAt: null },
    data: {
      ...input,
      dueAt: input.dueAt ? new Date(input.dueAt) : undefined,
      reminderAt: input.reminderAt ? new Date(input.reminderAt) : input.reminderAt,
    },
  });
}

export function findTodoById(userId: string, todoId: string) {
  return prisma.todo.findFirst({ where: { id: todoId, userId, deletedAt: null } });
}

export function listDueTodosForReminder(now: Date, limit = 100) {
  return prisma.todo.findMany({
    where: {
      deletedAt: null,
      status: 'active',
      reminderAt: { lte: now, not: null },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          timezone: true,
          status: true,
          deletedAt: true,
        },
      },
    },
    orderBy: [{ reminderAt: 'asc' }, { createdAt: 'asc' }],
    take: limit,
  });
}

export function softDeleteTodo(userId: string, todoId: string) {
  return prisma.todo.updateMany({
    where: { id: todoId, userId, deletedAt: null },
    data: { deletedAt: new Date() },
  });
}
