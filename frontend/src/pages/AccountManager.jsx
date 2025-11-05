import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountTable from "../components/AccountTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddUserModal from "@/components/AddUserModal";
import { getParentsApi, getDriversApi, createUserApi, deleteUserApi } from "@/api/userApi";
import ToastService from "@/lib/toastService";
import { Users, UserPlus, Filter, Search, TrendingUp, Shield } from "lucide-react";

import Swal from 'sweetalert2';

function AccountManager() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // ← Thêm state cho modal

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const loadingToast = ToastService.loading("Đang tải danh sách người dùng...");

        try {
            setLoading(true);

            const [parentsData, driversData] = await Promise.all([
                getParentsApi(),
                getDriversApi()
            ]);

            const allUsers = [...parentsData, ...driversData];

            setUsers(allUsers);
            ToastService.update(loadingToast, "Tải dữ liệu thành công!", "success");
        } catch (error) {
            console.error('Error fetching users:', error);
            ToastService.update(loadingToast, "Không thể tải dữ liệu người dùng. Vui lòng thử lại!", "error");
        } finally {
            setLoading(false);
        }
    };

    // ← Thêm hàm xử lý tạo user
    const handleCreateUser = async (userData) => {
        const loadingToast = ToastService.loading("Đang tạo người dùng...");

        try {
            const response = await createUserApi(userData);
            console.log("✅ User created:", response);

            ToastService.update(loadingToast, "Tạo người dùng thành công!", "success");

            // Refresh danh sách
            await fetchUsers();

        } catch (error) {
            console.error("❌ Error creating user:", error);
            const errorMsg = error.response?.data?.message || "Không thể tạo người dùng. Vui lòng thử lại!";
            ToastService.update(loadingToast, errorMsg, "error");
            throw error; // Để modal xử lý lỗi
        }
    };


    const handleDeleteUser = async (id) => {
        // Tìm thông tin user từ state
        const user = users.find(u => u._id === id);

        // Hiển thị role bằng tiếng Việt
        const roleDisplay = {
            'parent': 'Phụ huynh',
            'driver': 'Tài xế',
            'admin': 'Quản trị viên',
            'manager': 'Quản lý'
        };

        Swal.fire({
            title: "Xác nhận xóa người dùng",
            html: `
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc3545;">
            <p style="margin: 0; font-size: 16px;">
                <strong>👤 Họ tên:</strong> ${user?.name || 'N/A'}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                <strong>🆔 Mã người dùng:</strong> ${user?.userId || 'N/A'}
            </p>
            
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                <strong>📞 Số điện thoại:</strong> ${user?.phoneNumber || 'N/A'}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                <strong>👔 Vai trò:</strong> <span style="background: #e7f3ff; padding: 2px 8px; border-radius: 4px; color: #0066cc;">${roleDisplay[user?.role] || user?.role || 'N/A'}</span>
            </p>
        </div>
        <p style="color: #d33; font-weight: bold; margin-top: 16px;">⚠️ Hành động này sẽ không thể hoàn tác!</p>
    `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            width: 550
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loadingToast = ToastService.loading("Đang xóa người dùng...");

                try {
                    // Gọi API xóa user
                    await deleteUserApi(id);

                    // Cập nhật UI
                    setUsers(prevUsers => prevUsers.filter(user => user._id !== id));

                    ToastService.update(loadingToast, `Đã xóa người dùng ${user?.name}!`, "success");

                } catch (error) {
                    console.error('Error deleting user:', error);

                    const errorMessage = error.response?.data?.message || "";

                    // ========== XỬ LÝ LỖI PHỤ HUYNH ==========
                    if (error.response?.status === 400 && errorMessage.includes("còn đang có con liên kết")) {
                        ToastService.update(loadingToast, "", "error");

                        Swal.fire({
                            title: "Không thể xóa phụ huynh!",
                            html: `
                        <div style="text-align: left;">
                            <div style="background: #ffe5e5; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #dc3545;">
                                <p style="margin: 0; font-size: 15px;">
                                    <strong>👤 ${user?.name}</strong> (${user?.userId})
                                </p>
                                <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">
                                    ${roleDisplay[user?.role] || user?.role}
                                </p>
                            </div>
                            <p><strong>⚠️ Phụ huynh này đang liên kết với học sinh!</strong></p>
                            <p style="margin-top: 12px; color: #666;">
                                Bạn cần xóa các học sinh liên kết trước khi xóa phụ huynh này.
                            </p>
                            <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #ffc107;">
                                <p style="margin: 0; font-size: 14px;">
                                    💡 <strong>Hướng dẫn:</strong><br/>
                                    1. Vào trang <strong>Quản lý học sinh</strong><br/>
                                    2. Tìm các học sinh của phụ huynh <strong>${user?.name}</strong><br/>
                                    3. Xóa hoặc chuyển học sinh sang phụ huynh khác<br/>
                                    4. Quay lại xóa phụ huynh
                                </p>
                            </div>
                        </div>
                    `,
                            icon: "error",
                            confirmButtonText: "Đã hiểu",
                            confirmButtonColor: "#3085d6",
                            width: 600
                        });
                    }
                    // ========== XỬ LÝ LỖI TÀI XẾ ==========
                    else if (error.response?.status === 400 && errorMessage.includes("đang được phân công")) {
                        ToastService.update(loadingToast, "", "error");

                        Swal.fire({
                            title: "Không thể xóa tài xế!",
                            html: `
                        <div style="text-align: left;">
                            <div style="background: #ffe5e5; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #dc3545;">
                                <p style="margin: 0; font-size: 15px;">
                                    <strong>🚗 ${user?.name}</strong> (${user?.userId})
                                </p>
                                <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">
                                    ${roleDisplay[user?.role] || user?.role}
                                </p>
                            </div>
                            <p><strong>⚠️ Tài xế này đang được phân công trong lịch trình!</strong></p>
                            <p style="margin-top: 12px; color: #666;">
                                Bạn cần hủy hoặc chuyển lịch trình trước khi xóa tài xế này.
                            </p>
                            <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #ffc107;">
                                <p style="margin: 0; font-size: 14px;">
                                    💡 <strong>Hướng dẫn:</strong><br/>
                                    1. Vào trang <strong>Quản lý xe bus</strong> hoặc <strong>Lịch trình</strong><br/>
                                    2. Tìm các lịch trình của tài xế <strong>${user?.name}</strong><br/>
                                    3. Hủy lịch hoặc phân công tài xế khác<br/>
                                    4. Quay lại xóa tài xế
                                </p>
                            </div>
                        </div>
                    `,
                            icon: "error",
                            confirmButtonText: "Đã hiểu",
                            confirmButtonColor: "#3085d6",
                            width: 600
                        });
                    }
                    // ========== CÁC LỖI KHÁC ==========
                    else {
                        const errorMsg = errorMessage || "Không thể xóa người dùng. Vui lòng thử lại!";
                        ToastService.update(loadingToast, errorMsg, "error");
                    }
                }
            }
        });
    };






    const handleEditUser = (user) => {
        navigate(`/accounts/edit/${user._id}`);
    };

    const filteredUsers = users.filter(user => {
        const matchSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.userId && user.userId.includes(searchTerm));
        const matchRole = filterRole === "all" || user.role === filterRole;
        return matchSearch && matchRole;
    });

    const parentCount = users.filter(u => u.role === 'parent').length;
    const driverCount = users.filter(u => u.role === 'driver').length;
    const managerCount = users.filter(u => u.role === 'manager').length;

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded p-5 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải danh sách người dùng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-6">
            {/* Header Banner với illustration */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* User illustration SVG */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
                    <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
                        <circle cx="60" cy="40" r="25" fill="white" opacity="0.9" />
                        <path d="M60 65 C60 65, 35 70, 35 95 L85 95 C85 70, 60 65, 60 65 Z" fill="white" opacity="0.9" />
                        <circle cx="100" cy="40" r="25" fill="white" opacity="0.7" />
                        <path d="M100 65 C100 65, 75 70, 75 95 L125 95 C125 70, 100 65, 100 65 Z" fill="white" opacity="0.7" />
                        <circle cx="140" cy="40" r="25" fill="white" opacity="0.5" />
                        <path d="M140 65 C140 65, 115 70, 115 95 L165 95 C165 70, 140 65, 140 65 Z" fill="white" opacity="0.5" />
                    </svg>
                </div>

                <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <Users className="text-white" size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    Quản lý tài khoản
                                </h1>
                                <p className="text-purple-100">
                                    Quản lý phụ huynh, tài xế và người dùng hệ thống
                                </p>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="hidden md:flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">Tổng số</div>
                                <div className="text-2xl font-bold text-white">{users.length}</div>
                            </div>
                            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                                <div className="text-green-100 text-xs mb-1">Phụ huynh</div>
                                <div className="text-2xl font-bold text-white">{parentCount}</div>
                            </div>
                            <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-purple-300/30">
                                <div className="text-purple-100 text-xs mb-1">Tài xế</div>
                                <div className="text-2xl font-bold text-white">{driverCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter và Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-wrap flex-1">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-purple-300 transition-colors">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer"
                            >
                                <option value="all">Tất cả vai trò</option>
                                <option value="parent">Phụ huynh</option>
                                <option value="driver">Tài xế</option>
                                <option value="manager">Quản lý</option>
                            </select>
                        </div>

                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, số điện thoại hoặc ID..."
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ← Sửa button này */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <UserPlus size={20} /> Thêm người dùng
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-indigo-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-100 rounded-full p-3">
                            <Users className="text-indigo-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng tài khoản</h3>
                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                    <p className="text-xs text-gray-500 mt-2">Đang hoạt động</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Phụ huynh</h3>
                    <p className="text-3xl font-bold text-gray-900">{parentCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Đang theo dõi học sinh</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 rounded-full p-3">
                            <Users className="text-purple-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Tài xế</h3>
                    <p className="text-3xl font-bold text-gray-900">{driverCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Đã được phân công</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <Shield className="text-orange-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Quản lý</h3>
                    <p className="text-3xl font-bold text-gray-900">{managerCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Quyền quản trị</p>
                </div>
            </div>

            {/* Account Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <AccountTable
                    users={filteredUsers}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    loading={loading}
                />
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && !loading && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100 mt-6">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                        <Users className="text-gray-400" size={48} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Không tìm thấy người dùng
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setFilterRole("all");
                        }}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            )}

            {/* ← Thêm Modal component */}
            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateUser}
            />
        </div>
    );
}

export default AccountManager;