import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRoutesApi, deleteRouteApi, updateRouteApi } from "@/api/routeApi";
import { getRoutesByIdApi } from "@/api/routestopApi";
import RouteDetailModal from "@/components/RouteDetailModal";
import RouteEditModal from "@/components/RouteEditModal";
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
import { useLanguage } from '../contexts/LanguageContext'; // ✅ Import hook

export default function RouteList() {
  const { t } = useLanguage(); // ✅ Sử dụng hook
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
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await getRoutesApi();

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
          originalData: route
        }));

        setRoutes(transformedRoutes);
        setError(null);
      } catch (err) {
        console.error("Error fetching routes:", err);
        setError(t('routeManager.messages.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [t]); // Reload khi đổi ngôn ngữ để cập nhật error message nếu có

  const handleDelete = (id) => {
    if (window.confirm(t('routeManager.messages.deleteConfirm'))) {
      setRoutes(routes.filter((r) => r.id !== id));
    }
  };

  const openDetail = async (route) => {
    try {
      setLoadingAction(true);
      // Fetch detailed route information including stops using MongoDB _id
      const mongoId = route.originalData?._id || route.originalData?.route_id;
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
      alert("Không thể tải thông tin chi tiết. Vui lòng thử lại!");
    } finally {
      setLoadingAction(false);
    }
  };

  const openEdit = async (route) => {
    try {
      setLoadingAction(true);
      // Fetch detailed route information for editing using MongoDB _id
      const mongoId = route.originalData?._id || route.originalData?.route_id;
      const detailedRoute = await getRoutesByIdApi(mongoId);

      const enrichedRoute = {
        ...route,
        originalData: detailedRoute
      };

      setSelectedRoute(enrichedRoute);
      setIsEditOpen(true);
    } catch (err) {
      console.error("Error fetching route details:", err);
      alert("Không thể tải thông tin tuyến đường. Vui lòng thử lại!");
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
      const mongoId = selectedRoute.originalData?._id || selectedRoute.originalData?.route_id;

      // Prepare update data
      const updateData = {
        name: formData.name,
        start_point: {
          name: formData.start,
          coordinates: selectedRoute.originalData?.start_point?.coordinates || [0, 0]
        },
        end_point: {
          name: formData.end,
          coordinates: selectedRoute.originalData?.end_point?.coordinates || [0, 0]
        },
        status: formData.status
      };

      // Call API to update route
      await updateRouteApi(mongoId, updateData);

      // Update local state
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === selectedRoute.id
            ? {
              ...r,
              name: formData.name,
              start: formData.start,
              end: formData.end,
              stops: formData.stops,
              status: formData.status
            }
            : r
        )
      );

      alert("Cập nhật tuyến đường thành công!");
      closeModal();
    } catch (err) {
      console.error("Error updating route:", err);
      alert("Không thể cập nhật tuyến đường. Vui lòng thử lại!");
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
          <p className="text-gray-600 font-medium">{t('routeManager.loading')}</p>
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
              <p className="font-bold text-red-800">{t('routeManager.messages.errorTitle')}</p>
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
          {/* SVG Illustration - giữ nguyên */}
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
                <h1 className="text-3xl font-bold text-white mb-1">{t('routeManager.title')}</h1>
                <p className="text-indigo-100">{t('routeManager.subtitle')}</p>
              </div>
            </div>

            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">{t('routeManager.stats.total')}</div>
                <div className="text-2xl font-bold text-white">{routes.length}</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                <div className="text-green-100 text-xs mb-1">{t('routeManager.stats.activeShort')}</div>
                <div className="text-2xl font-bold text-white">{activeRoutes}</div>
              </div>
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-blue-300/30">
                <div className="text-blue-100 text-xs mb-1">{t('routeManager.stats.avg')}</div>
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
                <option value="all">{t('routeManager.filter.allStatus')}</option>
                <option value="active">{t('routeManager.filter.active')}</option>
                <option value="inactive">{t('routeManager.filter.inactive')}</option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('routeManager.filter.searchPlaceholder')}
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
            <Plus size={20} /> {t('routeManager.filter.addBtn')}
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
          <h3 className="text-gray-600 text-sm font-medium mb-1">{t('routeManager.stats.totalRoutes')}</h3>
          <p className="text-3xl font-bold text-gray-900">{routes.length}</p>
          <p className="text-xs text-gray-500 mt-2">{t('routeManager.stats.created')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Navigation className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{t('routeManager.stats.active')}</h3>
          <p className="text-3xl font-bold text-gray-900">{activeRoutes}</p>
          <p className="text-xs text-gray-500 mt-2">{t('routeManager.stats.operating')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{t('routeManager.stats.totalStops')}</h3>
          <p className="text-3xl font-bold text-gray-900">{totalStops}</p>
          <p className="text-xs text-gray-500 mt-2">{t('routeManager.stats.allRoutes')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Map className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{t('routeManager.stats.avgStops')}</h3>
          <p className="text-3xl font-bold text-gray-900">{avgStops}</p>
          <p className="text-xs text-gray-500 mt-2">{t('routeManager.stats.stopPerRoute')}</p>
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
              {searchTerm || filterStatus !== "all" ? t('routeManager.empty.notFoundTitle') : t('routeManager.empty.noDataTitle')}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== "all" ? t('routeManager.empty.notFoundDesc') : t('routeManager.empty.noDataDesc')}
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                {t('routeManager.filter.clearFilter')}
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b-2 border-indigo-100">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">{t('routeManager.table.code')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">{t('routeManager.table.name')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">{t('routeManager.table.start')}</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">{t('routeManager.table.end')}</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">{t('routeManager.table.stops')}</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">{t('routeManager.table.status')}</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">{t('routeManager.table.action')}</th>
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
                        {r.status === "active" ? t('routeManager.status.active') : t('routeManager.status.inactive')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openDetail(r)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-all" title={t('routeManager.table.actions.detail')}>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openEdit(r)} className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-600 hover:text-white transition-all" title={t('routeManager.table.actions.edit')}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-all" title={t('routeManager.table.actions.delete')}>
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

      {/* Modal chi tiết */}
      {isDetailOpen && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <RouteIcon size={24} />
                  {t('routeManager.modal.detailTitle')}
                </h3>
                <button onClick={closeModal} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <RouteIcon className="text-indigo-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t('routeManager.modal.code')}</p>
                  <p className="font-semibold text-gray-800">{selectedRoute.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Map className="text-indigo-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t('routeManager.modal.name')}</p>
                  <p className="font-semibold text-gray-800">{selectedRoute.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <MapPin className="text-green-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t('routeManager.modal.start')}</p>
                  <p className="font-semibold text-gray-800">{selectedRoute.start}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <MapPin className="text-red-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t('routeManager.modal.end')}</p>
                  <p className="font-semibold text-gray-800">{selectedRoute.end}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Navigation className="text-blue-600 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t('routeManager.modal.stopsCount')}</p>
                  <p className="font-semibold text-gray-800">{selectedRoute.stops} {t('routeManager.modal.unitStop')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-1">
                  <div className={`w-5 h-5 rounded-full ${selectedRoute.status === "active" ? "bg-green-500" : "bg-gray-500"}`}></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{t('routeManager.modal.status')}</p>
                  <p className="font-semibold text-gray-800">
                    {selectedRoute.status === "active" ? t('routeManager.status.active') : t('routeManager.status.inactive')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                <p className="text-sm font-semibold text-gray-800 mb-3">{t('routeManager.modal.stopsList')}</p>
                <ul className="space-y-2">
                  {selectedRoute.stopsList.map((stop, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</div>
                      {stop}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-2xl">
              <button onClick={closeModal} className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-3 rounded-lg font-semibold transition-all">
                {t('routeManager.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa */}
      {isEditOpen && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit size={24} />
                  {t('routeManager.modal.editTitle')}
                </h3>
                <button onClick={closeModal} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('routeManager.modal.name')}</label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={selectedRoute.name}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, name: e.target.value })}
                  placeholder={t('routeManager.modal.placeholders.name')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('routeManager.modal.start')}</label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={selectedRoute.start}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, start: e.target.value })}
                  placeholder={t('routeManager.modal.placeholders.start')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('routeManager.modal.end')}</label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={selectedRoute.end}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, end: e.target.value })}
                  placeholder={t('routeManager.modal.placeholders.end')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('routeManager.modal.stopsCount')}</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={selectedRoute.stops}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, stops: Number(e.target.value) })}
                  placeholder={t('routeManager.modal.placeholders.stops')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('routeManager.modal.status')}</label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={selectedRoute.status}
                  onChange={(e) => setSelectedRoute({ ...selectedRoute, status: e.target.value })}
                >
                  <option value="active">{t('routeManager.status.active')}</option>
                  <option value="inactive">{t('routeManager.status.inactive')}</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={handleEditSave}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-all"
              >
                {t('routeManager.modal.save')}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-3 rounded-lg font-semibold transition-all"
              >
                {t('routeManager.modal.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}