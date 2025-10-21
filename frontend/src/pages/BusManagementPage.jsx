import React, { useState, useEffect } from 'react';
import BusCard from '../components/BusCard';
import { Plus, Filter } from 'lucide-react';
import AddBusModal from '../components/AddBusModal'; // THÊM MỚI: Import Modal

// --- Dữ liệu giả (Fake Data) ---
const fakeDrivers = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
  { id: 3, name: 'Lê Văn C' },
  { id: 4, name: 'Phạm Văn D' },
  { id: 5, name: 'Võ Thị E' },
];

const fakeRoutes = [
  { id: 'T01', name: 'Tuyến 01 - Bến Thành - Suối Tiên' },
  { id: 'T02', name: 'Tuyến 02 - Bến xe Miền Tây - An Sương' },
  { id: 'T03', name: 'Tuyến 03 - Quận 1 - Quận 7' },
];

// CẬP NHẬT: Thêm startTime và endTime vào dữ liệu ảo
const fakeBusData = [
  {
    routeId: 'T01',
    routeName: 'Tuyến 01 - Bến Thành - Suối Tiên',
    buses: [
      { id: 1, plate: '51B-123.45', driver: 'Nguyễn Văn A', status: 'Đang chạy', passengers: 30, startTime: '06:00', endTime: '18:00' },
      { id: 2, plate: '51B-678.90', driver: 'Trần Thị B', status: 'Đang chạy', passengers: 15, startTime: '06:30', endTime: '18:30' },
      { id: 3, plate: '51B-111.22', driver: 'Lê Văn C', status: 'Bảo trì', passengers: 0, startTime: 'N/A', endTime: 'N/A' },
    ],
  },
  {
    routeId: 'T02',
    routeName: 'Tuyến 02 - Bến xe Miền Tây - An Sương',
    buses: [
      { id: 4, plate: '51C-333.44', driver: 'Phạm Văn D', status: 'Ngừng', passengers: 0, startTime: 'N/A', endTime: 'N/A' },
      { id: 5, plate: '51C-555.66', driver: 'Võ Thị E', status: 'Đang chạy', passengers: 40, startTime: '07:00', endTime: '19:00' },
    ],
  },
];
// ------------------------------

const BusManagementPage = () => {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setRoutes(fakeBusData);
  }, []);

  // CẬP NHẬT: Thêm startTime và endTime khi tạo xe mới
  const handleAddBus = (newBusData) => {
    const driver = fakeDrivers.find(d => d.id === parseInt(newBusData.driverId));
    const routeInfo = fakeRoutes.find(r => r.id === newBusData.routeId);

    if (!driver || !routeInfo) return;

    const newBus = {
      id: Date.now(),
      plate: newBusData.plate,
      driver: driver.name,
      status: newBusData.status,
      passengers: 0,
      startTime: newBusData.startTime, // Thêm giờ bắt đầu
      endTime: newBusData.endTime,     // Thêm giờ kết thúc
    };

    setRoutes(prevRoutes => {
      const routeIndex = prevRoutes.findIndex(r => r.routeId === routeInfo.id);
      const updatedRoutes = [...prevRoutes];

      if (routeIndex > -1) {
        updatedRoutes[routeIndex].buses.push(newBus);
      } else {
        updatedRoutes.push({
          routeId: routeInfo.id,
          routeName: routeInfo.name,
          buses: [newBus],
        });
      }
      return updatedRoutes;
    });
  };

  const filteredRoutes = routes
    .map(route => {
      const filteredBuses = route.buses.filter(bus => {
        const statusMatch = filterStatus === 'all' ||
          (filterStatus === 'running' && bus.status === 'Đang chạy') ||
          (filterStatus === 'stopped' && bus.status === 'Ngừng') ||
          (filterStatus === 'maintenance' && bus.status === 'Bảo trì');
        const searchMatch = bus.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (bus.driver && bus.driver.toLowerCase().includes(searchTerm.toLowerCase()));
        return statusMatch && searchMatch;
      });
      return { ...route, buses: filteredBuses };
    })
    .filter(route => route.buses.length > 0);

  return (
    <div className="bg-white rounded p-5 min-h-full">
      <div className="sticky top-0 z-1 flex flex-wrap justify-between items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-md px-3 py-2">
            <Filter size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="running">Đang chạy</option>
              <option value="stopped">Ngừng</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Tìm theo biển số, tài xế..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Thêm xe mới
        </button>
      </div>
      <div className="space-y-8">
        {filteredRoutes.map((route) => (
          <section key={route.routeId}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2 inline-block">
              {route.routeName}
            </h3>
            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
              {route.buses.map((bus) => (
                // CẬP NHẬT: Truyền startTime và endTime vào BusCard
                <BusCard
                  key={bus.id}
                  licensePlate={bus.plate}
                  driverName={bus.driver}
                  status={bus.status}
                  passengerCount={bus.passengers}
                  startTime={bus.startTime}
                  endTime={bus.endTime}
                />
              ))}
            </div>
          </section>
        ))}
        {filteredRoutes.length === 0 && (
          <div className="text-center text-gray-500 text-lg mt-10">
            <p>Không tìm thấy xe bus nào phù hợp.</p>
          </div>
        )}
      </div>
      <AddBusModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBus={handleAddBus}
        drivers={fakeDrivers}
        routes={fakeRoutes}
      />
    </div>
  );
};

export default BusManagementPage;