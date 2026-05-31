import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../repositories/todo-repository.js', () => ({
  listDueTodosForReminder: vi.fn(),
}));

vi.mock('../repositories/reminder-event-repository.js', () => ({
  claimReminderEvent: vi.fn(),
  markReminderSent: vi.fn(),
  markReminderFailed: vi.fn(),
}));

vi.mock('./email-service.js', () => ({
  sendTodoReminderEmail: vi.fn(),
}));

vi.mock('../config/email.js', () => ({
  reminderConfig: {
    maxAttempts: 3,
  },
}));

import * as todoRepository from '../repositories/todo-repository.js';
import * as reminderEventRepository from '../repositories/reminder-event-repository.js';
import * as emailService from './email-service.js';
import { processDueReminders } from './reminder-service.js';

describe('processDueReminders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends and marks reminders as sent when claim succeeds', async () => {
    vi.mocked(todoRepository.listDueTodosForReminder).mockResolvedValue([
      {
        id: 'todo-1',
        userId: 'user-1',
        title: 'Pay rent',
        dueAt: new Date('2026-06-01T09:00:00.000Z'),
        reminderAt: new Date('2026-06-01T08:45:00.000Z'),
        user: {
          id: 'user-1',
          email: 'user@example.com',
          name: 'User',
          timezone: 'Asia/Ho_Chi_Minh',
          status: 'active',
          deletedAt: null,
        },
      },
    ] as never);

    vi.mocked(reminderEventRepository.claimReminderEvent).mockResolvedValue({
      id: 'event-1',
      todoId: 'todo-1',
      reminderAt: new Date('2026-06-01T08:45:00.000Z'),
      attempts: 1,
    });

    const result = await processDueReminders(new Date('2026-06-01T09:00:00.000Z'));

    expect(emailService.sendTodoReminderEmail).toHaveBeenCalledOnce();
    expect(reminderEventRepository.markReminderSent).toHaveBeenCalledWith('event-1');
    expect(result).toEqual({ scanned: 1, sent: 1, failed: 0 });
  });

  it('marks reminders as failed when send throws', async () => {
    vi.mocked(todoRepository.listDueTodosForReminder).mockResolvedValue([
      {
        id: 'todo-2',
        userId: 'user-2',
        title: 'Submit report',
        dueAt: new Date('2026-06-01T10:00:00.000Z'),
        reminderAt: new Date('2026-06-01T09:55:00.000Z'),
        user: {
          id: 'user-2',
          email: 'user2@example.com',
          name: 'User 2',
          timezone: 'Asia/Ho_Chi_Minh',
          status: 'active',
          deletedAt: null,
        },
      },
    ] as never);

    vi.mocked(reminderEventRepository.claimReminderEvent).mockResolvedValue({
      id: 'event-2',
      todoId: 'todo-2',
      reminderAt: new Date('2026-06-01T09:55:00.000Z'),
      attempts: 1,
    });

    vi.mocked(emailService.sendTodoReminderEmail).mockRejectedValue(new Error('smtp down'));

    const result = await processDueReminders(new Date('2026-06-01T10:00:00.000Z'));

    expect(reminderEventRepository.markReminderFailed).toHaveBeenCalledWith('event-2', 'smtp down');
    expect(result).toEqual({ scanned: 1, sent: 0, failed: 1 });
  });

  it('skips deleted or inactive users', async () => {
    vi.mocked(todoRepository.listDueTodosForReminder).mockResolvedValue([
      {
        id: 'todo-3',
        userId: 'user-3',
        title: 'Archived',
        dueAt: new Date('2026-06-01T10:00:00.000Z'),
        reminderAt: new Date('2026-06-01T09:55:00.000Z'),
        user: {
          id: 'user-3',
          email: 'user3@example.com',
          name: 'User 3',
          timezone: 'Asia/Ho_Chi_Minh',
          status: 'inactive',
          deletedAt: null,
        },
      },
    ] as never);

    const result = await processDueReminders(new Date('2026-06-01T10:00:00.000Z'));

    expect(reminderEventRepository.claimReminderEvent).not.toHaveBeenCalled();
    expect(result).toEqual({ scanned: 1, sent: 0, failed: 0 });
  });
});
