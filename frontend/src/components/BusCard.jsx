//src/components/BusCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings, Info, CalendarCheck, Pencil, Trash2, Clock
} from 'lucide-react';

const BusCard = ({ bus, allBusData, allStudentData, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
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
    onEdit(bus);
    setOpen(false);
  };

  const handleDeleteClick = () => {
    onDelete(bus.id);
    setOpen(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition-shadow duration-200 hover:shadow-md">
      <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
        <strong className="text-lg font-semibold text-blue-900">{bus.plate}</strong>
        <div className="relative inline-block text-left" ref={menuRef}>
          <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Settings size={18} />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg z-10 py-1">
              <Link to={`/buses/${bus.id}/students`} state={{ busData: allBusData, studentData: allStudentData }} className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <Info size={16} className="mr-3" />
                Danh sách học sinh
              </Link>
             
              <button onClick={handleEditClick} className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                <Pencil size={16} className="mr-3" />
                Sửa thông tin
              </button>
              <div className="my-1 h-px bg-gray-100" />
              <button onClick={handleDeleteClick} className="group flex w-full items-center rounded-md px-3 py-2 text-sm text-red-600 font-medium hover:bg-red-50 hover:text-red-700">
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
  );
};

export default BusCard;