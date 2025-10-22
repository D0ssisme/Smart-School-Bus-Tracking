import React from "react";
import { Users, Bus, MapPin } from "lucide-react";

function Features() {
  const features = [
    {
      icon: <span className="text-4xl sm:text-5xl md:text-6xl ">👨‍👩‍👧</span>,
      title: "Phụ huynh",
      desc: "Theo dõi vị trí xe theo thời gian thực, nhận thông báo khi xe đến gần và xem lịch sử di chuyển.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-gradient-to-br from-blue-50 to-blue-70",
    },
    {
      icon: <span className="text-4xl sm:text-5xl md:text-6xl">👨‍✈️</span>,
      title: "Tài xế",
      desc: "Quản lý lịch trình chạy xe, báo cáo nhanh chóng và cập nhật tình trạng xe buýt.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-gradient-to-br from-green-50 to-green-70",
    },
    {
      icon: <span className="text-4xl sm:text-5xl md:text-6xl">🏫</span>,
      title: "Nhà trường",
      desc: "Phân công tuyến đường, gửi thông báo đến phụ huynh và giám sát toàn bộ hệ thống.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-gradient-to-br from-purple-50 to-purple-70",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              {/* Icon */}
              <div className={`relative w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${feature.color} transition-all">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.desc}
              </p>

              {/* Decorative Circle */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${feature.bgColor} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Features;