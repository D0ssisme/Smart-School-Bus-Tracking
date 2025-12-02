import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIncidentReports } from "@/api/incidentReportApi";
import ToastService from "@/lib/toastService";
import {
  AlertTriangle,
  Filter,
  Search,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle,
  FileText,
  Edit2,
  Trash2,
  Calendar,
  Users,
  MapPin,
  Clock
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useLanguage } from '../contexts/LanguageContext'; // ✅ Import hook

// ReportCard Component
function ReportCard({ report, onEdit, onDelete }) {
  const { t, language } = useLanguage(); // ✅ Sử dụng hook

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'đã giải quyết':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'pending':
      case 'đang xử lý':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'urgent':
      case 'khẩn cấp':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'đã giải quyết':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'pending':
      case 'đang xử lý':
        return <Clock size={20} className="text-yellow-600" />;
      case 'urgent':
      case 'khẩn cấp':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Info size={20} className="text-gray-600" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'đã giải quyết':
        return t('reportManager.status.resolved');
      case 'pending':
      case 'đang xử lý':
        return t('reportManager.status.pending');
      case 'urgent':
      case 'khẩn cấp':
        return t('reportManager.status.urgent');
      default:
        return status || t('reportManager.status.unknown');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${getStatusStyle(report.status)}`}>
            {getStatusIcon(report.status)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyle(report.status)}`}>
                {getStatusLabel(report.status)}
              </span>
              {report.createdAt && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(report.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>

            <p className="text-gray-800 font-medium mb-2">{report.description || report.message || t('reportManager.card.noDescription')}</p>

            {/* Hiển thị thông tin tài xế */}
            {report.driver_id && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Users size={14} />
                  <span className="font-medium">{t('reportManager.card.driver')}</span>
                  <span className="text-gray-800">
                    {report.driver_id.name || t('reportManager.card.na')}
                  </span>
                </p>

                {report.driver_id.phoneNumber && (
                  <span className="text-xs text-gray-500">
                    📞 {report.driver_id.phoneNumber}
                  </span>
                )}
              </div>
            )}

            {/* Hiển thị title nếu có */}
            {report.title && (
              <p className="text-sm font-semibold text-gray-700 mt-2">
                {report.title}
              </p>
            )}

            {/* Hiển thị tọa độ địa điểm */}
            {report.location?.coordinates && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {t('reportManager.card.location')} {report.location.coordinates[1].toFixed(6)}, {report.location.coordinates[0].toFixed(6)}
              </p>
            )}

            {/* Hiển thị thông tin xe bus */}
            {report.bus_id && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                🚌 {t('reportManager.card.bus')} {report.bus_id.licensePlate || report.bus_id.busNumber || report.bus_id._id}
              </p>
            )}

            {/* Hiển thị lịch trình */}
            {report.schedule_id && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                📅 {t('reportManager.card.schedule')} {report.schedule_id.name || report.schedule_id._id}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(report)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={t('reportManager.card.actions.edit')}
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(report._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title={t('reportManager.card.actions.delete')}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Report() {
  const { t } = useLanguage(); // ✅ Sử dụng hook
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    fetchReports();
  }, [t]); // Reload khi đổi ngôn ngữ

  const fetchReports = async () => {
    const loadingToast = ToastService.loading(t('reportManager.loading'));

    try {
      setLoading(true);
      const data = await getAllIncidentReports();
      setReports(data);
      ToastService.update(loadingToast, t('reportManager.messages.loadSuccess'), "success");
    } catch (error) {
      console.error('Error fetching reports:', error);
      ToastService.update(loadingToast, t('reportManager.messages.loadError'), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
    if (confirm(t('reportManager.messages.deleteConfirm'))) {
      const loadingToast = ToastService.loading(t('reportManager.messages.deleting'));

      try {
        // TODO: Gọi API xóa report
        // await deleteIncidentReportApi(id);

        setTimeout(() => {
          setReports(reports.filter(r => r._id !== id));
          ToastService.update(loadingToast, t('reportManager.messages.deleteSuccess'), "success");
        }, 1000);
      } catch (error) {
        console.error('Error deleting report:', error);
        ToastService.update(loadingToast, t('reportManager.messages.deleteError'), "error");
      }
    }
  };

  const handleEditReport = (report) => {
    navigate(`/reports/edit/${report._id}`);
  };

  const filteredReports = reports.filter(r => {
    const matchSearch =
      (r.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.message?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.status?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  // Reset về trang 1 khi filter/search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage) || 1;
  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Statistics
  const resolvedCount = reports.filter(r => r.status?.toLowerCase() === 'resolved' || r.status?.toLowerCase() === 'đã giải quyết').length;
  const pendingCount = reports.filter(r => r.status?.toLowerCase() === 'pending' || r.status?.toLowerCase() === 'đang xử lý').length;
  const urgentCount = reports.filter(r => r.status?.toLowerCase() === 'urgent' || r.status?.toLowerCase() === 'khẩn cấp').length;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 rounded p-5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('reportManager.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 min-h-screen p-6">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
          {/* SVG Illustration - giữ nguyên */}
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <path d="M90 30 L150 150 L30 150 Z" fill="white" opacity="0.8" stroke="white" strokeWidth="4" />
            <circle cx="90" cy="110" r="5" fill="white" />
            <path d="M90 60 L90 95" stroke="white" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>

        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <AlertTriangle className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {t('reportManager.title')}
                </h1>
                <p className="text-orange-100">
                  {t('reportManager.subtitle')}
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">{t('reportManager.stats.total')}</div>
                <div className="text-2xl font-bold text-white">{reports.length}</div>
              </div>
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-red-300/30">
                <div className="text-red-100 text-xs mb-1">{t('reportManager.stats.urgent')}</div>
                <div className="text-2xl font-bold text-white">{urgentCount}</div>
              </div>
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-yellow-300/30">
                <div className="text-yellow-100 text-xs mb-1">{t('reportManager.stats.pending')}</div>
                <div className="text-2xl font-bold text-white">{pendingCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-red-300 transition-colors">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer"
              >
                <option value="all">{t('reportManager.filter.allStatus')}</option>
                <option value="urgent">{t('reportManager.filter.urgent')}</option>
                <option value="pending">{t('reportManager.filter.pending')}</option>
                <option value="resolved">{t('reportManager.filter.resolved')}</option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('reportManager.filter.searchPlaceholder')}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{t('reportManager.stats.totalReports')}</h3>
          <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
          <p className="text-xs text-gray-500 mt-2">{t('reportManager.stats.received')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-red-600">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <TrendingUp className="text-red-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{t('reportManager.stats.urgent')}</h3>
          <p className="text-3xl font-bold text-gray-900">{urgentCount}</p>
          <p className="text-xs text-gray-500 mt-2">{t('reportManager.stats.urgentAction')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <TrendingUp className="text-yellow-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{t('reportManager.stats.pending')}</h3>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
          <p className="text-xs text-gray-500 mt-2">{t('reportManager.stats.reviewing')}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{t('reportManager.stats.resolved')}</h3>
          <p className="text-3xl font-bold text-gray-900">{resolvedCount}</p>
          <p className="text-xs text-gray-500 mt-2">{t('reportManager.stats.completed')}</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="text-red-600" size={24} />
            {t('reportManager.list.title')}
          </h2>

          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t('reportManager.empty.title')}
              </h3>
              <p className="text-gray-500 mb-4">
                {t('reportManager.empty.subtitle')}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                {t('reportManager.filter.clearFilter')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentReports.map((report) => (
                <ReportCard
                  key={report._id}
                  report={report}
                  onEdit={handleEditReport}
                  onDelete={handleDeleteReport}
                />
              ))}
            </div>
          )}
        </div>

        {/* Phân trang */}
        {filteredReports.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default Report;