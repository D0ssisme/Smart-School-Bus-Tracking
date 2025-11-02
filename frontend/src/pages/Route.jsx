import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRoutesApi } from "@/api/routeApi";

export default function RouteList() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Load data từ API khi component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await getRoutesApi();

        // Transform data từ API sang format của component
        const transformedRoutes = response.map(route => ({
          id: route.route_id || route._id,
          name: route.name,
          start: route.start_point?.name || "N/A",
          end: route.end_point?.name || "N/A",
          stops: route.path?.coordinates?.length || 2,
          stopsList: [
            route.start_point?.name,
            ...(route.intermediate_stops?.map(stop => stop.name) || []),
            route.end_point?.name
          ].filter(Boolean),
          status: route.status,
          originalData: route // Giữ data gốc để dùng khi cần
        }));

        setRoutes(transformedRoutes);
        setError(null);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError("Không thể tải danh sách tuyến xe. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tuyến này?")) {
      setRoutes(routes.filter((r) => r.id !== id));
      // TODO: Gọi API delete ở đây
      // deleteRouteApi(id);
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
    // TODO: Gọi API update ở đây
    // updateRouteApi(selectedRoute.id, selectedRoute);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow min-h-screen m-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-white rounded shadow min-h-screen m-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Lỗi</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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

      {routes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có tuyến xe buýt nào
        </div>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Mã tuyến</th>
              <th className="p-2 border">Tên tuyến</th>
              <th className="p-2 border">Điểm khởi đầu</th>
              <th className="p-2 border">Điểm kết thúc</th>
              <th className="p-2 border">Số điểm dừng</th>
              <th className="p-2 border">Trạng thái</th>
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
                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${r.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {r.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => openDetail(r)}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-600 hover:text-white transition"
                  >
                    Chi tiết
                  </button>

                  <button
                    onClick={() => openEdit(r)}
                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-600 hover:text-white transition"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal chi tiết */}
      {isDetailOpen && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Chi tiết tuyến xe</h3>
            <p>
              <strong>Mã tuyến:</strong> {selectedRoute.id}
            </p>
            <p>
              <strong>Tên tuyến:</strong> {selectedRoute.name}
            </p>
            <p>
              <strong>Điểm bắt đầu:</strong> {selectedRoute.start}
            </p>
            <p>
              <strong>Điểm kết thúc:</strong> {selectedRoute.end}
            </p>
            <p>
              <strong>Số điểm dừng:</strong> {selectedRoute.stops}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-xs ${selectedRoute.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {selectedRoute.status === "active"
                  ? "Hoạt động"
                  : "Không hoạt động"}
              </span>
            </p>

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

      {/* Modal sửa */}
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