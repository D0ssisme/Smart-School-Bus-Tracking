import React from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";

function StudentTable({ students, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Mã HS
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Họ và tên
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Lớp
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Mã Phụ huynh
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-green-600" />
                                Điểm đón
                            </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                                <Navigation size={14} className="text-blue-600" />
                                Điểm trả
                            </div>
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Hành động
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-16 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="bg-gray-100 rounded-full p-4 mb-3">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm">
                                        Không tìm thấy học sinh nào
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        students.map((student, index) => (
                            <tr
                                key={student.id}
                                className="hover:bg-blue-50/50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                        {student.MaHS}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                                            <span className="text-sm font-bold text-white">
                                                {student.HoTen.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {student.HoTen}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <Badge
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 border-purple-200 font-semibold"
                                    >
                                        {student.Lop}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                                    {student.MaPhuHuynh}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {student.Diemdon === 'Chưa có' ? (
                                        <span className="text-gray-400 italic text-xs">
                                            Chưa có
                                        </span>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            <MapPin size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-800 text-xs leading-relaxed">
                                                {student.Diemdon}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {student.Diemtra === 'Chưa có' ? (
                                        <span className="text-gray-400 italic text-xs">
                                            Chưa có
                                        </span>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            <Navigation size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-800 text-xs leading-relaxed">
                                                {student.Diemtra}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => onEdit(student)}
                                            className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200 group"
                                            title="Chỉnh sửa"
                                        >
                                            <svg
                                                className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(student.id)}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-all duration-200 group"
                                            title="Xóa"
                                        >
                                            <svg
                                                className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
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