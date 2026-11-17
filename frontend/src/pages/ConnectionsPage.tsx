import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Clock, Check, X, Trash2, MessageSquare, ArrowLeft } from 'lucide-react';
import { connectionApi } from '../api/connectionApi';
import { messageApi } from '../api/messageApi';
import { ConnectionItem } from '../types';
import { useNavigate } from 'react-router-dom';

export const ConnectionsPage: React.FC = () => {
  const navigate = useNavigate();

  const [accepted, setAccepted] = useState<ConnectionItem[]>([]);
  const [pendingIncoming, setPendingIncoming] = useState<ConnectionItem[]>([]);
  const [pendingOutgoing, setPendingOutgoing] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'accepted' | 'incoming' | 'outgoing'>('accepted');

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await connectionApi.getMyConnections();
      if (res.success) {
        setAccepted(res.accepted);
        setPendingIncoming(res.pendingIncoming);
        setPendingOutgoing(res.pendingOutgoing);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleAccept = async (connectionId: string) => {
    try {
      await connectionApi.acceptRequest(connectionId);
      fetchConnections();
    } catch (err) {
      console.error('Error accepting connection:', err);
    }
  };

  const handleReject = async (connectionId: string) => {
    try {
      await connectionApi.rejectRequest(connectionId);
      fetchConnections();
    } catch (err) {
      console.error('Error rejecting connection:', err);
    }
  };

  const handleCancel = async (connectionId: string) => {
    try {
      await connectionApi.cancelRequest(connectionId);
      fetchConnections();
    } catch (err) {
      console.error('Error cancelling connection request:', err);
    }
  };

  const handleRemove = async (targetUserId: string) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) return;
    try {
      await connectionApi.removeConnection(targetUserId);
      fetchConnections();
    } catch (err) {
      console.error('Error removing connection:', err);
    }
  };

  const handleMessage = async (recipientId: string) => {
    try {
      const res = await messageApi.getOrCreateConversation({ recipientId });
      if (res.success && res.conversation) {
        navigate(`/inbox?conv=${res.conversation._id}`);
      }
    } catch (err) {
      console.error('Error opening conversation:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
            My Travel Connections
          </h1>
          <p className="text-xs text-[#777F79] mt-1">
            Manage your network of fellow travelers, locals, and pending requests.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EAE6] pb-1">
        <button
          onClick={() => setActiveTab('accepted')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'accepted'
              ? 'border-[#174C3B] text-[#174C3B]'
              : 'border-transparent text-[#777F79] hover:text-[#202522]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Connected ({accepted.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'incoming'
              ? 'border-[#174C3B] text-[#174C3B]'
              : 'border-transparent text-[#777F79] hover:text-[#202522]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Received Requests ({pendingIncoming.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'outgoing'
              ? 'border-[#174C3B] text-[#174C3B]'
              : 'border-transparent text-[#777F79] hover:text-[#202522]'
          }`}
        >
          <span>Sent Requests ({pendingOutgoing.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#777F79]">Loading connections...</div>
      ) : activeTab === 'accepted' ? (
        accepted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8EAE6] p-10 text-center space-y-3">
            <Users className="w-8 h-8 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#202522]">No connections yet</h3>
            <p className="text-xs text-[#777F79] max-w-sm mx-auto">
              Explore travelers and locals from around the world and send connection requests!
            </p>
            <Link
              to="/explore"
              className="inline-block px-5 py-2 rounded-xl bg-[#174C3B] text-white text-xs font-semibold hover:bg-[#11392C]"
            >
              Explore People
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accepted.map((item) => (
              <div
                key={item.connectionId}
                className="bg-white rounded-2xl p-4 border border-[#E8EAE6] shadow-xs flex items-center justify-between gap-3"
              >
                <Link
                  to={`/users/${item.user?._id}`}
                  className="flex items-center gap-3 min-w-0"
                >
                  <img
                    src={
                      item.user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={item.user?.fullName}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-[#202522] truncate">
                      {item.user?.fullName}
                    </h4>
                    <p className="text-[11px] text-[#777F79] truncate">
                      {item.user?.currentCity || item.user?.country}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleMessage(item.user?._id)}
                    className="p-2 rounded-xl bg-[#E5EEE8] text-[#174C3B] hover:bg-[#C8DBD0]"
                    title="Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(item.user?._id)}
                    className="p-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
                    title="Remove connection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'incoming' ? (
        pendingIncoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8EAE6] p-8 text-center text-xs text-[#777F79]">
            No pending incoming connection requests.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingIncoming.map((item) => (
              <div
                key={item.connectionId}
                className="bg-white rounded-2xl p-4 border border-[#E8EAE6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <Link
                  to={`/users/${item.user?._id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={
                      item.user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={item.user?.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#202522]">{item.user?.fullName}</h4>
                    <p className="text-[11px] text-[#777F79] capitalize">
                      {item.user?.accountType} • {item.user?.country}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleAccept(item.connectionId)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(item.connectionId)}
                    className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        pendingOutgoing.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8EAE6] p-8 text-center text-xs text-[#777F79]">
            No pending sent requests.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOutgoing.map((item) => (
              <div
                key={item.connectionId}
                className="bg-white rounded-2xl p-4 border border-[#E8EAE6] shadow-xs flex items-center justify-between gap-3"
              >
                <Link
                  to={`/users/${item.user?._id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={
                      item.user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={item.user?.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#202522]">{item.user?.fullName}</h4>
                    <p className="text-[11px] text-[#777F79] capitalize">
                      {item.user?.accountType} • {item.user?.country}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => handleCancel(item.connectionId)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-semibold"
                >
                  Cancel Request
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
