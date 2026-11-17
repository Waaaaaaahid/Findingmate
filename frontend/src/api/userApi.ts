import api from './client';
import { User } from '../types';

export const userApi = {
  getExploreUsers: async (params: any) => {
    const res = await api.get<{
      success: boolean;
      data: User[];
      pagination: { total: number; page: number; pages: number };
    }>('/users/explore', { params });
    return res.data;
  },
  getUserById: async (id: string) => {
    const res = await api.get<{ success: boolean; user: User }>(`/users/${id}`);
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await api.put<{ success: boolean; message: string; user: User }>('/users/profile', data);
    return res.data;
  },
  setOpenToMeet: async (data: any) => {
    const res = await api.post<{ success: boolean; message: string; openToMeet: any }>('/users/open-to-meet', data);
    return res.data;
  },
  blockUser: async (id: string) => {
    const res = await api.post<{ success: boolean; message: string }>(`/users/${id}/block`);
    return res.data;
  },
  unblockUser: async (id: string) => {
    const res = await api.post<{ success: boolean; message: string }>(`/users/${id}/unblock`);
    return res.data;
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post<{ success: boolean; url: string }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
