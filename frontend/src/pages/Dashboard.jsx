
import { useEffect, useState } from "react";
import { getDriversApi } from "../api/userApi";
import { getRoutesApi } from "../api/routeApi";
import { getAllBuschedule } from "../api/busscheduleApi";
import axios from "axios";
import { Bus, Users, Route, Calendar, TrendingUp, Clock } from "lucide-react";

export default function Dashboard() {
  const [busCount, setBusCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);
  const [scheduleStats, setScheduleStats] = useState({
    scheduled: 0,
    completed: 0,
    cancelled: 0
  });

  const fetchBusCount = async () => {
    const res = await axios.get("http://localhost:8080/api/bus");
    setBusCount(res.data.length);
  };

  const fetchDriverCount = async () => {
    const data = await getDriversApi();
    setDriverCount(data.length);
  };

  const fetchRouteCount = async () => {
    const data = await getRoutesApi();
    setRouteCount(data.length);
  };

  const fetchScheduleStats = async () => {
    try {
      const schedules = await getAllBuschedule();
      const stats = {
        scheduled: schedules.filter(s => s.status === 'scheduled').length,
        completed: schedules.filter(s => s.status === 'completed').length,
        cancelled: schedules.filter(s => s.status === 'cancelled').length
      };
      setScheduleStats(stats);
    } catch (error) {
      console.error('Error fetching schedule stats:', error);
    }
  };

  useEffect(() => {
    fetchBusCount();
    fetchDriverCount();
    fetchRouteCount();
    fetchScheduleStats();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 rounded-2xl shadow-xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
          </svg>
        </div>
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🚌 Hệ thống quản lý xe bus
              </h1>
              <p className="text-blue-100 text-lg">
                Giám sát và điều hành hoạt động vận chuyển học sinh
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Calendar className="text-white" size={32} />
                  <div className="text-white">
                    <div className="text-sm opacity-80">Hôm nay</div>
                    <div className="text-xl font-semibold">
                      {new Date().toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Bus className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng số xe bus</h3>
          <p className="text-3xl font-bold text-gray-900">{busCount}</p>
          <p className="text-xs text-gray-500 mt-2">Đang hoạt động</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Users className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng tài xế</h3>
          <p className="text-3xl font-bold text-gray-900">{driverCount}</p>
          <p className="text-xs text-gray-500 mt-2">Đã được phân công</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Route className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tuyến đường</h3>
          <p className="text-3xl font-bold text-gray-900">{routeCount}</p>
          <p className="text-xs text-gray-500 mt-2">Đang được sử dụng</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 rounded-full p-3">
              <Clock className="text-orange-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Lịch trình hôm nay</h3>
          <p className="text-3xl font-bold text-gray-900">{scheduleStats.scheduled}</p>
          <p className="text-xs text-gray-500 mt-2">Chuyến đang chờ</p>
        </div>
      </div>

      {/* Schedule Status & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Status */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-blue-600" />
            Tình trạng lịch trình
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-700 font-medium text-sm">Đang chờ</span>
                <div className="bg-yellow-200 rounded-full w-3 h-3"></div>
              </div>
              <p className="text-3xl font-bold text-yellow-800">{scheduleStats.scheduled}</p>
              <p className="text-xs text-yellow-600 mt-1">Chuyến xe</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 font-medium text-sm">Hoàn thành</span>
                <div className="bg-green-200 rounded-full w-3 h-3"></div>
              </div>
              <p className="text-3xl font-bold text-green-800">{scheduleStats.completed}</p>
              <p className="text-xs text-green-600 mt-1">Chuyến xe</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-700 font-medium text-sm">Đã hủy</span>
                <div className="bg-red-200 rounded-full w-3 h-3"></div>
              </div>
              <p className="text-3xl font-bold text-red-800">{scheduleStats.cancelled}</p>
              <p className="text-xs text-red-600 mt-1">Chuyến xe</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tiến độ hoàn thành</span>
              <span className="font-semibold">
                {scheduleStats.scheduled + scheduleStats.completed + scheduleStats.cancelled > 0
                  ? Math.round((scheduleStats.completed / (scheduleStats.scheduled + scheduleStats.completed + scheduleStats.cancelled)) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${scheduleStats.scheduled + scheduleStats.completed + scheduleStats.cancelled > 0
                    ? (scheduleStats.completed / (scheduleStats.scheduled + scheduleStats.completed + scheduleStats.cancelled)) * 100
                    : 0}%`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin nhanh</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 rounded-full p-2">
                <Bus className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Xe đang hoạt động</p>
                <p className="text-lg font-bold text-gray-900">{scheduleStats.scheduled}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="bg-green-100 rounded-full p-2">
                <Users className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Tài xế sẵn sàng</p>
                <p className="text-lg font-bold text-gray-900">{driverCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 rounded-full p-2">
                <Route className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-600">Tuyến hoạt động</p>
                <p className="text-lg font-bold text-gray-900">{routeCount}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">💡 Mẹo hữu ích</p>
              <p className="text-xs text-blue-900">
                Kiểm tra lịch trình định kỳ để đảm bảo xe bus hoạt động ổn định
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================
// HƯỚNG DẪN SỬ DỤNG:
// ====================
// 1. Copy toàn bộ code trên
// 2. Mở file src/pages/Dashboard.jsx trong project của bạn
// 3. Thay thế toàn bộ nội dung bằng code này
// 4. Lưu file và refresh trình duyệt
// 
// Lưu ý: Đảm bảo các API functions đã được import đúng:
// - getDriversApi từ ../api/userApi
// - getRoutesApi từ ../api/routeApi  
// - getAllBuschedule từ ../api/busscheduleApi
// - axios đã được cài đặt (npm install axios)