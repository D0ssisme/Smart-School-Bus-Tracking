import { useEffect, useState } from "react";
import { MapPin, Navigation, Clock, User, Phone, AlertCircle, ChevronDown, Bus } from "lucide-react";
import { getStudentsByParent } from "@/api/parentstudentApi";
import { getAllStudentRouteAssignments } from "@/api/studentrouteassignmentApi";
import { getStopsApi } from "@/api/stopApi";
import { useSocket } from "@/contexts/SocketContext";
import BusTrackingMapEnhanced from "@/components/BusTrackingMapEnhanced";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ParentTracking() {
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
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await getStudentsByParent(parentId);
      console.log("👨‍👩‍👧‍👦 Students of parent:", studentsData);

      if (!studentsData || studentsData.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const [routeAssignments, stopsData] = await Promise.all([
        getAllStudentRouteAssignments(),
        getStopsApi()
      ]);

      console.log("🚏 Route assignments:", routeAssignments);
      console.log("📍 All stops:", stopsData);

      setAllStops(stopsData);

      const transformedStudents = studentsData.map(item => {
        const student = item.student_id || item;
        const studentId = student._id || student;

        const routeAssignment = routeAssignments.find(ra => {
          const raStudentId = ra.student_id?._id || ra.student_id;
          return raStudentId?.toString() === studentId?.toString();
        });

        console.log(`🔍 Route assignment for ${student.name}:`, routeAssignment);

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

          console.log(`  📍 Pickup stop (${pickupStopId}):`, pickupStop);
          console.log(`  📍 Dropoff stop (${dropoffStopId}):`, dropoffStop);
        }

        return {
          _id: studentId,
          student_id: student.student_id || 'N/A',
          name: student.name || 'Không rõ',
          grade: student.grade,
          class: student.class,
          route_id: routeAssignment?.route_id?._id || routeAssignment?.route_id,
          route_name: routeAssignment?.route_id?.name || 'Chưa phân công',
          route_full: routeAssignment?.route_id,
          pickup_stop_id: pickupStop?._id,
          pickup_stop_name: pickupStop?.name || 'Chưa xác định',
          pickup_stop_address: pickupStop?.address || '',
          pickup_stop_location: pickupStop?.location,
          dropoff_stop_id: dropoffStop?._id,
          dropoff_stop_name: dropoffStop?.name || 'Chưa xác định',
          dropoff_stop_address: dropoffStop?.address || '',
          dropoff_stop_location: dropoffStop?.location,
          active: routeAssignment?.active !== false,
          status: 'on_way',
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

  useEffect(() => {
    if (selectedStudent) {
      console.log('🎯 Selected student changed:', selectedStudent);
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
    console.log('🏗️ Building route stops for student:', student.name);

    if (student.route_full?.stops && Array.isArray(student.route_full.stops)) {
      console.log('✅ Using stops from route_full:', student.route_full.stops);
      setRouteStops(student.route_full.stops);
      return;
    }

    if (student.route_id) {
      console.log('📡 Fetching route stops from API:', student.route_id);
      try {
        const response = await axios.get(`http://localhost:8080/api/route/${student.route_id}`);
        console.log('📦 Full API Response:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.stops && response.data.stops.length > 0) {
          console.log(`📊 Found ${response.data.stops.length} stops in API response`);

          const transformedStops = response.data.stops.map((stopData, index) => {
            console.log(`🔍 Processing stop ${index + 1}:`, stopData);

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

          console.log('✅ Transformed stops from API:', transformedStops);
          setRouteStops(transformedStops);
          return;
        } else {
          console.log('⚠️ API response has no stops or empty stops array');
        }
      } catch (error) {
        console.log('⚠️ API fetch failed, using fallback:', error.message);
        console.log('Error details:', error.response?.data || error);
      }
    }

    if (student.pickup_stop_id && student.dropoff_stop_id) {
      console.log('🔨 Building route from pickup & dropoff stops');

      const pickupStopData = allStops.find(s => s._id?.toString() === student.pickup_stop_id?.toString());
      const dropoffStopData = allStops.find(s => s._id?.toString() === student.dropoff_stop_id?.toString());

      if (pickupStopData && dropoffStopData) {
        const constructedStops = [
          {
            stop_id: pickupStopData,
            order: 1,
            estimated_arrival_time: null
          },
          {
            stop_id: dropoffStopData,
            order: 2,
            estimated_arrival_time: null
          }
        ];

        console.log('✅ Constructed route stops:', constructedStops);
        setRouteStops(constructedStops);
        return;
      }
    }

    console.log('🔍 Using all assignments fallback');
    buildRouteStopsFromAllAssignments(student.route_id);
  };

  const buildRouteStopsFromAllAssignments = async (routeId) => {
    try {
      const allAssignments = await getAllStudentRouteAssignments();

      const sameRouteAssignments = allAssignments.filter(assignment => {
        const assignmentRouteId = assignment.route_id?._id || assignment.route_id;
        return assignmentRouteId?.toString() === routeId?.toString();
      });

      console.log(`📦 Found ${sameRouteAssignments.length} assignments for this route`);

      if (sameRouteAssignments.length === 0) {
        setRouteStops([]);
        return;
      }

      const uniqueStopsMap = new Map();

      sameRouteAssignments.forEach(assignment => {
        const pickupStopId = assignment.pickup_stop_id?._id || assignment.pickup_stop_id;
        const dropoffStopId = assignment.dropoff_stop_id?._id || assignment.dropoff_stop_id;

        if (pickupStopId) {
          const stopData = allStops.find(s => s._id?.toString() === pickupStopId?.toString());
          if (stopData && !uniqueStopsMap.has(pickupStopId.toString())) {
            uniqueStopsMap.set(pickupStopId.toString(), stopData);
          }
        }

        if (dropoffStopId) {
          const stopData = allStops.find(s => s._id?.toString() === dropoffStopId?.toString());
          if (stopData && !uniqueStopsMap.has(dropoffStopId.toString())) {
            uniqueStopsMap.set(dropoffStopId.toString(), stopData);
          }
        }
      });

      const constructedStops = Array.from(uniqueStopsMap.values()).map((stop, index) => ({
        stop_id: stop,
        order: index + 1,
        estimated_arrival_time: null
      }));

      console.log(`✅ Built ${constructedStops.length} unique stops from assignments:`, constructedStops);
      setRouteStops(constructedStops);

    } catch (error) {
      console.error('❌ Error building route stops:', error);
      setRouteStops([]);
    }
  };

  const fetchBusInfoByRoute = async (routeId) => {
    try {
      console.log(`🚌 Fetching bus info for route: ${routeId}`);
      const scheduleRes = await axios.get(`http://localhost:8080/api/busschedule/by-route/${routeId}`);
      const schedule = scheduleRes.data;

      if (!schedule) {
        console.log('⚠️ No active schedule for this route');
        return;
      }

      console.log('✅ Schedule found:', schedule);
      setBusInfo(schedule);

      const busId = schedule.bus_id?._id || schedule.bus_id;
      console.log(`📍 Fetching location for bus: ${busId}`);

      const locationRes = await axios.get(`http://localhost:8080/api/bus-locations/${busId}`);
      console.log('✅ Bus location:', locationRes.data);

      setBusLocation(locationRes.data);

    } catch (error) {
      console.log('ℹ️ Bus info not available:', error.message);
    }
  };

  const fetchStudentStatus = async (studentId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/studentbusassignments/student/${studentId}`);
      setStudentStatus(res.data);
      console.log('👨‍🎓 Student status:', res.data);
    } catch (error) {
      console.log('ℹ️ No student assignment found');
    }
  };

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

      if (selectedStudent?._id) {
        fetchStudentStatus(selectedStudent._id);
      }
    };

    socket.on(`bus_location_${busId}`, handleLocationUpdate);

    return () => {
      socket.off(`bus_location_${busId}`, handleLocationUpdate);
    };
  }, [socket, busInfo, selectedStudent]);

  const calculateDistance = () => {
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

  const distance = calculateDistance();
  const estimatedTime = distance ? Math.ceil(distance / 0.4 * 60) : null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "picked":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">✅ Đã đón</span>;
      case "dropped":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">📍 Đã trả</span>;
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">🚌 Đang đi</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">⏸️ Chưa rõ</span>;
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-4 py-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="text-blue-600" size={24} />
          Theo dõi xe buýt học sinh 
        </h1>
      </div>

      <div className="p-4">
        {selectedStudent && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Side - Map Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Live Status Banner */}
              {busLocation && (
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="font-semibold text-sm">🔴 LIVE - Đang theo dõi</span>
                  </div>
                  <span className="text-xs">
                    {new Date(busLocation.timestamp).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
              )}

              {/* Debug Info */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 text-xs">
                <p className="font-bold text-blue-800 mb-1">ℹ️ Thông tin tuyến:</p>
                <p>• Số điểm dừng: <span className="font-bold">{routeStops?.length || 0}</span></p>
                <p>• Vị trí xe bus: <span className="font-bold">{busLocation ? '✅ Đang hoạt động' : '❌ Chưa khởi hành'}</span></p>
                <p>• Điểm đón: <span className="font-bold">{selectedStudent?.pickup_stop_name}</span></p>
                <p>• Điểm trả: <span className="font-bold">{selectedStudent?.dropoff_stop_name}</span></p>
              </div>

              {/* Map Container */}
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

              {/* Distance & Time Cards */}
              {distance !== null && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-600 font-medium mb-1">Khoảng cách</p>
                    <p className="text-2xl font-bold text-blue-800">{distance.toFixed(2)} km</p>
                    <p className="text-xs text-blue-600 mt-1">đến điểm đón</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-lg p-4">
                    <p className="text-xs text-purple-600 font-medium mb-1">Thời gian dự kiến</p>
                    <p className="text-2xl font-bold text-purple-800">~{estimatedTime} phút</p>
                    <p className="text-xs text-purple-600 mt-1">sẽ đến điểm đón</p>
                  </div>
                </div>
              )}

              {/* Alert */}
              {distance !== null && distance < 1 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <AlertCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-lg">⚡ Xe sắp đến rồi!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Xe buýt đang rất gần điểm đón. Vui lòng chuẩn bị sẵn sàng.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Student Selection & Info */}
            <div className="lg:col-span-1 space-y-4">
              {/* Student Selector */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg shadow-xl p-5 border-2 border-indigo-400">
                <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <User className="text-white" size={18} />
                  Chọn học sinh theo dõi:
                </label>
                <div className="relative">
                  <select
                    value={selectedStudent?._id || ''}
                    onChange={(e) => {
                      const student = students.find(s => s._id === e.target.value);
                      console.log('👤 Student selected:', student);
                      setSelectedStudent(student);
                    }}
                    className="w-full px-4 py-3 pr-10 border-2 border-white rounded-lg outline-none focus:ring-4 focus:ring-yellow-300 appearance-none cursor-pointer bg-white hover:bg-gray-50 transition-all font-bold text-gray-800 shadow-md"
                  >
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.grade || student.class || 'N/A'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" size={20} />
                </div>
                <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                  <p className="text-xs text-white font-medium">
                    🚌 Tuyến: <span className="font-bold">{selectedStudent?.route_name}</span>
                  </p>
                </div>
              </div>

              {/* Student Info */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-5 border-2 border-slate-600">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-600">
                  <div className="bg-blue-500 rounded-full p-2">
                    <User className="text-white" size={20} />
                  </div>
                  <h3 className="font-bold text-white text-lg">Thông tin học sinh</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <label className="text-xs text-blue-300 uppercase font-semibold">Học sinh</label>
                    <p className="font-bold text-white text-lg mt-1">{selectedStudent.name}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <label className="text-xs text-blue-300 uppercase font-semibold">Lớp</label>
                    <p className="font-bold text-white text-base mt-1">{selectedStudent.grade || selectedStudent.class || 'N/A'}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <label className="text-xs text-blue-300 uppercase font-semibold">Tuyến</label>
                    <p className="font-bold text-white text-base mt-1">{selectedStudent.route_name}</p>
                  </div>

                  <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 border-2 border-green-400">
                    <label className="text-xs text-green-300 uppercase font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      Điểm đón
                    </label>
                    <p className="font-bold text-white text-sm mt-1">{selectedStudent.pickup_stop_name}</p>
                  </div>

                  <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-3 border-2 border-red-400">
                    <label className="text-xs text-red-300 uppercase font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                      Điểm trả
                    </label>
                    <p className="font-bold text-white text-sm mt-1">{selectedStudent.dropoff_stop_name}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-gray-200">
                  <Clock className="text-blue-600" size={20} />
                  <h3 className="font-bold text-gray-800">Trạng thái</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-700">Đón</span>
                    {getStatusBadge(studentStatus?.pickup_status || 'pending')}
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-700">Trả</span>
                    {getStatusBadge(studentStatus?.dropoff_status || 'pending')}
                  </div>
                </div>
              </div>

              {/* Bus Info */}
              {busInfo && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bus size={20} />
                    <h3 className="font-bold">Xe buýt</h3>
                  </div>
                  <p className="text-lg font-bold mb-1">{busInfo.bus_id?.license_plate}</p>
                  {busInfo.driver_id && (
                    <p className="text-sm opacity-90">👨‍✈️ {busInfo.driver_id.name}</p>
                  )}
                </div>
              )}

              {/* Emergency */}
              <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-lg shadow-lg p-4">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  Khẩn cấp
                </h3>
                <button className="w-full bg-white text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors">
                  Gọi: 1900-1412
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}