import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRoutesApi, deleteRouteApi, updateRouteApi } from "@/api/routeApi";
import { getRoutesByIdApi } from "@/api/routeStopApi";
import RouteDetailModal from "@/components/RouteDetailModal";
import RouteEditModal from "@/components/RouteEditModal";
import ToastService from "@/lib/toastService";
import Swal from 'sweetalert2';
import {
  Route as RouteIcon,
  MapPin,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Map,
  Navigation,
  Eye,
  Edit,
  Trash2,
  X
} from "lucide-react";

export default function RouteList() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await getRoutesApi();

      const transformedRoutes = response.map(route => {
        console.log("Route from API:", route);
        return {
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
          originalData: route
        };
      });

      setRoutes(transformedRoutes);
      setError(null);
    } catch (err) {
      console.error("Error fetching routes:", err);
      setError("Không thể tải danh sách tuyến xe. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (route) => {
    Swal.fire({
      title: 'Xác nhận xóa tuyến đường',
      html: `
        <div style="text-align: left;">
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc3545;">
            <p style="margin: 0; font-size: 16px;">
              <strong>🛣️ Tên tuyến:</strong> ${route.name}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🆔 Mã tuyến:</strong> ${route.id}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>📍 Điểm đầu:</strong> ${route.start}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🏁 Điểm cuối:</strong> ${route.end}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>📍 Số điểm dừng:</strong> ${route.stops} điểm
            </p>
          </div>
          <p style="color: #d33; font-weight: bold; margin-top: 16px;">⚠️ Hành động này không thể hoàn tác!</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa tuyến đường',
      cancelButtonText: 'Hủy',
      width: 600
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loadingToast = ToastService.loading('Đang xóa tuyến đường...');

        try {
          setLoadingAction(true);
          // Sử dụng MongoDB _id để xóa
          const mongoId = route.originalData?._id || route.id;

          if (!mongoId) {
            ToastService.update(loadingToast, 'Không tìm thấy ID tuyến đường!', 'error');
            return;
          }

          console.log("Deleting route with ID:", mongoId);
          await deleteRouteApi(mongoId);

          // Fetch lại danh sách routes
          await fetchRoutes();

          ToastService.update(loadingToast, 'Xóa tuyến đường thành công!', 'success');
        } catch (err) {
          console.error("Error deleting route:", err);
          const errorMessage = err.response?.data?.message || 'Không thể xóa tuyến đường!';
          ToastService.update(loadingToast, errorMessage, 'error');
        } finally {
          setLoadingAction(false);
        }
      }
    });
  };


  const openDetail = async (route) => {
    try {
      setLoadingAction(true);
      // Fetch detailed route information including stops using MongoDB _id
      const mongoId = route.originalData?._id || route.id;

      if (!mongoId) {
        ToastService.error('Không tìm thấy ID tuyến đường!');
        return;
      }

      const detailedRoute = await getRoutesByIdApi(mongoId);

      // Transform the detailed data
      const enrichedRoute = {
        ...route,
        stopsList: [
          detailedRoute.start_point?.name,
          ...(detailedRoute.intermediate_stops?.map(stop => stop.name) || []),
          detailedRoute.end_point?.name
        ].filter(Boolean),
        originalData: detailedRoute
      };

      setSelectedRoute(enrichedRoute);
      setIsDetailOpen(true);
    } catch (err) {
      console.error("Error fetching route details:", err);
      ToastService.error('Không thể tải thông tin chi tiết. Vui lòng thử lại!');
    } finally {
      setLoadingAction(false);
    }
  };

  const openEdit = async (route) => {
    try {
      setLoadingAction(true);
      // Fetch detailed route information for editing using MongoDB _id
      const mongoId = route.originalData?._id || route.id;

      if (!mongoId) {
        ToastService.error('Không tìm thấy ID tuyến đường!');
        return;
      }

      const detailedRoute = await getRoutesByIdApi(mongoId);

      const enrichedRoute = {
        ...route,
        originalData: detailedRoute
      };

      setSelectedRoute(enrichedRoute);
      setIsEditOpen(true);
    } catch (err) {
      console.error("Error fetching route details:", err);
      ToastService.error('Không thể tải thông tin tuyến đường. Vui lòng thử lại!');
    } finally {
      setLoadingAction(false);
    }
  };

  const closeModal = () => {
    setIsDetailOpen(false);
    setIsEditOpen(false);
    setSelectedRoute(null);
  };

  const handleEditSave = async (formData) => {
    try {
      setLoadingAction(true);

      // Sử dụng MongoDB _id để update
      const mongoId = selectedRoute.originalData?._id || selectedRoute.id;

      if (!mongoId) {
        ToastService.error('Không tìm thấy ID tuyến đường!');
        return;
      }

      console.log("Updating route with ID:", mongoId);

      // Backend chỉ nhận name và status
      const updateData = {
        name: formData.name,
        status: formData.status
      };

      // Call API to update route
      const response = await updateRouteApi(mongoId, updateData);

      // Fetch lại danh sách routes để có data mới nhất
      await fetchRoutes();

      ToastService.success('Cập nhật tuyến đường thành công!');
      closeModal();
    } catch (err) {
      console.error("Error updating route:", err);
      const errorMessage = err.response?.data?.message || 'Không thể cập nhật tuyến đường!';
      ToastService.error(errorMessage);
    } finally {
      setLoadingAction(false);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const matchSearch =
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.end.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === "all" || route.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const activeRoutes = routes.filter(r => r.status === "active").length;
  const totalStops = routes.reduce((sum, r) => sum + r.stops, 0);
  const avgStops = routes.length > 0 ? Math.round(totalStops / routes.length) : 0;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded p-5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu tuyến đường...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 rounded-full p-2">
              <X className="text-red-600" size={24} />
            </div>
            <div>
              <p className="font-bold text-red-800">Lỗi tải dữ liệu</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen p-6">
      {/* Loading Overlay */}
      {loadingAction && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-700 font-medium">Đang xử lý...</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
          <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
            <circle cx="40" cy="60" r="15" fill="white" opacity="0.9" />
            <circle cx="100" cy="40" r="12" fill="white" opacity="0.7" />
            <circle cx="100" cy="80" r="12" fill="white" opacity="0.7" />
            <circle cx="160" cy="60" r="15" fill="white" opacity="0.9" />
            <path d="M40 60 Q70 50, 100 40" stroke="white" strokeWidth="3" opacity="0.6" fill="none" />
            <path d="M100 40 Q130 50, 160 60" stroke="white" strokeWidth="3" opacity="0.6" fill="none" />
            <path d="M40 60 Q70 70, 100 80" stroke="white" strokeWidth="3" opacity="0.6" fill="none" />
            <path d="M100 80 Q130 70, 160 60" stroke="white" strokeWidth="3" opacity="0.6" fill="none" />
          </svg>
        </div>

        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Map className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Quản lý tuyến đường</h1>
                <p className="text-indigo-100">Danh sách và thông tin các tuyến xe buýt</p>
              </div>
            </div>

            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">Tổng số</div>
                <div className="text-2xl font-bold text-white">{routes.length}</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                <div className="text-green-100 text-xs mb-1">Hoạt động</div>
                <div className="text-2xl font-bold text-white">{activeRoutes}</div>
              </div>
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-blue-300/30">
                <div className="text-blue-100 text-xs mb-1">TB điểm dừng</div>
                <div className="text-2xl font-bold text-white">{avgStops}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter và Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-indigo-300 transition-colors">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm theo tên tuyến, mã, điểm đầu/cuối..."
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Link
            to="/createroute"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus size={20} /> Tạo tuyến mới
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-indigo-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 rounded-full p-3">
              <RouteIcon className="text-indigo-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng tuyến đường</h3>
          <p className="text-3xl font-bold text-gray-900">{routes.length}</p>
          <p className="text-xs text-gray-500 mt-2">Đã tạo trong hệ thống</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Navigation className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Đang hoạt động</h3>
          <p className="text-3xl font-bold text-gray-900">{activeRoutes}</p>
          <p className="text-xs text-gray-500 mt-2">Tuyến đang vận hành</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng điểm dừng</h3>
          <p className="text-3xl font-bold text-gray-900">{totalStops}</p>
          <p className="text-xs text-gray-500 mt-2">Trên tất cả tuyến</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Map className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">TB điểm dừng</h3>
          <p className="text-3xl font-bold text-gray-900">{avgStops}</p>
          <p className="text-xs text-gray-500 mt-2">Điểm dừng/tuyến</p>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredRoutes.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <RouteIcon className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || filterStatus !== "all" ? "Không tìm thấy tuyến đường" : "Chưa có tuyến đường nào"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== "all" ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" : "Bắt đầu tạo tuyến đường mới cho hệ thống"}
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b-2 border-indigo-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Mã tuyến</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Tên tuyến</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Điểm khởi đầu</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Điểm kết thúc</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Điểm dừng</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((r, index) => (
                  <tr key={r.id} className={`border-b hover:bg-indigo-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4 text-sm text-gray-800 font-medium">{r.id}</td>
                    <td className="p-4 text-sm text-gray-800 font-medium">{r.name}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-green-600" />
                        {r.start}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-red-600" />
                        {r.end}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{r.stops}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {r.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openDetail(r)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-all" title="Chi tiết">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openEdit(r)} className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-600 hover:text-white transition-all" title="Sửa">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(r)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-all" title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Components */}
      <RouteDetailModal
        isOpen={isDetailOpen}
        onClose={closeModal}
        route={selectedRoute}
      />

      <RouteEditModal
        isOpen={isEditOpen}
        onClose={closeModal}
        route={selectedRoute}
        onSave={handleEditSave}
      />
    </div>
  );
}