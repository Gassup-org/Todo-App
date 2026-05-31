import nodemailer from 'nodemailer';
import { emailConfig } from '../config/email.js';
import { buildTodoReminderEmail } from '../templates/todo-reminder-email.js';

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  ...(emailConfig.user ? { auth: { user: emailConfig.user, pass: emailConfig.pass } } : {}),
});

export async function sendTodoReminderEmail(input: {
  to: string;
  userName: string;
  todoTitle: string;
  dueAt: Date;
  timezone: string;
}) {
  const message = buildTodoReminderEmail({
    userName: input.userName,
    todoTitle: input.todoTitle,
    dueAt: input.dueAt,
    timezone: input.timezone,
  });

  await transporter.sendMail({
    from: emailConfig.from,
    to: input.to,
    subject: message.subject,
    text: message.text,
  });
}
