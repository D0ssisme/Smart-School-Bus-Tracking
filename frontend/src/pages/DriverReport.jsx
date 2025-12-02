import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, AlertTriangle, CheckCircle, Clock, XCircle, MapPin, Calendar, User, Truck, Edit2, Trash2 } from 'lucide-react';
import { getIncidentReportByDriverIdApi , createIncidentReportApi, updateIncidentReportApi, deleteIncidentReportApi } from '@/api/incidentReportApi';
import { getAllBuses } from '@/api/busApi';
import { getAllBuschedule } from '@/api/busscheduleApi';
import { useLanguage } from '@/contexts/LanguageContext'; // ✅ Import hook

const BusIcon = Truck;

// Component Card
const IncidentCard = ({ incident, onEdit, onDelete, t, language }) => {
  const statusConfig = {
    pending: { label: t('driverReport.status.pending'), color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock, dotColor: 'bg-yellow-500' },
    resolved: { label: t('driverReport.status.resolved'), color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, dotColor: 'bg-green-500' },
    ignored: { label: t('driverReport.status.ignored'), color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', icon: XCircle, dotColor: 'bg-gray-500' }
  };

  const config = statusConfig[incident.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const formatDate = (d) => new Date(d).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="bg-gradient-to-r from-red-500 to-orange-600 p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id={`ip-${incident._id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#ip-${incident._id})`} />
          </svg>
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <div className="text-white/80 text-xs font-medium">{t('driverReport.card.code')}</div>
              <div className="text-white text-sm font-bold">#{incident._id?.slice(-8)}</div>
            </div>
          </div>
          <div className={`${config.dotColor} w-3 h-3 rounded-full animate-pulse`}></div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{incident.title}</h3>
          {incident.description && <p className="text-sm text-gray-600 line-clamp-3">{incident.description}</p>}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="text-gray-400" size={16} />
            <span className="text-gray-600">{incident.driver_id?.name || t('driverReport.card.unknownDriver')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BusIcon className="text-gray-400" size={16} />
            <span className="text-gray-600">{incident.bus_id?.license_plate || 'N/A'} {incident.bus_id?.bus_id && `(${incident.bus_id.bus_id})`}</span>
          </div>
          {incident.location?.coordinates && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="text-gray-400" size={16} />
              <span className="text-gray-600">{incident.location.coordinates[1].toFixed(4)}, {incident.location.coordinates[0].toFixed(4)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="text-gray-400" size={16} />
            <span className="text-gray-600">{formatDate(incident.timestamp || incident.createdAt)}</span>
          </div>
        </div>

        <div className={`flex items-center justify-between p-3 ${config.bg} rounded-lg border ${config.border} mb-4`}>
          <div className="flex items-center gap-2">
            <StatusIcon className={config.color} size={18} />
            <span className="text-sm font-medium text-gray-700">{t('driverReport.card.status')}</span>
          </div>
          <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button onClick={() => onEdit(incident)} className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Edit2 size={16} />{t('driverReport.card.actions.edit')}
          </button>
          <button onClick={() => onDelete(incident)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            <Trash2 size={16} />{t('driverReport.card.actions.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Modal
const AddIncidentModal = ({ isOpen, onClose, onSave, initialData, buses, schedules, currentDriverId, t }) => {
  const [formData, setFormData] = useState({
    driver_id: '', bus_id: '', schedule_id: '', title: '', description: '', latitude: '', longitude: '', status: 'pending'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        driver_id: initialData.driver_id?._id || '',
        bus_id: initialData.bus_id?._id || '',
        schedule_id: initialData.schedule_id?._id || '',
        title: initialData.title || '',
        description: initialData.description || '',
        latitude: initialData.location?.coordinates?.[1] || '',
        longitude: initialData.location?.coordinates?.[0] || '',
        status: initialData.status || 'pending'
      });
    } else {
      setFormData({
        driver_id: currentDriverId, 
        bus_id: '',
        schedule_id: '',
        title: '',
        description: '',
        latitude: '',
        longitude: '',
        status: 'pending'
      });
    }
  }, [initialData, isOpen, currentDriverId]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.title || !formData.bus_id || !formData.driver_id || !formData.schedule_id) {
      alert(t('driverReport.messages.validation'));
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      alert(t('driverReport.messages.validationLocation'));
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        driver_id: formData.driver_id,
        bus_id: formData.bus_id,
        schedule_id: formData.schedule_id,
        title: formData.title,
        description: formData.description,
        location: { type: 'Point', coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)] },
        status: formData.status
      };
      await onSave(submitData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle size={28} />
            {initialData ? t('driverReport.modal.editTitle') : t('driverReport.modal.addTitle')}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('driverReport.modal.busLabel')} <span className="text-red-500">*</span></label>
            <select value={formData.bus_id} onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={saving}>
              <option value="">{t('driverReport.modal.selectBus')}</option>
              {buses.map(b => <option key={b.id} value={b.id}>{b.plate} ({b.busId})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('driverReport.modal.scheduleLabel')} <span className="text-red-500">*</span></label>
            <select value={formData.schedule_id} onChange={(e) => setFormData({ ...formData, schedule_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={saving}>
              <option value="">{t('driverReport.modal.selectSchedule')}</option>
              {schedules.map(s => <option key={s._id} value={s._id}>{s.schedule_id} - {s.route_id?.name || 'N/A'}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('driverReport.modal.titleLabel')} <span className="text-red-500">*</span></label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder={t('driverReport.modal.placeholders.title')} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={saving} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('driverReport.modal.descLabel')}</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder={t('driverReport.modal.placeholders.desc')} rows="3" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" disabled={saving} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('driverReport.modal.latLabel')} <span className="text-red-500">*</span></label>
              <input type="number" step="any" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} placeholder={t('driverReport.modal.placeholders.lat')} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={saving} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('driverReport.modal.longLabel')} <span className="text-red-500">*</span></label>
              <input type="number" step="any" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} placeholder={t('driverReport.modal.placeholders.long')} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={saving} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('driverReport.modal.statusLabel')}</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" disabled={saving}>
              <option value="pending">{t('driverReport.status.pending')}</option>
              <option value="resolved">{t('driverReport.status.resolved')}</option>
              <option value="ignored">{t('driverReport.status.ignored')}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50" disabled={saving}>{t('driverReport.modal.btnCancel')}</button>
            <button type="button" onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50" disabled={saving}>
              {saving ? t('driverReport.modal.btnProcess') : (initialData ? t('driverReport.modal.btnUpdate') : t('driverReport.modal.btnAdd'))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const DriverReport = () => {
  const { t, language } = useLanguage(); // ✅ Sử dụng hook
  const [incidents, setIncidents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDriverId, setCurrentDriverId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy thông tin driver đang đăng nhập
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const driverId = currentUser._id || currentUser.id;
      setCurrentDriverId(driverId);

      console.log('🚗 Current Driver ID:', driverId);

      if (!driverId) {
        setError(t('driverReport.messages.noDriver'));
        setLoading(false);
        return;
      }

      // Lấy chỉ incident reports của driver hiện tại
      const [incidentsData, busesData, schedulesData] = await Promise.all([
        getIncidentReportByDriverIdApi (driverId),
        getAllBuses(),
        getAllBuschedule()
      ]);

      console.log('📊 My Incidents:', incidentsData);

      setIncidents(incidentsData);
      setBuses(busesData.map(b => ({ id: b._id, busId: b.bus_id, plate: b.license_plate, capacity: b.capacity })));
      setSchedules(schedulesData);

    } catch (err) {
      console.error('❌ Error:', err);
      setError(t('driverReport.messages.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [t]); // Reload khi đổi ngôn ngữ

  const handleSaveIncident = async (data) => {
    try {
      if (editingIncident) {
        await updateIncidentReportApi(editingIncident._id, data);
        alert(t('driverReport.messages.updateSuccess'));
      } else {
        await createIncidentReportApi(data);
        alert(t('driverReport.messages.addSuccess'));
      }
      await fetchData();
      setIsModalOpen(false);
      setEditingIncident(null);
    } catch (err) {
      console.error('❌ Error:', err);
      alert(t('driverReport.messages.error') + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteIncident = async (incident) => {
    const confirmMsg = t('driverReport.messages.deleteConfirm').replace('{title}', incident.title);
    if (window.confirm(confirmMsg)) {
      try {
        await deleteIncidentReportApi(incident._id);
        setIncidents(incidents.filter(i => i._id !== incident._id));
        alert(t('driverReport.messages.deleteSuccess'));
      } catch (err) {
        console.error('❌ Error:', err);
        alert(t('driverReport.messages.error') + (err.response?.data?.message || err.message));
      }
    }
  };

  const filteredIncidents = incidents.filter(i => {
    const statusMatch = filterStatus === 'all' || i.status === filterStatus;
    const searchMatch =
      i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.driver_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.bus_id?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const pendingCount = incidents.filter(i => i.status === 'pending').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu báo cáo sự cố...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchData} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 min-h-screen p-6">
      <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-orange-800 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        </div>

        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <AlertTriangle className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{t('driverReport.header.title')}</h1>
                <p className="text-red-100">{t('driverReport.header.subtitle')}</p>
              </div>
            </div>

            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">{t('driverReport.stats.total')}</div>
                <div className="text-2xl font-bold text-white">{incidents.length}</div>
              </div>
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-yellow-300/30">
                <div className="text-yellow-100 text-xs mb-1">{t('driverReport.stats.pending')}</div>
                <div className="text-2xl font-bold text-white">{pendingCount}</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                <div className="text-green-100 text-xs mb-1">{t('driverReport.stats.resolved')}</div>
                <div className="text-2xl font-bold text-white">{resolvedCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-red-300 transition-colors">
              <Filter size={18} className="text-gray-500" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer">
                <option value="all">{t('driverReport.filter.allStatus')}</option>
                <option value="pending">{t('driverReport.filter.pending')}</option>
                <option value="resolved">{t('driverReport.filter.resolved')}</option>
                <option value="ignored">{t('driverReport.filter.ignored')}</option>
              </select>
            </div>

            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder={t('driverReport.filter.searchPlaceholder')} className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <button onClick={() => { setEditingIncident(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <Plus size={20} /> {t('driverReport.filter.addBtn')}
          </button>
        </div>
      </div>

      {filteredIncidents.length > 0 ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredIncidents.map(i => <IncidentCard key={i._id} incident={i} onEdit={(inc) => { setEditingIncident(inc); setIsModalOpen(true); }} onDelete={handleDeleteIncident} t={t} language={language} />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('driverReport.empty.title')}</h3>
          <p className="text-gray-500">{incidents.length === 0 ? t('driverReport.empty.start') : t('driverReport.empty.search')}</p>
        </div>
      )}

      <AddIncidentModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingIncident(null); }}
        onSave={handleSaveIncident}
        initialData={editingIncident}
        buses={buses}
        schedules={schedules}
        currentDriverId={currentDriverId}
        t={t}
      />
    </div>
  );
};

export default DriverReport;