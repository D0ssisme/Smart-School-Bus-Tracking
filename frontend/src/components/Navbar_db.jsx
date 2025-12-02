// src/components/Navbar_db.jsx
import { EllipsisVertical } from "lucide-react";
import UserDropdown from "./UserDropdown";
import NotificationBell from "./NotificationBell";
import LanguageSwitcher from "./LanguageSwitcher"; // ✅ Import component
import { useAuth } from "../hooks/useAuth";

export default function Navbar_db({ toggleSidebar, isOpen }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  return (
    <div
      className={`h-16 bg-white shadow flex items-center justify-between px-6 fixed top-0 right-0 z-10 transition-all duration-1000 ${
        isOpen ? "left-64" : "left-18"
      }`}
    >
      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded hover:bg-gray-200 text-black bg-gray-100"
      >
        <EllipsisVertical className="w-5 h-5" />
      </button>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* ✅ Thêm Language Switcher */}
        <LanguageSwitcher />

        {/* Notification Bell */}
        <NotificationBell userId={userId} />

        {/* User Dropdown */}
        <UserDropdown />
      </div>
    </div>
  );
}