import { TodoPriority, TodoStatus } from '@prisma/client';
import { prisma } from '../config/db';

interface CreateTodoInput {
  userId: string;
  title: string;
  description?: string;
  scheduledDate: Date;
  dueTime?: string;
  priority?: TodoPriority;
  reminderEmailEnabled?: boolean;
  reminderAt?: Date;
}

interface UpdateTodoInput {
  title?: string;
  description?: string;
  scheduledDate?: Date;
  dueTime?: string;
  priority?: TodoPriority;
  status?: TodoStatus;
  reminderEmailEnabled?: boolean;
  reminderAt?: Date | null;
}

export const todoRepository = {
  create(input: CreateTodoInput) {
    return prisma.todo.create({ data: input });
  },

  findById(id: string) {
    return prisma.todo.findUnique({ where: { id } });
  },

  findByUserAndDate(userId: string, start: Date, end: Date) {
    return prisma.todo.findMany({
      where: { userId, scheduledDate: { gte: start, lt: end } },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }]
    });
  },

  updateById(id: string, data: UpdateTodoInput) {
    return prisma.todo.update({ where: { id }, data });
  },

  deleteById(id: string) {
    return prisma.todo.delete({ where: { id } });
  },

  countByUser(userId: string) {
    return prisma.todo.count({ where: { userId } });
  },

  countAll() {
    return prisma.todo.count();
  },

  completionOverview() {
    return prisma.todo.groupBy({ by: ['status'], _count: { _all: true } });
  },

  upcomingByUser(userId: string, from: Date, to: Date) {
    return prisma.todo.findMany({
      where: {
        userId,
        reminderEmailEnabled: true,
        reminderAt: { gte: from, lte: to },
        reminderSentAt: null
      },
      orderBy: { reminderAt: 'asc' }
    });
  },

  dueReminderTodos(now: Date) {
    return prisma.todo.findMany({
      where: {
        reminderEmailEnabled: true,
        reminderAt: { lte: now },
        reminderSentAt: null,
        status: { not: 'ARCHIVED' }
      },
      include: { user: true }
    });
  },

  markReminderSent(todoId: string, sentAt: Date) {
    return prisma.todo.update({ where: { id: todoId }, data: { reminderSentAt: sentAt } });
  }
};
