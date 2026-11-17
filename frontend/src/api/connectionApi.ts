import api from './client';
import { ConnectionItem } from '../types';

export const connectionApi = {
  getMyConnections: async () => {
    const res = await api.get<{
      success: boolean;
      accepted: ConnectionItem[];
      pendingIncoming: ConnectionItem[];
      pendingOutgoing: ConnectionItem[];
    }>('/connections');
    return res.data;
  },
  sendRequest: async (recipientId: string) => {
    const res = await api.post<{ success: boolean; message: string; connection: any }>('/connections/request', {
      recipientId,
    });
    return res.data;
  },
  acceptRequest: async (connectionId: string) => {
    const res = await api.post<{ success: boolean; message: string }>('/connections/accept', { connectionId });
    return res.data;
  },
  rejectRequest: async (connectionId: string) => {
    const res = await api.post<{ success: boolean; message: string }>('/connections/reject', { connectionId });
    return res.data;
  },
  cancelRequest: async (connectionId: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/connections/request/${connectionId}`);
    return res.data;
  },
  removeConnection: async (targetUserId: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/connections/${targetUserId}`);
    return res.data;
  },
  checkStatus: async (targetUserId: string) => {
    const res = await api.get<{ status: 'none' | 'connected' | 'pending_incoming' | 'pending_outgoing' | 'blocked'; connectionId?: string }>(
      `/connections/status/${targetUserId}`
    );
    return res.data;
  },
};
