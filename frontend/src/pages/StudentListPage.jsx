import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Search, Download, UserPlus, Trash2, ChevronLeft, MapPin } from 'lucide-react';

const StudentListPage = () => {
  const { busId } = useParams();
  const location = useLocation();
  // Nhận dữ liệu từ state của Link
  const { busData, studentData } = location.state || { busData: [], studentData: [] };

  const [busInfo, setBusInfo] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let foundBus = null;
    // Tìm thông tin xe bus dựa trên busId từ URL
    for (const route of busData) {
      const bus = route.buses.find(b => b.id.toString() === busId);
      if (bus) {
        foundBus = { ...bus, routeName: route.routeName };
        break;
      }
    }

    if (foundBus) {
      setBusInfo(foundBus);
      // Lọc danh sách học sinh thuộc xe bus này
      const studentsOnBus = studentData.filter(s => foundBus.studentIds.includes(s.student_id));
      setStudentList(studentsOnBus);
    }
  }, [busId, busData, studentData]);

  // Cập nhật logic tìm kiếm
  const filteredStudents = studentList.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!busInfo) {
    return (
        <div className="p-6 text-center">
            <p>Đang tải hoặc không tìm thấy thông tin xe bus.</p>
            <Link to="/buses" className="text-blue-600 hover:underline mt-4 inline-block">
                Quay lại trang quản lý
            </Link>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 min-h-full rounded-lg">
       <div className="mb-4">
            <Link to="/buses" className="flex items-center text-sm text-gray-500 hover:text-gray-800">
                <ChevronLeft size={18} className="mr-1" />
                Quay lại Quản lý xe bus
            </Link>
        </div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên, mã học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100">
            <Download size={16} /> Xuất danh sách
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800">
            <UserPlus size={16} /> Thêm học sinh
          </button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {busInfo.routeName} - Xe {busInfo.plate}
        </h2>
        <span className="text-gray-600 font-medium">Sĩ số: {studentList.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm">
          {/* CẬP NHẬT TIÊU ĐỀ BẢNG */}
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600">STT</th>
              <th className="p-3 text-left font-semibold text-gray-600">Họ tên</th>
              <th className="p-3 text-left font-semibold text-gray-600">Mã HS</th>
              <th className="p-3 text-left font-semibold text-gray-600">Lớp</th>
              <th className="p-3 text-left font-semibold text-gray-600">Điểm đón / trả</th>
              <th className="p-3 text-left font-semibold text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* CẬP NHẬT NỘI DUNG BẢNG */}
            {filteredStudents.map((student, index) => (
              <tr key={student.student_id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-500">{index + 1}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-gray-700">{student.student_id}</td>
                <td className="p-3 text-gray-700">{student.grade}</td>
                <td className="p-3 text-gray-700">
                    <div className="flex items-center gap-2 text-green-600">
                        <MapPin size={14}/> <span>{student.pickup_point}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 mt-1">
                        <MapPin size={14}/> <span>{student.dropoff_point}</span>
                    </div>
                </td>
                <td className="p-3">
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentListPage;

