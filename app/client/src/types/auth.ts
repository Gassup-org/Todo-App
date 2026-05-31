export type UserRole = 'guest' | 'user' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}