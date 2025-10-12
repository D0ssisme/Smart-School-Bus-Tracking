import React from "react";
import { Badge } from "@/components/ui/badge";

function StudentTable({ students, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mã HS</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Họ và tên</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lớp</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mã Phụ huynh</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mã Tuyến</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                Không tìm thấy học sinh nào
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {student.MaHS}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {student.HoTen.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {student.HoTen}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                        {student.Lop}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">{student.MaPhuHuynh}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{student.MaTuyen}</td>
                                <td className="px-6 py-4">
                                    <Badge
                                        variant={student.status === "active" ? "default" : "secondary"}
                                        className={student.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                                    >
                                        {student.status === "active" ? "Đang học" : "Nghỉ học"}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(student)}
                                            className="p-2 hover:bg-gray-100 rounded transition"
                                            title="Chỉnh sửa"
                                        >
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(student.id)}
                                            className="p-2 hover:bg-gray-100 rounded transition"
                                            title="Xóa"
                                        >
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default StudentTable;