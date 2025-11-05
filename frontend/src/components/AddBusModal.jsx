import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Bus, User, MapPin, Activity, Clock, Users } from 'lucide-react';
import { getDriversApi } from "../api/userApi";
import { getRoutesApi } from "../api/routeApi";
import { getAllBuses, createBusApi } from '@/api/busApi';
import { createBusScheduleApi } from '@/api/busscheduleApi';

const AddBusModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [plate, setPlate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [driverId, setDriverId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [busStatus, setBusStatus] = useState('active');
  const [scheduleStatus, setScheduleStatus] = useState('scheduled');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // State để lưu dữ liệu từ API
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State để quản lý chế độ: tạo mới bus hay chọn bus có sẵn
  const [isNewBus, setIsNewBus] = useState(true);
  const [selectedBusId, setSelectedBusId] = useState('');

  const isEditing = Boolean(initialData);

  // Load drivers, routes và buses từ API
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        setError(null);

        // Gọi cả 3 API cùng lúc
        const [driversData, routesData, busesData] = await Promise.all([
          getDriversApi(),
          getRoutesApi(),
          getAllBuses()
        ]);

        // Transform drivers data
        const transformedDrivers = driversData.map(driver => ({
          id: driver._id,
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          licenseNumber: driver.driverInfo?.licenseNumber,
        }));

        // Transform routes data
        const transformedRoutes = routesData.map(route => ({
          id: route._id,
          route_id: route.route_id,
          name: route.name,
          startPoint: route.start_point?.name,
          endPoint: route.end_point?.name,
        }));

        // Transform buses data
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

  // Điền dữ liệu vào form khi ở chế độ "Sửa"
  useEffect(() => {
    if (isEditing && isOpen) {
      setIsNewBus(false);
      setSelectedBusId(initialData.busId || '');
      setPlate(initialData.plate || '');
      setCapacity(initialData.capacity || '');
      setDriverId(initialData.driverId || '');
      setRouteId(initialData.routeId || '');
      setBusStatus(initialData.busStatus || 'active');
      setScheduleStatus(initialData.scheduleStatus || 'scheduled');
      setStartTime(initialData.startTime || '');
      setEndTime(initialData.endTime || '');
    } else if (isOpen) {
      // Reset form khi mở ở chế độ "Thêm mới"
      setIsNewBus(true);
      setSelectedBusId('');
      setPlate('');
      setCapacity('');
      setDriverId('');
      setRouteId('');
      setBusStatus('active');
      setScheduleStatus('scheduled');
      setStartTime('');
      setEndTime('');
    }
  }, [initialData, isOpen, isEditing]);

  // Tự động điền capacity khi chọn bus có sẵn
  const handleBusSelect = (busId) => {
    setSelectedBusId(busId);
    const selectedBus = buses.find(bus => bus.id === busId);
    if (selectedBus) {
      setPlate(selectedBus.license_plate);
      setCapacity(selectedBus.capacity.toString());
      setBusStatus(selectedBus.status);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      let busId = selectedBusId;

      // Nếu tạo bus mới
      if (isNewBus) {
        const newBus = await createBusApi({
          plate: plate,
          capacity: parseInt(capacity),
          status: busStatus
        });
        busId = newBus._id;
        console.log("Bus created:", newBus);
      }

      // Tạo bus schedule
      const scheduleData = {
        busId: busId,
        driverId: driverId,
        routeId: routeId,
        startTime: startTime,
        endTime: endTime,
        status: scheduleStatus
      };

      const newSchedule = await createBusScheduleApi(scheduleData);
      console.log("Schedule created:", newSchedule);

      alert("✅ Thêm lịch trình xe bus thành công!");

      // Gọi callback onSave nếu có
      if (onSave) {
        onSave(newSchedule);
      }

      onClose();

    } catch (err) {
      console.error("Error creating bus/schedule:", err);
      setError(
        err.response?.data?.message ||
        "Không thể tạo lịch trình. Vui lòng thử lại."
      );
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
                  {isEditing ? 'Cập nhật lịch trình xe' : 'Thêm lịch trình xe bus'}
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
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Chọn chế độ: Bus mới hay Bus có sẵn */}
                    {!isEditing && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chọn xe bus
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              checked={isNewBus}
                              onChange={() => setIsNewBus(true)}
                              className="mr-2"
                            />
                            <span className="text-sm">Tạo xe mới</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              checked={!isNewBus}
                              onChange={() => setIsNewBus(false)}
                              className="mr-2"
                            />
                            <span className="text-sm">Chọn xe có sẵn</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Chọn Bus có sẵn */}
                    {!isNewBus && (
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
                            onChange={(e) => handleBusSelect(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="" disabled>-- Chọn xe bus --</option>
                            {buses.map(bus => (
                              <option key={bus.id} value={bus.id}>
                                {bus.license_plate} - {bus.capacity} chỗ ({bus.status})
                              </option>
                            ))}
                          </select>
                        </div>
                        {buses.length === 0 && (
                          <p className="mt-1 text-xs text-gray-500">Chưa có xe bus nào</p>
                        )}
                      </div>
                    )}

                    {/* Biển số xe (chỉ khi tạo mới) */}
                    {isNewBus && (
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
                    )}

                    {/* Sức chứa */}
                    {isNewBus && (
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
                    )}

                    {/* Tài xế */}
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
                      {drivers.length === 0 && (
                        <p className="mt-1 text-xs text-gray-500">Chưa có tài xế nào</p>
                      )}
                    </div>

                    {/* Tuyến đường */}
                    <div>
                      <label htmlFor="route" className="block text-sm font-medium text-gray-700">
                        Chọn tuyến đường <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <MapPin size={16} className="text-gray-400" />
                        </span>
                        <select
                          id="route"
                          value={routeId}
                          onChange={(e) => setRouteId(e.target.value)}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="" disabled>-- Chọn tuyến đường --</option>
                          {routes.map(route => (
                            <option key={route.id} value={route.id}>
                              {route.route_id} - {route.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {routes.length === 0 && (
                        <p className="mt-1 text-xs text-gray-500">Chưa có tuyến đường nào</p>
                      )}
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

                    {/* Trạng thái */}
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Trạng thái
                      </label>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Activity size={16} className="text-gray-400" />
                        </span>
                        <select
                          id="status"
                          value={scheduleStatus}
                          onChange={(e) => setScheduleStatus(e.target.value)}
                          required
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          {scheduleStatusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
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
                        {loading ? 'Đang xử lý...' : (isEditing ? 'Lưu thay đổi' : 'Thêm lịch trình')}
                      </button>
                    </div>
                  </form>
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