import React, { useState } from "react";
import { Link } from "react-router-dom";
export default function RouteList() {
  const [routes, setRoutes] = useState([
    {
      id: "12",
      name: "Bến Thành ⇄ An Sương",
      start: "Bến Thành",
      end: "An Sương",
      stops: 4,
      stopsList: ["Bến Thành", "Ngã Sáu Phù Đổng", "Công viên Lê Thị Riêng", "An Sương"],
    },
    {
      id: "34",
      name: "Suối Tiên ⇄ Chợ Lớn",
      start: "Suối Tiên",
      end: "Chợ Lớn",
      stops: 5,
      stopsList: ["Suối Tiên", "ĐH Quốc Gia", "Ngã Tư Thủ Đức", "Bến Xe Miền Đông", "Chợ Lớn"],
    },
  ]);

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tuyến này?")) {
      setRoutes(routes.filter((r) => r.id !== id));
    }
  };

  const openDetail = (route) => {
    setSelectedRoute(route);
    setIsDetailOpen(true);
  };

  const openEdit = (route) => {
    setSelectedRoute(route);
    setIsEditOpen(true);
  };

  const closeModal = () => {
    setIsDetailOpen(false);
    setIsEditOpen(false);
    setSelectedRoute(null);
  };

  const handleEditSave = () => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === selectedRoute.id ? selectedRoute : r))
    );
    closeModal();
  };

  return (
    <div className="p-4 bg-white rounded shadow min-h-screen m-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Danh sách tuyến xe buýt</h2>
         <Link
            to="/createroute"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Tạo tuyến đường mới
          </Link>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Mã tuyến</th>
            <th className="p-2 border">Tên tuyến</th>
            <th className="p-2 border">Điểm khởi đầu</th>
            <th className="p-2 border">Điểm kết thúc</th>
            <th className="p-2 border">Số điểm dừng</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="p-2 border">{r.id}</td>
              <td className="p-2 border">{r.name}</td>
              <td className="p-2 border">{r.start}</td>
              <td className="p-2 border">{r.end}</td>
              <td className="p-2 border text-center">{r.stops}</td>
              <td className="p-2 border text-center space-x-2">
                <button
                  onClick={() => openDetail(r)}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-600 transition"
                >
                  Chi tiết
                </button>

                <button
                  onClick={() => openEdit(r)}
                  className="bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-red-600 transition"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chi tiết */}
      {isDetailOpen && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Chi tiết tuyến xe</h3>
            <p><strong>Mã tuyến:</strong> {selectedRoute.id}</p>
            <p><strong>Tên tuyến:</strong> {selectedRoute.name}</p>
            <p><strong>Điểm bắt đầu:</strong> {selectedRoute.start}</p>
            <p><strong>Điểm kết thúc:</strong> {selectedRoute.end}</p>
            <p><strong>Số điểm dừng:</strong> {selectedRoute.stops}</p>

            {/* Danh sách điểm dừng */}
            <div className="mt-3">
              <strong>Danh sách điểm dừng:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-700">
                {selectedRoute.stopsList.map((stop, index) => (
                  <li key={index}>{stop}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa (chưa thêm edit danh sách điểm dừng) */}
      {isEditOpen && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Sửa thông tin tuyến</h3>
            <input
              className="w-full border p-2 mb-2 rounded"
              value={selectedRoute.name}
              onChange={(e) =>
                setSelectedRoute({ ...selectedRoute, name: e.target.value })
              }
              placeholder="Tên tuyến"
            />
            <input
              className="w-full border p-2 mb-2 rounded"
              value={selectedRoute.start}
              onChange={(e) =>
                setSelectedRoute({ ...selectedRoute, start: e.target.value })
              }
              placeholder="Điểm bắt đầu"
            />
            <input
              className="w-full border p-2 mb-2 rounded"
              value={selectedRoute.end}
              onChange={(e) =>
                setSelectedRoute({ ...selectedRoute, end: e.target.value })
              }
              placeholder="Điểm kết thúc"
            />
            <input
              type="number"
              className="w-full border p-2 mb-2 rounded"
              value={selectedRoute.stops}
              onChange={(e) =>
                setSelectedRoute({
                  ...selectedRoute,
                  stops: Number(e.target.value),
                })
              }
              placeholder="Số điểm dừng"
            />

            <div className="mt-4 text-right space-x-2">
              <button
                onClick={handleEditSave}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Lưu
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
