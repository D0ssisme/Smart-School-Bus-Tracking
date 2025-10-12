import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ToastService from "@/lib/toastService";
import { mockUsers } from "@/lib/mockData";

function AccountFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        msdd: "",
        name: "",
        email: "",
        phone: "",
        gender: "Nam",
        birthday: "",
        role: "parent"
    });

    useEffect(() => {
        if (isEditMode) {
            const user = mockUsers.find(u => u.id === parseInt(id));
            if (user) {
                setFormData(user);
            } else {
                ToastService.error("Không tìm thấy người dùng!");
                navigate("/accounts");
            }
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation số điện thoại
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            ToastService.warning("Số điện thoại phải có 10 chữ số!");
            return;
        }

        const loadingToast = ToastService.loading(
            isEditMode ? "Đang cập nhật..." : "Đang thêm người dùng..."
        );

        setTimeout(() => {
            ToastService.update(
                loadingToast,
                isEditMode ? "Cập nhật thành công!" : "Thêm người dùng thành công!",
                "success"
            );

            setTimeout(() => {
                navigate("/accounts");
            }, 1000);
        }, 1500);
    };

    const handleCancel = () => {
        if (confirm("Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.")) {
            navigate("/accounts");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/accounts")}
                    className="mb-4 -ml-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                </h1>
                <p className="text-gray-600 mt-1">
                    {isEditMode ? "Cập nhật thông tin người dùng" : "Điền thông tin để tạo tài khoản mới"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* MSDD */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            MSDD <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="msdd"
                            value={formData.msdd}
                            onChange={handleChange}
                            placeholder="Nhập MSDD"
                            required
                        />
                    </div>

                    {/* Họ và tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
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

                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="0901234567"
                            maxLength={10}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Nhập 10 chữ số</p>
                    </div>

                    {/* Giới tính */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>

                    {/* Ngày sinh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="birthday"
                            type="date"
                            value={formData.birthday}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Nhóm quyền */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhóm quyền <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="parent">Phụ huynh</option>
                            <option value="driver">Tài xế</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-6"
                    >
                        {isEditMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AccountFormPage;