//
import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, CheckCircle, XCircle, Wrench, Edit2, Trash2, Users, Truck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext'; // ✅ Import hook

const BusIcon = Truck;

// ========================================
// 🔥 IMPORT API - sử dụng alias @ từ project
// ========================================
import { getAllBuses, createBusApi, updateBusApi, deleteBusApi } from '@/api/busApi';
import ToastService from '@/lib/toastService';
import Swal from 'sweetalert2';

// Component BusCard
const BusCard = ({ bus, onEdit, onDelete }) => {
  const { t } = useLanguage(); // ✅ Sử dụng hook

  const statusConfig = {
    active: {
      label: t('busManager.status.active'), // ✅ Dịch label
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      dotColor: 'bg-green-500'
    },
    inactive: {
      label: t('busManager.status.inactive'), // ✅ Dịch label
      color: 'text-gray-700',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: XCircle,
      dotColor: 'bg-gray-500'
    },
    repair: {
      label: t('busManager.status.repair'), // ✅ Dịch label
      color: 'text-orange-700',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: Wrench,
      dotColor: 'bg-orange-500'
    }
  };

  // Fallback nếu status không hợp lệ
  const config = statusConfig[bus.status] || statusConfig.inactive;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:scale-[1.02]">
      {/* Header với gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id={`bus-pattern-${bus._id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#bus-pattern-${bus._id})`} />
          </svg>
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <BusIcon className="text-white" size={24} />
            </div>
            <div>
              <div className="text-white/80 text-xs font-medium">{t('busManager.card.code')}</div>
              <div className="text-white text-lg font-bold">{bus.bus_id}</div>
            </div>
          </div>
          <div className={`${config.dotColor} w-3 h-3 rounded-full animate-pulse`}></div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Biển số xe - nổi bật */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-3 mb-4 text-center shadow-md">
          <div className="text-xs text-yellow-900 font-semibold mb-1">{t('busManager.card.plateHeader')}</div>
          <div className="text-2xl font-bold text-yellow-900 tracking-wider font-mono">
            {bus.license_plate}
          </div>
        </div>

        {/* Thông tin chính */}
        <div className="space-y-3 mb-4">
          {/* Sức chứa */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <Users className="text-blue-600" size={18} />
              <span className="text-sm font-medium text-gray-700">{t('busManager.card.capacity')}</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{bus.capacity} {t('busManager.card.seat')}</span>
          </div>

          {/* Trạng thái */}
          <div className={`flex items-center justify-between p-3 ${config.bg} rounded-lg border ${config.border}`}>
            <div className="flex items-center gap-2">
              <StatusIcon className={config.color} size={18} />
              <span className="text-sm font-medium text-gray-700">{t('busManager.card.status')}</span>
            </div>
            <span className={`text-sm font-semibold ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(bus)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <Edit2 size={16} />
            {t('busManager.card.edit')}
          </button>
          <button
            onClick={() => onDelete(bus)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <Trash2 size={16} />
            {t('busManager.card.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Modal
const AddBusModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { t } = useLanguage(); // ✅ Sử dụng hook
  const [formData, setFormData] = useState({
    license_plate: '',
    capacity: '',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        license_plate: initialData.license_plate,
        capacity: initialData.capacity,
        status: initialData.status
      });
    } else {
      setFormData({
        license_plate: '',
        capacity: '',
        status: 'active'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.license_plate || !formData.capacity) {
      ToastService.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (formData.capacity < 1) {
      ToastService.error('Sức chứa phải lớn hơn 0!');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BusIcon size={28} />
            {initialData ? t('busManager.modal.editTitle') : t('busManager.modal.addTitle')}
          </h2>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Biển số xe */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('busManager.modal.plateLabel')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.license_plate}
              onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
              placeholder={t('busManager.modal.platePlaceholder')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
          </div>

          {/* Sức chứa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('busManager.modal.capacityLabel')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder={t('busManager.modal.capacityPlaceholder')}
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('busManager.modal.statusLabel')} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            >
              <option value="active">{t('busManager.status.active')}</option>
              <option value="inactive">{t('busManager.status.inactive')}</option>
              <option value="repair">{t('busManager.status.repair')}</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {t('busManager.modal.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={saving}
            >
              {saving ? t('busManager.modal.processing') : (initialData ? t('busManager.modal.update') : t('busManager.modal.create'))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component Chính
const BusManager = () => {
  const { t } = useLanguage(); // ✅ Sử dụng hook
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data từ API
  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBuses();
      console.log('✅ Fetched buses:', data);
      setBuses(data);
    } catch (err) {
      console.error('❌ Error fetching buses:', err);
      setError(t('busManager.messages.genericError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBus(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bus) => {
    setEditingBus(bus);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBus(null);
  };

  const handleSaveBus = async (data) => {
    const loadingToast = ToastService.loading('Đang xử lý...');

    try {
      if (editingBus) {
        // Update existing bus
        console.log('🔄 Updating bus:', editingBus._id, data);
        const updatedBus = await updateBusApi(editingBus._id, data);

        setBuses(buses.map(bus =>
          bus._id === editingBus._id
            ? { ...bus, ...data }
            : bus
        ));

        ToastService.update(loadingToast, 'Cập nhật xe bus thành công!', 'success');
      } else {
        // Add new bus
        console.log('➕ Creating new bus:', data);
        const newBus = await createBusApi(data);
        console.log('✅ API response:', newBus);

        // Refresh data từ server để có bus_id mới
        await fetchBuses();

        ToastService.update(loadingToast, 'Thêm xe bus thành công!', 'success');
      }
      handleCloseModal();
    } catch (err) {
      console.error('❌ Error saving bus:', err);
      ToastService.update(
        loadingToast,
        err.response?.data?.message || 'Có lỗi xảy ra khi lưu xe bus!',
        'error'
      );
    }
  };

  const handleDeleteBus = async (bus) => {
    Swal.fire({
      title: t('busManager.swal.deleteTitle'),
      html: `
        <div style="text-align: left;">
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc3545;">
            <p style="margin: 0; font-size: 16px;">
              <strong>🚌 ${t('busManager.swal.plate')}:</strong> ${bus.license_plate}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🆔 ${t('busManager.swal.busId')}:</strong> ${bus.bus_id}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>👥 ${t('busManager.swal.capacity')}:</strong> ${bus.capacity} ${t('busManager.card.seat')}
            </p>
          </div>
          <p style="color: #d33; font-weight: bold; margin-top: 16px;">⚠️ ${t('busManager.swal.warning')}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: t('busManager.swal.confirmDelete'),
      cancelButtonText: t('busManager.swal.cancel'),
      width: 600
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loadingToast = ToastService.loading(t('busManager.swal.deleting'));

        try {
          console.log('🗑️ Deleting bus:', bus._id);
          await deleteBusApi(bus._id);

          setBuses(buses.filter(b => b._id !== bus._id));
          ToastService.update(loadingToast, t('busManager.messages.deleteSuccess'), 'success');
        } catch (err) {
          console.error('❌ Error deleting bus:', err);

          if (err.response?.status === 400 && err.response?.data?.message?.includes('lịch trình')) {
            ToastService.update(loadingToast, t('busManager.swal.constraintError'), 'error');

            Swal.fire({
              title: t('busManager.swal.cannotDelete'),
              html: `
                <div style="text-align: left;">
                  <p style="margin-bottom: 12px;">${t('busManager.swal.busInUse', { plate: bus.license_plate })}</p>
                  <div style="background: #fff3cd; padding: 12px; border-radius: 8px; border-left: 4px solid #ffc107;">
                    <p style="margin: 0; font-size: 14px;">
                      💡 <strong>${t('busManager.swal.instructionTitle')}:</strong><br/>
                      1. ${t('busManager.swal.instruction1')}<br/>
                      2. ${t('busManager.swal.instruction2')}<br/>
                      3. ${t('busManager.swal.instruction3')}
                    </p>
                  </div>
                </div>
              `,
              icon: 'error',
              confirmButtonText: t('busManager.swal.understood')
            });
          } else {
            ToastService.update(
              loadingToast,
              err.response?.data?.message || t('busManager.messages.genericError'),
              'error'
            );
          }
        }
      }
    });
  };

  const filteredBuses = buses.filter(bus => {
    const statusMatch = filterStatus === 'all' || bus.status === filterStatus;
    const searchMatch =
      bus.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.bus_id.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const activeBuses = buses.filter(b => b.status === 'active').length;
  const repairBuses = buses.filter(b => b.status === 'repair').length;
  const inactiveBuses = buses.filter(b => b.status === 'inactive').length;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('busManager.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('busManager.errorTitle')}</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBuses}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            {t('busManager.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-6">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Bus SVG Illustration - giữ nguyên */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
          <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
            <rect x="40" y="20" width="120" height="70" rx="8" fill="white" opacity="0.9" />
            <rect x="50" y="30" width="30" height="25" rx="3" fill="#1e40af" />
            <rect x="85" y="30" width="30" height="25" rx="3" fill="#1e40af" />
            <rect x="120" y="30" width="30" height="25" rx="3" fill="#1e40af" />
            <circle cx="60" cy="100" r="12" fill="white" />
            <circle cx="60" cy="100" r="8" fill="#374151" />
            <circle cx="140" cy="100" r="12" fill="white" />
            <circle cx="140" cy="100" r="8" fill="#374151" />
            <path d="M40 60 L160 60 L160 90 L40 90 Z" fill="white" opacity="0.3" />
          </svg>
        </div>

        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <BusIcon className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{t('busManager.title')}</h1>
                <p className="text-blue-100">{t('busManager.subtitle')}</p>
              </div>
            </div>

            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">{t('busManager.stats.total')}</div>
                <div className="text-2xl font-bold text-white">{buses.length}</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                <div className="text-green-100 text-xs mb-1">{t('busManager.stats.active')}</div>
                <div className="text-2xl font-bold text-white">{activeBuses}</div>
              </div>
              <div className="bg-orange-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-orange-300/30">
                <div className="text-orange-100 text-xs mb-1">{t('busManager.stats.repair')}</div>
                <div className="text-2xl font-bold text-white">{repairBuses}</div>
              </div>
              <div className="bg-gray-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-300/30">
                <div className="text-gray-100 text-xs mb-1">{t('busManager.stats.inactive')}</div>
                <div className="text-2xl font-bold text-white">{inactiveBuses}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter và Search */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-blue-300 transition-colors">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer"
              >
                <option value="all">{t('busManager.filter.all')}</option>
                <option value="active">{t('busManager.filter.active')}</option>
                <option value="repair">{t('busManager.filter.repair')}</option>
                <option value="inactive">{t('busManager.filter.inactive')}</option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('busManager.filter.searchPlaceholder')}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus size={20} /> {t('busManager.filter.addBtn')}
          </button>
        </div>
      </div>

      {/* Bus Grid */}
      {filteredBuses.length > 0 ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBuses.map((bus) => (
            <BusCard
              key={bus._id}
              bus={bus}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteBus}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <BusIcon className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('busManager.empty.title')}</h3>
          <p className="text-gray-500">
            {buses.length === 0
              ? 'Chưa có xe bus nào. Nhấn nút "Thêm xe bus" để bắt đầu!'
              : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
          </p>
        </div>
      )}

      {/* Modal */}
      <AddBusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBus}
        initialData={editingBus}
      />
    </div>
  );
};

export default BusManager;