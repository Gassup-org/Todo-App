import { TodoPriority, TodoStatus } from '@prisma/client';
import { todoRepository } from '../repositories/todo.repository';
import { toUtcDayRange } from '../utils/date';

interface CreateTodoDto {
  title: string;
  description?: string;
  scheduledDate: string;
  dueTime?: string;
  priority?: TodoPriority;
  reminderEmailEnabled?: boolean;
  reminderAt?: string;
}

interface UpdateTodoDto {
  title?: string;
  description?: string;
  scheduledDate?: string;
  dueTime?: string;
  priority?: TodoPriority;
  status?: TodoStatus;
  reminderEmailEnabled?: boolean;
  reminderAt?: string | null;
}

export const todoService = {
  async create(userId: string, input: CreateTodoDto) {
    return todoRepository.create({
      userId,
      title: input.title,
      description: input.description,
      scheduledDate: new Date(`${input.scheduledDate}T00:00:00.000Z`),
      dueTime: input.dueTime,
      priority: input.priority,
      reminderEmailEnabled: input.reminderEmailEnabled ?? false,
      reminderAt: input.reminderAt ? new Date(input.reminderAt) : undefined
    });
  },

  async listByDate(userId: string, date: string) {
    const { start, end } = toUtcDayRange(date);
    return todoRepository.findByUserAndDate(userId, start, end);
  },

  async update(userId: string, todoId: string, input: UpdateTodoDto) {
    const todo = await todoRepository.findById(todoId);
    if (!todo || todo.userId !== userId) {
      throw new Error('Todo not found');
    }

    return todoRepository.updateById(todoId, {
      title: input.title,
      description: input.description,
      scheduledDate: input.scheduledDate ? new Date(`${input.scheduledDate}T00:00:00.000Z`) : undefined,
      dueTime: input.dueTime,
      priority: input.priority,
      status: input.status,
      reminderEmailEnabled: input.reminderEmailEnabled,
      reminderAt: input.reminderAt === null ? null : input.reminderAt ? new Date(input.reminderAt) : undefined
    });
  },

  async toggleCompleted(userId: string, todoId: string) {
    const todo = await todoRepository.findById(todoId);
    if (!todo || todo.userId !== userId) {
      throw new Error('Todo not found');
    }

    const status = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED;
    return todoRepository.updateById(todoId, { status });
  },

  async remove(userId: string, todoId: string) {
    const todo = await todoRepository.findById(todoId);
    if (!todo || todo.userId !== userId) {
      throw new Error('Todo not found');
    }

    await todoRepository.deleteById(todoId);
  }
};
