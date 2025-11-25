import { useState } from "react";
import { User, ChevronDown, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // ✅ dùng context để gọi logout()
import Swal from "sweetalert2";
import ToastService from "@/lib/toastService";

export default function UserDropdown() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth(); // ✅ lấy user & logout từ context
    const navigate = useNavigate();





    const handleLogout = () => {
        Swal.fire({
            title: "Bạn có chắc muốn đăng xuất?",
            text: "Phiên đăng nhập hiện tại sẽ kết thúc.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy",
            reverseButtons: true,
            confirmButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                // ✅ Tắt ngay modal, không chờ animation
                Swal.close();

                logout(); // Gọi logout từ context
                navigate("/"); // Chuyển trang ngay lập tức

                // ✅ Hiện toast sau khi logout
                setTimeout(() => {
                    Swal.fire({
                        toast: true,
                        position: "bottom-end",
                        icon: "success",
                        title: "Đã đăng xuất!",
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        },
                    });
                }, 10); // một chút để toast render sau khi route đổi
            }
        });
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
