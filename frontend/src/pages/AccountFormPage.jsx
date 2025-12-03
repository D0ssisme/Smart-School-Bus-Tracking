import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ToastService from "@/lib/toastService";
import { mockUsers } from "@/lib/mockData";
import { useLanguage } from '../contexts/LanguageContext';

function AccountFormPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        uid: "",
        name: "",
        email: "",
        phone: "",
        password: "",
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
            isEditMode ? t('accountForm.updating') : t('accountForm.adding')
        );

        setTimeout(() => {
            ToastService.update(
                loadingToast,
                isEditMode ? t('accountForm.updateSuccess') : t('accountForm.addSuccess'),
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
                    {isEditMode ? t('accountForm.editTitle') : t('accountForm.addTitle')}
                </h1>
                <p className="text-gray-600 mt-1">
                    {isEditMode ? t('accountForm.editSubtitle') : t('accountForm.addSubtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* uid */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            UID <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="uid"
                            value={formData.uid}
                            onChange={handleChange}
                            placeholder="Nhập UID"
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

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu..."
                            required
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$"
                        />
                        <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 10 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!</p>
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
                            <option value="manager">Quản lý</option>
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