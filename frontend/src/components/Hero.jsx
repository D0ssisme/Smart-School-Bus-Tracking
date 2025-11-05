import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, Bell, MapPin } from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  const benefits = [
    { icon: <Shield className="w-5 h-5" />, text: "An toàn tuyệt đối" },
    { icon: <Clock className="w-5 h-5" />, text: "Quản lý thời gian" },
    { icon: <Bell className="w-5 h-5" />, text: "Thông báo tức thì" },
    { icon: <MapPin className="w-5 h-5" />, text: "Định vị chính xác" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Text Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 animate-gradient-x leading-tight animate-fade-in-up">
            Hệ Thống Quản Lý Xe Bus
          </h1>

          <p className="text-0.5xl text-gray-900 leading-relaxed animate-fade-in-up animation-delay-200">
            Hệ thống giúp phụ huynh, nhà trường và tài xế quản lý minh bạch & tiện lợi.
          </p>

          <div className="flex gap-4 pt-4 animate-fade-in-up animation-delay-400">
            <button
              onClick={() => navigate("/")}
              className="group px-8 py-4 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Bắt đầu ngay
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={() => {
                const section = document.getElementById("features");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 transform"
            >
              Tìm hiểu thêm
            </button>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${i * 100 + 600}ms` }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                  {benefit.icon}
                </div>
                <span className="font-semibold text-gray-700">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative">
          <div className="relative animate-fade-in-right">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse-slow"></div>

            <img
              src="/bus_home.png"
              alt="School Bus Tracking"
              className="relative w-full max-w-2xl rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />

            {/* Floating Stats Card 1 */}
            <div className="absolute top-10 -left-10 hidden lg:block animate-float">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">25 Xe bus</p>
                    <p className="text-sm text-gray-500">Đang hoạt động</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats Card 2 */}
            <div className="absolute bottom-10 -right-10 hidden lg:block animate-float-delayed">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">500+ Học sinh</p>
                    <p className="text-sm text-gray-500">Sử dụng mỗi ngày</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;