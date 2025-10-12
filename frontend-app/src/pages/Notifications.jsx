import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../components/NotificationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockNotifications } from "@/lib/mockData";
import ToastService from "@/lib/toastService";

function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(mockNotifications);
    const [searchTerm, setSearchTerm] = useState("");


    const handleDeleteNotification = (id) => {
        if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
            const loadingToast = ToastService.loading("Đang xóa thông báo...");

            setTimeout(() => {
                setNotifications(notifications.filter(n => n.id !== id));
                ToastService.update(loadingToast, "Xóa thông báo thành công!", "success");
            }, 1000);
        }
    };

    const handleEditNotification = (notification) => {
        navigate(`/notifications/edit/${notification.id}`);
    };

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex gap-4 items-center">
                    <Input
                        placeholder="Tìm kiếm thông báo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                    <Button
                        onClick={() => navigate("/notifications/create")}
                        className="ml-auto bg-blue-900 hover:bg-blue-700"
                    >
                        + TẠO THÔNG BÁO
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg">Không tìm thấy thông báo nào</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onEdit={handleEditNotification}
                            onDelete={handleDeleteNotification}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;