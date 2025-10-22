import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountTable from "../components/AccountTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/lib/mockData";
import ToastService from "@/lib/toastService";

function AccountManager() {
    const navigate = useNavigate();
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const handleDeleteUser = (id) => {
        if (confirm("Bạn có chắc muốn xóa tài khoản này?")) {
            const loadingToast = ToastService.loading("Đang xóa người dùng...");

            setTimeout(() => {
                setUsers(users.filter(u => u.id !== id));
                ToastService.update(loadingToast, "Xóa người dùng thành công!", "success");
            }, 1000);
        }
    };

    const handleEditUser = (user) => {
        navigate(`/accounts/edit/${user.id}`);
    };

    const filteredUsers = users.filter(user => {
        const matchSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.uid.includes(searchTerm);
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

            <AccountTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
            />
        </div>
    );
}

export default AccountManager;