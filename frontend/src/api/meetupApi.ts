import api from './client';
import { Meetup } from '../types';

export const meetupApi = {
  getMeetups: async (params?: any) => {
    const res = await api.get<{
      success: boolean;
      data: Meetup[];
      pagination: { total: number; page: number; pages: number };
    }>('/meetups', { params });
    return res.data;
  },
  getMyMeetups: async () => {
    const res = await api.get<{
      success: boolean;
      created: Meetup[];
      joined: Meetup[];
      saved: Meetup[];
    }>('/meetups/my');
    return res.data;
  },
  getMeetupById: async (id: string) => {
    const res = await api.get<{
      success: boolean;
      meetup: Meetup;
      isSaved: boolean;
    }>(`/meetups/${id}`);
    return res.data;
  },
  createMeetup: async (data: any) => {
    const res = await api.post<{ success: boolean; message: string; meetup: Meetup }>('/meetups', data);
    return res.data;
  },
  updateMeetup: async (id: string, data: any) => {
    const res = await api.put<{ success: boolean; message: string; meetup: Meetup }>(`/meetups/${id}`, data);
    return res.data;
  },
  cancelMeetup: async (id: string) => {
    const res = await api.post<{ success: boolean; message: string; meetup: Meetup }>(`/meetups/${id}/cancel`);
    return res.data;
  },
  joinMeetup: async (id: string, message?: string) => {
    const res = await api.post<{ success: boolean; message: string; meetup: Meetup }>(`/meetups/${id}/join`, { message });
    return res.data;
  },
  respondToRequest: async (meetupId: string, requestId: string, action: 'accept' | 'reject') => {
    const res = await api.post<{ success: boolean; message: string; meetup: Meetup }>(`/meetups/${meetupId}/respond`, {
      requestId,
      action,
    });
    return res.data;
  },
  leaveMeetup: async (id: string) => {
    const res = await api.post<{ success: boolean; message: string; meetup: Meetup }>(`/meetups/${id}/leave`);
    return res.data;
  },
  toggleSaveMeetup: async (id: string) => {
    const res = await api.post<{ success: boolean; saved: boolean; message: string }>(`/meetups/${id}/save`);
    return res.data;
  },
};
