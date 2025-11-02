import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "../components/StudentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToastService from "@/lib/toastService";
import { getAllParentStudent } from "@/api/parentstudentApi";
import { GraduationCap, UserPlus, Filter, Search, TrendingUp, BookOpen, Users, Award } from "lucide-react";

function StudentManager() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("all");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await getAllParentStudent();

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

    // Thống kê theo lớp
    const activeStudents = students.filter(s => s.active).length;
    const totalClasses = new Set(students.map(s => s.Lop)).size;

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded p-5 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải danh sách học sinh...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6">
            {/* Header Banner với illustration */}
            <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* Student illustration SVG */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
                    <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
                        {/* Graduation cap */}
                        <rect x="50" y="30" width="100" height="8" fill="white" opacity="0.9" />
                        <polygon points="100,20 40,35 100,50 160,35" fill="white" opacity="0.9" />
                        <rect x="95" y="50" width="10" height="30" fill="white" opacity="0.8" />
                        <circle cx="100" cy="85" r="8" fill="white" opacity="0.8" />
                        {/* Books */}
                        <rect x="30" y="100" width="40" height="30" rx="2" fill="white" opacity="0.7" />
                        <rect x="75" y="105" width="40" height="25" rx="2" fill="white" opacity="0.6" />
                        <rect x="120" y="95" width="40" height="35" rx="2" fill="white" opacity="0.5" />
                    </svg>
                </div>

                <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <GraduationCap className="text-white" size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    Quản lý học sinh
                                </h1>
                                <p className="text-cyan-100">
                                    Theo dõi và quản lý thông tin học sinh toàn trường
                                </p>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="hidden md:flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">Tổng số</div>
                                <div className="text-2xl font-bold text-white">{students.length}</div>
                            </div>
                            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                                <div className="text-green-100 text-xs mb-1">Đang học</div>
                                <div className="text-2xl font-bold text-white">{activeStudents}</div>
                            </div>
                            <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-blue-300/30">
                                <div className="text-blue-100 text-xs mb-1">Số lớp</div>
                                <div className="text-2xl font-bold text-white">{totalClasses}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter và Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-wrap flex-1">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-cyan-300 transition-colors">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer"
                            >
                                <option value="all">Tất cả lớp ({students.length})</option>
                                {classList.filter(c => c !== "all").map(className => (
                                    <option key={className} value={className}>
                                        {className} ({students.filter(s => s.Lop === className).length})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, mã học sinh hoặc lớp..."
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/students/create")}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <UserPlus size={20} /> Thêm học sinh
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <GraduationCap className="text-blue-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng học sinh</h3>
                    <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                    <p className="text-xs text-gray-500 mt-2">Toàn trường</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Đang học tập</h3>
                    <p className="text-3xl font-bold text-gray-900">{activeStudents}</p>
                    <p className="text-xs text-gray-500 mt-2">Học sinh hoạt động</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-cyan-100 rounded-full p-3">
                            <BookOpen className="text-cyan-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Số lớp học</h3>
                    <p className="text-3xl font-bold text-gray-900">{totalClasses}</p>
                    <p className="text-xs text-gray-500 mt-2">Đang hoạt động</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <Award className="text-orange-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Trung bình/Lớp</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {totalClasses > 0 ? Math.round(students.length / totalClasses) : 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Học sinh mỗi lớp</p>
                </div>
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {filteredStudents.length === 0 ? (
                    <div className="text-center py-16 px-6">
                        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="text-gray-400" size={48} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchTerm || filterClass !== "all"
                                ? "Không tìm thấy học sinh"
                                : "Chưa có học sinh nào"}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || filterClass !== "all"
                                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                                : "Bắt đầu thêm học sinh vào hệ thống"}
                        </p>
                        {(searchTerm || filterClass !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterClass("all");
                                }}
                                className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                ) : (
                    <StudentTable
                        students={filteredStudents}
                        onEdit={handleEditStudent}
                        onDelete={handleDeleteStudent}
                    />
                )}
            </div>
        </div>
    );
}

export default StudentManager;