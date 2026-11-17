import api from './client';
import { AdminStats, User, Meetup, Report } from '../types';

export const adminApi = {
  getStats: async () => {
    const res = await api.get<{ success: boolean; stats: AdminStats; recentReports: Report[] }>('/admin/stats');
    return res.data;
  },
  getUsers: async (params?: any) => {
    const res = await api.get<{
      success: boolean;
      users: User[];
      pagination: { total: number; page: number; pages: number };
    }>('/admin/users', { params });
    return res.data;
  },
  updateUserStatus: async (userId: string, data: any) => {
    const res = await api.put<{ success: boolean; message: string; user: any }>(`/admin/users/${userId}/status`, data);
    return res.data;
  },
  getMeetups: async (params?: any) => {
    const res = await api.get<{
      success: boolean;
      meetups: Meetup[];
      pagination: { total: number; page: number; pages: number };
    }>('/admin/meetups', { params });
    return res.data;
  },
  deleteMeetup: async (meetupId: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/admin/meetups/${meetupId}`);
    return res.data;
  },
  getReports: async (params?: any) => {
    const res = await api.get<{
      success: boolean;
      reports: Report[];
      pagination: { total: number; page: number; pages: number };
    }>('/admin/reports', { params });
    return res.data;
  },
  resolveReport: async (reportId: string, data: { status: string; adminNotes?: string; action?: string }) => {
    const res = await api.put<{ success: boolean; message: string }>(`/admin/reports/${reportId}`, data);
    return res.data;
  },
};
