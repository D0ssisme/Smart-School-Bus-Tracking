import { useState } from "react";
import { User, ChevronDown, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // ✅ dùng context để gọi logout()

export default function UserDropdown() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth(); // ✅ lấy user & logout từ context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // xoá token, xoá user
        navigate("/"); // điều hướng về trang login
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
                <User className="w-5 h-5" />
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="flex flex-col items-center py-3 border-b">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
                            alt="avatar"
                            className="w-12 h-12 rounded-full"
                        />
                        <p className="font-semibold text-black mt-1">
                            {user?.name || ""}
                        </p>
                    </div>

                    <div className="flex flex-col p-2">
                        <Link
                            to="/myaccount"
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-black"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Tài khoản</span>
                        </Link>

                        {/* ✅ Nút logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
