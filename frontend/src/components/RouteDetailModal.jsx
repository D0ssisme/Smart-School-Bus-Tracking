//src/components/RouteDetailModal.jsx
import React from 'react';
import { X, RouteIcon, Map, MapPin, Navigation } from 'lucide-react';

const RouteDetailModal = ({ isOpen, onClose, route }) => {
    if (!isOpen || !route) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <RouteIcon size={24} />
                            Chi tiết tuyến xe
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
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <RouteIcon className="text-indigo-600 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Mã tuyến</p>
                            <p className="font-semibold text-gray-800">{route.id}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Map className="text-indigo-600 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Tên tuyến</p>
                            <p className="font-semibold text-gray-800">{route.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <MapPin className="text-green-600 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Điểm bắt đầu</p>
                            <p className="font-semibold text-gray-800">{route.start}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <MapPin className="text-red-600 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Điểm kết thúc</p>
                            <p className="font-semibold text-gray-800">{route.end}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Navigation className="text-blue-600 mt-1" size={20} />
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Số điểm dừng</p>
                            <p className="font-semibold text-gray-800">{route.stops} điểm</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="mt-1">
                            <div className={`w-5 h-5 rounded-full ${route.status === "active" ? "bg-green-500" : "bg-gray-500"}`}></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                            <p className="font-semibold text-gray-800">{route.status === "active" ? "Hoạt động" : "Không hoạt động"}</p>
                        </div>
                    </div>

                    {route.stopsList && route.stopsList.length > 0 && (
                        <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                            <p className="text-sm font-semibold text-gray-800 mb-3">Danh sách điểm dừng:</p>
                            <ul className="space-y-2">
                                {route.stopsList.map((stop, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        {stop}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-3 rounded-lg font-semibold transition-all"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RouteDetailModal;