import { z } from 'zod';

export const adminUserListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const adminUserCreateSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(1).max(120),
  role: z.enum(['user', 'admin']).default('user'),
  timezone: z.string().trim().min(1).default('Asia/Ho_Chi_Minh'),
  reason: z.string().trim().max(500).optional(),
});

export const adminUserUpdateSchema = z.object({
  email: z.string().trim().email().optional(),
  name: z.string().trim().min(1).max(120).optional(),
  role: z.enum(['user', 'admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  timezone: z.string().trim().min(1).optional(),
  reason: z.string().trim().max(500).optional(),
}).refine((value) => Object.keys(value).some((key) => key !== 'reason'), {
  message: 'At least one user field is required',
});

export const adminUserReasonSchema = z.object({
  reason: z.string().trim().min(1).max(500),
});

export type AdminUserCreateInput = z.infer<typeof adminUserCreateSchema>;
export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
