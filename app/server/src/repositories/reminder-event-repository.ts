import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma-client.js';

function isUniqueConstraint(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

export type ReminderClaim = {
  id: string;
  todoId: string;
  reminderAt: Date;
  attempts: number;
};

export async function claimReminderEvent(input: {
  todoId: string;
  userId: string;
  reminderAt: Date;
  maxAttempts: number;
}) {
  return prisma.$transaction(async (tx) => {
    try {
      const created = await tx.reminderEvent.create({
        data: {
          todoId: input.todoId,
          userId: input.userId,
          reminderAt: input.reminderAt,
          status: 'sending',
          attempts: 1,
          lastError: null,
        },
        select: {
          id: true,
          todoId: true,
          reminderAt: true,
          attempts: true,
        },
      });

      return created;
    } catch (error) {
      if (!isUniqueConstraint(error)) throw error;

      const updated = await tx.reminderEvent.updateMany({
        where: {
          todoId: input.todoId,
          reminderAt: input.reminderAt,
          status: { in: ['pending', 'failed'] },
          attempts: { lt: input.maxAttempts },
        },
        data: {
          status: 'sending',
          attempts: { increment: 1 },
          lastError: null,
        },
      });

      if (updated.count === 0) {
        return null;
      }

      return tx.reminderEvent.findUnique({
        where: {
          todoId_reminderAt: {
            todoId: input.todoId,
            reminderAt: input.reminderAt,
          },
        },
        select: {
          id: true,
          todoId: true,
          reminderAt: true,
          attempts: true,
        },
      });
    }
  });
}

export function markReminderSent(reminderEventId: string) {
  return prisma.reminderEvent.update({
    where: { id: reminderEventId },
    data: {
      status: 'sent',
      sentAt: new Date(),
      lastError: null,
    },
  });
}

export function markReminderFailed(reminderEventId: string, errorMessage: string) {
  return prisma.reminderEvent.update({
    where: { id: reminderEventId },
    data: {
      status: 'failed',
      lastError: errorMessage.slice(0, 1000),
    },
  });
}
