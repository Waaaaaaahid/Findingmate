import api from './client';
import { Notification } from '../types';

export const notificationApi = {
  getNotifications: async () => {
    const res = await api.get<{ success: boolean; notifications: Notification[]; unreadCount: number }>('/notifications');
    return res.data;
  },
  markAsRead: async (id: string) => {
    const res = await api.put<{ success: boolean; notification: Notification }>(`/notifications/${id}/read`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await api.put<{ success: boolean; message: string }>('/notifications/read-all');
    return res.data;
  },
};
