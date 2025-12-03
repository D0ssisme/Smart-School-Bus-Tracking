import { useEffect, useState } from "react";
import { MapPin, Navigation, Clock, User, Phone, AlertCircle, ChevronDown, Bus } from "lucide-react";
import { getStudentsByParent } from "@/api/parentstudentApi";
import { getAllStudentRouteAssignments } from "@/api/studentrouteassignmentApi";
import { getStopsApi } from "@/api/stopApi";
import { useSocket } from "@/contexts/SocketContext";
import BusTrackingMapEnhanced from "@/components/BusTrackingMapEnhanced";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLanguage } from '@/contexts/LanguageContext'; // ✅ Import hook

export default function ParentTracking() {
  const { t, language } = useLanguage(); // ✅ Sử dụng hook
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busLocation, setBusLocation] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [studentStatus, setStudentStatus] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [allStops, setAllStops] = useState([]);
  const { socket } = useSocket();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const parentId = currentUser._id || currentUser.id;

  useEffect(() => {
    fetchStudents();
  }, [t]); // Reload khi đổi ngôn ngữ để cập nhật text mặc định nếu cần

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await getStudentsByParent(parentId);

      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const [routeAssignments, stopsData] = await Promise.all([
        getAllStudentRouteAssignments(),
        getStopsApi()
      ]);

      setAllStops(stopsData);

      const transformedStudents = studentsData.map(item => {
        const student = item.student_id || item;
        const studentId = student._id || student;

        const routeAssignment = routeAssignments.find(ra => {
          const raStudentId = ra.student_id?._id || ra.student_id;
          return raStudentId?.toString() === studentId?.toString();
        });

        let pickupStop = null;
        let dropoffStop = null;

        if (routeAssignment) {
          const pickupStopId = routeAssignment.pickup_stop_id?._id || routeAssignment.pickup_stop_id;
          const dropoffStopId = routeAssignment.dropoff_stop_id?._id || routeAssignment.dropoff_stop_id;

          pickupStop = stopsData.find(stop =>
            (stop._id?.toString() === pickupStopId?.toString())
          );
          dropoffStop = stopsData.find(stop =>
            (stop._id?.toString() === dropoffStopId?.toString())
          );
        }

        return {
          _id: studentId,
          student_id: student.student_id || t('parentTracking.defaults.na'),
          name: student.name || t('parentTracking.defaults.unknown'),
          grade: student.grade,
          class: student.class,
          route_id: routeAssignment?.route_id?._id || routeAssignment?.route_id,
          route_name: routeAssignment?.route_id?.name || t('parentTracking.defaults.unassigned'),
          route_full: routeAssignment?.route_id,
          pickup_stop_id: pickupStop?._id,
          pickup_stop_name: pickupStop?.name || t('parentTracking.defaults.undefined'),
          pickup_stop_address: pickupStop?.address || '',
          pickup_stop_location: pickupStop?.location,
          dropoff_stop_id: dropoffStop?._id,
          dropoff_stop_name: dropoffStop?.name || t('parentTracking.defaults.undefined'),
          dropoff_stop_address: dropoffStop?.address || '',
          dropoff_stop_location: dropoffStop?.location,
          active: routeAssignment?.active !== false,
          status: 'on_way',
          routeAssignment: routeAssignment
        };
      });

      setStudents(transformedStudents);
      if (transformedStudents.length > 0) {
        // Giữ nguyên student đang chọn nếu có, hoặc chọn người đầu tiên
        setSelectedStudent(prev => prev ? transformedStudents.find(s => s._id === prev._id) || transformedStudents[0] : transformedStudents[0]);
      }

    } catch (error) {
      console.error('❌ Error fetching students:', error);
      toast.error(t('parentTracking.messages.errorFetch'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      buildRouteStops(selectedStudent);

      if (selectedStudent.route_id) {
        fetchBusInfoByRoute(selectedStudent.route_id);
      }

      if (selectedStudent._id) {
        fetchStudentStatus(selectedStudent._id);
      }
    }
  }, [selectedStudent, allStops]);

  const buildRouteStops = async (student) => {
    if (student.route_full?.stops && Array.isArray(student.route_full.stops)) {
      setRouteStops(student.route_full.stops);
      return;
    }

    if (student.route_id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/route/${student.route_id}`);

        if (response.data && response.data.stops && response.data.stops.length > 0) {
          const transformedStops = response.data.stops.map((stopData, index) => {
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

          setRouteStops(transformedStops);
          return;
        }
      } catch (error) {
        console.log('⚠️ API fetch failed:', error.message);
      }
    }

    if (student.pickup_stop_id && student.dropoff_stop_id) {
      const pickupStopData = allStops.find(s => s._id?.toString() === student.pickup_stop_id?.toString());
      const dropoffStopData = allStops.find(s => s._id?.toString() === student.dropoff_stop_id?.toString());

      if (pickupStopData && dropoffStopData) {
        const constructedStops = [
          { stop_id: pickupStopData, order: 1, estimated_arrival_time: null },
          { stop_id: dropoffStopData, order: 2, estimated_arrival_time: null }
        ];

        setRouteStops(constructedStops);
        return;
      }
    }
  };

  const fetchBusInfoByRoute = async (routeId) => {
    try {
      const scheduleRes = await axios.get(`http://localhost:8080/api/busschedule/by-route/${routeId}`);
      const schedule = scheduleRes.data;

      if (!schedule) return;

      setBusInfo(schedule);

      const busId = schedule.bus_id?._id || schedule.bus_id;
      const locationRes = await axios.get(`http://localhost:8080/api/bus-locations/${busId}`);
      setBusLocation(locationRes.data);

    } catch (error) {
      console.log('ℹ️ Bus info not available:', error.message);
    }
  };

  const fetchStudentStatus = async (studentId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/studentbusassignments/student/${studentId}`);
      setStudentStatus(res.data);
    } catch (error) {
      console.log('ℹ️ No student assignment found');
    }
  };

  useEffect(() => {
    if (!socket || !busInfo?.bus_id) return;

    const busId = busInfo.bus_id._id || busInfo.bus_id;
    socket.emit('subscribe_bus', busId);

    const handleLocationUpdate = (data) => {
      setBusLocation({
        bus_id: data.bus_id,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp,
        schedule_id: data.schedule_id,
        current_stop_index: data.current_stop_index
      });

      if (selectedStudent?._id) {
        fetchStudentStatus(selectedStudent._id);
      }
    };

    socket.on('bus_location_update', handleLocationUpdate);

    return () => {
      socket.off('bus_location_update', handleLocationUpdate);
      socket.emit('unsubscribe_bus', busId);
    };
  }, [socket, busInfo, selectedStudent]);

  // Calculations
  const calculateDistanceToPickup = () => {
    if (!busLocation || !selectedStudent?.pickup_stop_location) return null;
    const R = 6371;
    const lat1 = busLocation.latitude;
    const lon1 = busLocation.longitude;
    const lat2 = selectedStudent.pickup_stop_location.coordinates[1];
    const lon2 = selectedStudent.pickup_stop_location.coordinates[0];
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calculateDistanceToDropoff = () => {
    if (!busLocation || !selectedStudent?.dropoff_stop_location) return null;
    const R = 6371;
    const lat1 = busLocation.latitude;
    const lon1 = busLocation.longitude;
    const lat2 = selectedStudent.dropoff_stop_location.coordinates[1];
    const lon2 = selectedStudent.dropoff_stop_location.coordinates[0];
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const distanceToPickup = calculateDistanceToPickup();
  const distanceToDropoff = calculateDistanceToDropoff();

  // Tính thời gian dự kiến (giả định xe bus chạy trung bình 30 km/h = 0.5 km/phút)
  // Công thức: thời gian (phút) = khoảng cách (km) / tốc độ (km/phút)
  const averageSpeed = 0.5; // 30 km/h = 0.5 km/phút
  const estimatedTimeToPickup = distanceToPickup ? Math.ceil(distanceToPickup / averageSpeed) : null;
  const estimatedTimeToDropoff = distanceToDropoff ? Math.ceil(distanceToDropoff / averageSpeed) : null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "picked":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">{t('parentTracking.status.picked')}</span>;
      case "dropped":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">{t('parentTracking.status.dropped')}</span>;
      case "completed":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">✅ Hoàn thành</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">{t('parentTracking.status.pending')}</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{t('parentTracking.status.unknown')} ({status})</span>;
    }
  }; if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('parentTracking.loading')}</p>
        </div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto mt-20">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <User className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t('parentTracking.empty.title')}
          </h3>
          <p className="text-gray-500">
            {t('parentTracking.empty.desc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b shadow-sm px-4 py-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="text-blue-600" size={24} />
          {t('parentTracking.title')}
        </h1>
      </div>

      <div className="p-4">
        {selectedStudent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Hiển thị cảnh báo nếu học sinh chưa có lịch trình */}
              {!busInfo && !busLocation && (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-yellow-300">
                  <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-yellow-600" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Chưa có lịch trình hôm nay
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>{selectedStudent.name}</strong> chưa có lịch trình xe buýt trong ngày hôm nay.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 text-left rounded">
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                      <strong>📌 Lý do có thể:</strong>
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Chưa được phân công vào lịch trình xe buýt</li>
                      <li>Lịch trình hôm nay đã hoàn thành</li>
                      <li>Xe buýt chưa bắt đầu chuyến đi</li>
                    </ul>
                  </div>
                  <div className="mt-6 flex gap-3 justify-center">
                    <button
                      onClick={fetchStudents}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                      <Navigation size={18} />
                      Làm mới
                    </button>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold transition-colors"
                      onClick={() => toast.info('Vui lòng liên hệ nhà trường để biết thêm thông tin')}
                    >
                      Liên hệ trường
                    </button>
                  </div>
                </div>
              )}

              {busLocation && (
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="font-semibold text-sm">{t('parentTracking.live')}</span>
                  </div>
                  <span className="text-xs">
                    {new Date(busLocation.timestamp).toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US')}
                  </span>
                </div>
              )}

              {(busInfo || busLocation) && (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full" style={{ height: '60vh' }}>
                  <BusTrackingMapEnhanced
                    busLocation={busLocation}
                    pickupStop={selectedStudent?.pickup_stop_location && selectedStudent?.pickup_stop_id ? {
                      _id: selectedStudent.pickup_stop_id,
                      name: selectedStudent.pickup_stop_name,
                      address: selectedStudent.pickup_stop_address,
                      location: selectedStudent.pickup_stop_location
                    } : null}
                    dropoffStop={selectedStudent?.dropoff_stop_location && selectedStudent?.dropoff_stop_id ? {
                      _id: selectedStudent.dropoff_stop_id,
                      name: selectedStudent.dropoff_stop_name,
                      address: selectedStudent.dropoff_stop_address,
                      location: selectedStudent.dropoff_stop_location
                    } : null}
                    busInfo={busInfo}
                    routeStops={routeStops}
                  />
                </div>
              )}

              {/* ✅ Distance & Time Cards - CẢ ĐIỂM ĐÓN VÀ ĐIỂM TRẢ */}
              <div className="grid grid-cols-2 gap-4">
                {/* Điểm đón */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-green-700 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Điểm đón
                  </h3>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">Khoảng cách</p>
                    <p className="text-xl font-bold text-green-800">
                      {distanceToPickup !== null ? `${distanceToPickup.toFixed(2)} km` : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">Thời gian dự kiến</p>
                    <p className="text-xl font-bold text-green-800">
                      {estimatedTimeToPickup !== null ? `~${estimatedTimeToPickup} phút` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Điểm trả */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-red-700 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Điểm trả
                  </h3>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-3">
                    <p className="text-xs text-red-600 font-medium mb-1">Khoảng cách</p>
                    <p className="text-xl font-bold text-red-800">
                      {distanceToDropoff !== null ? `${distanceToDropoff.toFixed(2)} km` : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-lg p-3">
                    <p className="text-xs text-red-600 font-medium mb-1">Thời gian dự kiến</p>
                    <p className="text-xl font-bold text-red-800">
                      {estimatedTimeToDropoff !== null ? `~${estimatedTimeToDropoff} phút` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Alert - Điểm đón */}
              {distanceToPickup !== null && distanceToPickup < 0.5 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <AlertCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-lg">⚡ Xe sắp đến điểm đón!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Xe buýt đang rất gần điểm đón. Vui lòng chuẩn bị sẵn sàng.
                    </p>
                  </div>
                </div>
              )}

              {/* Alert - Điểm trả */}
              {distanceToDropoff !== null && distanceToDropoff < 0.5 && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-orange-500 rounded-full p-2">
                    <AlertCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-orange-800 text-lg">🏫 Con sắp về đến!</p>
                    <p className="text-sm text-orange-700 mt-1">
                      Xe buýt sắp đến điểm trả. Con sắp về đến nhà.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg shadow-xl p-5 border-2 border-indigo-400">
                <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <User className="text-white" size={18} />
                  {t('parentTracking.selectStudent')}
                </label>
                <div className="relative">
                  <select
                    value={selectedStudent?._id || ''}
                    onChange={(e) => {
                      const student = students.find(s => s._id === e.target.value);
                      setSelectedStudent(student);
                    }}
                    className="w-full px-4 py-3 pr-10 border-2 border-white rounded-lg outline-none focus:ring-4 focus:ring-yellow-300 appearance-none cursor-pointer bg-white hover:bg-gray-50 transition-all font-bold text-gray-800 shadow-md"
                  >
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.grade || student.class || t('parentTracking.defaults.na')}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" size={20} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-5 border-2 border-slate-600">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-600">
                  <div className="bg-blue-500 rounded-full p-2">
                    <User className="text-white" size={20} />
                  </div>
                  <h3 className="font-bold text-white text-lg">{t('parentTracking.studentInfo')}</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <label className="text-xs text-blue-300 uppercase font-semibold">{t('parentTracking.labels.student')}</label>
                    <p className="font-bold text-white text-lg mt-1">{selectedStudent.name}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <label className="text-xs text-blue-300 uppercase font-semibold">{t('parentTracking.labels.grade')}</label>
                    <p className="font-bold text-white text-base mt-1">{selectedStudent.grade || selectedStudent.class || t('parentTracking.defaults.na')}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <label className="text-xs text-blue-300 uppercase font-semibold">{t('parentTracking.labels.route')}</label>
                    <p className="font-bold text-white text-base mt-1">{selectedStudent.route_name}</p>
                  </div>

                  <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border-2 border-green-400">
                    <label className="text-xs text-green-300 uppercase font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      {t('parentTracking.labels.pickup')}
                    </label>
                    <p className="font-bold text-white text-sm mt-1">{selectedStudent.pickup_stop_name}</p>
                  </div>

                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-3 border-2 border-red-400">
                    <label className="text-xs text-red-300 uppercase font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      {t('parentTracking.labels.dropoff')}
                    </label>
                    <p className="font-bold text-white text-sm mt-1">{selectedStudent.dropoff_stop_name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-gray-200">
                  <Clock className="text-blue-600" size={20} />
                  <h3 className="font-bold text-gray-800">{t('parentTracking.labels.status')}</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-700">{t('parentTracking.labels.pickupStatus')}</span>
                    {getStatusBadge(studentStatus?.pickup_status || 'pending')}
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-700">{t('parentTracking.labels.dropoffStatus')}</span>
                    {getStatusBadge(studentStatus?.dropoff_status || 'pending')}
                  </div>
                </div>
              </div>

              {busInfo && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bus size={20} />
                    <h3 className="font-bold">{t('parentTracking.busInfo')}</h3>
                  </div>
                  <p className="text-lg font-bold mb-1">{busInfo.bus_id?.license_plate}</p>
                  {busInfo.driver_id && (
                    <p className="text-sm opacity-90">👨‍✈️ {busInfo.driver_id.name}</p>
                  )}
                </div>
              )}

              <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-lg shadow-lg p-4">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  {t('parentTracking.emergency')}
                </h3>
                <button className="w-full bg-white text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors">
                  {t('parentTracking.call')}: 1900-1412
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}