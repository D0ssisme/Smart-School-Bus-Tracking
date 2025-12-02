import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings, Info, Pencil, Trash2, Clock, X, Calendar, Truck, Users, MapPin
} from 'lucide-react';

const BusIcon = Truck;

// Edit Schedule Modal Component
const EditScheduleModal = ({ isOpen, onClose, onSave, schedule, drivers, routes, buses }) => {
  const [formData, setFormData] = useState({
    driver_id: '',
    bus_id: '',
    route_id: '',
    start_time: '',
    end_time: '',
    date: '',
    status: 'scheduled'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (schedule && isOpen) {
      setFormData({
        driver_id: schedule.driverId || '',
        bus_id: schedule.busId || '',
        route_id: schedule.routeId || '',
        start_time: schedule.startTime || '',
        end_time: schedule.endTime || '',
        date: schedule.date || new Date().toISOString().split('T')[0],
        status: schedule.rawStatus || 'scheduled'
      });
    }
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.driver_id || !formData.bus_id || !formData.route_id || !formData.start_time || !formData.end_time) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setSaving(true);
    try {
      await onSave(schedule.id, formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <BusIcon size={28} />
              Sửa lịch trình
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {schedule?.plate} - {schedule?.scheduleId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tài xế */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tài xế <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.driver_id}
                onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="">Chọn tài xế</option>
                {drivers?.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Xe bus */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Xe bus <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.bus_id}
                onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="">Chọn xe bus</option>
                {buses?.map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.plate} - {bus.capacity} chỗ
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tuyến đường - READ ONLY */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tuyến đường
            </label>
            <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">
              {routes?.find(route => route.id === formData.route_id)?.name || 'Không xác định'}
              <p className="text-xs text-gray-500 mt-1">🔒 Không thể thay đổi tuyến đường</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Giờ bắt đầu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giờ bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              />
            </div>

            {/* Giờ kết thúc */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giờ kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              />
            </div>

            {/* Ngày */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              />
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            >
              <option value="scheduled">Đang chờ</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Hủy</option>
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
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Cập nhật'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BusCard = ({ bus, allBusData, allStudentData, onEdit, onDelete, drivers, routes, buses }) => {
  const [open, setOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Đang chờ': return 'bg-yellow-100 text-yellow-800';
      case 'Hoàn thành': return 'bg-green-100 text-green-800';
      case 'Hủy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setOpen(false);
  };

  const handleSaveEdit = async (scheduleId, formData) => {
    try {
      await onEdit(scheduleId, formData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  };

  const handleDeleteClick = () => {
    onDelete(bus.id);
    setOpen(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition-shadow duration-200 hover:shadow-md">
        <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
          <strong className="text-lg font-semibold text-blue-900">{bus.plate}</strong>
          <div className="relative inline-block text-left" ref={menuRef}>
            <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Settings size={18} />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                <Link
                  to={`/buses/${bus.id}/students`}
                  state={{ busData: allBusData, studentData: allStudentData }}
                  className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Info size={16} className="mr-3" />
                  Danh sách học sinh
                </Link>

                <button
                  onClick={handleEditClick}
                  className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Pencil size={16} className="mr-3" />
                  Sửa lịch trình
                </button>
                <div className="my-1 h-px bg-gray-100" />
                <button
                  onClick={handleDeleteClick}
                  className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={16} className="mr-3" />
                  Xoá lịch trình
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium text-gray-900">Tài xế:</span> {bus.driver}</p>
          <p><span className="font-medium text-gray-900">Sức chứa:</span> {bus.capacity} chỗ</p>
          <div className="flex items-center">
            <Clock size={15} className="text-gray-500 mr-2 flex-shrink-0" />
            <span className="font-medium text-gray-900">{bus.startTime} - {bus.endTime}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-900">Trạng thái:</span>
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(bus.status)}`}>
              {bus.status}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        schedule={bus}
        drivers={drivers}
        routes={routes}
        buses={buses}
      />
    </>
  );
};

export default BusCard;