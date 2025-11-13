import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Trash2, Eye, Clock } from 'lucide-react';
import { getNotificationsByReceiver, markAsRead, markAllAsRead, deleteNotification } from '@/api/notificationApi';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from 'react-hot-toast';

const NotificationBell = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const { socket, connected } = useSocket();

    useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    // 🔥 Lắng nghe notification realtime
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification) => {
            console.log("🔔 Received new notification:", notification);

            // Thêm vào đầu danh sách
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Hiển thị toast
            toast.success(
                <div>
                    <strong>{getNotificationTypeLabel(notification.type)}</strong>
                    <p className="text-sm">{notification.message}</p>
                </div>,
                {
                    duration: 4000,
                    icon: getNotificationIcon(notification.type),
                }
            );

            // Phát âm thanh (optional)
            playNotificationSound();
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket]);

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
            setNotifications(data);
            // ✅ Sửa từ is_read -> isRead
            const unread = data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n =>
                    // ✅ Sửa từ is_read -> isRead
                    n._id === notificationId ? { ...n, isRead: true } : n
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
            await markAllAsRead(userId);
            setNotifications(prev =>
                // ✅ Sửa từ is_read -> isRead
                prev.map(n => ({ ...n, isRead: true }))
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
            await deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            toast.success('Đã xóa thông báo');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Không thể xóa thông báo');
        }
    };

    const playNotificationSound = () => {
        // Optional: Phát âm thanh thông báo
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Cannot play sound:', err));
    };

    // ✅ Cập nhật theo type mới: "alert", "info", "reminder"
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'alert': return '⚠️';
            case 'info': return '💡';
            case 'reminder': return '🔔';
            default: return '📢';
        }
    };

    // ✅ Cập nhật theo type mới
    const getNotificationColor = (type) => {
        switch (type) {
            case 'alert': return 'border-red-200 bg-red-50';
            case 'info': return 'border-blue-200 bg-blue-50';
            case 'reminder': return 'border-yellow-200 bg-yellow-50';
            default: return 'border-gray-200 bg-gray-50';
        }
    };

    // ✅ Label cho type mới
    const getNotificationTypeLabel = (type) => {
        switch (type) {
            case 'alert': return 'Cảnh báo';
            case 'info': return 'Thông tin';
            case 'reminder': return 'Nhắc nhở';
            default: return 'Thông báo';
        }
    };

    const getTimeAgo = (date) => {
        if (!date) return "Không xác định";

        // ✅ Xử lý cả timestamp và createdAt
        let safeDate;

        if (typeof date === 'string') {
            // Convert "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
            safeDate = new Date(date.replace(" ", "T"));
        } else {
            safeDate = new Date(date);
        }

        if (isNaN(safeDate.getTime())) return "Không xác định";

        const now = new Date();
        const diffMs = now - safeDate;

        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return safeDate.toLocaleDateString('vi-VN');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Thông báo"
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

                {/* Connection indicator */}
                {connected && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 max-h-[32rem] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 flex justify-between items-center">
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            <Bell size={20} />
                            Thông báo
                        </h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-white hover:text-blue-100 underline transition-colors"
                                    title="Đánh dấu tất cả đã đọc"
                                >
                                    Đọc hết
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                                aria-label="Đóng"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-[28rem]">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-600 border-t-transparent"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                    <Bell className="text-gray-400" size={32} />
                                </div>
                                <p className="text-gray-500 font-medium">Không có thông báo</p>
                                <p className="text-gray-400 text-sm mt-1">Bạn sẽ nhận được thông báo tại đây</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map(n => (
                                    <div
                                        key={n._id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-orange-50/30' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${getNotificationColor(n.type)}`}>
                                                {getNotificationIcon(n.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getNotificationColor(n.type)}`}>
                                                        {getNotificationTypeLabel(n.type)}
                                                    </span>
                                                    {!n.isRead && (
                                                        <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-1"></span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-800 font-medium mb-1 line-clamp-2">
                                                    {n.message}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {getTimeAgo(n.timestamp || n.createdAt)}
                                                    </p>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1">
                                                        {!n.isRead && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(n._id)}
                                                                className="p-1.5 hover:bg-green-100 rounded-full transition-colors group"
                                                                title="Đánh dấu đã đọc"
                                                            >
                                                                <Check className="text-gray-400 group-hover:text-green-600 transition-colors" size={16} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteNotification(n._id)}
                                                            className="p-1.5 hover:bg-red-100 rounded-full transition-colors group"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 className="text-gray-400 group-hover:text-red-600 transition-colors" size={16} />
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
                        <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-center">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    // Navigate to notifications page if needed
                                    // navigate('/notifications');
                                }}
                                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Xem tất cả thông báo
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;