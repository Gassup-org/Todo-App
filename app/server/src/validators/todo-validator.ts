import { z } from 'zod';

export const todoCreateSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().nullable(),
  status: z.enum(['active', 'completed']).default('active'),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  dueAt: z.string().datetime(),
  reminderAt: z.string().datetime().optional().nullable(),
});

export const todoUpdateSchema = todoCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required',
});

export const todoDateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type TodoCreateInput = z.infer<typeof todoCreateSchema>;
export type TodoUpdateInput = z.infer<typeof todoUpdateSchema>;
