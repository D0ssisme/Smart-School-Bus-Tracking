import React, { useState, useEffect } from "react";
import { X, BellPlus, User, MessageSquare, AlertCircle, Edit2 } from "lucide-react";
import { getAllUsersApi, getDriversApi, getParentsApi } from "@/api/userApi";
import { createNotification, updateNotification } from "@/api/notificationApi";
import { toast } from "react-hot-toast";
import { useLanguage } from '../contexts/LanguageContext';

const CreateNotificationModal = ({ isOpen, onClose, onNotificationCreated, editingNotification }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        receiver_id: "",
        message: "",
        type: "info"
    });
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && editingNotification) {
            // Load data khi edit
            setFormData({
                receiver_id: editingNotification.receiver_id?._id || editingNotification.receiver_id || "",
                message: editingNotification.message || "",
                type: editingNotification.type || "info"
            });
        } else if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                receiver_id: "",
                message: "",
                type: "info"
            });
            setErrors({});
        }
    }, [isOpen, editingNotification]);

    const fetchUsers = async () => {
        try {
            setFetchingUsers(true);
            // Gọi API lấy drivers và parents riêng biệt
            const [drivers, parents] = await Promise.all([
                getDriversApi(),
                getParentsApi()
            ]);
            // Gộp 2 mảng lại
            const allUsers = [...drivers, ...parents];
            setUsers(allUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setFetchingUsers(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.receiver_id) {
            newErrors.receiver_id = "Vui lòng chọn người nhận";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Vui lòng nhập nội dung thông báo";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Nội dung thông báo phải có ít nhất 10 ký tự";
        }

        if (!formData.type) {
            newErrors.type = "Vui lòng chọn loại thông báo";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const isEditing = !!editingNotification;
        const loadingToast = toast.loading(isEditing ? t('createNotification.updating') : t('createNotification.creating'));
        setLoading(true);

        try {
            if (isEditing) {
                await updateNotification(editingNotification._id, formData);
                toast.success(t('createNotification.updateSuccess'), {
                    id: loadingToast
                });
            } else {
                await createNotification(formData);
                toast.success(t('createNotification.createSuccess'), {
                    id: loadingToast
                });
            }

            // Callback để refresh danh sách
            if (onNotificationCreated) {
                onNotificationCreated();
            }

            // Close modal
            onClose();

        } catch (error) {
            console.error(isEditing ? "Error updating notification:" : "Error creating notification:", error);
            const errorMessage = error.response?.data?.message || (isEditing ? "Không thể cập nhật thông báo. Vui lòng thử lại!" : "Không thể tạo thông báo. Vui lòng thử lại!");
            toast.error(errorMessage, {
                id: loadingToast
            });
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'alert':
                return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' };
            case 'info':
                return { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' };
            case 'reminder':
                return { icon: BellPlus, color: 'text-orange-600', bg: 'bg-orange-100' };
            default:
                return { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' };
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                            {editingNotification ? <Edit2 className="text-white" size={24} /> : <BellPlus className="text-white" size={24} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {editingNotification ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                            </h2>
                            <p className="text-orange-100 text-sm">
                                {editingNotification ? "Cập nhật thông tin thông báo" : "Gửi thông báo đến người dùng"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    <div className="space-y-5">
                        {/* Người nhận */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <User size={18} className="text-orange-600" />
                                Người nhận <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    name="receiver_id"
                                    value={formData.receiver_id}
                                    onChange={handleChange}
                                    disabled={fetchingUsers}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.receiver_id ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                        } rounded-lg outline-none transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer disabled:opacity-50`}
                                >
                                    <option value="">
                                        {fetchingUsers ? t('createNotification.loading') : t('createNotification.selectReceiver')}
                                    </option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} - {user.role === 'parent' ? t('createNotification.roleParent') : user.role === 'driver' ? t('createNotification.roleDriver') : user.role === 'admin' ? t('createNotification.roleAdmin') : t('createNotification.roleAdmin')}
                                            {user.phoneNumber ? ` (${user.phoneNumber})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    {fetchingUsers ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {errors.receiver_id && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.receiver_id}
                                </p>
                            )}
                        </div>

                        {/* Loại thông báo */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <AlertCircle size={18} className="text-orange-600" />
                                Loại thông báo <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'info', label: 'Thông tin', desc: 'Thông báo chung' },
                                    { value: 'alert', label: 'Cảnh báo', desc: 'Quan trọng' },
                                    { value: 'reminder', label: 'Nhắc nhở', desc: 'Lời nhắc' }
                                ].map((type) => {
                                    const { icon: Icon, color, bg } = getTypeIcon(type.value);
                                    const isSelected = formData.type === type.value;
                                    return (
                                        <label
                                            key={type.value}
                                            className={`relative flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-orange-300 bg-white'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type.value}
                                                checked={isSelected}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className={`${bg} ${isSelected ? 'scale-110' : ''} rounded-full p-2 mb-2 transition-transform`}>
                                                <Icon className={color} size={24} />
                                            </div>
                                            <span className={`text-sm font-semibold ${isSelected ? 'text-orange-600' : 'text-gray-700'}`}>
                                                {type.label}
                                            </span>
                                            <span className="text-xs text-gray-500 mt-1">{type.desc}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.type && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.type}
                                </p>
                            )}
                        </div>

                        {/* Nội dung thông báo */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <MessageSquare size={18} className="text-orange-600" />
                                Nội dung thông báo <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Nhập nội dung thông báo..."
                                rows={5}
                                className={`w-full px-4 py-3 border-2 ${errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                                    } rounded-lg outline-none transition-colors bg-gray-50 focus:bg-white resize-none`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <div>
                                    {errors.message && (
                                        <p className="text-red-500 text-xs flex items-center gap-1">
                                            <span className="font-medium">⚠</span> {errors.message}
                                        </p>
                                    )}
                                </div>
                                <span className={`text-xs ${formData.message.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {formData.message.length} ký tự
                                </span>
                            </div>
                        </div>

                        {/* Preview Box */}
                        {formData.message && (
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    Xem trước thông báo
                                </p>
                                <div className="bg-white rounded-lg p-3 border border-orange-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        {(() => {
                                            const { icon: Icon, color, bg } = getTypeIcon(formData.type);
                                            return (
                                                <div className={`${bg} rounded-full p-1.5`}>
                                                    <Icon className={color} size={16} />
                                                </div>
                                            );
                                        })()}
                                        <span className="text-xs font-semibold text-gray-600 uppercase">
                                            {formData.type === 'info' ? 'Thông tin' : formData.type === 'alert' ? 'Cảnh báo' : 'Nhắc nhở'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.message}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                {editingNotification ? "Đang cập nhật..." : "Đang gửi..."}
                            </>
                        ) : (
                            <>
                                {editingNotification ? <Edit2 size={20} /> : <BellPlus size={20} />}
                                {editingNotification ? "Cập nhật" : "Tạo thông báo"}
                            </>
                        )}
                    </button>
                </div>
            </div>

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
            `}</style>
        </div>
    );
};

export default CreateNotificationModal;