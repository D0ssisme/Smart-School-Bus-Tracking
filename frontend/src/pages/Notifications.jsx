import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateNotificationModal from '@/components/CreateNotificationModal';
import { getAllNotifications, createNotification, deleteNotification } from "@/api/notificationApi";
import ToastService from "@/lib/toastService";
import { Bell, BellPlus, Filter, Search, TrendingUp, AlertCircle, Info, CheckCircle, Megaphone, Edit2, Trash2, Calendar, Users, X } from "lucide-react";
import Pagination from "@/components/Pagination";
import { useLanguage } from '../contexts/LanguageContext'; // ✅ Import hook
import Swal from 'sweetalert2';

// NotificationCard Component
function NotificationCard({ notification, onEdit, onDelete }) {
    const { t } = useLanguage(); // ✅ Sử dụng hook

    const getTypeStyle = (type) => {
        switch (type) {
            case 'alert':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'success':
                return 'bg-green-50 border-green-200 text-green-700';
            case 'announcement':
                return 'bg-purple-50 border-purple-200 text-purple-700';
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
            case 'success':
                return <CheckCircle size={20} className="text-green-600" />;
            case 'announcement':
                return <Megaphone size={20} className="text-purple-600" />;
            default:
                return <Bell size={20} className="text-gray-600" />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'alert':
                return t('notificationManager.card.type.alert');
            case 'info':
                return t('notificationManager.card.type.info');
            case 'success':
                return t('notificationManager.card.type.success');
            case 'announcement':
                return t('notificationManager.card.type.announcement');
            default:
                return t('notificationManager.card.type.other');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeStyle(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeStyle(notification.type)}`}>
                                {getTypeLabel(notification.type)}
                            </span>
                            {notification.createdAt && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-800 font-medium mb-1">{notification.message}</p>

                        {/* Hiển thị thông tin người nhận */}
                        {notification.receiver_id && (
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <Users size={14} />
                                    <span className="font-medium">{t('notificationManager.card.receiver')}</span>
                                    <span className="text-gray-800">
                                        {notification.receiver_id.name || 'N/A'}
                                    </span>
                                </p>

                                {notification.receiver_id.role && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${notification.receiver_id.role === 'parent'
                                        ? 'bg-blue-100 text-blue-700'
                                        : notification.receiver_id.role === 'driver'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {notification.receiver_id.role === 'parent'
                                            ? t('notificationManager.card.role.parent')
                                            : notification.receiver_id.role === 'driver'
                                                ? t('notificationManager.card.role.driver')
                                                : notification.receiver_id.role === 'admin'
                                                    ? t('notificationManager.card.role.admin')
                                                    : '👤 ' + notification.receiver_id.role
                                        }
                                    </span>
                                )}

                                {notification.receiver_id.phoneNumber && (
                                    <span className="text-xs text-gray-500">
                                        📞 {notification.receiver_id.phoneNumber}
                                    </span>
                                )}
                            </div>
                        )}

                        {notification.recipientCount && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Users size={14} />
                                {t('notificationManager.card.sentTo').replace('{count}', notification.recipientCount)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(notification)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t('notificationManager.card.actions.edit')}
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(notification._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('notificationManager.card.actions.delete')}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Notifications() {
    const { t } = useLanguage(); // ✅ Sử dụng hook
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingNotification, setDeletingNotification] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 20;

    useEffect(() => {
        fetchNotifications();
    }, [t]); // Reload khi đổi ngôn ngữ để cập nhật thông báo toast nếu cần

    const fetchNotifications = async () => {
        // Chỉ hiện loading lần đầu, không hiện khi reload do ngôn ngữ
        // Tuy nhiên ở đây giữ nguyên logic toast như cũ
        const loadingToast = ToastService.loading(t('notificationManager.loading'));

        try {
            setLoading(true);
            const data = await getAllNotifications();
            setNotifications(data);
            ToastService.update(loadingToast, t('notificationManager.messages.loadSuccess'), "success");
        } catch (error) {
            console.error('Error fetching notifications:', error);
            ToastService.update(loadingToast, t('notificationManager.messages.loadError'), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNotification = async (notification) => {
        const notifId = notification._id || notification;

        Swal.fire({
            title: t('notificationManager.swal.deleteTitle'),
            html: `
                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <p style="margin: 0; font-size: 16px;">
                        <strong>📢 ${t('notificationManager.swal.message')}:</strong><br/>
                        ${notification.message || 'N/A'}
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                        <strong>🏷️ ${t('notificationManager.swal.type')}:</strong> ${notification.type || 'N/A'}
                    </p>
                </div>
                <p style="color: #d33; font-weight: bold; margin-top: 16px;">${t('notificationManager.swal.warning')}</p>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: t('notificationManager.swal.btnDelete'),
            cancelButtonText: t('notificationManager.swal.btnCancel'),
            width: 550
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loadingToast = ToastService.loading(t('notificationManager.messages.deleting'));

                try {
                    await deleteNotification(notifId);
                    setNotifications(notifications.filter(n => n._id !== notifId));
                    ToastService.update(loadingToast, t('notificationManager.messages.deleteSuccess'), "success");
                } catch (error) {
                    console.error('Error deleting notification:', error);
                    const errorMsg = error.response?.data?.message || t('notificationManager.messages.deleteError');
                    ToastService.update(loadingToast, errorMsg, "error");
                }
            }
        });
    };

    const handleEditNotification = (notification) => {
        setEditingNotification(notification);
        setIsCreateModalOpen(true);
    };

    const filteredNotifications = notifications.filter(n => {
        const matchSearch =
            n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === "all" || n.type === filterType;
        return matchSearch && matchType;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterType]);

    const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage) || 1;
    const indexOfLast = currentPage * notificationsPerPage;
    const indexOfFirst = indexOfLast - notificationsPerPage;
    const currentNotifications = filteredNotifications.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const alertCount = notifications.filter(n => n.type === 'alert').length;
    const infoCount = notifications.filter(n => n.type === 'info').length;
    const successCount = notifications.filter(n => n.type === 'success').length;
    const announcementCount = notifications.filter(n => n.type === 'announcement').length;

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded p-5 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">{t('notificationManager.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 min-h-screen p-6">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
                    {/* SVG Illustration - giữ nguyên */}
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
                                    {t('notificationManager.title')}
                                </h1>
                                <p className="text-orange-100">
                                    {t('notificationManager.subtitle')}
                                </p>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="hidden md:flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">{t('notificationManager.stats.total')}</div>
                                <div className="text-2xl font-bold text-white">{notifications.length}</div>
                            </div>
                            <div className="bg-red-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-red-300/30">
                                <div className="text-red-100 text-xs mb-1">{t('notificationManager.stats.alert')}</div>
                                <div className="text-2xl font-bold text-white">{alertCount}</div>
                            </div>
                            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-yellow-300/30">
                                <div className="text-yellow-100 text-xs mb-1">{t('notificationManager.stats.info')}</div>
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
                                <option value="all">{t('notificationManager.filter.all')}</option>
                                <option value="alert">{t('notificationManager.filter.alert')}</option>
                                <option value="info">{t('notificationManager.filter.info')}</option>
                                <option value="success">{t('notificationManager.filter.success')}</option>
                                <option value="announcement">{t('notificationManager.filter.announcement')}</option>
                            </select>
                        </div>

                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={t('notificationManager.filter.searchPlaceholder')}
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <BellPlus size={20} /> {t('notificationManager.filter.addBtn')}
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
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('notificationManager.stats.totalNotifications')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('notificationManager.stats.sent')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <AlertCircle className="text-red-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('notificationManager.stats.alert')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{alertCount}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('notificationManager.stats.emergency')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <Info className="text-blue-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('notificationManager.stats.info')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{infoCount}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('notificationManager.stats.normal')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('notificationManager.stats.success')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{successCount}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('notificationManager.stats.completed')}</p>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Megaphone className="text-orange-600" size={24} />
                        {t('notificationManager.list.title')}
                    </h2>

                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                <Bell className="text-gray-400" size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {t('notificationManager.empty.title')}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {t('notificationManager.empty.subtitle')}
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterType("all");
                                }}
                                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                            >
                                {t('notificationManager.filter.clearFilter')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {currentNotifications.map((notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                    onEdit={handleEditNotification}
                                    onDelete={() => handleDeleteNotification(notification)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Phân trang */}
                {filteredNotifications.length > 0 && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {/* Create/Edit Notification Modal */}
            <CreateNotificationModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingNotification(null);
                }}
                editingNotification={editingNotification}
                onNotificationCreated={() => {
                    fetchNotifications();
                    setEditingNotification(null);
                }}
            />

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                    <AlertCircle className="text-white" size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Xác nhận xóa</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeletingNotification(null);
                                }}
                                disabled={isDeleting}
                                className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="text-red-600" size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 text-base leading-relaxed mb-3">
                                        Bạn có chắc chắn muốn xóa thông báo này không?
                                    </p>
                                    {deletingNotification && (
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {deletingNotification.message}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800 flex items-center gap-2">
                                    <AlertCircle size={16} className="flex-shrink-0" />
                                    <span className="font-medium">Cảnh báo:</span> Hành động này không thể hoàn tác!
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeletingNotification(null);
                                }}
                                disabled={isDeleting}
                                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Đang xóa...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={18} />
                                        Xác nhận xóa
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
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
}

export default Notifications;