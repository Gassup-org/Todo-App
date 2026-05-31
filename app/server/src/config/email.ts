import { env } from './env.js';

export const emailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  user: env.SMTP_USER,
  pass: env.SMTP_PASS,
  from: env.SMTP_FROM,
};

export const reminderConfig = {
  enabled: env.REMINDERS_ENABLED,
  cron: env.REMINDER_CRON,
  maxAttempts: env.REMINDER_MAX_ATTEMPTS,
};
