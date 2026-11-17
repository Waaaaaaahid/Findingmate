import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Calendar, Users, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
      case 'connection_accepted':
        return <Users className="w-4 h-4 text-[#174C3B]" />;
      case 'meetup_request':
      case 'meetup_accepted':
      case 'meetup_reminder':
        return <Calendar className="w-4 h-4 text-[#E89A55]" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-emerald-700" />;
      case 'meetup_cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
            Notifications
          </h1>
          <p className="text-xs text-[#777F79] mt-0.5">
            Stay updated on meetup requests, connections, and travel invitations.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-1.5 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#174C3B] hover:bg-[#FAF9F6] flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E8EAE6] text-center space-y-3">
          <Bell className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-[#202522]">No notifications yet</h3>
          <p className="text-xs text-[#777F79] max-w-sm mx-auto">
            When other travelers send connection requests or invite you to meetups, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8EAE6] divide-y divide-[#E8EAE6] shadow-sm overflow-hidden">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.read && markAsRead(notif._id)}
              className={`p-4 sm:p-5 flex items-start gap-3.5 transition-colors cursor-pointer ${
                notif.read ? 'bg-white hover:bg-[#FAF9F6]' : 'bg-[#E5EEE8]/30 hover:bg-[#E5EEE8]/50'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-[#E8EAE6] shadow-xs shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4
                    className={`text-xs ${
                      notif.read ? 'font-medium text-[#202522]' : 'font-bold text-[#174C3B]'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-[#777F79] shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <p className="text-xs text-[#777F79] leading-relaxed mb-2">{notif.message}</p>

                {notif.link && (
                  <Link
                    to={notif.link}
                    className="text-xs font-semibold text-[#174C3B] hover:underline"
                  >
                    View Details →
                  </Link>
                )}
              </div>

              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-[#E89A55] shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
