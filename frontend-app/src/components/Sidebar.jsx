import { LayoutDashboard, Bus, Users, BellRing, Route, GraduationCap, AlertTriangle, LifeBuoy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Trang chủ" },
    { path: "/buses", icon: Bus, label: "Xe bus" },
    { path: "/accounts", icon: Users, label: "Người dùng" },
    { path: "/drivers", icon: LifeBuoy, label: "Tài xế" },
    { path: "/students", icon: GraduationCap, label: "Học sinh" },
    { path: "/routes", icon: Route, label: "Tuyến đường" },
    { path: "/notifications", icon: BellRing, label: "Thông báo" },
    { path: "/reports", icon: AlertTriangle, label: "Báo cáo, cảnh báo" },
  ];

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-18"
        } bg-white h-screen shadow-md fixed left-0 top-0 transition-all duration-300 overflow-hidden z-40`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center border-b bg-blue-900 pl-5">
        <span className="text-lg font-bold text-white">
          {isOpen ? "SSB Tracking" : "SSB"}
        </span>
      </div>

      {/* Menu */}
      <nav className="mt-3 space-y-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all relative ${isActive
                  ? "bg-blue-100 text-blue-900"
                  : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-900" : "text-gray-600"}`} />
              <span
                className={`absolute left-14 whitespace-nowrap transition-all duration-300 font-medium ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                  } ${isActive ? "text-blue-900" : "text-gray-700"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}