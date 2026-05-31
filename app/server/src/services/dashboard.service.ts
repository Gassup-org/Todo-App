import { TodoStatus } from '@prisma/client';
import { prisma } from '../config/db';

export const dashboardService = {
  async getUserDashboard(userId: string) {
    const now = new Date();
    const [total, completed, pending, priorityGroups, upcomingReminders] = await Promise.all([
      prisma.todo.count({ where: { userId } }),
      prisma.todo.count({ where: { userId, status: TodoStatus.COMPLETED } }),
      prisma.todo.count({ where: { userId, status: TodoStatus.PENDING } }),
      prisma.todo.groupBy({ by: ['priority'], where: { userId }, _count: { _all: true } }),
      prisma.todo.count({
        where: {
          userId,
          reminderEmailEnabled: true,
          reminderAt: { gte: now },
          reminderSentAt: null,
          status: { not: TodoStatus.ARCHIVED }
        }
      })
    ]);

    const byPriority = {
      low: 0,
      medium: 0,
      high: 0
    };

    for (const group of priorityGroups) {
      byPriority[group.priority.toLowerCase() as keyof typeof byPriority] = group._count._all;
    }

    return {
      total,
      completed,
      pending,
      completionRate: total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2)),
      byPriority,
      upcomingReminders
    };
  }
};
