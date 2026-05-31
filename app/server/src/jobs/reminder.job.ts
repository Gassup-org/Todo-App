import cron from 'node-cron';
import { env } from '../config/env';
import { reminderService } from '../services/reminder.service';

export const startReminderJob = () => {
  if (env.NODE_ENV === 'test') {
    return;
  }

  cron.schedule(env.REMINDER_CRON, async () => {
    try {
      await reminderService.processDueReminders();
    } catch (error) {
      console.error('Reminder job failed', error);
    }
  });
};
