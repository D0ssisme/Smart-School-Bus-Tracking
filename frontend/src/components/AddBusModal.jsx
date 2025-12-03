import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Bus, User, MapPin, Activity, Clock, Users } from 'lucide-react';
import { getDriversApi } from "../api/userApi";
import { getRoutesApi } from "../api/routeApi";
import { getAllBuses, createBusApi } from '@/api/busApi';
import { createBusScheduleApi, updateBusScheduleApi } from '@/api/busscheduleApi';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';





const AddBusModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const { t } = useLanguage();
  // State cho Bus mới
  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [busStatus, setBusStatus] = useState('active');

  // State cho Schedule
  const [selectedBusId, setSelectedBusId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [scheduleStatus, setScheduleStatus] = useState('scheduled');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // State để lưu dữ liệu từ API
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State để quản lý chế độ: tạo mới bus hay phân bổ lịch trình
  const [mode, setMode] = useState('create'); // 'create' hoặc 'schedule'

  const isEditing = Boolean(initialData);

  // Load drivers, routes và buses từ API
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        setError(null);

        const [driversData, routesData, busesData] = await Promise.all([
          getDriversApi(),
          getRoutesApi(),
          getAllBuses()
        ]);

        const transformedDrivers = driversData.map(driver => ({
          id: driver._id,
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          licenseNumber: driver.driverInfo?.licenseNumber,
        }));

        const transformedRoutes = routesData.map(route => ({
          id: route._id,
          route_id: route.route_id,
          name: route.name,
          startPoint: route.start_point?.name,
          endPoint: route.end_point?.name,
        }));

        const transformedBuses = busesData.map(bus => ({
          id: bus._id,
          bus_id: bus.bus_id,
          license_plate: bus.license_plate,
          capacity: bus.capacity,
          status: bus.status,
        }));

        setDrivers(transformedDrivers);
        setRoutes(transformedRoutes);
        setBuses(transformedBuses);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // Reset form khi mở modal hoặc load data khi edit
  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        // Load data cho edit schedule
        setMode('schedule');
        setSelectedBusId(initialData.busId || '');
        setDriverId(initialData.driverId || '');
        setRouteId(initialData.routeId || '');
        setScheduleStatus(initialData.rawStatus || 'scheduled');
        setStartTime(initialData.startTime || '');
        setEndTime(initialData.endTime || '');
      } else {
        // Reset form cho tạo mới
        setMode('create');
        setPlate('');
        setCapacity('');
        setBusStatus('active');
        setSelectedBusId('');
        setDriverId('');
        setRouteId('');
        setScheduleStatus('scheduled');
        setStartTime('');
        setEndTime('');
      }
    }
  }, [isOpen, isEditing, initialData]);

  // Handle submit cho TẠO BUS MỚI
  const handleCreateBus = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      console.log("🚌 Creating new bus:", {
        license_plate: plate,
        capacity: parseInt(capacity),
        status: busStatus
      });

      const newBus = await createBusApi({
        license_plate: plate,
        capacity: parseInt(capacity),
        status: busStatus
      });

      console.log("✅ Bus created successfully:", newBus);

      Swal.fire({
        title: "✅ Tạo xe bus thành công!",
        html: `
        <p><strong>Mã xe:</strong> ${newBus.bus?.bus_id || "Chưa có"}</p>
        <p><strong>Biển số:</strong> ${newBus.bus?.license_plate || "Chưa có"}</p>
      `,
        icon: "success",
        confirmButtonText: "OK",
      });

      if (onSave) {
        onSave(newBus);
      }

      onClose();

    } catch (err) {
      console.error("❌ Error creating bus:", err);
      console.error("❌ Error response:", err.response?.data);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Không thể tạo xe bus. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };


  // Handle submit cho PHÂN BỔ/SỬA LỊCH TRÌNH
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const scheduleData = {
        bus_id: selectedBusId,
        driver_id: driverId,
        route_id: routeId,
        start_time: startTime,
        end_time: endTime,
        date: new Date().toISOString().split('T')[0],
        status: scheduleStatus || 'scheduled'
      };

      let response;
      if (isEditing && initialData?.id) {
        // Update existing schedule
        response = await updateBusScheduleApi(initialData.id, scheduleData);
        console.log("✅ Schedule updated successfully:", response);
      } else {
        // Create new schedule
        response = await createBusScheduleApi(scheduleData);
        console.log("✅ Schedule created successfully:", response);
      }

      // ← Thay alert bằng Toast đẹp
      const successMessage = isEditing ? t('addBus.messages.updateSuccess') : t('addBus.messages.createSuccess');
      toast.success(
        <div className="flex items-center gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{t('common.success')}!</p>
            <p className="text-sm text-gray-600">{successMessage}</p>
          </div>
        </div>,
        {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#fff',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid #10b981'
          }
        }
      );

      // ✅ Gọi onSave với schedule data
      if (onSave) {
        onSave(response.data || response); // Truyền schedule object
      }

      onClose();

    } catch (err) {
      console.error("❌ Error creating schedule:", err);

      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        "Không thể tạo lịch trình.";

      // ← Toast error
      toast.error(
        <div className="flex items-center gap-3">
          <div className="bg-red-100 rounded-full p-2">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Lỗi!</p>
            <p className="text-sm text-gray-600">{errorMessage}</p>
          </div>
        </div>,
        {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#fff',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ef4444'
          }
        }
      );

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };























  const busStatusOptions = ['active', 'repair', 'inactive'];
  const scheduleStatusOptions = ['scheduled', 'completed', 'cancelled'];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  {isEditing ? '✏️ Sửa lịch trình xe' : (mode === 'create' ? 'Tạo xe bus mới' : 'Phân bổ lịch trình xe')}
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                {/* Loading State */}
                {loading ? (
                  <div className="mt-4 flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang xử lý...</span>
                  </div>
                ) : (
                  <>
                    {/* Chọn chế độ */}
                    {!isEditing && (
                      <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          🚌 Chọn chức năng
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setMode('create')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${mode === 'create'
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                          >
                            ➕ Tạo xe mới
                          </button>
                          <button
                            type="button"
                            onClick={() => setMode('schedule')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${mode === 'schedule'
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                              }`}
                          >
                            📅 Phân bổ lịch trình
                          </button>
                        </div>
                      </div>
                    )}

                    {/* FORM TẠO XE MỚI */}
                    {mode === 'create' && (
                      <form onSubmit={handleCreateBus} className="mt-4 space-y-4">
                        {/* Biển số xe */}
                        <div>
                          <label htmlFor="plate" className="block text-sm font-medium text-gray-700">
                            Biển số xe <span className="text-red-500">*</span>
                          </label>
                          <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <Bus size={16} className="text-gray-400" />
                            </span>
                            <input
                              type="text"
                              id="plate"
                              value={plate}
                              onChange={(e) => setPlate(e.target.value)}
                              placeholder="Ví dụ: 51B-123.45"
                              required
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Sức chứa */}
                        <div>
                          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                            Sức chứa (số chỗ ngồi) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <Users size={16} className="text-gray-400" />
                            </span>
                            <input
                              type="number"
                              id="capacity"
                              value={capacity}
                              onChange={(e) => setCapacity(e.target.value)}
                              placeholder="Ví dụ: 30"
                              required
                              min="1"
                              max="100"
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Trạng thái xe */}
                        <div>
                          <label htmlFor="busStatus" className="block text-sm font-medium text-gray-700">
                            Trạng thái xe
                          </label>
                          <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <Activity size={16} className="text-gray-400" />
                            </span>
                            <select
                              id="busStatus"
                              value={busStatus}
                              onChange={(e) => setBusStatus(e.target.value)}
                              required
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                              {busStatusOptions.map(opt => (
                                <option key={opt} value={opt}>
                                  {opt === 'active' ? 'Hoạt động' : opt === 'repair' ? 'Đang sửa chữa' : 'Không hoạt động'}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                          >
                            Huỷ
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? t('addBus.creating') : t('addBus.createBus')}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* FORM PHÂN BỔ/SỬA LỊCH TRÌNH */}
                    {mode === 'schedule' && (
                      <form onSubmit={handleSaveSchedule} className="mt-4 space-y-4">
                        {/* Chọn xe bus */}
                        <div>
                          <label htmlFor="existingBus" className="block text-sm font-medium text-gray-700">
                            Chọn xe bus <span className="text-red-500">*</span>
                          </label>
                          <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <Bus size={16} className="text-gray-400" />
                            </span>
                            <select
                              id="existingBus"
                              value={selectedBusId}
                              onChange={(e) => setSelectedBusId(e.target.value)}
                              required
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                              <option value="" disabled>-- Chọn xe bus --</option>
                              {buses.map(bus => (
                                <option key={bus.id} value={bus.id}>
                                  {bus.bus_id} - {bus.license_plate} ({bus.capacity} chỗ)
                                </option>
                              ))}
                            </select>
                          </div>
                          {buses.length === 0 && (
                            <p className="mt-1 text-xs text-red-500">⚠️ Chưa có xe bus nào. Vui lòng tạo xe trước!</p>
                          )}
                        </div>

                        {/* Chọn tài xế */}
                        <div>
                          <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
                            Chọn tài xế <span className="text-red-500">*</span>
                          </label>
                          <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <User size={16} className="text-gray-400" />
                            </span>
                            <select
                              id="driver"
                              value={driverId}
                              onChange={(e) => setDriverId(e.target.value)}
                              required
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                              <option value="" disabled>-- Chọn tài xế --</option>
                              {drivers.map(driver => (
                                <option key={driver.id} value={driver.id}>
                                  {driver.name} - {driver.licenseNumber || 'N/A'}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Chọn tuyến đường */}
                        <div>
                          <label htmlFor="route" className="block text-sm font-medium text-gray-700">
                            Chọn tuyến đường {!isEditing && <span className="text-red-500">*</span>}
                            {isEditing && <span className="text-xs text-gray-500 ml-2">🔒 Không thể thay đổi</span>}
                          </label>
                          <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <MapPin size={16} className="text-gray-400" />
                            </span>
                            <select
                              id="route"
                              value={routeId}
                              onChange={(e) => setRouteId(e.target.value)}
                              required={!isEditing}
                              disabled={isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${isEditing ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed' : 'bg-white border-gray-300'
                                }`}
                            >
                              <option value="" disabled>-- Chọn tuyến đường --</option>
                              {routes.map(route => (
                                <option key={route.id} value={route.id}>
                                  {route.route_id} - {route.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Giờ bắt đầu và kết thúc */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                              Giờ bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-1">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Clock size={16} className="text-gray-400" />
                              </span>
                              <input
                                type="time"
                                id="startTime"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                              Giờ kết thúc <span className="text-red-500">*</span>
                            </label>
                            <div className="relative mt-1">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Clock size={16} className="text-gray-400" />
                              </span>
                              <input
                                type="time"
                                id="endTime"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Trạng thái lịch trình */}


                        <div className="mt-6 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                          >
                            Huỷ
                          </button>
                          <button
                            type="submit"
                            disabled={loading || buses.length === 0}
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? t('addBus.processing') : (isEditing ? t('addBus.updateSchedule') : t('addBus.allocateSchedule'))}
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddBusModal;