import { prisma } from '../db/prisma-client.js';

export async function getUserDashboardStats(userId: string, now = new Date()) {
  const [openTodos, completedTodos, overdueTodos, upcomingReminders] = await Promise.all([
    prisma.todo.count({ where: { userId, status: 'active', deletedAt: null } }),
    prisma.todo.count({ where: { userId, status: 'completed', deletedAt: null } }),
    prisma.todo.count({ where: { userId, status: 'active', deletedAt: null, dueAt: { lt: now } } }),
    prisma.todo.count({ where: { userId, status: 'active', deletedAt: null, reminderAt: { gte: now } } }),
  ]);

  return { openTodos, completedTodos, overdueTodos, upcomingReminders };
}

export async function getAdminDashboardStats() {
  const [userCount, activeTodoCount, completedTodoCount, failedReminderCount] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null, status: 'active' } }),
    prisma.todo.count({ where: { deletedAt: null, status: 'active' } }),
    prisma.todo.count({ where: { deletedAt: null, status: 'completed' } }),
    prisma.reminderEvent.count({ where: { status: 'failed' } }),
  ]);
  const totalTodos = activeTodoCount + completedTodoCount;
  const completionRate = totalTodos === 0 ? 0 : completedTodoCount / totalTodos;

  return { userCount, activeTodoCount, completionRate, failedReminderCount };
}
