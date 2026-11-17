import api from './client';
import { User } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', credentials);
    return res.data;
  },
  register: async (data: any) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },
  completeOnboarding: async (data: any) => {
    const res = await api.post<{ success: boolean; user: User }>('/auth/onboarding', data);
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post<{ success: boolean; message: string; debugDemoResetCode?: string }>('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (data: any) => {
    const res = await api.post<{ success: boolean; message: string }>('/auth/reset-password', data);
    return res.data;
  },
};
