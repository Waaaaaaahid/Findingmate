import api from './client';
import { Conversation, Message } from '../types';

export const messageApi = {
  getConversations: async () => {
    const res = await api.get<{ success: boolean; conversations: Conversation[] }>('/messages/conversations');
    return res.data;
  },
  getOrCreateConversation: async (data: { recipientId?: string; meetupId?: string; isGroup?: boolean; title?: string }) => {
    const res = await api.post<{ success: boolean; conversation: Conversation }>('/messages/conversations', data);
    return res.data;
  },
  getMessages: async (conversationId: string) => {
    const res = await api.get<{ success: boolean; messages: Message[] }>(`/messages/conversations/${conversationId}/messages`);
    return res.data;
  },
  sendMessage: async (conversationId: string, data: { text?: string; meetupCard?: any; attachments?: string[] }) => {
    const res = await api.post<{ success: boolean; message: Message }>(`/messages/conversations/${conversationId}/messages`, data);
    return res.data;
  },
  markAsRead: async (conversationId: string) => {
    const res = await api.post<{ success: boolean }>(`/messages/conversations/${conversationId}/read`);
    return res.data;
  },
};
