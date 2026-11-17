import api from './client';
import { Trip } from '../types';

export const tripApi = {
  getTrips: async (params?: any) => {
    const res = await api.get<{
      success: boolean;
      data: Trip[];
      pagination: { total: number; page: number; pages: number };
    }>('/trips', { params });
    return res.data;
  },
  getMyTrips: async () => {
    const res = await api.get<{ success: boolean; trips: Trip[] }>('/trips/my');
    return res.data;
  },
  getTripById: async (id: string) => {
    const res = await api.get<{ success: boolean; trip: Trip }>(`/trips/${id}`);
    return res.data;
  },
  createTrip: async (data: any) => {
    const res = await api.post<{ success: boolean; message: string; trip: Trip }>('/trips', data);
    return res.data;
  },
  updateTrip: async (id: string, data: any) => {
    const res = await api.put<{ success: boolean; message: string; trip: Trip }>(`/trips/${id}`, data);
    return res.data;
  },
  deleteTrip: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/trips/${id}`);
    return res.data;
  },
};
