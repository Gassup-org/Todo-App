import type { Request } from 'express';

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  timezone: string;
};

export type AuthenticatedRequest = Request & {
  authenticatedUser: AuthenticatedUser;
};
