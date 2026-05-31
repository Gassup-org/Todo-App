import { prisma } from '../config/db';
import { emailService } from './email.service';
import { todoRepository } from '../repositories/todo.repository';

export const reminderService = {
  async processDueReminders() {
    const now = new Date();
    const dueTodos = await todoRepository.dueReminderTodos(now);

    for (const todo of dueTodos) {
      const existingLog = await prisma.reminderLog.findUnique({ where: { todoId: todo.id } });
      if (existingLog) {
        continue;
      }

      if (!todo.reminderAt) {
        continue;
      }

      await emailService.sendReminder(todo.user.email, todo.title, todo.reminderAt);
      await prisma.$transaction([
        prisma.reminderLog.create({ data: { userId: todo.userId, todoId: todo.id } }),
        prisma.todo.update({ where: { id: todo.id }, data: { reminderSentAt: now } })
      ]);
    }

    return { processed: dueTodos.length };
  }
};
