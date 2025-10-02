import React, { useState } from "react";
import AccountTable from "../components/AccountTable";
import AccountForm from "../components/AccountForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUsers } from "@/lib/mockData";

function AccountManager() {
    const [users, setUsers] = useState(mockUsers);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const handleAddUser = (newUser) => {
        const user = {
            ...newUser,
            id: crypto.randomUUID(),
            joinDate: new Date().toISOString().split('T')[0],
            status: "active"
        };
        setUsers([...users, user]);
        setIsFormOpen(false);
    };

    const handleEditUser = (updatedUser) => {
        setUsers(users.map(u =>
            u.id === updatedUser.id ? { ...u, ...updatedUser } : u
        ));
        setIsFormOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (id) => {
        if (confirm("Bạn có chắc muốn xóa tài khoản này?")) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const openEditForm = (user) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const filteredUsers = users.filter(user => {
        const matchSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.msdd.includes(searchTerm);
        const matchRole = filterRole === "all" || user.role === filterRole;
        return matchSearch && matchRole;
    });

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Quản lý tài khoản
                </h1>

                <div className="flex gap-4 items-center">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="parent">Phụ huynh</option>
                        <option value="driver">Tài xế</option>
                        <option value="admin">Quản trị viên</option>
                    </select>

                    <Input
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />

                    <Button
                        onClick={() => {
                            setEditingUser(null);
                            setIsFormOpen(true);
                        }}
                        className="ml-auto bg-blue-600 hover:bg-blue-700"
                    >
                        THÊM NGƯỜI DÙNG
                    </Button>
                </div>
            </div>

            <AccountTable
                users={filteredUsers}
                onEdit={openEditForm}
                onDelete={handleDeleteUser}
            />

            <AccountForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingUser(null);
                }}
                onSubmit={editingUser ? handleEditUser : handleAddUser}
                editingUser={editingUser}
            />
        </div>
    );
}

export default AccountManager;
