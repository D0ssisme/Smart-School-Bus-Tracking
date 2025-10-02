import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function NotificationCard({ notification, onEdit, onDelete }) {
    // Map recipient type to Vietnamese label
    const recipientLabels = {
        all: "Tất cả",
        parent: "Phụ huynh",
        driver: "Tài xế",
    };

    // Color coding for recipient types
    const recipientColors = {
        all: "bg-blue-100 text-blue-700",
        parent: "bg-green-100 text-green-700",
        driver: "bg-orange-100 text-orange-700",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                            {notification.title}
                        </h3>
                        <Badge className={recipientColors[notification.recipientType] || recipientColors.all}>
                            {recipientLabels[notification.recipientType] || recipientLabels.all}
                        </Badge>
                    </div>

                    {notification.content && (
                        <p className="text-sm text-gray-700 mb-3">
                            {notification.content}
                        </p>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{notification.sentAt}</span>
                    </div>
                </div>

                <div className="flex gap-2 ml-4">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(notification)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(notification.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Xoá
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NotificationCard;