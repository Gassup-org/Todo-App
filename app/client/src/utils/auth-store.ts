import { create } from 'zustand';

export type UserRole = 'user' | 'admin';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  timezone: string;
  avatarUrl?: string;
};

type AuthState = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
