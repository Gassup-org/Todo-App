import { claimReminderEvent, markReminderFailed, markReminderSent } from '../repositories/reminder-event-repository.js';
import { listDueTodosForReminder } from '../repositories/todo-repository.js';
import { reminderConfig } from '../config/email.js';
import { sendTodoReminderEmail } from './email-service.js';

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown reminder send error';
}

export async function processDueReminders(now = new Date(), batchSize = 100) {
  const dueTodos = await listDueTodosForReminder(now, batchSize);
  let sentCount = 0;
  let failedCount = 0;

  for (const todo of dueTodos) {
    if (!todo.reminderAt) continue;
    if (todo.user.deletedAt || todo.user.status !== 'active') continue;

    const claim = await claimReminderEvent({
      todoId: todo.id,
      userId: todo.userId,
      reminderAt: todo.reminderAt,
      maxAttempts: reminderConfig.maxAttempts,
    });

    if (!claim) continue;

    try {
      await sendTodoReminderEmail({
        to: todo.user.email,
        userName: todo.user.name,
        todoTitle: todo.title,
        dueAt: todo.dueAt,
        timezone: todo.user.timezone,
      });
      await markReminderSent(claim.id);
      sentCount += 1;
    } catch (error) {
      await markReminderFailed(claim.id, toErrorMessage(error));
      failedCount += 1;
    }
  }

  return {
    scanned: dueTodos.length,
    sent: sentCount,
    failed: failedCount,
  };
}
