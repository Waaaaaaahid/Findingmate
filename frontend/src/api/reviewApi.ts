import api from './client';
import { Review } from '../types';

export const reviewApi = {
  createReview: async (data: { revieweeId: string; meetupId: string; rating: number; feedback: string }) => {
    const res = await api.post<{ success: boolean; message: string; review: Review }>('/reviews', data);
    return res.data;
  },
  getReviewsForUser: async (userId: string) => {
    const res = await api.get<{ success: boolean; reviews: Review[]; count: number; averageRating: number }>(
      `/reviews/user/${userId}`
    );
    return res.data;
  },
  report: async (data: { targetType: 'user' | 'meetup' | 'review'; targetUserId?: string; targetMeetupId?: string; targetReviewId?: string; reason: string; details?: string }) => {
    const res = await api.post<{ success: boolean; message: string }>('/reports', data);
    return res.data;
  },
};
