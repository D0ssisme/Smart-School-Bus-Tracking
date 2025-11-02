import React, { useState, useEffect } from 'react';
import BusCard from '../components/BusCard';
import AddBusModal from '../components/AddBusModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { Plus, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllBuschedule } from '../api/busscheduleApi';

const fakeStudents = [
  { student_id: 101, name: 'Lê Hoàng An Đình', grade: 'Lớp 1A', parent_id: 201, pickup_point: 'Cổng A - Chung cư A', dropoff_point: 'Cổng A - Chung cư A' },
  { student_id: 102, name: 'Nguyễn Ngọc Minh', grade: 'Lớp 2B', parent_id: 202, pickup_point: '72 Thành Thái, P.14, Q.10', dropoff_point: '72 Thành Thái, P.14, Q.10' },
  { student_id: 103, name: 'Trần Đức Duy', grade: 'Lớp 1A', parent_id: 203, pickup_point: 'Ngã tư Hàng Xanh', dropoff_point: 'Cổng B - Chung cư A' },
  { student_id: 104, name: 'Trầm Đại Dương', grade: 'Lớp 3C', parent_id: 204, pickup_point: 'Cổng C - Chung cư B', dropoff_point: 'Cổng C - Chung cư B' },
  { student_id: 105, name: 'Võ Trường Sinh', grade: 'Lớp 4A', parent_id: 205, pickup_point: '18 Nguyễn Thị Minh Khai, Q.1', dropoff_point: '18 Nguyễn Thị Minh Khai, Q.1' },
];

const BusManagementPage = () => {
  const [busData, setBusData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // State để lưu schedules gốc và dữ liệu cho modal
  const [schedules, setSchedules] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);

  // Fetch data từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const schedulesData = await getAllBuschedule();
        setSchedules(schedulesData);

        // Extract unique drivers, routes, buses từ schedules data
        const driversSet = new Set();
        const routesSet = new Set();
        const busesSet = new Set();

        schedulesData.forEach(schedule => {
          if (schedule.driver_id) {
            driversSet.add(JSON.stringify({
              id: schedule.driver_id._id,
              name: schedule.driver_id.name
            }));
          }
          if (schedule.route_id) {
            routesSet.add(JSON.stringify({
              id: schedule.route_id._id,
              name: schedule.route_id.name
            }));
          }
          if (schedule.bus_id) {
            busesSet.add(JSON.stringify({
              id: schedule.bus_id._id,
              plate: schedule.bus_id.license_plate,
              capacity: schedule.bus_id.capacity
            }));
          }
        });

        setDrivers(Array.from(driversSet).map(item => JSON.parse(item)));
        setRoutes(Array.from(routesSet).map(item => JSON.parse(item)));
        setBuses(Array.from(busesSet).map(item => JSON.parse(item)));

        // Transform data để hiển thị
        const transformedData = transformDataForDisplay(schedulesData);
        setBusData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm transform data từ API sang format hiển thị
  const transformDataForDisplay = (schedules) => {
    const routeMap = {};

    schedules.forEach(schedule => {
      // Skip nếu thiếu thông tin cơ bản
      if (!schedule.bus_id || !schedule.route_id) return;

      const routeId = schedule.route_id._id;
      const routeName = schedule.route_id.name;

      // Tạo route group nếu chưa có
      if (!routeMap[routeId]) {
        routeMap[routeId] = {
          routeId: routeId,
          routeName: routeName,
          buses: []
        };
      }

      // Map status từ schedule
      const statusMap = {
        'scheduled': 'Đang chạy',
        'in_progress': 'Đang chạy',
        'completed': 'Ngừng',
        'cancelled': 'Bảo trì'
      };

      // Tạo bus object
      const busObj = {
        id: schedule._id,
        scheduleId: schedule.schedule_id,
        busId: schedule.bus_id._id,
        plate: schedule.bus_id.license_plate,
        driver: schedule.driver_id ? schedule.driver_id.name : 'Chưa phân công',
        driverId: schedule.driver_id?._id || null,
        status: statusMap[schedule.status] || 'Ngừng',
        passengers: 0, // Có thể cập nhật sau nếu có data học sinh
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        studentIds: [],
        capacity: schedule.bus_id.capacity,
        date: schedule.date
      };

      routeMap[routeId].buses.push(busObj);
    });

    return Object.values(routeMap);
  };

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

  const handleConfirmDelete = async () => {
    try {
      // TODO: Gọi API xóa schedule
      // await deleteScheduleApi(busToDelete);

      setBusData(prevData =>
        prevData.map(route => ({
          ...route,
          buses: route.buses.filter(bus => bus.id !== busToDelete)
        })).filter(route => route.buses.length > 0)
      );
      toast.success('Đã xoá xe thành công!');
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast.error('Không thể xóa xe. Vui lòng thử lại!');
    } finally {
      handleCloseDeleteModal();
    }
  };

  const handleSaveBus = async (formData) => {
    try {
      const driver = drivers.find(d => d.id === formData.driverId);
      const route = routes.find(r => r.id === formData.routeId);
      const bus = buses.find(b => b.id === formData.busId);

      if (!route || !bus) {
        toast.error('Thông tin không hợp lệ!');
        return;
      }

      if (formData.id) {
        // TODO: Gọi API update schedule
        // await updateScheduleApi(formData.id, { ... });

        setBusData(prevData => (
          prevData.map(r => ({
            ...r,
            buses: r.buses.map(b =>
              b.id === formData.id
                ? {
                    ...b,
                    plate: bus.plate,
                    driver: driver ? driver.name : 'Chưa phân công',
                    driverId: driver?.id || null,
                    status: formData.status,
                    startTime: formData.startTime,
                    endTime: formData.endTime
                  }
                : b
            ),
          }))
        ));
        toast.success('Cập nhật thông tin xe thành công!');
      } else {
        // TODO: Gọi API tạo schedule mới
        // const newSchedule = await createScheduleApi({ ... });

        const newBus = {
          id: Date.now(),
          scheduleId: `SCHEDULE${Date.now()}`,
          busId: bus.id,
          plate: bus.plate,
          driver: driver ? driver.name : 'Chưa phân công',
          driverId: driver?.id || null,
          status: formData.status,
          passengers: 0,
          startTime: formData.startTime,
          endTime: formData.endTime,
          studentIds: [],
          capacity: bus.capacity,
          routeId: route.id
        };

        setBusData(prevData => {
          const routeIndex = prevData.findIndex(r => r.routeId === route.id);
          const updatedData = JSON.parse(JSON.stringify(prevData));

          if (routeIndex > -1) {
            updatedData[routeIndex].buses.push(newBus);
          } else {
            updatedData.push({
              routeId: route.id,
              routeName: route.name,
              buses: [newBus]
            });
          }
          return updatedData;
        });
        toast.success('Thêm xe mới thành công!');
      }
    } catch (error) {
      console.error('Error saving bus:', error);
      toast.error('Không thể lưu thông tin xe. Vui lòng thử lại!');
    }
  };

  const filteredRoutes = busData.map(route => ({
    ...route,
    buses: route.buses.filter(bus => {
      const statusMatch = filterStatus === 'all' ||
        (filterStatus === 'running' && bus.status === 'Đang chạy') ||
        (filterStatus === 'stopped' && bus.status === 'Ngừng') ||
        (filterStatus === 'maintenance' && bus.status === 'Bảo trì');

      const searchMatch = bus.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bus.driver && bus.driver.toLowerCase().includes(searchTerm.toLowerCase()));

      return statusMatch && searchMatch;
    })
  })).filter(route => route.buses.length > 0);

  if (loading) {
    return (
      <div className="bg-white rounded p-5 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
          onClick={handleOpenAddModal}
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
                <BusCard
                  key={bus.id}
                  bus={{ ...bus, routeId: route.routeId }}
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
          <div className="text-center text-gray-500 text-lg mt-10">
            <p>Không tìm thấy xe bus nào phù hợp.</p>
          </div>
        )}
      </div>

      <AddBusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBus}
        drivers={drivers}
        routes={routes}
        buses={buses}
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