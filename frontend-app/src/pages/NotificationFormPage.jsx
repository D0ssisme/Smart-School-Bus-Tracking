import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ToastService from "@/lib/toastService";
import { mockNotifications } from "@/lib/mockData";

function NotificationFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        route: "",
        recipients: {
            driver: false,
            parent: false
        }
    });

    const routes = [
        { id: "route2", name: "Tuyến 19 - Bến xe Miền Tây ⇄ ĐHQG" },
        { id: "route3", name: "Tuyến 45 - Bến Thành ⇄ Sân bay TSN" },
    ];

    useEffect(() => {
        if (isEditMode) {
            const notification = mockNotifications.find(n => n.id === parseInt(id));
            if (notification) {
                setFormData({
                    title: notification.title,
                    content: notification.content,
                    route: notification.route || "",
                    recipients: notification.recipients || {
                        driver: notification.recipientType === "driver" || notification.recipientType === "all",
                        parent: notification.recipientType === "parent" || notification.recipientType === "all"
                    }
                });
            }
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRouteChange = (e) => {
        setFormData({
            ...formData,
            route: e.target.value,
            recipients: {
                driver: false,
                parent: false
            }
        });
    };

    const handleRecipientChange = (type) => {
        setFormData({
            ...formData,
            recipients: {
                ...formData.recipients,
                [type]: !formData.recipients[type]
            }
        });
    };

    const handleSelectAll = () => {
        const allSelected = formData.recipients.driver && formData.recipients.parent;
        setFormData({
            ...formData,
            recipients: {
                driver: !allSelected,
                parent: !allSelected
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.route) {
            ToastService.warning("Vui lòng chọn tuyến đường!");
            return;
        }

        if (!formData.recipients.driver && !formData.recipients.parent) {
            ToastService.warning("Vui lòng chọn ít nhất một đối tượng nhận thông báo!");
            return;
        }

        const loadingToast = ToastService.loading(
            isEditMode ? "Đang cập nhật thông báo..." : "Đang gửi thông báo..."
        );

        setTimeout(() => {
            ToastService.update(
                loadingToast,
                isEditMode ? "Cập nhật thông báo thành công!" : "Gửi thông báo thành công!",
                "success"
            );

            setTimeout(() => {
                navigate("/notifications");
            }, 1000);
        }, 1500);
    };

    const handleCancel = () => {
        if (confirm("Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.")) {
            navigate("/notifications");
        }
    };

    const isRouteSelected = !!formData.route;
    const allSelected = formData.recipients.driver && formData.recipients.parent;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/notifications")}
                    className="mb-4 -ml-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditMode ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                </h1>
                <p className="text-gray-600 mt-1">
                    {isEditMode ? "Cập nhật thông tin thông báo" : "Gửi thông báo đến tài xế và phụ huynh"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border p-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Nhập tiêu đề thông báo"
                        className="text-base"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung thông báo <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Nhập nội dung thông báo..."
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="border rounded-lg p-5 bg-gray-50">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thông báo cho tuyến <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="route"
                            value={formData.route}
                            onChange={handleRouteChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">-- Chọn tuyến xe bus --</option>
                            {routes.map((route) => (
                                <option key={route.id} value={route.id}>
                                    {route.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={`space-y-3 bg-white p-4 rounded-md border ${!isRouteSelected ? 'opacity-50 pointer-events-none' : ''}`}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đối tượng nhận thông báo <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center space-x-2 pb-3 border-b">
                            <input
                                id="all"
                                type="checkbox"
                                checked={allSelected}
                                onChange={handleSelectAll}
                                disabled={!isRouteSelected}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="all" className="text-gray-700 font-medium cursor-pointer">
                                Chọn tất cả
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    id="driver"
                                    type="checkbox"
                                    checked={formData.recipients.driver}
                                    onChange={() => handleRecipientChange('driver')}
                                    disabled={!isRouteSelected}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="driver" className="text-gray-700 cursor-pointer">
                                    Tài xế
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="parent"
                                    type="checkbox"
                                    checked={formData.recipients.parent}
                                    onChange={() => handleRecipientChange('parent')}
                                    disabled={!isRouteSelected}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="parent" className="text-gray-700 cursor-pointer">
                                    Phụ huynh
                                </label>
                            </div>
                        </div>

                        {!isRouteSelected && (
                            <p className="text-xs text-amber-600 mt-2 italic">
                                * Vui lòng chọn tuyến đường trước
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-900 hover:bg-blue-700 px-6"
                    >
                        {isEditMode ? "Cập nhật" : "Gửi thông báo"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default NotificationFormPage;