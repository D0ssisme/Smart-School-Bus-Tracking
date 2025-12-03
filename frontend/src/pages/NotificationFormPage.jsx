//src/pages/NotificationFormPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ToastService from "@/lib/toastService";
import { mockNotifications } from "@/lib/mockData";
import { useLanguage } from '../contexts/LanguageContext';

function NotificationFormPage() {
    const { t, translateData } = useLanguage();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        type: "",
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
                    type: notification.type,
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
            isEditMode ? t('notificationForm.updating') : t('notificationForm.sending')
        );

        setTimeout(() => {
            ToastService.update(
                loadingToast,
                isEditMode ? t('notificationForm.updateSuccess') : t('notificationForm.sendSuccess'),
                "success"
            );

            const oldLoadingToast = ToastService.loading(
                isEditMode ? "Đang cập nhật thông báo..." : "Đang gửi thông báo..."
            );

            setTimeout(() => {
                ToastService.update(
                    oldLoadingToast,
                    isEditMode ? "Cập nhật thông báo thành công!" : "Gửi thông báo thành công!",
                    "success"
                );

                setTimeout(() => {
                    navigate("/notifications");
                }, 1000);
            }, 1500);
        }, 500);
    };

    const handleCancel = () => {
        navigate("/notifications");
    };

    const allSelected = formData.recipients.driver && formData.recipients.parent;
    const isRouteSelected = formData.route !== "";

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/notifications")}
                    className="mb-4 -ml-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('notificationForm.back')}
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditMode ? t('notificationForm.editTitle') : t('notificationForm.createTitle')}
                </h1>
                <p className="text-gray-600 mt-1">
                    {isEditMode ? t('notificationForm.editSubtitle') : t('notificationForm.createSubtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border p-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('notificationForm.typeLabel')} <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="parent">{t('notificationForm.typeAlert')}</option>
                        <option value="driver">{t('notificationForm.typeInfo')}</option>
                        <option value="manager">{t('notificationForm.typeReminder')}</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('notificationForm.contentLabel')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder={t('notificationForm.contentPlaceholder')}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="border rounded-lg p-5 bg-gray-50">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('notificationForm.routeLabel')} <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="route"
                            value={formData.route}
                            onChange={handleRouteChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">{t('notificationForm.selectRoute')}</option>
                            {routes.map((route) => (
                                <option key={route.id} value={route.id}>
                                    {translateData(route.name)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={`space-y-3 bg-white p-4 rounded-md border ${!isRouteSelected ? 'opacity-50 pointer-events-none' : ''}`}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('notificationForm.recipientsLabel')} <span className="text-red-500">*</span>
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
                                {t('notificationForm.selectAll')}
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
                                    {t('notificationForm.driver')}
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
                                    {t('notificationForm.parent')}
                                </label>
                            </div>
                        </div>

                        {!isRouteSelected && (
                            <p className="text-xs text-amber-600 mt-2 italic">
                                {t('notificationForm.selectRouteFirst')}
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
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-900 hover:bg-blue-700 px-6"
                    >
                        {isEditMode ? t('notificationForm.update') : t('notificationForm.send')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default NotificationFormPage;