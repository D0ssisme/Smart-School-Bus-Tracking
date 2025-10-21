import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Bus, User, MapPin, Activity, Clock } from 'lucide-react'; // Thêm icon Clock

const AddBusModal = ({ isOpen, onClose, onAddBus, drivers = [], routes = [] }) => {
  const [plate, setPlate] = useState('');
  const [driverId, setDriverId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [status, setStatus] = useState('Ngừng');
  // THÊM MỚI: State cho giờ bắt đầu và kết thúc
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBus({
      plate,
      driverId,
      routeId,
      status,
      startTime, // THÊM MỚI
      endTime,   // THÊM MỚI
    });
    
    // Reset form
    onClose();
    setPlate('');
    setDriverId('');
    setRouteId('');
    setStatus('Ngừng');
    setStartTime(''); // THÊM MỚI
    setEndTime('');   // THÊM MỚI
  };

  const statusOptions = ['Ngừng', 'Đang chạy', 'Bảo trì'];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        {/* ... (Phần Transition.Child cho nền mờ giữ nguyên) ... */}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  Thêm xe bus mới
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  
                  {/* ... (Các ô Mã xe, Tài xế, Tuyến đường, Trạng thái giữ nguyên) ... */}
                  <div>
                    <label htmlFor="plate" className="block text-sm font-medium text-gray-700">Mã xe (Biển số)</label>
                    <div className="relative mt-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Bus size={16} className="text-gray-400" />
                      </span>
                      <input type="text" id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Ví dụ: 51B-123.45" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                   <div>
                    <label htmlFor="driver" className="block text-sm font-medium text-gray-700">Chọn tài xế</label>
                    <div className="relative mt-1">
                       <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <User size={16} className="text-gray-400" />
                      </span>
                      <select id="driver" value={driverId} onChange={(e) => setDriverId(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white" >
                        <option value="" disabled>-- Chọn tài xế --</option>
                        {drivers.map(driver => ( <option key={driver.id} value={driver.id}>{driver.name}</option> ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="route" className="block text-sm font-medium text-gray-700">Chọn tuyến đường</label>
                     <div className="relative mt-1">
                       <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin size={16} className="text-gray-400" />
                      </span>
                      <select id="route" value={routeId} onChange={(e) => setRouteId(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white" >
                        <option value="" disabled>-- Chọn tuyến đường --</option>
                        {routes.map(route => ( <option key={route.id} value={route.id}>{route.name}</option> ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <div className="relative mt-1">
                       <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Activity size={16} className="text-gray-400" />
                      </span>
                      <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white" >
                        {statusOptions.map(opt => ( <option key={opt} value={opt}>{opt}</option> ))}
                      </select>
                    </div>
                  </div>

                  {/* THÊM MỚI: Ô nhập giờ */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Giờ bắt đầu</label>
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
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
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

                  {/* ... (Nút Submit giữ nguyên) ... */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" > Huỷ </button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none" > Thêm xe </button>
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
