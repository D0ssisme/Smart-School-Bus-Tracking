import { useEffect, useState } from "react";
import { MapPin, Navigation, Clock, User, Phone, AlertCircle, ChevronDown } from "lucide-react";
import { getStudentsByParent } from "@/api/parentstudentApi";
import { getAllStudentRouteAssignments } from "@/api/studentrouteassignmentApi";
import { getStopsApi } from "@/api/stopApi";
import { useSocket } from "@/contexts/SocketContext";
import BusTrackingMap from "@/components/BusTrackingMap";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ParentTracking() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busLocation, setBusLocation] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [studentStatus, setStudentStatus] = useState(null);
  const { socket } = useSocket();

  // Lấy thông tin parent đang đăng nhập
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const parentId = currentUser._id || currentUser.id;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      // 1. Lấy danh sách học sinh của parent
      const studentsData = await getStudentsByParent(parentId);
      console.log("👨‍👩‍👧‍👦 Students of parent:", studentsData);

      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // 2. Lấy route assignments và stops song song
      const [routeAssignments, allStops] = await Promise.all([
        getAllStudentRouteAssignments(),
        getStopsApi()
      ]);

      console.log("🚏 Route assignments:", routeAssignments);
      console.log("📍 All stops:", allStops);

      // 3. Transform data - kết hợp thông tin
      const transformedStudents = studentsData.map(item => {
        const student = item.student_id || item;
        const studentId = student._id || student;

        // Tìm route assignment của student này
        const routeAssignment = routeAssignments.find(ra => {
          const raStudentId = ra.student_id?._id || ra.student_id;
          return raStudentId?.toString() === studentId?.toString();
        });

        console.log(`🔍 Route assignment for ${student.name}:`, routeAssignment);

        // Lấy thông tin stops
        let pickupStop = null;
        let dropoffStop = null;

        if (routeAssignment) {
          const pickupStopId = routeAssignment.pickup_stop_id?._id || routeAssignment.pickup_stop_id;
          const dropoffStopId = routeAssignment.dropoff_stop_id?._id || routeAssignment.dropoff_stop_id;

          pickupStop = allStops.find(stop =>
            (stop._id?.toString() === pickupStopId?.toString())
          );
          dropoffStop = allStops.find(stop =>
            (stop._id?.toString() === dropoffStopId?.toString())
          );
        }

        return {
          _id: studentId,
          student_id: student.student_id || 'N/A',
          name: student.name || 'Không rõ',
          grade: student.grade,
          class: student.class,

          // ⭐ Thông tin route
          route_id: routeAssignment?.route_id?._id || routeAssignment?.route_id,
          route_name: routeAssignment?.route_id?.name || 'Chưa phân công',

          // ⭐ Thông tin pickup stop
          pickup_stop_id: pickupStop?._id,
          pickup_stop_name: pickupStop?.name || 'Chưa xác định',
          pickup_stop_address: pickupStop?.address || '',
          pickup_stop_location: pickupStop?.location,

          // ⭐ Thông tin dropoff stop
          dropoff_stop_id: dropoffStop?._id,
          dropoff_stop_name: dropoffStop?.name || 'Chưa xác định',
          dropoff_stop_address: dropoffStop?.address || '',
          dropoff_stop_location: dropoffStop?.location,

          active: routeAssignment?.active !== false,
          status: 'on_way',

          // Lưu assignment để dùng sau
          routeAssignment: routeAssignment
        };
      });

      console.log("✅ Transformed students:", transformedStudents);

      setStudents(transformedStudents);
      if (transformedStudents.length > 0) {
        setSelectedStudent(transformedStudents[0]);
      }

    } catch (error) {
      console.error('❌ Error fetching students:', error);
      toast.error('Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch bus location khi chọn học sinh
  useEffect(() => {
    if (selectedStudent?.route_id) {
      fetchBusInfoByRoute(selectedStudent.route_id);
      fetchStudentStatus(selectedStudent._id);
    }
  }, [selectedStudent]);

  // Lấy thông tin xe bus theo route
  const fetchBusInfoByRoute = async (routeId) => {
    try {
      // 1. Tìm schedule đang active cho route này
      const scheduleRes = await axios.get(`http://localhost:8080/api/busschedule/by-route/${routeId}`);
      const schedule = scheduleRes.data;

      if (!schedule) {
        console.log('⚠️ No active schedule for this route');
        return;
      }

      setBusInfo(schedule);

      // 2. Lấy vị trí xe bus
      const busId = schedule.bus_id?._id || schedule.bus_id;
      const locationRes = await axios.get(`http://localhost:8080/api/bus-locations/${busId}`);

      setBusLocation(locationRes.data);
      console.log('📍 Bus location loaded:', locationRes.data);

    } catch (error) {
      console.error('❌ Error fetching bus info:', error);
      toast.error('Không thể tải thông tin xe bus');
    }
  };

  // Lấy trạng thái học sinh
  const fetchStudentStatus = async (studentId) => {
    try {
      // Tìm assignment của học sinh
      const res = await axios.get(`http://localhost:8080/api/studentbusassignments/student/${studentId}`);
      setStudentStatus(res.data);
      console.log('👨‍🎓 Student status:', res.data);
    } catch (error) {
      console.error('Error fetching student status:', error);
    }
  };

  // 🔥 Listen realtime bus location updates
  useEffect(() => {
    if (!socket || !busInfo?.bus_id) return;

    const busId = busInfo.bus_id._id || busInfo.bus_id;

    const handleLocationUpdate = (data) => {
      console.log('🚌 Location update:', data);
      setBusLocation(prev => ({
        ...prev,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp
      }));

      // Refresh student status khi xe di chuyển
      if (selectedStudent?._id) {
        fetchStudentStatus(selectedStudent._id);
      }
    };

    socket.on(`bus_location_${busId}`, handleLocationUpdate);

    return () => {
      socket.off(`bus_location_${busId}`, handleLocationUpdate);
    };
  }, [socket, busInfo, selectedStudent]);

  // Tính khoảng cách đến điểm đón
  const calculateDistance = () => {
    if (!busLocation || !selectedStudent?.pickup_stop_location) return null;

    const R = 6371; // Bán kính trái đất (km)
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

  const distance = calculateDistance();
  const estimatedTime = distance ? Math.ceil(distance / 0.4 * 60) : null; // 24km/h = 0.4km/min

  const getStatusBadge = (status) => {
    switch (status) {
      case "picked":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">✅ Đã đón học sinh</span>;
      case "dropped":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">📍 Đã trả học sinh</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">🚌 Đang trên đường</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">⏸️ Chưa có thông tin</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
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
            Chưa có học sinh nào
          </h3>
          <p className="text-gray-500">
            Bạn chưa có học sinh nào được đăng ký trong hệ thống
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header with Student Selector */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📍 Theo dõi học sinh
        </h1>
        <p className="text-gray-600 mb-4">Xem vị trí xe buýt theo thời gian thực</p>

        {/* Student Selector */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Chọn học sinh để theo dõi:
          </label>
          <div className="relative">
            <select
              value={selectedStudent?._id || ''}
              onChange={(e) => {
                const student = students.find(s => s._id === e.target.value);
                setSelectedStudent(student);
              }}
              className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500 appearance-none cursor-pointer bg-gray-50 hover:bg-white transition-colors font-medium text-gray-800"
            >
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.grade || student.class || 'N/A'}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Bạn có {students.length} học sinh trong hệ thống
          </p>
        </div>
      </div>

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Real Leaflet Map */}
              <div className="h-96">
                <BusTrackingMap
                  busLocation={busLocation}
                  pickupStop={selectedStudent?.pickup_stop_location ? {
                    _id: selectedStudent.pickup_stop_id,
                    name: selectedStudent.pickup_stop_name,
                    address: selectedStudent.pickup_stop_address,
                    location: selectedStudent.pickup_stop_location
                  } : null}
                  dropoffStop={selectedStudent?.dropoff_stop_location ? {
                    _id: selectedStudent.dropoff_stop_id,
                    name: selectedStudent.dropoff_stop_name,
                    address: selectedStudent.dropoff_stop_address,
                    location: selectedStudent.dropoff_stop_location
                  } : null}
                  busInfo={busInfo}
                />
              </div>

              {/* Status Bar - Realtime */}
              {busLocation && (
                <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-semibold">🔴 LIVE - Theo dõi trực tiếp</p>
                        <p className="text-xs text-green-100">
                          Cập nhật: {new Date(busLocation.timestamp).toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">LIVE</p>
                      <p className="text-xs text-green-100">Realtime</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Distance Info */}
            {distance !== null && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-600 font-medium mb-1">Khoảng cách đến điểm đón</p>
                    <p className="text-3xl font-bold text-blue-800">{distance.toFixed(2)} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600 font-medium mb-1">Thời gian dự kiến</p>
                    <p className="text-3xl font-bold text-blue-800">~{estimatedTime} phút</p>
                  </div>
                </div>
              </div>
            )}

            {/* Alert based on distance */}
            {distance !== null && distance < 1 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <AlertCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Xe sắp đến rồi!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Xe buýt đang rất gần điểm đón, vui lòng chuẩn bị.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Student Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Thông tin học sinh</h3>
                  <p className="text-xs text-gray-500">Chi tiết học sinh và tuyến</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">Học sinh</label>
                  <p className="font-semibold text-gray-800">{selectedStudent.name}</p>
                </div>

                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">Mã học sinh</label>
                  <p className="font-semibold text-gray-800 font-mono text-sm">{selectedStudent.student_id}</p>
                </div>

                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">Lớp</label>
                  <p className="font-semibold text-gray-800">{selectedStudent.grade || selectedStudent.class || 'N/A'}</p>
                </div>

                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">Tuyến đường</label>
                  <p className="font-semibold text-gray-800">{selectedStudent.route_name}</p>
                </div>

                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">📍 Điểm đón</label>
                  <p className="font-semibold text-gray-800 text-sm">{selectedStudent.pickup_stop_name}</p>
                  {selectedStudent.pickup_stop_address && (
                    <p className="text-xs text-gray-500 mt-1">{selectedStudent.pickup_stop_address}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500">📍 Điểm trả</label>
                  <p className="font-semibold text-gray-800 text-sm">{selectedStudent.dropoff_stop_name}</p>
                  {selectedStudent.dropoff_stop_address && (
                    <p className="text-xs text-gray-500 mt-1">{selectedStudent.dropoff_stop_address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-blue-600" size={20} />
                Trạng thái hiện tại
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Trạng thái đón</span>
                  {getStatusBadge(studentStatus?.pickup_status || 'pending')}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Trạng thái trả</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${studentStatus?.dropoff_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {studentStatus?.dropoff_status === 'completed' ? '✅ Hoàn thành' : '⏳ Chưa hoàn thành'}
                  </span>
                </div>

                {distance !== null && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Khoảng cách</span>
                    <span className="font-bold text-green-800">~{distance.toFixed(2)} km</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Trạng thái tuyến</span>
                  <span className={`px-2 py-1 rounded-full font-semibold ${selectedStudent.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {selectedStudent.active ? 'Đang hoạt động' : 'Tạm ngưng'}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-md p-6 border border-red-200">
              <h3 className="font-bold text-red-800 mb-2">🚨 Liên hệ khẩn cấp</h3>
              <p className="text-sm text-red-700 mb-3">
                Gặp sự cố hoặc cần hỗ trợ?
              </p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Phone size={18} />
                Hotline: 1900-xxxx
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}