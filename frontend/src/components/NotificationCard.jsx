// src/components/NotificationCard.jsx
import React from "react";
import { Bell, AlertCircle, Info, CheckCircle, Megaphone, Trash2, Edit, User, Clock, Shield, Car, Users } from "lucide-react";

function NotificationCard({ notification, onEdit, onDelete }) {
    // Map type to icon and color
    const getTypeConfig = (type) => {
        const configs = {
            alert: {
                icon: AlertCircle,
                bgColor: "bg-red-50",
                borderColor: "border-red-200",
                iconColor: "text-red-600",
                iconBg: "bg-red-100",
                badge: "bg-red-100 text-red-700"
            },
            info: {
                icon: Info,
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
                iconColor: "text-blue-600",
                iconBg: "bg-blue-100",
                badge: "bg-blue-100 text-blue-700"
            },
            success: {
                icon: CheckCircle,
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                iconColor: "text-green-600",
                iconBg: "bg-green-100",
                badge: "bg-green-100 text-green-700"
            },
            announcement: {
                icon: Megaphone,
                bgColor: "bg-purple-50",
                borderColor: "border-purple-200",
                iconColor: "text-purple-600",
                iconBg: "bg-purple-100",
                badge: "bg-purple-100 text-purple-700"
            }
        };
        return configs[type] || configs.info;
    };

    // Get role config
    const getRoleConfig = (role) => {
        const configs = {
            parent: {
                label: "Phụ huynh",
                icon: Users,
                color: "text-green-600",
                bgColor: "bg-green-100"
            },
            driver: {
                label: "Tài xế",
                icon: Car,
                color: "text-purple-600",
                bgColor: "bg-purple-100"
            },
            manager: {
                label: "Quản lý",
                icon: Shield,
                color: "text-orange-600",
                bgColor: "bg-orange-100"
            }
        };
        return configs[role] || {
            label: role || "Không xác định",
            icon: User,
            color: "text-gray-600",
            bgColor: "bg-gray-100"
        };
    };

    const config = getTypeConfig(notification.type);
    const IconComponent = config.icon;

    // Format timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get type label in Vietnamese
    const getTypeLabel = (type) => {
        const labels = {
            alert: "Cảnh báo",
            info: "Thông tin",
            success: "Thành công",
            announcement: "Thông báo chung"
        };
        return labels[type] || type;
    };

    const roleConfig = notification.receiver_id?.role ? getRoleConfig(notification.receiver_id.role) : null;
    const RoleIcon = roleConfig?.icon;

    return (
        <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-5 hover:shadow-md transition-all`}>
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`${config.iconBg} rounded-full p-3 flex-shrink-0`}>
                    <IconComponent className={config.iconColor} size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`${config.badge} px-2.5 py-1 rounded-full text-xs font-semibold`}>
                                    {getTypeLabel(notification.type)}
                                </span>
                            </div>
                            <p className="text-gray-900 font-medium text-base leading-relaxed">
                                {notification.message}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => onEdit(notification)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                            >
                                <Edit size={18} className="text-gray-600" />
                            </button>
                            <button
                                onClick={() => onDelete(notification._id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                title="Xóa"
                            >
                                <Trash2 size={18} className="text-red-600" />
                            </button>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mt-3">
                        {/* Receiver with Role */}
                        {notification.receiver_id && (
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-gray-500" />
                                <span className="font-medium">
                                    {notification.receiver_id.name || 'Không xác định'}
                                </span>
                                {roleConfig && (
                                    <span className={`${roleConfig.bgColor} ${roleConfig.color} px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1`}>
                                        <RoleIcon size={12} />
                                        {roleConfig.label}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-gray-500" />
                            <span>{formatDate(notification.timestamp)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificationCard;