import React, { useState, useEffect } from 'react';
import BusCard from '../components/BusCard';
import AddBusModal from '../components/AddBusModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Plus, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

const fakeDrivers = [
  { id: 1, name: 'Nguyễn Văn A' }, { id: 2, name: 'Trần Thị B' }, { id: 3, name: 'Lê Văn C' }, { id: 4, name: 'Phạm Văn D' }, { id: 5, name: 'Võ Thị E' },
];
const fakeRoutes = [
  { id: 'T01', name: 'Tuyến 01 - Bến Thành - Suối Tiên' }, { id: 'T02', name: 'Tuyến 02 - Bến xe Miền Tây - An Sương' }, { id: 'T03', name: 'Tuyến 03 - Quận 1 - Quận 7' },
];
const fakeStudents = [
    { student_id: 101, name: 'Lê Hoàng An Đình', grade: 'Lớp 1A', parent_id: 201, pickup_point: 'Cổng A - Chung cư A', dropoff_point: 'Cổng A - Chung cư A' }, { student_id: 102, name: 'Nguyễn Ngọc Minh', grade: 'Lớp 2B', parent_id: 202, pickup_point: '72 Thành Thái, P.14, Q.10', dropoff_point: '72 Thành Thái, P.14, Q.10' }, { student_id: 103, name: 'Trần Đức Duy', grade: 'Lớp 1A', parent_id: 203, pickup_point: 'Ngã tư Hàng Xanh', dropoff_point: 'Cổng B - Chung cư A' }, { student_id: 104, name: 'Trầm Đại Dương', grade: 'Lớp 3C', parent_id: 204, pickup_point: 'Cổng C - Chung cư B', dropoff_point: 'Cổng C - Chung cư B' }, { student_id: 105, name: 'Võ Trường Sinh', grade: 'Lớp 4A', parent_id: 205, pickup_point: '18 Nguyễn Thị Minh Khai, Q.1', dropoff_point: '18 Nguyễn Thị Minh Khai, Q.1' },
];
const initialBusData = [
  {
    routeId: 'T01', routeName: 'Tuyến 01 - Bến Thành - Suối Tiên',
    buses: [
      { id: 1, plate: '51B-123.45', driver: 'Nguyễn Văn A', status: 'Đang chạy', passengers: 3, startTime: '06:00', endTime: '18:00', studentIds: [101, 102, 103] }, { id: 2, plate: '51B-678.90', driver: 'Trần Thị B', status: 'Đang chạy', passengers: 2, startTime: '06:30', endTime: '18:30', studentIds: [104, 105] }, { id: 3, plate: '51B-111.22', driver: 'Lê Văn C', status: 'Bảo trì', passengers: 0, startTime: 'N/A', endTime: 'N/A', studentIds: [] },
    ],
  },
  {
    routeId: 'T02', routeName: 'Tuyến 02 - Bến xe Miền Tây - An Sương',
    buses: [ { id: 4, plate: '51C-333.44', driver: 'Phạm Văn D', status: 'Ngừng', passengers: 0, startTime: 'N/A', endTime: 'N/A', studentIds: [] } ],
  },
];

const BusManagementPage = () => {
  const [busData, setBusData] = useState(initialBusData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);

  const handleOpenAddModal = () => {
    setEditingBus(null); 
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (busToEdit) => {
    setEditingBus(busToEdit); 
    setIsModalOpen(true); 
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBus(null);
  };
  
  const handleOpenDeleteModal = (busId) => {
    setBusToDelete(busId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBusToDelete(null);
  };
  
  const handleConfirmDelete = () => {
    setBusData(prevData => 
        prevData.map(route => ({
            ...route,
            buses: route.buses.filter(bus => bus.id !== busToDelete)
        })).filter(route => route.buses.length > 0)
    );
    toast.success('Đã xoá xe thành công!');
    handleCloseDeleteModal();
  };

  const handleSaveBus = (formData) => {
    const driver = fakeDrivers.find(d => d.id === parseInt(formData.driverId));
    const routeInfo = fakeRoutes.find(r => r.id === formData.routeId);
    if (!driver || !routeInfo) return;

    if (formData.id) {
      setBusData(prevData => (
        prevData.map(route => ({
          ...route,
          buses: route.buses.map(bus => 
            bus.id === formData.id 
            ? { ...bus, plate: formData.plate, driver: driver.name, status: formData.status, startTime: formData.startTime, endTime: formData.endTime } 
            : bus
          ),
        }))
      ));
      toast.success('Cập nhật thông tin xe thành công!');
    } else {
      const newBus = {
        id: Date.now(), plate: formData.plate, driver: driver.name, status: formData.status, passengers: 0, startTime: formData.startTime, endTime: formData.endTime, studentIds: [],
      };
      setBusData(prevData => {
        const routeIndex = prevData.findIndex(r => r.routeId === routeInfo.id);
        const updatedData = JSON.parse(JSON.stringify(prevData));
        if (routeIndex > -1) {
          updatedData[routeIndex].buses.push(newBus);
        } else {
          updatedData.push({ routeId: routeInfo.id, routeName: routeInfo.name, buses: [newBus] });
        }
        return updatedData;
      });
      toast.success('Thêm xe mới thành công!');
    }
  };

  const filteredRoutes = busData.map(route => ({...route, buses: route.buses.filter(bus => {
    const statusMatch = filterStatus === 'all' || (filterStatus === 'running' && bus.status === 'Đang chạy') || (filterStatus === 'stopped' && bus.status === 'Ngừng') || (filterStatus === 'maintenance' && bus.status === 'Bảo trì');
    const searchMatch = bus.plate.toLowerCase().includes(searchTerm.toLowerCase()) || (bus.driver && bus.driver.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && searchMatch;
  })})).filter(route => route.buses.length > 0);

  return (
    <div className="bg-white rounded p-5 min-h-full">
      {/* --- THAY ĐỔI Ở ĐÂY: z-10 thành z-1 --- */}
      <div className="sticky top-0 z-1 flex flex-wrap justify-between items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-md px-3 py-2">
            <Filter size={16} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent border-none focus:ring-0 text-sm outline-none">
              <option value="all">Tất cả trạng thái</option> <option value="running">Đang chạy</option> <option value="stopped">Ngừng</option> <option value="maintenance">Bảo trì</option>
            </select>
          </div>
          <input type="text" placeholder="Tìm theo biển số, tài xế..." className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64 focus:ring-blue-500 focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={18} /> Thêm xe mới
        </button>
      </div>
      <div className="space-y-8">
        {filteredRoutes.map((route) => (
          <section key={route.routeId}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2 inline-block">{route.routeName}</h3>
            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
              {route.buses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={{...bus, routeId: route.routeId}}
                  allBusData={busData}
                  allStudentData={fakeStudents}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                />
              ))}
            </div>
          </section>
        ))}
        {filteredRoutes.length === 0 && (
          <div className="text-center text-gray-500 text-lg mt-10"><p>Không tìm thấy xe bus nào phù hợp.</p></div>
        )}
      </div>
      <AddBusModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBus}
        drivers={fakeDrivers}
        routes={fakeRoutes}
        initialData={editingBus}
      />
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default BusManagementPage;

