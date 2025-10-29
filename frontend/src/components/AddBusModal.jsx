import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Bus, User, MapPin, Activity, Clock } from 'lucide-react';

const AddBusModal = ({ isOpen, onClose, onSave, drivers = [], routes = [], initialData = null }) => {
  const [plate, setPlate] = useState('');
  const [driverId, setDriverId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [status, setStatus] = useState('Ngừng');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const isEditing = Boolean(initialData);

  // Sử dụng useEffect để điền dữ liệu vào form khi ở chế độ "Sửa"
  useEffect(() => {
    if (isEditing && isOpen) {
        // Tìm driver ID từ driver name
        const driver = drivers.find(d => d.name === initialData.driver);
        setPlate(initialData.plate || '');
        setDriverId(driver ? driver.id : '');
        setRouteId(initialData.routeId || '');
        setStatus(initialData.status || 'Ngừng');
        setStartTime(initialData.startTime || '');
        setEndTime(initialData.endTime || '');
    } else {
        // Reset form khi mở ở chế độ "Thêm mới"
        setPlate('');
        setDriverId('');
        setRouteId('');
        setStatus('Ngừng');
        setStartTime('');
        setEndTime('');
    }
  }, [initialData, isOpen, drivers]);


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: isEditing ? initialData.id : null, // Gửi kèm ID nếu là chế độ sửa
      plate,
      driverId,
      routeId,
      status,
      startTime,
      endTime,
    });
    onClose(); // Tự động đóng sau khi lưu
  };

  const statusOptions = ['Ngừng', 'Đang chạy', 'Bảo trì'];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                  {/* Tiêu đề thay đổi tùy theo chế độ */}
                  {isEditing ? 'Cập nhật thông tin xe' : 'Thêm xe bus mới'}
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="plate" className="block text-sm font-medium text-gray-700">Mã xe (Biển số)</label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Bus size={16} className="text-gray-400" /></span>
                      <input type="text" id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Ví dụ: 51B-123.45" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="driver" className="block text-sm font-medium text-gray-700">Chọn tài xế</label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3"><User size={16} className="text-gray-400" /></span>
                      <select id="driver" value={driverId} onChange={(e) => setDriverId(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="" disabled>-- Chọn tài xế --</option>
                        {drivers.map(driver => (<option key={driver.id} value={driver.id}>{driver.name}</option>))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="route" className="block text-sm font-medium text-gray-700">Chọn tuyến đường</label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3"><MapPin size={16} className="text-gray-400" /></span>
                      <select id="route" value={routeId} onChange={(e) => setRouteId(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                        <option value="" disabled>-- Chọn tuyến đường --</option>
                        {routes.map(route => (<option key={route.id} value={route.id}>{route.name}</option>))}
                      </select>
                    </div>
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Giờ bắt đầu</label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Clock size={16} className="text-gray-400" /></span>
                                <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Clock size={16} className="text-gray-400" /></span>
                                <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                        </div>
                    </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Activity size={16} className="text-gray-400" /></span>
                      <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                        {statusOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Huỷ</button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">
                      {/* Tên nút thay đổi tùy theo chế độ */}
                      {isEditing ? 'Lưu thay đổi' : 'Thêm xe'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddBusModal;

