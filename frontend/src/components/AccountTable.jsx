import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Pagination from "./Pagination";
import { roleLabels } from "@/lib/mockData";

function AccountTable({ users, onEdit, onDelete, loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const accountPerPage = 1; // 👉 số account mỗi trang

  // Tính vị trí phân trang
  const totalPages = Math.ceil(users.length / accountPerPage);
  const indexOfLast = currentPage * accountPerPage;
  const indexOfFirst = indexOfLast - accountPerPage;
  const currentStudents = users.slice(indexOfFirst, indexOfLast);

  // Chuyển trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0zM7 10a2 2 0 11-4 0 2 2 0z"
            />
          </svg>
          <p className="text-lg font-medium">Không có người dùng nào</p>
          <p className="text-sm mt-1">
            Không tìm thấy người dùng phù hợp với bộ lọc
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              UID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Họ và tên
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Số điện thoại
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Nhóm quyền
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Thông tin bổ sung
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Hành động
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {currentStudents.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.userId || "—"}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {user.phoneNumber || "Chưa cập nhật"}
              </td>

              <td className="px-6 py-4">
                <Badge
                  variant={
                    user.role === "admin"
                      ? "destructive"
                      : user.role === "driver"
                      ? "default"
                      : user.role === "parent"
                      ? "secondary"
                      : "outline"
                  }
                  className="font-medium"
                >
                  {roleLabels[user.role] || user.role}
                </Badge>
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {user.role === "driver" && user.driverInfo && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        />
                      </svg>
                      <span className="text-xs">
                        <span className="font-medium">GPLX:</span>{" "}
                        {user.driverInfo.licenseNumber}
                      </span>
                    </div>
                    {user.driverInfo.vehiclePlate && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span className="text-xs">
                          <span className="font-medium">Biển số:</span>{" "}
                          {user.driverInfo.vehiclePlate}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {user.role === "parent" && user.parentInfo && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-xs">
                      {user.parentInfo.address || "Chưa cập nhật"}
                    </span>
                  </div>
                )}
                {user.role !== "driver" && user.role !== "parent" && (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>

              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 hover:bg-blue-50 rounded transition"
                    title="Chỉnh sửa"
                  >
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                    onClick={() => onDelete(user._id)}
                    className="p-2 hover:bg-red-50 rounded transition"
                    title="Xóa"
                  >
                    <svg
                      className="w-5 h-5 text-red-600"
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
          ))}
        </tbody>
      </table>

      {/* ======= PHÂN TRANG ======= */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      
    </div>
  );
}

export default AccountTable;
