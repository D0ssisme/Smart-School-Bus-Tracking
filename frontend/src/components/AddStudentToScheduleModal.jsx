import React, { useState, useEffect } from 'react';
import { X, UserPlus, Search, MapPin, User } from 'lucide-react';
import { getAllStudentRouteAssignments } from '@/api/studentrouteassignmentApi';
import { createStudentBusAssignment } from '@/api/studentbusassignmentApi';
import { toast } from 'react-hot-toast';

const AddStudentToScheduleModal = ({ isOpen, onClose, scheduleInfo, onStudentAdded, existingStudentIds }) => {
    const [availableStudents, setAvailableStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        if (isOpen && scheduleInfo) {
            fetchAvailableStudents();
        }
    }, [isOpen, scheduleInfo]);

    useEffect(() => {
        // Filter students based on search term
        if (searchTerm.trim() === '') {
            setFilteredStudents(availableStudents);
        } else {
            const filtered = availableStudents.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.grade.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, availableStudents]);

    const fetchAvailableStudents = async () => {
        try {
            setFetchLoading(true);

            // Lấy tất cả student route assignments
            const routeAssignments = await getAllStudentRouteAssignments();
            console.log("📦 All route assignments:", routeAssignments);
            console.log("🗺️ Schedule route_id:", scheduleInfo.routeId);
            console.log("👥 Existing student IDs:", existingStudentIds);

            // Lọc học sinh có cùng route_id với schedule
            const studentsInRoute = routeAssignments.filter(assignment => {
                const assignmentRouteId = assignment.route_id?._id || assignment.route_id;
                return assignmentRouteId.toString() === scheduleInfo.routeId.toString();
            });

            console.log("👥 Students in same route:", studentsInRoute);

            // Transform data và loại bỏ học sinh đã có trong schedule
            const transformedStudents = studentsInRoute
                .map(assignment => {
                    const student = assignment.student_id;
                    const studentObjectId = student?._id || student;

                    // ✅ Kiểm tra xem học sinh đã có trong bus assignment chưa
                    // existingStudentIds chứa student._id (ObjectId của học sinh)
                    const isAlreadyInBus = existingStudentIds.some(existingId =>
                        existingId?.toString() === studentObjectId?.toString()
                    );

                    console.log(`Checking student ${student?.name}:`, {
                        studentObjectId: studentObjectId?.toString(),
                        existingIds: existingStudentIds.map(id => id?.toString()),
                        isAlreadyInBus
                    });

                    // Skip nếu học sinh đã có trong schedule
                    if (isAlreadyInBus) {
                        console.log(`❌ Skipping ${student?.name} - already in schedule`);
                        return null;
                    }

                    console.log(`✅ Including ${student?.name} - not in schedule yet`);

                    return {
                        _id: studentObjectId,
                        assignment_id: assignment._id,
                        student_id: student?.student_id || 'N/A',
                        name: student?.name || 'Không rõ',
                        grade: student?.grade || 'N/A',
                        pickup_stop: assignment.pickup_stop_id?.name || assignment.pickup_stop_id?.address || 'Chưa xác định',
                        dropoff_stop: assignment.dropoff_stop_id?.name || assignment.dropoff_stop_id?.address || 'Chưa xác định',
                        pickup_stop_id: assignment.pickup_stop_id?._id || assignment.pickup_stop_id,
                        dropoff_stop_id: assignment.dropoff_stop_id?._id || assignment.dropoff_stop_id,
                        active: assignment.active
                    };
                })
                .filter(Boolean); // Remove nulls

            console.log("✅ Available students after filtering:", transformedStudents);
            setAvailableStudents(transformedStudents);
            setFilteredStudents(transformedStudents);

        } catch (error) {
            console.error('❌ Error fetching available students:', error);
            toast.error('Không thể tải danh sách học sinh');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s._id));
        }
    };

    const handleAddStudents = async () => {
        if (selectedStudents.length === 0) {
            toast.error('Vui lòng chọn ít nhất một học sinh');
            return;
        }

        const loadingToast = toast.loading(`Đang thêm ${selectedStudents.length} học sinh...`);
        setLoading(true);

        try {
            // Tạo bus assignments cho từng học sinh được chọn
            const promises = selectedStudents.map(studentId => {
                return createStudentBusAssignment({
                    student_id: studentId,
                    schedule_id: scheduleInfo._id || scheduleInfo.id,
                    pickup_status: 'pending',
                    dropoff_status: 'pending'
                });
            });

            await Promise.all(promises);

            toast.success(`Đã thêm ${selectedStudents.length} học sinh vào lịch trình!`, {
                id: loadingToast
            });

            // Callback để refresh danh sách
            if (onStudentAdded) {
                onStudentAdded();
            }

            // Close modal
            handleClose();

        } catch (error) {
            console.error('❌ Error adding students:', error);
            toast.error('Không thể thêm học sinh. Vui lòng thử lại!', {
                id: loadingToast
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSearchTerm('');
        setSelectedStudents([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                            <UserPlus className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Thêm học sinh vào lịch trình</h2>
                            <p className="text-cyan-100 text-sm">
                                {scheduleInfo?.routeName} - Xe {scheduleInfo?.plate}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {fetchLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-600 border-t-transparent mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang tải danh sách học sinh...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Search & Select All */}
                            <div className="mb-4 space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tìm theo tên, mã học sinh, lớp..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Chọn tất cả ({filteredStudents.length} học sinh)
                                        </span>
                                    </label>

                                    {selectedStudents.length > 0 && (
                                        <span className="text-sm font-semibold text-cyan-600">
                                            Đã chọn: {selectedStudents.length}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Student List */}
                            <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
                                {filteredStudents.length === 0 ? (
                                    <div className="text-center py-12 px-6">
                                        <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                            <User className="text-gray-400" size={40} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                            {searchTerm ? "Không tìm thấy học sinh" : "Không có học sinh khả dụng"}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {searchTerm
                                                ? "Thử thay đổi từ khóa tìm kiếm"
                                                : "Tất cả học sinh trong tuyến này đã được thêm vào lịch trình"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200">
                                        {filteredStudents.map((student) => (
                                            <label
                                                key={student._id}
                                                className="flex items-start gap-4 p-4 hover:bg-cyan-50 cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student._id)}
                                                    onChange={() => handleSelectStudent(student._id)}
                                                    className="mt-1 w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                                />

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold">
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{student.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                                <span className="font-mono">{student.student_id}</span>
                                                                <span>•</span>
                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                                    {student.grade}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1 ml-13">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <MapPin size={14} className="text-green-600 flex-shrink-0" />
                                                            <span className="text-gray-700">
                                                                <span className="font-medium">Đón:</span> {student.pickup_stop}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <MapPin size={14} className="text-red-600 flex-shrink-0" />
                                                            <span className="text-gray-700">
                                                                <span className="font-medium">Trả:</span> {student.dropoff_stop}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAddStudents}
                        disabled={loading || selectedStudents.length === 0}
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} />
                                Thêm {selectedStudents.length > 0 ? `${selectedStudents.length} ` : ''}học sinh
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AddStudentToScheduleModal;