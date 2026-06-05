import { api } from './client.js';

export interface AuthUser {
  id: string;
  email: string;
}

export const authApi = {
  register: (email: string, password: string) =>
    api.post<AuthUser>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post<AuthUser>('/auth/login', { email, password }),

  me: () => api.get<AuthUser>('/auth/me'),

  logout: () => api.post<void>('/auth/logout', {}),

  updateMe: (payload: {
    currentPassword: string;
    email?: string;
    newPassword?: string;
  }) => api.patch<AuthUser>('/auth/me', payload),

  deleteMe: (currentPassword: string) =>
    api.delete<void>('/auth/me', { currentPassword }),
};
