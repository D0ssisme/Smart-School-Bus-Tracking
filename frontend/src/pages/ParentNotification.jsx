import { useState, useEffect } from "react";
import { Bell, AlertCircle, Info, CheckCircle, Clock, Search, Filter } from "lucide-react";

export default function ParentNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // TODO: Thay bằng API thực
            // const data = await getParentNotificationsApi();
            
            // Mock data cho phụ huynh
            const mockData = [
                {
                    _id: "1",
                    type: "alert",
                    title: "Xe buýt sắp đến",
                    message: "Xe buýt Bus 01 sẽ đến điểm đón của con em bạn trong vòng 5 phút nữa. Vui lòng chuẩn bị sẵn sàng.",
                    time: new Date(Date.now() - 5 * 60000).toISOString(),
                    isRead: false
                },
                {
                    _id: "2",
                    type: "success",
                    title: "Học sinh đã được đón",
                    message: "Con em bạn đã được tài xế Trần Văn B đón an toàn lúc 7:12 AM.",
                    time: new Date(Date.now() - 25 * 60000).toISOString(),
                    isRead: true
                },
                {
                    _id: "3",
                    type: "info",
                    title: "Thay đổi lịch trình",
                    message: "Lịch trình xe buýt ngày mai (08/11) sẽ có thay đổi nhỏ do bảo trì đường. Thời gian đón dự kiến chậm 10 phút.",
                    time: new Date(Date.now() - 60 * 60000).toISOString(),
                    isRead: true
                },
                {
                    _id: "4",
                    type: "alert",
                    title: "Thời tiết xấu",
                    message: "Dự báo mưa to vào buổi chiều. Xe buýt có thể bị chậm trễ. Vui lòng theo dõi thông tin cập nhật.",
                    time: new Date(Date.now() - 2 * 3600000).toISOString(),
                    isRead: false
                },
                {
                    _id: "5",
                    type: "info",
                    title: "Nhắc nhở an toàn",
                    message: "Nhắc nhở học sinh đeo khẩu trang và mang theo nước uống khi đi xe buýt.",
                    time: new Date(Date.now() - 24 * 3600000).toISOString(),
                    isRead: true
                },
                {
                    _id: "6",
                    type: "success",
                    title: "Học sinh đã về nhà",
                    message: "Con em bạn đã được trả an toàn tại điểm trả lúc 5:20 PM.",
                    time: new Date(Date.now() - 26 * 3600000).toISOString(),
                    isRead: true
                }
            ];

            setNotifications(mockData);
        } catch (error) {
            console.error('Error fetching notifications:', error);
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
    };

    const filteredNotifications = notifications.filter(n => {
        const matchSearch = 
            n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === "all" || n.type === filterType;
        return matchSearch && matchType;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getNotificationIcon = (type) => {
        switch(type) {
            case "alert":
                return <AlertCircle className="text-red-600" size={24} />;
            case "success":
                return <CheckCircle className="text-green-600" size={24} />;
            case "info":
            default:
                return <Info className="text-blue-600" size={24} />;
        }
    };

    const getNotificationStyle = (type) => {
        switch(type) {
            case "alert":
                return "border-l-4 border-red-500 bg-red-50";
            case "success":
                return "border-l-4 border-green-500 bg-green-50";
            case "info":
            default:
                return "border-l-4 border-blue-500 bg-blue-50";
        }
    };

    const formatTime = (isoTime) => {
        const date = new Date(isoTime);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Vừa xong";
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays === 1) return "Hôm qua";
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải thông báo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 rounded-2xl shadow-xl overflow-hidden mb-6">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 relative">
                                <Bell className="text-white" size={40} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    Thông báo
                                </h1>
                                <p className="text-blue-100">
                                    Cập nhật mới nhất về lịch trình xe buýt của con em bạn
                                </p>
                            </div>
                        </div>

                        {/* Unread count badge */}
                        {unreadCount > 0 && (
                            <div className="hidden md:block bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">Chưa đọc</div>
                                <div className="text-2xl font-bold text-white">{unreadCount}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-xl shadow-md p-5 mb-6">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-wrap flex-1">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700"
                            >
                                <option value="all">Tất cả</option>
                                <option value="alert">Cảnh báo</option>
                                <option value="info">Thông tin</option>
                                <option value="success">Thành công</option>
                            </select>
                        </div>

                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm thông báo..."
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                            <Bell className="text-gray-400" size={48} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Không có thông báo
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm || filterType !== "all" 
                                ? "Không tìm thấy thông báo phù hợp"
                                : "Bạn chưa có thông báo nào"}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`bg-white rounded-xl shadow-md p-5 transition-all hover:shadow-lg ${
                                !notification.isRead ? "ring-2 ring-blue-200" : ""
                            }`}
                        >
                            <div className="flex gap-4">
                                {/* Icon */}
                                <div className={`flex-shrink-0 rounded-full p-3 ${getNotificationStyle(notification.type)}`}>
                                    {getNotificationIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className={`font-semibold text-gray-800 ${!notification.isRead ? "text-blue-900" : ""}`}>
                                            {notification.title}
                                            {!notification.isRead && (
                                                <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                            )}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                                            <Clock size={14} />
                                            {formatTime(notification.time)}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-3">
                                        {notification.message}
                                    </p>

                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification._id)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            Đánh dấu đã đọc
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Quick Stats Footer */}
            {filteredNotifications.length > 0 && (
                <div className="mt-6 bg-white rounded-xl shadow-md p-4">
                    <div className="flex items-center justify-center gap-8 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            <span className="text-gray-600">
                                {unreadCount} chưa đọc
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-600">
                                {notifications.length - unreadCount} đã đọc
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-gray-400" />
                            <span className="text-gray-600">
                                Tổng {notifications.length} thông báo
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}