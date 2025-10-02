import React, { useState } from "react";
import NotificationCard from "../components/NotificationCard";
import NotificationForm from "../components/NotificationForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockNotifications } from "@/lib/mockData";

function Notifications() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddNotification = (newNotification) => {
        const notification = {
            ...newNotification,
            id: crypto.randomUUID(),
            sentAt: new Date().toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }),
            status: "sent"
        };
        setNotifications([notification, ...notifications]);
        setIsFormOpen(false);
    };

    const handleEditNotification = (updatedNotification) => {
        setNotifications(notifications.map(n =>
            n.id === updatedNotification.id ? updatedNotification : n
        ));
        setIsFormOpen(false);
        setEditingNotification(null);
    };

    const handleDeleteNotification = (id) => {
        if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
            setNotifications(notifications.filter(n => n.id !== id));
        }
    };

    const openEditForm = (notification) => {
        setEditingNotification(notification);
        setIsFormOpen(true);
    };

    const filteredNotifications = notifications.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Thông báo
                </h1>

                <div className="flex gap-4 items-center">
                    <Input
                        placeholder="Tìm kiếm thông báo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                    <Button
                        onClick={() => {
                            setEditingNotification(null);
                            setIsFormOpen(true);
                        }}
                        className="ml-auto bg-blue-600 hover:bg-blue-700"
                    >
                        + TẠO THÔNG BÁO
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Không tìm thấy thông báo nào
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onEdit={openEditForm}
                            onDelete={handleDeleteNotification}
                        />
                    ))
                )}
            </div>

            <NotificationForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingNotification(null);
                }}
                onSubmit={editingNotification ? handleEditNotification : handleAddNotification}
                editingNotification={editingNotification}
            />
        </div>
    );
}

export default Notifications;
