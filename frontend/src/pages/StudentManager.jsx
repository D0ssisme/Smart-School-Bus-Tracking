import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "../components/StudentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToastService from "@/lib/toastService";
import { getAllParentStudent } from "@/api/parentstudentApi";

function StudentManager() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("all");

    // ===== FETCH DỮ LIỆU TỪ API =====
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await getAllParentStudent();

            // Transform dữ liệu API thành format phù hợp với StudentTable
            const transformedData = response.map(item => ({
                id: item.student_id._id,
                MaHS: item.student_id.student_id,
                HoTen: item.student_id.name,
                Lop: item.student_id.grade,
                parent_id: item.parent_id._id,
                parent_name: item.parent_id.name,
                MaPhuHuynh: item.parent_id.userId,
                active: item.active,
                createdAt: item.createdAt
            }));

            setStudents(transformedData);
        } catch (error) {
            console.error("Error fetching students:", error);
            ToastService.error("Không thể tải danh sách học sinh");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (confirm("Bạn có chắc muốn xóa học sinh này?")) {
            const loadingToast = ToastService.loading("Đang xóa học sinh...");

            try {
                // TODO: Gọi API delete khi có
                // await deleteStudent(id);

                // Tạm thời xóa khỏi state
                setStudents(students.filter(s => s.id !== id));
                ToastService.update(loadingToast, "Xóa học sinh thành công!", "success");
            } catch (error) {
                console.error("Error deleting student:", error);
                ToastService.update(loadingToast, "Xóa học sinh thất bại!", "error");
            }
        }
    };

    const handleEditStudent = (student) => {
        navigate(`/students/edit/${student.id}`);
    };

    // Lấy danh sách lớp unique
    const classList = ["all", ...new Set(students.map(s => s.Lop))];

    const filteredStudents = students.filter(student => {
        const matchSearch =
            student.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.MaHS.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.Lop.toLowerCase().includes(searchTerm.toLowerCase());
        const matchClass = filterClass === "all" || student.Lop === filterClass;
        return matchSearch && matchClass;
    });

    // ===== LOADING STATE =====
    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải danh sách học sinh...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex gap-4 items-center">
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả lớp ({students.length})</option>
                        {classList.filter(c => c !== "all").map(className => (
                            <option key={className} value={className}>
                                {className} ({students.filter(s => s.Lop === className).length})
                            </option>
                        ))}
                    </select>

                    <Input
                        placeholder="Tìm kiếm học sinh..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />

                    <Button
                        onClick={() => navigate("/students/create")}
                        className="ml-auto bg-blue-900 hover:bg-blue-700"
                    >
                        THÊM HỌC SINH
                    </Button>
                </div>
            </div>

            {filteredStudents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">
                        {searchTerm || filterClass !== "all"
                            ? "Không tìm thấy học sinh phù hợp"
                            : "Chưa có học sinh nào"}
                    </p>
                </div>
            ) : (
                <StudentTable
                    students={filteredStudents}
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteStudent}
                />
            )}
        </div>
    );
}

export default StudentManager;