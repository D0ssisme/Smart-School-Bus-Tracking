import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "../components/StudentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockStudents } from "@/lib/mockData";
import ToastService from "@/lib/toastService";

function StudentManager() {
    const navigate = useNavigate();
    const [students, setStudents] = useState(mockStudents);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("all");

    const handleDeleteStudent = (id) => {
        if (confirm("Bạn có chắc muốn xóa học sinh này?")) {
            const loadingToast = ToastService.loading("Đang xóa học sinh...");

            setTimeout(() => {
                setStudents(students.filter(s => s.id !== id));
                ToastService.update(loadingToast, "Xóa học sinh thành công!", "success");
            }, 1000);
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

    return (
        <div className="p-6">
            <div className="mb-6">

                <div className="flex gap-4 items-center">
                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">Tất cả lớp</option>
                        {classList.filter(c => c !== "all").map(className => (
                            <option key={className} value={className}>{className}</option>
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

            <StudentTable
                students={filteredStudents}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
            />
        </div>
    );
}

export default StudentManager;