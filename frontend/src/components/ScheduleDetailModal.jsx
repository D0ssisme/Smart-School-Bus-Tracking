import React, { useState, useEffect } from 'react';
import { X, MapPin, Users, Truck, User, Clock, Calendar, Navigation, Phone, AlertCircle } from 'lucide-react';
import BusTrackingMapEnhanced from '@/components/BusTrackingMapEnhanced';

const BusIcon = Truck;

const StudentCard = ({ student }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case "picked":
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">✅ Đã đón</span>;
            case "dropped":
            case "completed":
                return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">✅ Đã trả</span>;
            case "pending":
                return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">⏳ Chờ đón</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">❓ Chưa rõ</span>;
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                        <User className="text-blue-600" size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{student.student_id?.name || 'N/A'}</h4>
                        <p className="text-xs text-gray-500">
                            {student.student_id?.grade || student.student_id?.class || 'N/A'}
                        </p>
                    </div>
                </div>
                {getStatusBadge(student.pickup_status)}
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                    <MapPin className="text-green-600 mt-0.5 flex-shrink-0" size={14} />
                    <div className="flex-1">
                        <p className="text-xs text-gray-600">Điểm đón:</p>
                        <p className="text-gray-900 font-medium">{student.pickup_stop_id?.name || 'Chưa xác định'}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <MapPin className="text-red-600 mt-0.5 flex-shrink-0" size={14} />
                    <div className="flex-1">
                        <p className="text-xs text-gray-600">Điểm trả:</p>
                        <p className="text-gray-900 font-medium">{student.dropoff_stop_id?.name || 'Chưa xác định'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ScheduleDetailModal = ({ isOpen, onClose, schedule }) => {
    const [students, setStudents] = useState([]);
    const [routeStops, setRouteStops] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && schedule) {
            fetchScheduleDetails();
        }
    }, [isOpen, schedule]);

    const fetchScheduleDetails = async () => {
        if (!schedule?.id) return;

        setLoading(true);
        setError(null);

        try {
            console.log('📊 Fetching details for schedule:', schedule.id);

            // Fetch students assigned to this schedule
            const studentsRes = await fetch(
                `http://localhost:8080/api/studentbusassignments/schedule/${schedule.id}`
            );

            if (!studentsRes.ok) {
                throw new Error('Failed to fetch students');
            }

            const studentsData = await studentsRes.json();
            console.log('✅ Students:', studentsData);
            setStudents(studentsData || []);

            // Fetch route information with stops
            if (schedule.routeId) {
                const routeRes = await fetch(
                    `http://localhost:8080/api/route/${schedule.routeId}`
                );

                if (!routeRes.ok) {
                    throw new Error('Failed to fetch route');
                }

                const routeData = await routeRes.json();
                console.log('✅ Route data:', routeData);

                setRouteInfo(routeData);

                if (routeData?.stops && Array.isArray(routeData.stops)) {
                    // Transform stops to match the format expected by BusTrackingMapEnhanced
                    const transformedStops = routeData.stops.map((stopData, index) => {
                        const stopInfo = stopData.stop_id || stopData;
                        return {
                            stop_id: {
                                _id: stopInfo._id,
                                name: stopInfo.name,
                                address: stopInfo.address,
                                location: stopInfo.location
                            },
                            order: stopData.order_number || index + 1,
                            estimated_arrival_time: stopData.estimated_arrival || null
                        };
                    });

                    console.log('✅ Transformed route stops:', transformedStops);
                    setRouteStops(transformedStops);
                }
            }

        } catch (err) {
            console.error('❌ Error fetching schedule details:', err);
            setError('Không thể tải thông tin chi tiết: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 flex items-center justify-between border-b-4 border-blue-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <BusIcon size={28} />
                            Chi tiết lịch trình
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">
                            {schedule?.route} - {schedule?.scheduleId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-3"></div>
                                <p className="text-gray-600">Đang tải thông tin...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <AlertCircle className="text-red-500 mx-auto mb-3" size={48} />
                                <p className="text-red-600 font-semibold">{error}</p>
                                <button
                                    onClick={fetchScheduleDetails}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                            {/* Left Side - Map Section */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Schedule Info Banner */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Calendar className="text-blue-600" size={20} />
                                        Thông tin chuyến đi
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <BusIcon className="text-gray-500" size={18} />
                                            <div>
                                                <p className="text-xs text-gray-600">Xe bus</p>
                                                <p className="font-semibold text-gray-900">{schedule?.busPlate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Navigation className="text-gray-500" size={18} />
                                            <div>
                                                <p className="text-xs text-gray-600">Tuyến đường</p>
                                                <p className="font-semibold text-gray-900">{schedule?.route}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="text-gray-500" size={18} />
                                            <div>
                                                <p className="text-xs text-gray-600">Giờ đi</p>
                                                <p className="font-semibold text-gray-900">{schedule?.startTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="text-gray-500" size={18} />
                                            <div>
                                                <p className="text-xs text-gray-600">Giờ về</p>
                                                <p className="font-semibold text-gray-900">{schedule?.endTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Map with BusTrackingMapEnhanced */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200" style={{ height: '500px' }}>
                                    <BusTrackingMapEnhanced
                                        busLocation={null}
                                        pickupStop={null}
                                        dropoffStop={null}
                                        busInfo={null}
                                        routeStops={routeStops}
                                    />
                                </div>

                                {/* Route Stops List */}
                                {routeStops.length > 0 && (
                                    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <MapPin className="text-blue-600" size={20} />
                                            Các điểm dừng ({routeStops.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {routeStops.map((stop, idx) => {
                                                const stopInfo = stop.stop_id || stop;
                                                return (
                                                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                            {stop.order || idx + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">{stopInfo.name || 'N/A'}</p>
                                                            <p className="text-sm text-gray-600">{stopInfo.address || 'Không có địa chỉ'}</p>
                                                            {stop.estimated_arrival_time && (
                                                                <p className="text-xs text-blue-600 mt-1">
                                                                    ⏰ Dự kiến: {stop.estimated_arrival_time}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Sidebar - Students List */}
                            <div className="lg:col-span-1 space-y-4">
                                {/* Students Summary */}
                                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl shadow-lg p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Users size={24} />
                                        <h3 className="font-bold text-lg">Học sinh</h3>
                                    </div>
                                    <p className="text-3xl font-bold">{students.length}</p>
                                    <p className="text-sm text-purple-100 mt-1">học sinh trong chuyến này</p>
                                </div>

                                {/* Students List */}
                                <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <User className="text-purple-600" size={20} />
                                        Danh sách học sinh
                                    </h3>

                                    {students.length === 0 ? (
                                        <div className="text-center py-8">
                                            <User className="text-gray-300 mx-auto mb-2" size={48} />
                                            <p className="text-gray-500 text-sm">Chưa có học sinh nào</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                            {students.map((student, idx) => (
                                                <StudentCard key={student._id || idx} student={student} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Emergency Contact */}
                                <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl shadow-lg p-4">
                                    <h3 className="font-bold mb-2 flex items-center gap-2">
                                        <Phone size={18} />
                                        Liên hệ khẩn cấp
                                    </h3>
                                    <button className="w-full bg-white text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors text-sm">
                                        📞 Gọi: 1900-1412
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                    >
                        Đóng
                    </button>
                    {schedule?.status === 'scheduled' && (
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all">
                            Bắt đầu chuyến
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleDetailModal;