//src/components/RouteEditModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Edit, Save } from 'lucide-react';

const RouteEditModal = ({ isOpen, onClose, route, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        start: '',
        end: '',
        stops: 0,
        status: 'active'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (route && isOpen) {
            setFormData({
                name: route.name || '',
                start: route.start || '',
                end: route.end || '',
                stops: route.stops || 0,
                status: route.status || 'active'
            });
            setErrors({});
        }
    }, [route, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên tuyến';
        if (!formData.start.trim()) newErrors.start = 'Vui lòng nhập điểm bắt đầu';
        if (!formData.end.trim()) newErrors.end = 'Vui lòng nhập điểm kết thúc';
        if (formData.stops < 2) newErrors.stops = 'Số điểm dừng phải ít nhất 2';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        onSave(formData);
    };

    if (!isOpen || !route) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Edit size={24} />
                            Sửa thông tin tuyến
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tên tuyến <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value });
                                if (errors.name) setErrors({ ...errors, name: '' });
                            }}
                            placeholder="Nhập tên tuyến"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">⚠️ {errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Điểm bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.start ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.start}
                            onChange={(e) => {
                                setFormData({ ...formData, start: e.target.value });
                                if (errors.start) setErrors({ ...errors, start: '' });
                            }}
                            placeholder="Nhập điểm bắt đầu"
                        />
                        {errors.start && <p className="mt-1 text-sm text-red-600">⚠️ {errors.start}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Điểm kết thúc <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.end ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.end}
                            onChange={(e) => {
                                setFormData({ ...formData, end: e.target.value });
                                if (errors.end) setErrors({ ...errors, end: '' });
                            }}
                            placeholder="Nhập điểm kết thúc"
                        />
                        {errors.end && <p className="mt-1 text-sm text-red-600">⚠️ {errors.end}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Số điểm dừng <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="2"
                            className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.stops ? 'border-red-500' : 'border-gray-300'
                                }`}
                            value={formData.stops}
                            onChange={(e) => {
                                setFormData({ ...formData, stops: Number(e.target.value) });
                                if (errors.stops) setErrors({ ...errors, stops: '' });
                            }}
                            placeholder="Nhập số điểm dừng"
                        />
                        {errors.stops && <p className="mt-1 text-sm text-red-600">⚠️ {errors.stops}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                    >
                        <Save size={18} />
                        Lưu thay đổi
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RouteEditModal;