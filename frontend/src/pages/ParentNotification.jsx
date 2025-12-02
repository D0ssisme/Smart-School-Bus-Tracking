import { useState, useEffect } from "react";
import { 
    Bell, 
    AlertCircle, 
    Info, 
    CheckCircle, 
    Clock, 
    Search, 
    Filter, 
    TrendingUp, 
    Check,
    MailOpen
} from "lucide-react";
import { getAllNotifications } from "@/api/notificationApi";
import { toast } from "react-hot-toast";
import { useLanguage } from '@/contexts/LanguageContext'; // ✅ Import hook

// Component Card riêng cho Parent (giống NotificationCard nhưng action khác)
function ParentNotificationCard({ notification, onMarkRead, t, language }) {
    
    const getTypeStyle = (type) => {
        switch (type) {
            case 'alert':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'reminder':
                return 'bg-orange-50 border-orange-200 text-orange-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'alert':
                return <AlertCircle size={20} className="text-red-600" />;
            case 'info':
                return <Info size={20} className="text-blue-600" />;
            case 'reminder':
                return <Bell size={20} className="text-orange-600" />;
            default:
                return <Bell size={20} className="text-gray-600" />;
        }
    };

    const formatTime = (isoTime) => {
        const date = new Date(isoTime);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('parentNotifications.card.justNow');
        if (diffMins < 60) return t('parentNotifications.card.minutesAgo').replace('{min}', diffMins);
        if (diffHours < 24) return t('parentNotifications.card.hoursAgo').replace('{hour}', diffHours);
        if (diffDays === 1) return t('parentNotifications.card.yesterday');
        return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
    };

    return (
        <div className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${!notification.isRead ? 'border-blue-300 shadow-sm bg-blue-50/30' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeStyle(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeStyle(notification.type)}`}>
                                {notification.title}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={14} />
                                {formatTime(notification.time)}
                            </span>
                            {!notification.isRead && (
                                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                            )}
                        </div>
                        <p className={`font-medium mb-1 ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.message}
                        </p>
                    </div>
                </div>
                {!notification.isRead && (
                    <button
                        onClick={() => onMarkRead(notification._id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium whitespace-nowrap"
                        title={t('parentNotifications.card.markRead')}
                    >
                        <Check size={16} />
                        <span className="hidden sm:inline">{t('parentNotifications.card.markRead')}</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default function ParentNotifications() {
    const { t, language } = useLanguage(); // ✅ Sử dụng hook
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser._id || currentUser.id;

    useEffect(() => {
        fetchNotifications();
    }, [t]);

    const getTitleByType = (type) => {
        switch (type) {
            case 'alert':
                return t('parentNotifications.card.type.alert');
            case 'reminder':
                return t('parentNotifications.card.type.reminder');
            case 'info':
                return t('parentNotifications.card.type.info');
            default:
                return t('parentNotifications.card.type.default');
        }
    };

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const allNotifications = await getAllNotifications();
            
            const myNotifications = allNotifications
                .filter(notification => {
                    const receiverId = notification.receiver_id?._id || notification.receiver_id;
                    return receiverId?.toString() === currentUserId?.toString();
                })
                .map(notification => ({
                    _id: notification._id,
                    type: notification.type, 
                    title: getTitleByType(notification.type),
                    message: notification.message,
                    time: notification.timestamp || notification.createdAt,
                    isRead: notification.isRead || false
                }))
                .sort((a, b) => new Date(b.time) - new Date(a.time));

            setNotifications(myNotifications);

        } catch (error) {
            console.error('❌ Error fetching notifications:', error);
            toast.error(t('parentNotifications.messages.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n._id === id ? { ...n, isRead: true } : n
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        toast.success(t('parentNotifications.messages.markAllSuccess'));
    };

    const filteredNotifications = notifications.filter(n => {
        const matchSearch =
            n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === "all" || n.type === filterType;
        return matchSearch && matchType;
    });

    // Stats calculation
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const readCount = notifications.filter(n => n.isRead).length;
    const alertCount = notifications.filter(n => n.type === 'alert').length;

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded p-5 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">{t('parentNotifications.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen p-6">
            {/* Header Banner - Giống Notifications.jsx nhưng tông xanh */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
                    <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                        <path d="M90 30 C70 30, 60 45, 60 65 L60 95 C60 105, 50 110, 50 120 L130 120 C130 110, 120 105, 120 95 L120 65 C120 45, 110 30, 90 30 Z" fill="white" opacity="0.8" />
                        <ellipse cx="90" cy="120" rx="40" ry="8" fill="white" opacity="0.6" />
                        <circle cx="100" cy="35" r="8" fill="white" opacity="0.9" />
                    </svg>
                </div>

                <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 relative">
                                <Bell className="text-white" size={40} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-blue-600">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    {t('parentNotifications.title')}
                                </h1>
                                <p className="text-blue-100">
                                    {t('parentNotifications.subtitle')}
                                </p>
                            </div>
                        </div>

                        {/* Quick stats for header */}
                        <div className="hidden md:flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">{t('parentNotifications.stats.total')}</div>
                                <div className="text-2xl font-bold text-white">{notifications.length}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">{t('parentNotifications.stats.unread')}</div>
                                <div className="text-2xl font-bold text-white">{unreadCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-wrap flex-1">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-blue-300 transition-colors">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer"
                            >
                                <option value="all">{t('parentNotifications.filter.all')}</option>
                                <option value="alert">{t('parentNotifications.filter.alert')}</option>
                                <option value="info">{t('parentNotifications.filter.info')}</option>
                                <option value="reminder">{t('parentNotifications.filter.reminder')}</option>
                            </select>
                        </div>

                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={t('parentNotifications.filter.searchPlaceholder')}
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            <MailOpen size={20} /> {t('parentNotifications.filter.markAllRead')}
                        </button>
                    )}
                </div>
            </div>

            {/* Statistics Cards - Grid giống Notifications.jsx */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <Bell className="text-blue-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('parentNotifications.stats.total')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('parentNotifications.stats.received')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <AlertCircle className="text-red-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('parentNotifications.stats.alert')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{alertCount}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('parentNotifications.stats.emergency')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <Bell className="text-orange-600" size={24} />
                        </div>
                        <TrendingUp className="text-orange-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('parentNotifications.stats.unread')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('parentNotifications.stats.attention')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('parentNotifications.stats.read')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{readCount}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('parentNotifications.stats.history')}</p>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Bell className="text-blue-600" size={24} />
                        {t('parentNotifications.title')}
                    </h2>

                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                <Bell className="text-gray-400" size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {t('parentNotifications.empty.title')}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {t('parentNotifications.empty.subtitle')}
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterType("all");
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                {t('parentNotifications.filter.all')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotifications.map((notification) => (
                                <ParentNotificationCard
                                    key={notification._id}
                                    notification={notification}
                                    onMarkRead={handleMarkAsRead}
                                    t={t}
                                    language={language}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}