import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../components/NotificationCard";
import { getAllNotifications } from "@/api/notificationApi";
import ToastService from "@/lib/toastService";
import { Bell, BellPlus, Filter, Search, TrendingUp, AlertCircle, Info, CheckCircle, Megaphone } from "lucide-react";

function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        const loadingToast = ToastService.loading("Đang tải thông báo...");

        try {
            setLoading(true);
            const data = await getAllNotifications();
            setNotifications(data);
            ToastService.update(loadingToast, "Tải thông báo thành công!", "success");
        } catch (error) {
            console.error('Error fetching notifications:', error);
            ToastService.update(loadingToast, "Không thể tải thông báo. Vui lòng thử lại!", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNotification = async (id) => {
        if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
            const loadingToast = ToastService.loading("Đang xóa thông báo...");

            try {
                // TODO: Gọi API xóa notification
                // await deleteNotificationApi(id);

                setTimeout(() => {
                    setNotifications(notifications.filter(n => n._id !== id));
                    ToastService.update(loadingToast, "Xóa thông báo thành công!", "success");
                }, 1000);
            } catch (error) {
                console.error('Error deleting notification:', error);
                ToastService.update(loadingToast, "Không thể xóa thông báo. Vui lòng thử lại!", "error");
            }
        }
    };

    const handleEditNotification = (notification) => {
        navigate(`/notifications/edit/${notification._id}`);
    };

    const filteredNotifications = notifications.filter(n => {
        const matchSearch =
            n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === "all" || n.type === filterType;
        return matchSearch && matchType;
    });

    // Statistics
    const alertCount = notifications.filter(n => n.type === 'alert').length;
    const infoCount = notifications.filter(n => n.type === 'info').length;
    const successCount = notifications.filter(n => n.type === 'success').length;
    const announcementCount = notifications.filter(n => n.type === 'announcement').length;

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded p-5 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải thông báo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 min-h-screen p-6">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* Bell illustration */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
                    <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                        <path d="M90 30 C70 30, 60 45, 60 65 L60 95 C60 105, 50 110, 50 120 L130 120 C130 110, 120 105, 120 95 L120 65 C120 45, 110 30, 90 30 Z" fill="white" opacity="0.8" />
                        <ellipse cx="90" cy="120" rx="40" ry="8" fill="white" opacity="0.6" />
                        <path d="M90 120 C90 120, 85 130, 85 135 C85 140, 87 142, 90 142 C93 142, 95 140, 95 135 C95 130, 90 120, 90 120 Z" fill="white" opacity="0.8" />
                        <circle cx="100" cy="35" r="8" fill="white" opacity="0.9" />
                        <path d="M100 35 L105 25 L110 30" stroke="white" strokeWidth="3" opacity="0.9" fill="none" />
                    </svg>
                </div>

                <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <Bell className="text-white" size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    Quản lý thông báo
                                </h1>
                                <p className="text-orange-100">
                                    Gửi và theo dõi thông báo đến phụ huynh và tài xế
                                </p>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="hidden md:flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">Tổng số</div>
                                <div className="text-2xl font-bold text-white">{notifications.length}</div>
                            </div>
                            <div className="bg-red-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-red-300/30">
                                <div className="text-red-100 text-xs mb-1">Cảnh báo</div>
                                <div className="text-2xl font-bold text-white">{alertCount}</div>
                            </div>
                            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-yellow-300/30">
                                <div className="text-yellow-100 text-xs mb-1">Thông tin</div>
                                <div className="text-2xl font-bold text-white">{infoCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-wrap flex-1">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-orange-300 transition-colors">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer"
                            >
                                <option value="all">Tất cả loại</option>
                                <option value="alert">Cảnh báo</option>
                                <option value="info">Thông tin</option>
                                <option value="success">Thành công</option>
                                <option value="announcement">Thông báo chung</option>
                            </select>
                        </div>

                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm thông báo..."
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/notifications/create")}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <BellPlus size={20} /> Tạo thông báo
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <Bell className="text-orange-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng thông báo</h3>
                    <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                    <p className="text-xs text-gray-500 mt-2">Đã gửi đi</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <AlertCircle className="text-red-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Cảnh báo</h3>
                    <p className="text-3xl font-bold text-gray-900">{alertCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Thông báo khẩn cấp</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <Info className="text-blue-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Thông tin</h3>
                    <p className="text-3xl font-bold text-gray-900">{infoCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Thông báo thông thường</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Thành công</h3>
                    <p className="text-3xl font-bold text-gray-900">{successCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Hoàn thành tốt</p>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Megaphone className="text-orange-600" size={24} />
                        Danh sách thông báo
                    </h2>

                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                <Bell className="text-gray-400" size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Không tìm thấy thông báo
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterType("all");
                                }}
                                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotifications.map((notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                    onEdit={handleEditNotification}
                                    onDelete={handleDeleteNotification}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notifications;