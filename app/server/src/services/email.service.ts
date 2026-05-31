import nodemailer from 'nodemailer';
import { env } from '../config/env';

const hasSmtpConfig = Boolean(env.SMTP_HOST);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
    })
  : null;

export const emailService = {
  async sendReminder(to: string, todoTitle: string, reminderAt: Date) {
    const subject = `Todo reminder: ${todoTitle}`;
    const text = `Reminder for todo "${todoTitle}" at ${reminderAt.toISOString()}`;

    if (!transporter) {
      console.log(`[DEV-EMAIL] to=${to} subject=${subject} body=${text}`);
      return;
    }

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      text
    });
  }
};
