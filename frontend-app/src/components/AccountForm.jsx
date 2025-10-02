import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AccountForm({ isOpen, onClose, onSubmit, editingUser }) {
    const [formData, setFormData] = useState({
        msdd: "",
        name: "",
        email: "",
        gender: "Nam",
        birthday: "",
        role: "parent"
    });

    useEffect(() => {
        if (editingUser) {
            setFormData(editingUser);
        } else {
            setFormData({
                msdd: "",
                name: "",
                email: "",
                gender: "Nam",
                birthday: "",
                role: "parent"
            });
        }
    }, [editingUser, isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-900">
                        {editingUser ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            MSDD
                        </label>
                        <Input
                            name="msdd"
                            value={formData.msdd}
                            onChange={handleChange}
                            placeholder="Nhập MSDD"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên
                        </label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@sgu.edu.vn"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giới tính
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày sinh
                            </label>
                            <Input
                                name="birthday"
                                type="date"
                                value={formData.birthday}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nhóm quyền
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="parent">Phụ huynh</option>
                            <option value="driver">Tài xế</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800"
                        >
                            {editingUser ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AccountForm;