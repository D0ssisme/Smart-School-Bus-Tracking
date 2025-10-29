import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ToastService from "@/lib/toastService";
import { mockStudents, mockRoutes } from "@/lib/mockData";

function StudentFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        MaHS: "",
        HoTen: "",
        Lop: "",
        MaPhuHuynh: "",
        MaTuyen: "",
        status: "active"
    });

    useEffect(() => {
        if (isEditMode) {
            const student = mockStudents.find(s => s.id === parseInt(id));
            if (student) {
                setFormData(student);
            } else {
                ToastService.error("Không tìm thấy học sinh!");
                navigate("/students");
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

        // Validation
        if (!formData.MaHS || !formData.HoTen || !formData.Lop) {
            ToastService.warning("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const loadingToast = ToastService.loading(
            isEditMode ? "Đang cập nhật học sinh..." : "Đang thêm học sinh..."
        );

        setTimeout(() => {
            ToastService.update(
                loadingToast,
                isEditMode ? "Cập nhật học sinh thành công!" : "Thêm học sinh thành công!",
                "success"
            );

            setTimeout(() => {
                navigate("/students");
            }, 1000);
        }, 1500);
    };

    const handleCancel = () => {
        if (confirm("Bạn có chắc muốn hủy? Các thay đổi sẽ không được lưu.")) {
            navigate("/students");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/students")}
                    className="mb-4 -ml-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEditMode ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}
                </h1>
                <p className="text-gray-600 mt-1">
                    {isEditMode ? "Cập nhật thông tin học sinh" : "Điền thông tin để thêm học sinh mới"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mã học sinh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã học sinh <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="MaHS"
                            value={formData.MaHS}
                            onChange={handleChange}
                            placeholder="Nhập mã học sinh (VD: HS001)"
                            required
                        />
                    </div>

                    {/* Họ và tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="HoTen"
                            value={formData.HoTen}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên học sinh"
                            required
                        />
                    </div>

                    {/* Lớp */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lớp <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="Lop"
                            value={formData.Lop}
                            onChange={handleChange}
                            placeholder="Nhập lớp (VD: 10A1)"
                            required
                        />
                    </div>

                    {/* Mã phụ huynh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã phụ huynh <span className="text-red-500">*</span>
                        </label>
                        <Input
                            name="MaPhuHuynh"
                            value={formData.MaPhuHuynh}
                            onChange={handleChange}
                            placeholder="Nhập mã phụ huynh (VD: PH001)"
                            required
                        />
                    </div>

                    {/* Tuyến xe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tuyến xe <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="MaTuyen"
                            value={formData.MaTuyen}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">-- Chọn tuyến xe --</option>
                            {mockRoutes.map((route) => (
                                <option key={route.id} value={route.id}>
                                    {route.name}
                                </option>
                            ))}
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
                        className="bg-blue-900 hover:bg-blue-700 px-6"
                    >
                        {isEditMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default StudentFormPage;