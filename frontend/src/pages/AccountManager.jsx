import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountTable from "../components/AccountTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getParentsApi, getDriversApi } from "@/api/userApi";
import ToastService from "@/lib/toastService";

function AccountManager() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [loading, setLoading] = useState(true);

    // Fetch users khi component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const loadingToast = ToastService.loading("Đang tải danh sách người dùng...");
        
        try {
            setLoading(true);
            
            // Gọi cả 2 API song song
            const [parentsData, driversData] = await Promise.all([
                getParentsApi(),
                getDriversApi()
            ]);

            // Gộp data từ cả 2 API
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

    const handleDeleteUser = async (id) => {
        if (confirm("Bạn có chắc muốn xóa tài khoản này?")) {
            const loadingToast = ToastService.loading("Đang xóa người dùng...");

            try {
                // TODO: Gọi API xóa user
                // await deleteUserApi(id);
                
                // Tạm thời xóa từ state (sau 1s để giống async)
                setTimeout(() => {
                    setUsers(users.filter(u => u._id !== id));
                    ToastService.update(loadingToast, "Xóa người dùng thành công!", "success");
                }, 1000);
            } catch (error) {
                console.error('Error deleting user:', error);
                ToastService.update(loadingToast, "Không thể xóa người dùng. Vui lòng thử lại!", "error");
            }
        }
    };

    const handleEditUser = (user) => {
        // Sử dụng _id từ MongoDB
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

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex gap-4 items-center">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="parent">Phụ huynh</option>
                        <option value="driver">Tài xế</option>
                        <option value="manager">Quản lý</option>
                    </select>

                    <Input
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />

                    <Button
                        onClick={() => navigate("/accounts/create")}
                        className="ml-auto bg-blue-900 hover:bg-blue-700"
                    >
                        THÊM NGƯỜI DÙNG
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Tổng tài khoản</p>
                    <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Phụ huynh</p>
                    <p className="text-2xl font-bold text-green-700">
                        {users.filter(u => u.role === 'parent').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Tài xế</p>
                    <p className="text-2xl font-bold text-purple-700">
                        {users.filter(u => u.role === 'driver').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Quản lý</p>
                    <p className="text-2xl font-bold text-orange-700">
                        {users.filter(u => u.role === 'manager').length}
                    </p>
                </div>
            </div>

            <AccountTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                loading={loading}
            />
        </div>
    );
}

export default AccountManager;