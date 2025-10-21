import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Info, 
  CalendarCheck, 
  Pencil, 
  Trash2,
  Clock // 1. Import thêm icon Clock
} from 'lucide-react';

// 2. Thêm `startTime` và `endTime` vào props
const BusCard = ({ licensePlate, driverName, status, passengerCount, startTime, endTime }) => {
  
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Đang chạy':
        return 'bg-green-100 text-green-800';
      case 'Ngừng':
        return 'bg-red-100 text-red-800';
      case 'Bảo trì':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleItemClick = () => {
    setOpen(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition-shadow duration-200 hover:shadow-md">
      <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
        <strong className="text-lg font-semibold text-blue-900">
          {licensePlate}
        </strong>

        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">Mở tuỳ chọn</span>
            <Settings size={18} />
          </button>

          {open && (
            <div 
              // Bỏ viền đen (ring)
              className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg focus:outline-none z-10 py-1"
            >
              <button
                onClick={handleItemClick}
                className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <Info size={16} className="mr-3" />
                Danh sách học sinh
              </button>
              <button
                onClick={handleItemClick}
                className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <CalendarCheck size={16} className="mr-3" />
                Check in / Check out
              </button>
              <button
                onClick={handleItemClick}
                className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <Pencil size={16} className="mr-3" />
                Sửa thông tin
              </button>
              
              <div className="my-1 h-px bg-gray-100" />
              
              <button
                onClick={handleItemClick}
                className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={16} className="mr-3" />
                Xoá xe
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">Tài xế:</span> {driverName}
        </p>
        <p>
          <span className="font-medium text-gray-900">Sĩ số:</span> {passengerCount} / 40
        </p>
        
        {/* 3. Thêm dòng hiển thị giờ */}
        <div className="flex items-center">
            <Clock size={15} className="text-gray-500 mr-2 flex-shrink-0" />
            <span className="font-medium text-gray-900">{startTime} - {endTime}</span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium text-gray-900">Trạng thái:</span>
          <span 
            className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(status)}`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusCard;