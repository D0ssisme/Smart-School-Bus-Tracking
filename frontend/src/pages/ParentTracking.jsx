//src/pages/ParentTracking.jsx
import { useEffect, useState } from "react";
import { MapPin, Navigation, Clock, User, Phone, AlertCircle } from "lucide-react";

export default function ParentTracking() {
  const [busLocation, setBusLocation] = useState({
    lat: 10.8231,
    lng: 106.6297
  });
  const [studentInfo, setStudentInfo] = useState({
    name: "Nguyễn Văn A",
    class: "5A",
    busNumber: "Bus 01",
    licensePlate: "29A-12345",
    driver: "Trần Văn B",
    driverPhone: "0912345678",
    pickupPoint: "123 Đường ABC, Quận 1",
    estimatedTime: "7:15 AM",
    status: "on_way" // on_way, arrived, picked_up
  });

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
    switch(status) {
      case "on_way":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">🚌 Đang trên đường</span>;
      case "arrived":
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">📍 Đã đến điểm đón</span>;
      case "picked_up":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">✅ Đã đón học sinh</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📍 Theo dõi học sinh
        </h1>
        <p className="text-gray-600">Xem vị trí xe buýt theo thời gian thực</p>
      </div>

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
                      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3"/>
                      <rect x="6" y="8" width="5" height="4" rx="1" fill="white"/>
                      <rect x="13" y="8" width="5" height="4" rx="1" fill="white"/>
                      <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="white"/>
                      <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="white"/>
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
                  <p className="text-2xl font-bold">{studentInfo.estimatedTime}</p>
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
                <p className="font-semibold text-gray-800">{studentInfo.name}</p>
              </div>

              <div className="pb-3 border-b">
                <label className="text-xs text-gray-500">Lớp</label>
                <p className="font-semibold text-gray-800">{studentInfo.class}</p>
              </div>

              <div className="pb-3 border-b">
                <label className="text-xs text-gray-500">Xe buýt</label>
                <p className="font-semibold text-gray-800">{studentInfo.busNumber} - {studentInfo.licensePlate}</p>
              </div>

              <div className="pb-3 border-b">
                <label className="text-xs text-gray-500">Tài xế</label>
                <p className="font-semibold text-gray-800">{studentInfo.driver}</p>
              </div>

              <div className="pb-3 border-b">
                <label className="text-xs text-gray-500 flex items-center gap-1">
                  <Phone size={12} /> Liên hệ
                </label>
                <a href={`tel:${studentInfo.driverPhone}`} className="font-semibold text-blue-600 hover:underline">
                  {studentInfo.driverPhone}
                </a>
              </div>

              <div>
                <label className="text-xs text-gray-500">Điểm đón</label>
                <p className="font-semibold text-gray-800 text-sm">{studentInfo.pickupPoint}</p>
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
                {getStatusBadge(studentInfo.status)}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Thời gian dự kiến</span>
                <span className="font-bold text-gray-800">{studentInfo.estimatedTime}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Khoảng cách</span>
                <span className="font-bold text-green-800">~2.5 km</span>
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
    </div>
  );
}