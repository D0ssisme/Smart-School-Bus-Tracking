import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, User, Phone, Lock, MapPin, CreditCard, UserCircle } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        phoneNumber: '',
        role: 'parent',
        // Driver fields
        licenseNumber: '',
        // Parent fields
        address: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Chuẩn bị data theo role
            const payload = {
                name: formData.name,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                role: formData.role
            };

            // Thêm thông tin theo role
            if (formData.role === 'driver') {
                payload.driverInfo = {
                    licenseNumber: formData.licenseNumber
                };
            } else if (formData.role === 'parent') {
                payload.parentInfo = {
                    address: formData.address
                };
            }

            await onSave(payload);

            // Reset form
            setFormData({
                name: '',
                password: '',
                phoneNumber: '',
                role: 'parent',
                licenseNumber: '',
                address: ''
            });

            onClose();
        } catch (err) {
            console.error("Error creating user:", err);
            setError(err.response?.data?.message || "Không thể tạo người dùng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <Dialog.Title className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Thêm người dùng mới
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </Dialog.Title>

                                {error && (
                                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Họ tên */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <User size={16} className="text-gray-400" />
                                            </span>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nhập họ tên"
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Số điện thoại */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Phone size={16} className="text-gray-400" />
                                            </span>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                required
                                                placeholder="0912345678"
                                                pattern="[0-9]{10}"
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Mật khẩu */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mật khẩu <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Lock size={16} className="text-gray-400" />
                                            </span>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength={6}
                                                placeholder="Tối thiểu 6 ký tự"
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Vai trò */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Vai trò <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <UserCircle size={16} className="text-gray-400" />
                                            </span>
                                            <select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                                            >
                                                <option value="parent">Phụ huynh</option>
                                                <option value="driver">Tài xế</option>
                                                <option value="admin">Quản trị viên</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Thông tin tài xế */}
                                    {formData.role === 'driver' && (
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Số giấy phép lái xe
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <CreditCard size={16} className="text-gray-400" />
                                                </span>
                                                <input
                                                    type="text"
                                                    name="licenseNumber"
                                                    value={formData.licenseNumber}
                                                    onChange={handleChange}
                                                    placeholder="VD: B2-12345678"
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Thông tin phụ huynh */}
                                    {formData.role === 'parent' && (
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Địa chỉ
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <MapPin size={16} className="text-gray-400" />
                                                </span>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="Nhập địa chỉ"
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Đang tạo...' : 'Tạo người dùng'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default AddUserModal;