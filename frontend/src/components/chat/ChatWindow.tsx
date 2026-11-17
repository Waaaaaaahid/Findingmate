import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Calendar, Clock, CheckCheck } from 'lucide-react';
import { Message, User } from '../../types';
import { messageApi } from '../../api/messageApi';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

interface ChatWindowProps {
  conversationId: string;
  partner?: User;
  meetupInfo?: {
    _id: string;
    title: string;
    city: string;
    date: string;
  };
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  partner,
  meetupInfo,
}) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await messageApi.getMessages(conversationId);
        if (res.success) {
          setMessages(res.messages);
        }
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_conversation', conversationId);

    const handleNewMessage = (msg: Message) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleTypingStatus = (data: { conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing_status', handleTypingStatus);

    return () => {
      socket.emit('leave_conversation', conversationId);
      socket.off('new_message', handleNewMessage);
      socket.off('typing_status', handleTypingStatus);
    };
  }, [socket, conversationId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const currentText = text;
    setText('');

    try {
      const res = await messageApi.sendMessage(conversationId, { text: currentText });
      if (res.success) {
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E8EAE6] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#E8EAE6] bg-[#FAF9F6] flex items-center justify-between">
        {partner ? (
          <div className="flex items-center gap-3">
            <img
              src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={partner.fullName}
              className="w-10 h-10 rounded-full object-cover border border-[#174C3B]/20"
            />
            <div>
              <h3 className="text-sm font-bold font-serif text-[#202522]">{partner.fullName}</h3>
              <p className="text-[11px] text-[#777F79] capitalize">
                {partner.accountType} • {partner.country}
              </p>
            </div>
          </div>
        ) : meetupInfo ? (
          <div>
            <h3 className="text-sm font-bold font-serif text-[#202522]">{meetupInfo.title}</h3>
            <p className="text-[11px] text-[#777F79]">Meetup Group Chat</p>
          </div>
        ) : (
          <h3 className="text-sm font-bold font-serif text-[#202522]">Chat</h3>
        )}

        {meetupInfo && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#E89A55]" />
            <span>{meetupInfo.city}</span>
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F6]/30">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs text-[#777F79]">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#777F79] p-6">
            <p className="text-xs">No messages yet. Say hello and plan your travel meetup!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-end gap-1.5 max-w-[80%]">
                  {!isMe && (
                    <img
                      src={
                        msg.sender?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                      }
                      alt={msg.sender?.fullName}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mb-1 border border-gray-200"
                    />
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      isMe
                        ? 'bg-[#174C3B] text-white rounded-br-xs'
                        : 'bg-white text-[#202522] border border-[#E8EAE6] rounded-bl-xs'
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[10px] font-bold text-[#174C3B] mb-0.5">
                        {msg.sender?.fullName}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                    {/* Meetup card if embedded */}
                    {msg.meetupCard && (
                      <div className="mt-2 p-2.5 rounded-xl bg-black/10 border border-white/20 text-xs">
                        <p className="font-bold">{msg.meetupCard.title}</p>
                        <p className="text-[11px] opacity-80">
                          {msg.meetupCard.city} • {msg.meetupCard.date}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-[#777F79]">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#174C3B]" />}
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="text-[11px] text-[#777F79] italic animate-pulse">
            Typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#E8EAE6] bg-white flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message to arrange meetups..."
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] focus:ring-1 focus:ring-[#174C3B] outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white disabled:opacity-40 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
