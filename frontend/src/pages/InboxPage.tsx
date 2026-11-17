import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Users, Search, CheckCheck } from 'lucide-react';
import { messageApi } from '../api/messageApi';
import { Conversation, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ChatWindow } from '../components/chat/ChatWindow';

export const InboxPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(
    searchParams.get('conv') || null
  );
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const fetchConversations = async () => {
    try {
      const res = await messageApi.getConversations();
      if (res.success) {
        setConversations(res.conversations);
        if (!selectedConvId && res.conversations.length > 0) {
          setSelectedConvId(res.conversations[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const paramConv = searchParams.get('conv');
    if (paramConv) {
      setSelectedConvId(paramConv);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', () => {
      fetchConversations();
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket]);

  const activeConversation = conversations.find((c) => c._id === selectedConvId);

  const getPartner = (conv: Conversation): User | undefined => {
    return conv.participants.find((p) => p._id !== user?._id);
  };

  const filteredConversations = conversations.filter((c) => {
    const partner = getPartner(c);
    const title = c.isGroup ? c.title : partner?.fullName;
    return title?.toLowerCase().includes(filterText.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-160px)] min-h-[550px]">
        {/* Left Side: Conversations List */}
        <div
          className={`md:col-span-5 lg:col-span-4 bg-white rounded-2xl border border-[#E8EAE6] flex flex-col shadow-sm overflow-hidden ${
            selectedConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#E8EAE6] space-y-3">
            <h2 className="text-lg font-bold font-serif text-[#174C3B] flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E8EAE6] outline-none"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E8EAE6]/60">
            {loading ? (
              <div className="p-8 text-center text-xs text-[#777F79]">Loading chats...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#777F79]">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const partner = getPartner(conv);
                const isSelected = conv._id === selectedConvId;
                const displayName = conv.isGroup ? conv.title : partner?.fullName || 'Traveler';

                return (
                  <div
                    key={conv._id}
                    onClick={() => {
                      setSelectedConvId(conv._id);
                      setSearchParams({ conv: conv._id });
                    }}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#E5EEE8]/50 border-l-4 border-l-[#174C3B]'
                        : 'hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={
                          conv.isGroup
                            ? 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100'
                            : partner?.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                        }
                        alt="avatar"
                        className="w-11 h-11 rounded-full object-cover border border-[#E8EAE6]"
                      />
                      {conv.unreadCount && conv.unreadCount > 0 ? (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E89A55] text-white text-[10px] font-bold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-[#202522] truncate">
                          {displayName}
                        </h4>
                        {conv.updatedAt && (
                          <span className="text-[10px] text-[#777F79]">
                            {new Date(conv.updatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#777F79] truncate">
                        {conv.lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div
          className={`md:col-span-7 lg:col-span-8 h-full ${
            selectedConvId ? 'flex' : 'hidden md:flex'
          }`}
        >
          {selectedConvId && activeConversation ? (
            <div className="w-full h-full flex flex-col">
              {/* Mobile Back to conversation list */}
              <button
                onClick={() => setSelectedConvId(null)}
                className="md:hidden pb-2 text-xs font-semibold text-[#174C3B] flex items-center gap-1"
              >
                ← Back to All Chats
              </button>
              <div className="flex-1 h-full">
                <ChatWindow
                  conversationId={selectedConvId}
                  partner={getPartner(activeConversation)}
                  meetupInfo={activeConversation.meetupId}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-white rounded-2xl border border-[#E8EAE6] flex flex-col items-center justify-center text-center p-8 text-[#777F79] shadow-sm">
              <MessageSquare className="w-12 h-12 text-[#E5EEE8] text-[#174C3B] mb-2" />
              <h3 className="text-base font-bold font-serif text-[#202522]">Your Messages</h3>
              <p className="text-xs max-w-sm mt-1">
                Select a conversation on the left to arrange meetups, coordinate trip timings, and share recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
