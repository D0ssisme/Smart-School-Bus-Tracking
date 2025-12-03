import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentTable from "../components/StudentTable";
import AddStudentModal from "../components/AddStudentModal";

import EditStudentModal from "../components/EditStudentModal ";
import ToastService from "@/lib/toastService";
import { getAllParentStudent } from "@/api/parentstudentApi";
import { getParentsApi } from "@/api/userApi";
import { getRoutesApi } from "@/api/routeApi";
import { createStudent, deleteStudent, updateStudent } from "@/api/studentApi";
import { createParentStudent } from "@/api/parentstudentApi";
import { createStudentRouteAssignment, getAllStudentRouteAssignments, updateStudentRouteAssignment } from "@/api/studentrouteassignmentApi";
import { getAllStudentBusAssignments, deleteStudentBusAssignment } from "@/api/studentbusassignmentApi";
import { GraduationCap, UserPlus, Filter, Search, TrendingUp, BookOpen, Users, Award } from "lucide-react";
import Swal from 'sweetalert2';
import { useLanguage } from '../contexts/LanguageContext'; // ✅ Import hook

function StudentManager() {
    const { t } = useLanguage(); // ✅ Sử dụng hook
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("all");

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parents, setParents] = useState([]);
    const [routes, setRoutes] = useState([]);

    // ✅ Thêm t vào dependency để reload lại text khi đổi ngôn ngữ
    useEffect(() => {
        fetchStudents();
        fetchParentsAndRoutes();
    }, [t]);

    const fetchStudents = async () => {
        try {
            setLoading(true);

            // Gọi song song cả 2 API
            const [parentStudentData, routeAssignmentsData] = await Promise.all([
                getAllParentStudent(),
                getAllStudentRouteAssignments()
            ]);

            // Tạo Map để tra cứu nhanh route assignments theo student_id
            const routeAssignmentsMap = new Map();
            routeAssignmentsData.forEach(assignment => {
                const studentId = assignment?.student_id?._id;
                if (studentId) {
                    routeAssignmentsMap.set(studentId, assignment);
                }
            });

            // Transform data và merge thông tin điểm đón/trả
            const transformedData = parentStudentData
                .map(item => {
                    const studentObj = item.student_id;
                    const parentObj = item.parent_id;

                    if (!studentObj?._id || !parentObj?._id) {
                        return null;
                    }

                    const studentId = studentObj._id;
                    const routeAssignment = routeAssignmentsMap.get(studentId);

                    return {
                        id: studentId,
                        MaHS: studentObj.student_id,
                        HoTen: studentObj.name,
                        Lop: studentObj.grade,
                        parent_id: parentObj._id,
                        parent_name: parentObj.name,
                        MaPhuHuynh: parentObj.userId,
                        active: item.active,
                        createdAt: item.createdAt,

                        // ✅ Sử dụng t(...) cho các giá trị mặc định
                        Diemdon: routeAssignment?.pickup_stop_id?.name || t('studentManager.data.noInfo'),
                        Diemtra: routeAssignment?.dropoff_stop_id?.name || t('studentManager.data.noInfo'),
                        pickupStop: routeAssignment?.pickup_stop_id?.name || t('studentManager.data.noInfo'),
                        dropoffStop: routeAssignment?.dropoff_stop_id?.name || t('studentManager.data.noInfo'),
                        routeName: routeAssignment?.route_id?.name || t('studentManager.data.noRoute'),
                        pickupStopId: routeAssignment?.pickup_stop_id?._id,
                        dropoffStopId: routeAssignment?.dropoff_stop_id?._id,
                        routeId: routeAssignment?.route_id?._id,
                        routeAssignmentId: routeAssignment?._id
                    };
                })
                .filter(Boolean);

            setStudents(transformedData);
        } catch (error) {
            console.error("Error fetching students:", error);
            ToastService.error(t('studentManager.messages.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    const fetchParentsAndRoutes = async () => {
        try {
            const [parentsData, routesData] = await Promise.all([
                getParentsApi(),
                getRoutesApi()
            ]);
            setParents(parentsData);
            setRoutes(routesData);
        } catch (error) {
            console.error('Error fetching parents and routes:', error);
            ToastService.error(t('studentManager.messages.fetchMetaError'));
        }
    };

    const handleAddStudent = async (formData) => {
        const loadingToast = ToastService.loading(t('studentManager.messages.adding'));

        try {
            const studentPayload = {
                name: formData.name,
                grade: formData.class
            };

            const response = await createStudent(studentPayload);

            const relationPayload = {
                parent_id: formData.parentId,
                student_id: response.student._id,
                active: true
            };

            const assignmentPayload = {
                student_id: response.student._id,
                route_id: formData.routeId,
                pickup_stop_id: formData.pickupStopId,
                dropoff_stop_id: formData.dropoffStopId
            };

            await createParentStudent(relationPayload);
            await createStudentRouteAssignment(assignmentPayload);

            ToastService.update(loadingToast, t('studentManager.messages.addSuccess'), "success");
            setIsModalOpen(false);

            await fetchStudents();
        } catch (error) {
            console.error('❌ Error adding student:', error);
            const errorMsg = error.response?.data?.message || t('studentManager.messages.addError');
            ToastService.update(loadingToast, errorMsg, "error");
        }
    };

    const handleDeleteStudent = async (id) => {
        const student = students.find(s => s.id === id);

        Swal.fire({
            title: t('studentManager.swal.deleteTitle'),
            html: `
            <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="margin: 0; font-size: 16px;">
                    <strong>👤 ${t('studentManager.swal.student')}:</strong> ${student?.HoTen || 'N/A'}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                    <strong>📚 ${t('studentManager.swal.class')}:</strong> ${student?.Lop || 'N/A'}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
                    <strong>🆔 ${t('studentManager.swal.studentCode')}:</strong> ${student?.MaHS || 'N/A'}
                </p>
            </div>
           
            <p style="color: #d33; font-weight: bold; margin-top: 16px;">${t('studentManager.swal.warningAction')}</p>
        `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: t('studentManager.swal.btnDelete'),
            cancelButtonText: t('studentManager.swal.btnCancel'),
            width: 550
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loadingToast = ToastService.loading(t('studentManager.swal.deleteLoading'));

                try {
                    await deleteStudent(id);
                    setStudents(students.filter(s => s.id !== id));
                    ToastService.update(loadingToast, t('studentManager.messages.deleteSuccess'), "success");
                } catch (error) {
                    console.error("Error deleting student:", error);
                    const errorMsg = error.response?.data?.message || t('studentManager.messages.deleteError');
                    ToastService.update(loadingToast, errorMsg, "error");
                }
            }
        });
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setIsEditModalOpen(true);
    };

    const handleUpdateStudent = async (formData) => {
        const loadingToast = ToastService.loading(t('studentManager.messages.updating'));

        try {
            // 1. Cập nhật thông tin học sinh
            await updateStudent(editingStudent.id, {
                name: formData.name,
                grade: formData.class
            });

            // 2. Kiểm tra xem có thay đổi tuyến đường không
            const routeChanged = editingStudent.routeId && editingStudent.routeId !== formData.routeId;

            // 3. Nếu đổi tuyến, xóa học sinh khỏi tất cả schedules của tuyến cũ
            if (routeChanged) {
                try {
                    const allAssignments = await getAllStudentBusAssignments();
                    const studentAssignments = allAssignments.filter(
                        assignment => assignment.student_id?._id === editingStudent.id
                    );
                    for (const assignment of studentAssignments) {
                        await deleteStudentBusAssignment(assignment._id);
                    }
                    console.log(`✅ Đã xóa ${studentAssignments.length} lịch trình cũ`);
                } catch (err) {
                    console.error('⚠️ Lỗi khi xóa lịch trình cũ:', err);
                }
            }

            // 4. Cập nhật route assignment
            if (editingStudent.routeAssignmentId) {
                await updateStudentRouteAssignment(editingStudent.routeAssignmentId, {
                    route_id: formData.routeId,
                    pickup_stop_id: formData.pickupStopId,
                    dropoff_stop_id: formData.dropoffStopId
                });
            } else {
                await createStudentRouteAssignment({
                    student_id: editingStudent.id,
                    route_id: formData.routeId,
                    pickup_stop_id: formData.pickupStopId,
                    dropoff_stop_id: formData.dropoffStopId
                });
            }

            ToastService.update(loadingToast, t('studentManager.messages.updateSuccess'), "success");
            setIsEditModalOpen(false);
            setEditingStudent(null);
            await fetchStudents();
        } catch (error) {
            console.error('❌ Error updating student:', error);
            const errorMsg = error.response?.data?.message || t('studentManager.messages.updateError');
            ToastService.update(loadingToast, errorMsg, "error");
        }
    };

    const classList = ["all", ...new Set(students.map(s => s.Lop))];

    const filteredStudents = students.filter(student => {
        const matchSearch =
            student.HoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.MaHS.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.Lop.toLowerCase().includes(searchTerm.toLowerCase());
        const matchClass = filterClass === "all" || student.Lop === filterClass;
        return matchSearch && matchClass;
    });

    const activeStudents = students.filter(s => s.active).length;
    const totalClasses = new Set(students.map(s => s.Lop)).size;

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded p-5 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">{t('studentManager.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
                    {/* SVG giữ nguyên */}
                    <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
                        <rect x="50" y="30" width="100" height="8" fill="white" opacity="0.9" />
                        <polygon points="100,20 40,35 100,50 160,35" fill="white" opacity="0.9" />
                        <rect x="95" y="50" width="10" height="30" fill="white" opacity="0.8" />
                        <circle cx="100" cy="85" r="8" fill="white" opacity="0.8" />
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
                                    {t('studentManager.title')}
                                </h1>
                                <p className="text-cyan-100">
                                    {t('studentManager.subtitle')}
                                </p>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="hidden md:flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">{t('studentManager.stats.total')}</div>
                                <div className="text-2xl font-bold text-white">{students.length}</div>
                            </div>
                            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                                <div className="text-green-100 text-xs mb-1">{t('studentManager.stats.studyingShort')}</div>
                                <div className="text-2xl font-bold text-white">{activeStudents}</div>
                            </div>
                            <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-blue-300/30">
                                <div className="text-blue-100 text-xs mb-1">{t('studentManager.stats.classCount')}</div>
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
                                <option value="all">{t('studentManager.filter.allClasses')} ({students.length})</option>
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
                                placeholder={t('studentManager.filter.searchPlaceholder')}
                                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <UserPlus size={20} /> {t('studentManager.filter.addBtn')}
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
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('studentManager.stats.totalStudents')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('studentManager.stats.schoolWide')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <Users className="text-green-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('studentManager.stats.studying')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{activeStudents}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('studentManager.stats.activeStudents')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-cyan-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-cyan-100 rounded-full p-3">
                            <BookOpen className="text-cyan-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('studentManager.stats.classes')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{totalClasses}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('studentManager.stats.activeClasses')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 rounded-full p-3">
                            <Award className="text-orange-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('studentManager.stats.avgPerClass')}</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {totalClasses > 0 ? Math.round(students.length / totalClasses) : 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{t('studentManager.stats.studentPerClass')}</p>
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
                                ? t('studentManager.empty.notFoundTitle')
                                : t('studentManager.empty.noDataTitle')}
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {searchTerm || filterClass !== "all"
                                ? t('studentManager.empty.notFoundDesc')
                                : t('studentManager.empty.noDataDesc')}
                        </p>
                        {(searchTerm || filterClass !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterClass("all");
                                }}
                                className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                            >
                                {t('studentManager.filter.clearFilter')}
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

            {/* Add Student Modal */}
            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddStudent}
                parents={parents}
                routes={routes}
            />

            {/* ✅ Edit Student Modal - RIÊNG BIỆT */}
            <EditStudentModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingStudent(null);
                }}
                onSubmit={handleUpdateStudent}
                student={editingStudent}
                parents={parents}
                routes={routes}
            />
        </div>
    );
}

export default StudentManager;