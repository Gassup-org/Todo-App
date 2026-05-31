import { apiRequest, clearStoredToken } from './apiClient';
import type { AuthUser, UserRole } from '../types/auth';

interface ServerUser {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  picture?: string | null;
}

export function normalizeUser(user: ServerUser): AuthUser {
  return {
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    role: user.role.toLowerCase() as UserRole,
    avatarUrl: user.picture ?? undefined
  };
}

export async function getCurrentUser() {
  const user = await apiRequest<ServerUser>('/auth/me');
  return normalizeUser(user);
}

export async function logout() {
  try {
    await apiRequest<{ loggedOut: boolean }>('/auth/logout', { method: 'POST' });
  } finally {
    clearStoredToken();
  }
}

export function loginWithGoogle() {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'}/auth/google`;
}
