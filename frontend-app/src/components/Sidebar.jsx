import { LayoutDashboard, Bus, Users, BellRing } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  const item = "flex items-center px-5 py-2 rounded hover:bg-gray-100 relative";
  const icon = "w-5 h-5 text-blue-900";

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-18"
      } bg-white h-screen shadow-md fixed left-0 top-0 transition-all duration-1000 overflow-hidden`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center border-b bg-blue-900 pl-5">
        <span className="text-lg font-bold text-white">
          {isOpen ? "SSB Tracking" : "SSB"}
        </span>
      </div>

      {/* Menu */}
      <nav className="mt-3 space-y-1">
        <Link to="/dashboard" className={item}>
          <LayoutDashboard className={icon} />
          <span
            className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${
              isOpen ? "opacity-100" : "opacity-0"
            }`  }
          >
            Trang chủ
          </span>
        </Link>

        <Link to="/buses" className={item}>
          <Bus className={icon} />
          <span
            className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Quản lý xe
          </span>
        </Link>

        <Link to="/accounts" className={item}>
          <Users className={icon} />
          <span
            className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Quản lý tài khoản
          </span>
        </Link>

        <Link to="/notifications" className={item}>
          <BellRing className={icon} />
          <span
            className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            Thông báo
          </span>
        </Link>
      </nav>
    </aside>
  );
}
