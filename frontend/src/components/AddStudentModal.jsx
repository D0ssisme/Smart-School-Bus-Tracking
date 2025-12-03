//frontend/src/components/AddStudentModal.jsx
import React, { useState, useEffect } from "react";
import { X, UserPlus, User, GraduationCap, Users, Route, MapPin } from "lucide-react";
import { getRoutesByIdApi } from "@/api/routestopApi";
import { useLanguage } from '../contexts/LanguageContext';

function AddStudentModal({ isOpen, onClose, onSubmit, parents, routes }) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: "",
        class: "",
        parentId: "",
        routeId: "",
        pickupStopId: "",
        dropoffStopId: ""
    });
    const [errors, setErrors] = useState({});
    const [routeStops, setRouteStops] = useState([]);
    const [loadingStops, setLoadingStops] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: "",
                class: "",
                parentId: "",
                routeId: "",
                pickupStopId: "",
                dropoffStopId: ""
            });
            setErrors({});
            setRouteStops([]);
        }
    }, [isOpen]);

    // Fetch stops when route changes
    useEffect(() => {
        const fetchRouteStops = async () => {
            if (formData.routeId) {
                try {
                    setLoadingStops(true);
                    const stopsData = await getRoutesByIdApi(formData.routeId);
                    console.log("Stops data:", stopsData);

                    // Transform data để lấy đúng cấu trúc stop_id.name
                    const transformedStops = stopsData.map(routeStop => ({
                        _id: routeStop.stop_id._id,
                        id: routeStop.stop_id._id,
                        name: routeStop.stop_id.name,
                        stop_id: routeStop.stop_id.stop_id,
                        order_number: routeStop.order_number
                    }));

                    // Sắp xếp theo order_number
                    transformedStops.sort((a, b) => a.order_number - b.order_number);

                    setRouteStops(transformedStops);
                } catch (error) {
                    console.error("Error fetching route stops:", error);
                    setRouteStops([]);
                } finally {
                    setLoadingStops(false);
                }
            } else {
                setRouteStops([]);
            }
        };

        fetchRouteStops();
    }, [formData.routeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "routeId") {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                pickupStopId: "",
                dropoffStopId: ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t('addStudent.validation.nameRequired');
        }

        if (!formData.class.trim()) {
            newErrors.class = t('addStudent.validation.gradeRequired');
        }

        if (!formData.parentId) {
            newErrors.parentId = t('addStudent.validation.parentRequired');
        }

        if (!formData.routeId) {
            newErrors.routeId = t('addStudent.validation.routeRequired');
        }

        if (!formData.pickupStopId) {
            newErrors.pickupStopId = t('addStudent.validation.pickupRequired');
        }

        if (!formData.dropoffStopId) {
            newErrors.dropoffStopId = t('addStudent.validation.dropoffRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                            <UserPlus className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{t('addStudent.title')}</h2>
                            <p className="text-cyan-100 text-sm">{t('addStudent.subtitle')}</p>
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
                        {/* Tên học sinh */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <User size={18} className="text-cyan-600" />
                                {t('addStudent.name')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('addStudent.namePlaceholder')}
                                className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                    } rounded-lg outline-none transition-colors bg-gray-50 focus:bg-white`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Lớp */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <GraduationCap size={18} className="text-cyan-600" />
                                {t('addStudent.grade')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                placeholder={t('addStudent.gradePlaceholder')}
                                className={`w-full px-4 py-3 border-2 ${errors.class ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                    } rounded-lg outline-none transition-colors bg-gray-50 focus:bg-white`}
                            />
                            {errors.class && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.class}
                                </p>
                            )}
                        </div>

                        {/* Phụ huynh */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Users size={18} className="text-cyan-600" />
                                {t('addStudent.parent')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    name="parentId"
                                    value={formData.parentId}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.parentId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                        } rounded-lg outline-none transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer`}
                                >
                                    <option value="">{t('addStudent.selectParent')}</option>
                                    {parents.map(parent => (
                                        <option key={parent._id} value={parent._id}>
                                            {parent.name} {parent.phoneNumber ? `- ${parent.phoneNumber}` : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.parentId && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.parentId}
                                </p>
                            )}
                        </div>

                        {/* Tuyến đường */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Route size={18} className="text-cyan-600" />
                                {t('addStudent.route')} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Route className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    name="routeId"
                                    value={formData.routeId}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-4 py-3 border-2 ${errors.routeId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                        } rounded-lg outline-none transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer`}
                                >
                                    <option value="">{t('addStudent.selectRoute')}</option>
                                    {routes.map(route => (
                                        <option key={route._id} value={route._id}>
                                            {route.name} {route.description ? `- ${route.description}` : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.routeId && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span className="font-medium">⚠</span> {errors.routeId}
                                </p>
                            )}
                        </div>

                        {/* Điểm đón */}
                        {formData.routeId && (
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin size={18} className="text-green-600" />
                                    {t('addStudent.pickup')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <select
                                        name="pickupStopId"
                                        value={formData.pickupStopId}
                                        onChange={handleChange}
                                        disabled={loadingStops || routeStops.length === 0}
                                        className={`w-full pl-11 pr-4 py-3 border-2 ${errors.pickupStopId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                            } rounded-lg outline-none transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <option value="">
                                            {loadingStops ? t('addStudent.loadingStops') : routeStops.length === 0 ? t('addStudent.noStops') : t('addStudent.selectPickup')}
                                        </option>
                                        {routeStops.map(stop => (
                                            <option key={stop._id} value={stop._id}>
                                                {stop.order_number}. {stop.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        {loadingStops ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                {errors.pickupStopId && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <span className="font-medium">⚠</span> {errors.pickupStopId}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Điểm trả */}
                        {formData.routeId && (
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin size={18} className="text-red-600" />
                                    {t('addStudent.dropoff')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <select
                                        name="dropoffStopId"
                                        value={formData.dropoffStopId}
                                        onChange={handleChange}
                                        disabled={loadingStops || routeStops.length === 0}
                                        className={`w-full pl-11 pr-4 py-3 border-2 ${errors.dropoffStopId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-cyan-500'
                                            } rounded-lg outline-none transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <option value="">
                                            {loadingStops ? t('addStudent.loadingStops') : routeStops.length === 0 ? t('addStudent.noStops') : t('addStudent.selectDropoff')}
                                        </option>
                                        {routeStops.map(stop => (
                                            <option key={stop._id} value={stop._id}>
                                                {stop.order_number}. {stop.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        {loadingStops ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                {errors.dropoffStopId && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <span className="font-medium">⚠</span> {errors.dropoffStopId}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Info box when route selected */}
                        {formData.routeId && !loadingStops && (
                            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-cyan-600 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-semibold text-cyan-900">{t('addStudent.noteTitle')}</p>
                                        <p className="text-xs text-cyan-700 mt-1">
                                            {routeStops.length > 0
                                                ? t('addStudent.noteContent').replace('{count}', routeStops.length)
                                                : t('addStudent.noteSelect')}
                                        </p>
                                    </div>
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
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <UserPlus size={20} />
                        {t('addStudent.submit')}
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
}

export default AddStudentModal;