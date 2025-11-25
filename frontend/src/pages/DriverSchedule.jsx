import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Bus, Navigation, Users, AlertCircle, CheckCircle, TrendingUp, Route as RouteIcon } from "lucide-react";
import { getBusScheduleByDriverIdApi } from "@/api/busscheduleApi";
import { toast } from "react-hot-toast";

export default function DriverSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Lấy thông tin driver đang đăng nhập
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const driverId = currentUser._id || currentUser.id;

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const res = await getBusScheduleByDriverIdApi(driverId);

      console.log("📅 Driver schedules:", res);

      // ÉP VỀ ARRAY AN TOÀN
      const list =
        Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.schedules)
              ? res.schedules
              : [];

      setSchedules(list);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Không thể tải lịch trình");
      setSchedules([]); // tránh crash UI
    } finally {
      setLoading(false);
    }
  };

  // Lọc schedules theo ngày được chọn
  const filteredSchedules = schedules.filter(schedule => {
    // Nếu có trường date/schedule_date
    if (schedule.date) {
      return schedule.date === selectedDate;
    }
    // Nếu không có, hiển thị tất cả
    return true;
  });

  // Thống kê
  const totalSchedules = schedules.length;
  const todaySchedules = schedules.filter(s => {
    const today = new Date().toISOString().split('T')[0];
    return s.date === today || !s.date; // Nếu không có date field, hiển thị tất cả
  }).length;

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (schedule) => {
    const now = new Date();
    const startTime = schedule.start_time;
    const endTime = schedule.end_time;

    // Logic đơn giản: so sánh giờ hiện tại
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = (startTime || "00:00").split(':').map(Number);
    const [endHour, endMin] = (endTime || "23:59").split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (currentTime < startMinutes) {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Clock size={14} />
          Sắp tới
        </span>
      );
    } else if (currentTime >= startMinutes && currentTime <= endMinutes) {
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Navigation size={14} />
          Đang chạy
        </span>
      );
    } else {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <CheckCircle size={14} />
          Hoàn thành
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải lịch trình...</p>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6">
        <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-2xl mx-auto mt-20">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chưa có lịch trình nào
          </h3>
          <p className="text-gray-500">
            Bạn chưa được phân công lịch trình làm việc
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Bus illustration */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
          <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
            <rect x="30" y="20" width="120" height="60" rx="8" fill="white" opacity="0.9" />
            <rect x="40" y="30" width="25" height="20" rx="3" fill="#1e40af" />
            <rect x="70" y="30" width="25" height="20" rx="3" fill="#1e40af" />
            <rect x="100" y="30" width="25" height="20" rx="3" fill="#1e40af" />
            <circle cx="50" cy="85" r="10" fill="white" />
            <circle cx="50" cy="85" r="6" fill="#374151" />
            <circle cx="130" cy="85" r="10" fill="white" />
            <circle cx="130" cy="85" r="6" fill="#374151" />
          </svg>
        </div>

        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Calendar className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  📅 Lịch trình làm việc
                </h1>
                <p className="text-blue-100">
                  Xem và quản lý lịch trình của bạn
                </p>
              </div>
            </div>

            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">Giờ hiện tại</div>
                <div className="text-2xl font-bold text-white">{getCurrentTime()}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">Tài xế</div>
                <div className="text-lg font-bold text-white">
                  {currentUser.name || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📆 Chọn ngày xem lịch trình:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-500 font-medium text-gray-800 hover:border-gray-300 transition-colors"
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Hiển thị</p>
            <p className="text-3xl font-bold text-blue-600">{filteredSchedules.length}</p>
            <p className="text-xs text-gray-500">lịch trình</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng lịch trình</h3>
          <p className="text-3xl font-bold text-gray-900">{totalSchedules}</p>
          <p className="text-xs text-gray-500 mt-2">Tất cả các ngày</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Hôm nay</h3>
          <p className="text-3xl font-bold text-gray-900">{todaySchedules}</p>
          <p className="text-xs text-gray-500 mt-2">Lịch trình hôm nay</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 rounded-full p-3">
              <Bus className="text-orange-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Xe phụ trách</h3>
          <p className="text-3xl font-bold text-gray-900">
            {schedules[0]?.bus_id?.license_plate || 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Biển số xe</p>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Navigation className="text-blue-600" size={24} />
            Danh sách lịch trình
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(selectedDate).toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không có lịch trình
            </h3>
            <p className="text-gray-500">
              Không có lịch trình nào cho ngày đã chọn
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {filteredSchedules.map((schedule, index) => (
                <ScheduleCard
                  key={schedule._id}
                  schedule={schedule}
                  index={index}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="text-yellow-600" size={20} />
          💡 Lời nhắc nhở
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <span>Kiểm tra xe trước khi khởi hành (nhiên liệu, lốp, đèn, phanh)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <span>Luôn chú ý an toàn khi đón trả học sinh</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <span>Tuân thủ giờ giấc và điểm dừng theo lịch trình</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="text-green-600 mt-0.5" size={16} />
            <span>Báo cáo ngay nếu có sự cố hoặc học sinh vắng mặt</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Schedule Card Component
function ScheduleCard({ schedule, index, getStatusBadge }) {
  return (
    <div className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-r-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-full p-2">
            <Bus className="text-blue-600" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">
              {schedule.route_id?.name || 'Tuyến không xác định'}
            </h4>
            <p className="text-sm text-gray-600">
              Chuyến #{index + 1} - Mã: {schedule.route_id?.route_id || 'N/A'}
            </p>
          </div>
        </div>
        {getStatusBadge(schedule)}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="text-gray-500" size={16} />
          <span className="text-gray-600">Giờ bắt đầu:</span>
          <span className="font-semibold text-gray-900">{schedule.start_time || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="text-gray-500" size={16} />
          <span className="text-gray-600">Giờ kết thúc:</span>
          <span className="font-semibold text-gray-900">{schedule.end_time || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Bus className="text-gray-500" size={16} />
          <span className="text-gray-600">Xe bus:</span>
          <span className="font-semibold text-gray-900">
            {schedule.bus_id?.license_plate || 'N/A'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="text-gray-500" size={16} />
          <span className="text-gray-600">Sức chứa:</span>
          <span className="font-semibold text-gray-900">
            {schedule.bus_id?.capacity || 'N/A'} học sinh
          </span>
        </div>
      </div>

      {/* Route Details */}
      {schedule.route_id && (
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
          <div className="flex items-start gap-2">
            <RouteIcon className="text-indigo-600 mt-0.5" size={18} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-indigo-900 mb-1">Tuyến đường:</p>
              <div className="flex items-center gap-2">
                <MapPin className="text-indigo-600" size={14} />
                <span className="text-sm font-semibold text-gray-800">
                  {schedule.route_id.start_point?.name || 'Điểm bắt đầu'}
                </span>
                <Navigation className="text-gray-400" size={14} />
                <span className="text-sm font-semibold text-gray-800">
                  {schedule.route_id.end_point?.name || 'Điểm kết thúc'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all">
          Chi tiết tuyến
        </button>
        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all">
          Xem bản đồ
        </button>
      </div>
    </div>
  );
}