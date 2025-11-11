//src/pages/ParentTracking.jsx
import { useEffect, useState } from "react";
import { MapPin, Navigation, Clock, User, Phone, AlertCircle, ChevronDown } from "lucide-react";
import { getStudentsByParent } from "@/api/parentstudentApi";
import { getAllStudentRouteAssignments } from "@/api/studentrouteassignmentApi";
import { getStopsApi } from "@/api/stopApi";
import { toast } from "react-hot-toast";

export default function ParentTracking() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busLocation, setBusLocation] = useState({
    lat: 10.8231,
    lng: 106.6297
  });

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

        console.log(`📍 Pickup stop for ${student.name}:`, pickupStop);
        console.log(`📍 Dropoff stop for ${student.name}:`, dropoffStop);

        return {
          _id: studentId,
          student_id: student.student_id || 'N/A',
          name: student.name || 'Không rõ',
          grade: student.grade,
          class: student.class,

          // ⭐ Thông tin route
          route_id: routeAssignment?.route_id || null,
          route_name: routeAssignment?.route_id?.name ||
            routeAssignment?.route_id?.route_id ||
            'Chưa phân công',

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
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  // Giả lập cập nhật vị trí real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setBusLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "on_way":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">🚌 Đang trên đường</span>;
      case "arrived":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">📍 Đã đến điểm đón</span>;
      case "picked_up":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">✅ Đã đón học sinh</span>;
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
              {/* Map Placeholder */}
              <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-blue-500 rounded-full p-6 inline-block mb-4 animate-pulse">
                    <MapPin className="text-white" size={48} />
                  </div>
                  <p className="text-blue-800 font-semibold text-lg">Bản đồ theo dõi real-time</p>
                  <p className="text-blue-600 text-sm mt-2">
                    Vị trí: {busLocation.lat.toFixed(6)}, {busLocation.lng.toFixed(6)}
                  </p>
                  <p className="text-blue-500 text-xs mt-1">
                    Cập nhật mỗi 3 giây
                  </p>
                </div>

                {/* Bus Icon Animation */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="bg-white rounded-lg shadow-lg p-3 animate-bounce">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                        <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
                        <rect x="6" y="8" width="5" height="4" rx="1" fill="white" />
                        <rect x="13" y="8" width="5" height="4" rx="1" fill="white" />
                        <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="white" />
                        <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="white" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-blue-400 rounded-lg animate-ping opacity-30"></div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Navigation className="animate-pulse" size={24} />
                    <div>
                      <p className="font-semibold">Đang di chuyển đến điểm đón</p>
                      <p className="text-xs text-blue-100">Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">7:15 AM</p>
                    <p className="text-xs text-blue-100">Dự kiến đến</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Alert */}
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <AlertCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-semibold text-green-800">Xe đang đến gần!</p>
                <p className="text-sm text-green-700 mt-1">
                  Xe buýt đang cách điểm đón khoảng 2.5km, dự kiến đến trong 10 phút nữa.
                </p>
              </div>
            </div>
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
                  <p className="text-xs text-gray-500">Chi tiết học sinh và xe</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">Học sinh</label>
                  <p className="font-semibold text-gray-800">{selectedStudent.name}</p>
                </div>

                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">Mã học sinh</label>
                  <p className="font-semibold text-gray-800 font-mono text-sm">{selectedStudent.student_id || 'N/A'}</p>
                </div>

                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">Lớp</label>
                  <p className="font-semibold text-gray-800">{selectedStudent.grade || selectedStudent.class || 'N/A'}</p>
                </div>

                {/* ⭐ HIỂN THỊ TUYẾN ĐƯỜNG */}
                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">Tuyến đường</label>
                  <p className="font-semibold text-gray-800">
                    {selectedStudent.route_name}
                  </p>
                  {selectedStudent.route_id?.route_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      Mã: {selectedStudent.route_id.route_id}
                    </p>
                  )}
                </div>

                {/* ⭐ HIỂN THỊ ĐIỂM ĐÓN */}
                <div className="pb-3 border-b">
                  <label className="text-xs text-gray-500">📍 Điểm đón</label>
                  <p className="font-semibold text-gray-800 text-sm">
                    {selectedStudent.pickup_stop_name}
                  </p>
                  {selectedStudent.pickup_stop_address && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedStudent.pickup_stop_address}
                    </p>
                  )}
                </div>

                {/* ⭐ HIỂN THỊ ĐIỂM TRẢ */}
                <div>
                  <label className="text-xs text-gray-500">📍 Điểm trả</label>
                  <p className="font-semibold text-gray-800 text-sm">
                    {selectedStudent.dropoff_stop_name}
                  </p>
                  {selectedStudent.dropoff_stop_address && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedStudent.dropoff_stop_address}
                    </p>
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
                  <span className="text-sm text-gray-700">Trạng thái</span>
                  {getStatusBadge(selectedStudent.status || 'on_way')}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Thời gian dự kiến</span>
                  <span className="font-bold text-gray-800">7:15 AM</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Khoảng cách</span>
                  <span className="font-bold text-green-800">~2.5 km</span>
                </div>
              </div>

              {/* Student Stats */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Hoạt động gần đây</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Trạng thái hoạt động</span>
                    <span className={`px-2 py-1 rounded-full font-semibold ${selectedStudent.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {selectedStudent.active ? 'Đang hoạt động' : 'Tạm ngưng'}
                    </span>
                  </div>
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