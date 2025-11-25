import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Search, Download, UserPlus, Trash2, ChevronLeft, MapPin } from 'lucide-react';
import { getAllStudentBusAssignments, deleteStudentBusAssignment } from '@/api/studentbusassignmentApi';
import { getAllStudentRouteAssignments } from '@/api/studentrouteassignmentApi';
import { toast } from 'react-hot-toast';
import AddStudentToScheduleModal from '@/components/AddStudentToScheduleModal';
import Swal from 'sweetalert2';


const StudentListPage = () => {
  const { busId } = useParams();
  const location = useLocation();
  const { busData } = location.state || { busData: [] };

  const [scheduleInfo, setScheduleInfo] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduleAndStudents();
  }, [busId, busData]);

  const fetchScheduleAndStudents = async () => {
    try {
      setLoading(true);

      // 1. Tìm schedule từ busData
      let foundSchedule = null;
      for (const route of busData) {
        const schedule = route.buses.find(b => (b._id || b.id)?.toString() === busId?.toString());
        if (schedule) {
          foundSchedule = {
            ...schedule,
            routeName: route.routeName,
            routeId: route.routeId
          };
          break;
        }
      }

      if (!foundSchedule) {
        toast.error("Không tìm thấy thông tin lịch trình");
        return;
      }

      setScheduleInfo(foundSchedule);
      console.log("📅 Found schedule:", foundSchedule);

      // 2. Load assignments
      const [busAssignments, routeAssignments] = await Promise.all([
        getAllStudentBusAssignments(),
        getAllStudentRouteAssignments(),
      ]);

      console.log("📦 Bus assignments:", busAssignments);
      console.log("🗺️ Route assignments:", routeAssignments);

      // 3. Lọc học sinh thuộc schedule này (CHỐNG NULL)
      const studentsInThisSchedule = busAssignments.filter((assignment) => {
        const scheduleId = assignment.schedule_id?._id || assignment.schedule_id;
        const busScheduleId = busId?._id || busId;

        return scheduleId?.toString() === busScheduleId?.toString();
      });

      console.log("👥 Students in this schedule:", studentsInThisSchedule);

      // 4. Kết hợp 2 API thành danh sách học sinh hoàn chỉnh
      const transformedStudents = studentsInThisSchedule.map((busAssignment) => {
        const student = busAssignment.student_id;

        const studentId = student?._id || student;
        const scheduleRouteId = foundSchedule.routeId?._id || foundSchedule.routeId;

        // Tìm route assignment phù hợp
        const routeAssignment = routeAssignments.find((ra) => {
          const raStudentId = ra.student_id?._id || ra.student_id;
          const raRouteId = ra.route_id?._id || ra.route_id;

          return (
            raStudentId?.toString() === studentId?.toString() &&
            raRouteId?.toString() === scheduleRouteId?.toString()
          );
        });

        return {
          _id: busAssignment._id,
          student_object_id: studentId,
          student_id: student?.student_id || "N/A",
          name: student?.name || "Không rõ",
          grade: student?.grade || "N/A",

          pickup_point:
            routeAssignment?.pickup_stop_id?.name ||
            routeAssignment?.pickup_stop_id?.address ||
            "Chưa xác định",

          dropoff_point:
            routeAssignment?.dropoff_stop_id?.name ||
            routeAssignment?.dropoff_stop_id?.address ||
            "Chưa xác định",

          pickup_status: busAssignment.pickup_status,
          dropoff_status: busAssignment.dropoff_status,
          active: routeAssignment?.active ?? true
        };
      });

      console.log("✅ Transformed students:", transformedStudents);
      setStudentList(transformedStudents);

    } catch (error) {
      console.error("❌ Error fetching students:", error);
      toast.error("Không thể tải danh sách học sinh");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = studentList.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteStudent = async (assignmentId) => {
    // Tìm học sinh theo assignmentId từ studentList
    const student = studentList.find(s => s._id === assignmentId);

    if (!student) {
      Swal.fire({
        icon: "error",
        title: "Không tìm thấy học sinh",
        text: "Học sinh không tồn tại trong danh sách hiện tại."
      });
      return;
    }

    // Popup hiển thị thông tin học sinh
    const result = await Swal.fire({
      title: "Xóa học sinh khỏi lịch trình?",
      html: `
      <div style="text-align: left;">
        <p><strong>👤 Họ tên:</strong> ${student.name}</p>
        <p><strong>🎓 Lớp:</strong> ${student.grade}</p>
        <p><strong>📍 Điểm đón:</strong> ${student.pickup_point}</p>
        <p><strong>🏁 Điểm trả:</strong> ${student.dropoff_point}</p>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa luôn",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        // Loading popup
        Swal.fire({
          title: "Đang xóa...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        // Gọi API xóa
        await deleteStudentBusAssignment(assignmentId);

        // Cập nhật UI
        setStudentList(prev => prev.filter(s => s._id !== assignmentId));

        // Thành công
        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: `Học sinh ${student.name} đã được xóa khỏi lịch trình.`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("❌ Error deleting student:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xóa học sinh. Vui lòng thử lại sau!"
        });
      }
    }
  };
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải danh sách học sinh...</p>
        </div>
      </div>
    );
  }

  if (!scheduleInfo) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-600 mb-4 text-lg">Không tìm thấy thông tin lịch trình.</p>
          <Link
            to="/buses"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeft size={18} className="mr-1" />
            Quay lại trang quản lý
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative px-8 py-8">
          <Link
            to="/buses"
            className="inline-flex items-center text-white/80 hover:text-white text-sm mb-4 transition"
          >
            <ChevronLeft size={18} className="mr-1" />
            Quay lại Quản lý xe bus
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Danh sách học sinh
              </h1>
              <div className="space-y-1">
                <p className="text-cyan-100 text-lg">
                  {scheduleInfo.routeName} - Xe {scheduleInfo.plate}
                </p>
                <p className="text-cyan-200 text-sm">
                  Tài xế: {scheduleInfo.driver} | {scheduleInfo.startTime} - {scheduleInfo.endTime}
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
              <div className="text-white/70 text-xs mb-1">Sĩ số</div>
              <div className="text-3xl font-bold text-white">{studentList.length}</div>
              <div className="text-white/70 text-xs mt-1">học sinh</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Download size={16} /> Xuất danh sách
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <UserPlus size={16} /> Thêm học sinh
            </button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "Không tìm thấy học sinh" : "Chưa có học sinh nào"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Thêm học sinh vào lịch trình này"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Lớp</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Điểm đón/trả</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <tr key={student._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {student.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <MapPin size={14} className="flex-shrink-0" />
                          <span className="truncate max-w-xs">{student.pickup_point}</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <MapPin size={14} className="flex-shrink-0" />
                          <span className="truncate max-w-xs">{student.dropoff_point}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.pickup_status === 'picked'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          Đón: {student.pickup_status === 'picked' ? 'Đã đón' : 'Chờ đón'}
                        </span>
                        <br />
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${student.dropoff_status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          Trả: {student.dropoff_status === 'completed' ? 'Đã trả' : 'Chờ trả'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteStudent(student._id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Xóa khỏi lịch trình"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddStudentToScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        scheduleInfo={scheduleInfo}
        existingStudentIds={studentList.map(s => s.student_object_id)}
        onStudentAdded={() => {
          fetchScheduleAndStudents();
        }}
      />
    </div>
  );
};

export default StudentListPage;