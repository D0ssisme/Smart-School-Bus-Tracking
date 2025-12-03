import React, { useState, useEffect } from 'react';
import { X, Save, User, BookOpen, Users, MapPin } from 'lucide-react';
import { getRoutesByIdApi } from "@/api/routestopApi";

const EditStudentModal = ({ isOpen, onClose, onSubmit, student, parents, routes }) => {
    const [formData, setFormData] = useState({
        name: '',
        class: '',
        parentId: '',
        routeId: '',
        pickupStopId: '',
        dropoffStopId: ''
    });

    const [stops, setStops] = useState([]);
    const [loadingStops, setLoadingStops] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (student && isOpen) {
            setFormData({
                name: student.HoTen || '',
                class: student.Lop || '',
                parentId: student.parent_id || '',
                routeId: student.routeId || '',
                pickupStopId: student.pickupStopId || '',
                dropoffStopId: student.dropoffStopId || ''
            });

            // Load stops nếu đã có route
            if (student.routeId) {
                fetchStops(student.routeId);
            }

            setErrors({});
        }
    }, [student, isOpen]);

    const fetchStops = async (routeId) => {
        if (!routeId) return;

        try {
            setLoadingStops(true);
            const response = await getRoutesByIdApi(routeId);
            // Response is array of RouteStop objects with populated stop_id
            const stopsList = response.map(rs => rs.stop_id).filter(Boolean);
            setStops(stopsList);
        } catch (error) {
            console.error('Error fetching stops:', error);
            setStops([]);
        } finally {
            setLoadingStops(false);
        }
    };

    const handleRouteChange = async (routeId) => {
        setFormData(prev => ({
            ...prev,
            routeId,
            pickupStopId: '',
            dropoffStopId: ''
        }));

        if (routeId) {
            await fetchStops(routeId);
        } else {
            setStops([]);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên học sinh';
        if (!formData.class.trim()) newErrors.class = 'Vui lòng nhập lớp';
        if (!formData.parentId) newErrors.parentId = 'Vui lòng chọn phụ huynh';
        if (!formData.routeId) newErrors.routeId = 'Vui lòng chọn tuyến đường';
        if (!formData.pickupStopId) newErrors.pickupStopId = 'Vui lòng chọn điểm đón';
        if (!formData.dropoffStopId) newErrors.dropoffStopId = 'Vui lòng chọn điểm trả';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        onSubmit(formData);
    };

    if (!isOpen) return null;

    const selectedParent = parents.find(p => p._id === formData.parentId);
    const selectedRoute = routes.find(r => r._id === formData.routeId);
    const selectedPickupStop = stops.find(s => s._id === formData.pickupStopId);
    const selectedDropoffStop = stops.find(s => s._id === formData.dropoffStopId);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                            <User className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Chỉnh sửa thông tin học sinh</h2>
                            <p className="text-cyan-100 text-sm">Cập nhật thông tin học sinh {student?.MaHS}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2 transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Thông tin không đổi */}
                    <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                        <h3 className="text-sm font-semibold text-blue-900 mb-3">📋 Thông tin hiện tại</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-blue-700 font-medium">Mã học sinh</label>
                                <div className="mt-1 text-sm font-semibold text-gray-800">{student?.MaHS}</div>
                            </div>
                            <div>
                                <label className="text-xs text-blue-700 font-medium">Mã phụ huynh</label>
                                <div className="mt-1 text-sm font-semibold text-gray-800">{student?.MaPhuHuynh}</div>
                            </div>
                        </div>
                    </div>

                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tên học sinh */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <User size={18} className="text-cyan-600" />
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, name: e.target.value }));
                                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập họ và tên học sinh"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">⚠️ {errors.name}</p>}
                        </div>

                        {/* Lớp */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <BookOpen size={18} className="text-cyan-600" />
                                Lớp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.class}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, class: e.target.value }));
                                    if (errors.class) setErrors(prev => ({ ...prev, class: '' }));
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.class ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="VD: Lớp 1A, 2B, 3C..."
                            />
                            {errors.class && <p className="mt-1 text-sm text-red-600">⚠️ {errors.class}</p>}
                        </div>

                        {/* Phụ huynh */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Users size={18} className="text-cyan-600" />
                                Phụ huynh <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.parentId}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, parentId: e.target.value }));
                                    if (errors.parentId) setErrors(prev => ({ ...prev, parentId: '' }));
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.parentId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">-- Chọn phụ huynh --</option>
                                {parents.map(parent => (
                                    <option key={parent._id} value={parent._id}>
                                        👤 {parent.name} ({parent.userId})
                                    </option>
                                ))}
                            </select>
                            {errors.parentId && <p className="mt-1 text-sm text-red-600">⚠️ {errors.parentId}</p>}
                        </div>

                        {/* Tuyến đường */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={18} className="text-cyan-600" />
                                Tuyến đường <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.routeId}
                                onChange={(e) => {
                                    handleRouteChange(e.target.value);
                                    if (errors.routeId) setErrors(prev => ({ ...prev, routeId: '' }));
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.routeId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">-- Chọn tuyến đường --</option>
                                {routes.map(route => (
                                    <option key={route._id} value={route._id}>
                                        🛣️ {route.name}
                                    </option>
                                ))}
                            </select>
                            {errors.routeId && <p className="mt-1 text-sm text-red-600">⚠️ {errors.routeId}</p>}
                        </div>

                        {/* Điểm đón */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📍 Điểm đón <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.pickupStopId}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, pickupStopId: e.target.value }));
                                    if (errors.pickupStopId) setErrors(prev => ({ ...prev, pickupStopId: '' }));
                                }}
                                disabled={!formData.routeId || loadingStops}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.pickupStopId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">-- Chọn điểm đón --</option>
                                {stops.map(stop => (
                                    <option key={stop._id} value={stop._id}>
                                        📍 {stop.name}
                                    </option>
                                ))}
                            </select>
                            {errors.pickupStopId && <p className="mt-1 text-sm text-red-600">⚠️ {errors.pickupStopId}</p>}
                        </div>

                        {/* Điểm trả */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📍 Điểm trả <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.dropoffStopId}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, dropoffStopId: e.target.value }));
                                    if (errors.dropoffStopId) setErrors(prev => ({ ...prev, dropoffStopId: '' }));
                                }}
                                disabled={!formData.routeId || loadingStops}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.dropoffStopId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">-- Chọn điểm trả --</option>
                                {stops.map(stop => (
                                    <option key={stop._id} value={stop._id}>
                                        📍 {stop.name}
                                    </option>
                                ))}
                            </select>
                            {errors.dropoffStopId && <p className="mt-1 text-sm text-red-600">⚠️ {errors.dropoffStopId}</p>}
                        </div>
                    </div>

                    {/* Tóm tắt thay đổi */}
                    {student && (
                        <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
                            <h3 className="text-sm font-semibold text-amber-900 mb-2">🔄 So sánh thay đổi:</h3>
                            <div className="space-y-2 text-sm">
                                {formData.name !== student.HoTen && (
                                    <div className="flex items-center gap-2 text-amber-800">
                                        <span>👤 Tên:</span>
                                        <span className="line-through">{student.HoTen}</span>
                                        <span>→</span>
                                        <span className="font-semibold">{formData.name}</span>
                                    </div>
                                )}
                                {formData.class !== student.Lop && (
                                    <div className="flex items-center gap-2 text-amber-800">
                                        <span>📚 Lớp:</span>
                                        <span className="line-through">{student.Lop}</span>
                                        <span>→</span>
                                        <span className="font-semibold">{formData.class}</span>
                                    </div>
                                )}
                                {formData.routeId !== student.routeId && selectedRoute && (
                                    <div className="flex items-center gap-2 text-amber-800">
                                        <span>🛣️ Tuyến:</span>
                                        <span className="line-through">{student.routeName}</span>
                                        <span>→</span>
                                        <span className="font-semibold">{selectedRoute.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <Save size={18} />
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditStudentModal;