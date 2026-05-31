import cron from 'node-cron';
import { reminderConfig } from '../config/email.js';
import { processDueReminders } from './reminder-service.js';

let workerStarted = false;

export function startReminderWorker() {
  if (!reminderConfig.enabled || workerStarted) {
    return null;
  }

  workerStarted = true;

  const task = cron.schedule(reminderConfig.cron, async () => {
    try {
      await processDueReminders();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown error';
      console.error(`Reminder worker failed: ${message}`);
    }
  });

  task.start();
  return task;
}
