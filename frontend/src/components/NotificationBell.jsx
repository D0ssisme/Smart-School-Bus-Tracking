// src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Eye, Clock } from 'lucide-react';
import { getNotificationsByReceiver } from '@/api/notificationApi';
import { toast } from 'react-hot-toast';

const NotificationBell = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getNotificationsByReceiver(userId);

            // Sort by newest first
            const sortedNotifications = data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            setNotifications(sortedNotifications);

            // Count unread
            const unread = sortedNotifications.filter(n => !n.is_read).length;
            setUnreadCount(unread);

        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            // TODO: Call API to mark as read
            // await markNotificationAsRead(notificationId);

            setNotifications(prev =>
                prev.map(n =>
                    n._id === notificationId ? { ...n, is_read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

        } catch (error) {
            console.error('Error marking as read:', error);
            toast.error('Không thể đánh dấu đã đọc');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            // TODO: Call API to mark all as read
            // await markAllNotificationsAsRead(userId);

            setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: true }))
            );
            setUnreadCount(0);
            toast.success('Đã đánh dấu tất cả là đã đọc');

        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Không thể đánh dấu tất cả');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            // TODO: Call API to delete notification
            // await deleteNotification(notificationId);

            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            toast.success('Đã xóa thông báo');

        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Không thể xóa thông báo');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'info':
                return '💡';
            case 'success':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            case 'schedule':
                return '📅';
            case 'student':
                return '👨‍🎓';
            case 'bus':
                return '🚌';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            case 'info':
                return 'border-blue-200 bg-blue-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now - notifDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return notifDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <Bell
                    className={`w-6 h-6 ${unreadCount > 0 ? 'text-blue-600' : 'text-gray-600'}`}
                    fill={unreadCount > 0 ? 'currentColor' : 'none'}
                />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="text-white" size={20} />
                            <h3 className="text-white font-bold">Thông báo</h3>
                            {unreadCount > 0 && (
                                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                                    {unreadCount} mới
                                </span>
                            )}
                        </div>

                        {notifications.length > 0 && unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-white/80 hover:text-white text-xs font-medium flex items-center gap-1"
                            >
                                <Check size={14} />
                                Đánh dấu tất cả
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[500px] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12 px-6">
                                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                    <Bell className="text-gray-400" size={32} />
                                </div>
                                <p className="text-gray-600 font-medium">Không có thông báo</p>
                                <p className="text-gray-400 text-sm mt-1">Bạn đã xem hết thông báo</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${getNotificationColor(notification.type)
                                                }`}>
                                                <span className="text-lg">
                                                    {getNotificationIcon(notification.type)}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className={`text-sm font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {notification.title}
                                                    </h4>

                                                    {!notification.is_read && (
                                                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock size={12} />
                                                        {getTimeAgo(notification.createdAt)}
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification._id)}
                                                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                                title="Đánh dấu đã đọc"
                                                            >
                                                                <Eye size={14} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteNotification(notification._id)}
                                                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                            title="Xóa thông báo"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="bg-gray-50 px-4 py-3 text-center border-t">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Xem tất cả thông báo
                            </button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default NotificationBell;