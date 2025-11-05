import React, { useState, useEffect } from 'react';
import BusCard from '../components/BusCard';
import AddBusModal from '../components/AddBusModal';
import { Plus, Filter, Bus as BusIcon, Route as RouteIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllBuschedule, deleteBusScheduleApi } from '../api/busscheduleApi';
import ToastService from "@/lib/toastService";
import Swal from 'sweetalert2';

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
  const [loading, setLoading] = useState(true);

  const [schedules, setSchedules] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const schedulesData = await getAllBuschedule();
        setSchedules(schedulesData);

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

  const transformDataForDisplay = (schedules) => {
    const routeMap = {};

    schedules.forEach(schedule => {
      if (!schedule.bus_id || !schedule.route_id) return;

      const routeId = schedule.route_id._id;
      const routeName = schedule.route_id.name;

      if (!routeMap[routeId]) {
        routeMap[routeId] = {
          routeId: routeId,
          routeName: routeName,
          buses: []
        };
      }

      const statusMap = {
        'scheduled': 'Đang chờ',
        'completed': 'Hoàn thành',
        'cancelled': 'Hủy'
      };

      const busObj = {
        id: schedule._id,
        scheduleId: schedule.schedule_id,
        busId: schedule.bus_id._id,
        plate: schedule.bus_id.license_plate,
        driver: schedule.driver_id ? schedule.driver_id.name : 'Chưa phân công',
        driverId: schedule.driver_id?._id || null,
        status: statusMap[schedule.status] || 'Đang chờ',
        rawStatus: schedule.status,
        passengers: 0,
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

  // ✅ Xử lý xóa lịch trình với SweetAlert2
  const handleOpenDeleteModal = (busId) => {
    // Tìm thông tin đầy đủ của schedule
    let scheduleInfo = null;
    let routeName = '';

    for (const route of busData) {
      const bus = route.buses.find(b => b.id === busId);
      if (bus) {
        scheduleInfo = bus;
        routeName = route.routeName;
        break;
      }
    }

    if (!scheduleInfo) {
      toast.error('Không tìm thấy thông tin lịch trình!');
      return;
    }

    // Hiển thị status màu sắc
    const statusColor = {
      'Đang chờ': '#ffc107',
      'Hoàn thành': '#28a745',
      'Hủy': '#dc3545'
    };

    const statusBg = {
      'Đang chờ': '#fff3cd',
      'Hoàn thành': '#d4edda',
      'Hủy': '#f8d7da'
    };

    Swal.fire({
      title: "Xác nhận xóa lịch trình",
      html: `
        <div style="text-align: left;">
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc3545;">
            <p style="margin: 0; font-size: 16px;">
              <strong>🚌 Biển số xe:</strong> ${scheduleInfo.plate}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🆔 Mã lịch trình:</strong> ${scheduleInfo.scheduleId}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🛣️ Tuyến đường:</strong> ${routeName}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>👨‍✈️ Tài xế:</strong> ${scheduleInfo.driver}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🕐 Thời gian:</strong> ${scheduleInfo.startTime} - ${scheduleInfo.endTime}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>👥 Sức chứa:</strong> ${scheduleInfo.capacity} chỗ
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>📊 Trạng thái:</strong> <span style="background: ${statusBg[scheduleInfo.status]}; padding: 2px 8px; border-radius: 4px; color: ${statusColor[scheduleInfo.status]}; font-weight: 600;">${scheduleInfo.status}</span>
            </p>
          </div>
          <p style="color: #d33; font-weight: bold; margin-top: 16px;">⚠️ Hành động này sẽ không thể hoàn tác!</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa lịch trình",
      cancelButtonText: "Hủy",
      width: 600
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loadingToast = ToastService.loading("Đang xóa lịch trình...");

        try {
          // Gọi API xóa schedule
          await deleteBusScheduleApi(busId);

          // Cập nhật UI
          setBusData(prevData =>
            prevData.map(route => ({
              ...route,
              buses: route.buses.filter(bus => bus.id !== busId)
            })).filter(route => route.buses.length > 0)
          );

          ToastService.update(loadingToast, `Đã xóa lịch trình ${scheduleInfo.scheduleId}!`, "success");

        } catch (error) {
          console.error('Error deleting schedule:', error);

          const errorMessage = error.response?.data?.message || "";

          // Xử lý lỗi nếu có học sinh trong lịch trình
          if (error.response?.status === 400 && errorMessage.includes("học sinh")) {
            ToastService.update(loadingToast, "", "error");

            Swal.fire({
              title: "Không thể xóa lịch trình!",
              html: `
                <div style="text-align: left;">
                  <div style="background: #ffe5e5; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #dc3545;">
                    <p style="margin: 0; font-size: 15px;">
                      <strong>🚌 ${scheduleInfo.plate}</strong> (${scheduleInfo.scheduleId})
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">
                      Tuyến: ${routeName}
                    </p>
                  </div>
                  <p><strong>⚠️ Lịch trình này đang có học sinh đăng ký!</strong></p>
                  <p style="margin-top: 12px; color: #666;">
                    Bạn cần hủy đăng ký của các học sinh trước khi xóa lịch trình.
                  </p>
                  <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #ffc107;">
                    <p style="margin: 0; font-size: 14px;">
                      💡 <strong>Hướng dẫn:</strong><br/>
                      1. Vào trang <strong>Danh sách học sinh</strong> của xe này<br/>
                      2. Xóa hoặc chuyển học sinh sang xe khác<br/>
                      3. Quay lại xóa lịch trình
                    </p>
                  </div>
                </div>
              `,
              icon: "error",
              confirmButtonText: "Đã hiểu",
              confirmButtonColor: "#3085d6",
              width: 600
            });
          } else {
            const errorMsg = errorMessage || "Không thể xóa lịch trình. Vui lòng thử lại!";
            ToastService.update(loadingToast, errorMsg, "error");
          }
        }
      }
    });
  };

  const handleSaveBus = async (data) => {
    const loadingToast = ToastService.loading("Đang xử lý...");

    try {
      console.log("📥 Received data from modal:", data);

      if (data.schedule_id || data._id) {
        console.log("✅ Schedule created successfully:", data);
        ToastService.update(loadingToast, "Tạo lịch trình thành công!", "success");

        const schedulesData = await getAllBuschedule();
        setSchedules(schedulesData);
        const transformedData = transformDataForDisplay(schedulesData);
        setBusData(transformedData);

        setIsModalOpen(false);
        return;
      }

      ToastService.update(loadingToast, "Thao tác thành công!", "success");
      setIsModalOpen(false);

    } catch (error) {
      console.error("❌ Error saving bus:", error);
      console.error("❌ Error details:", error.message);

      ToastService.update(
        loadingToast,
        error.message || "Không thể lưu thông tin. Vui lòng thử lại!",
        "error"
      );
    }
  };

  const filteredRoutes = busData.map(route => ({
    ...route,
    buses: route.buses.filter(bus => {
      const statusMatch = filterStatus === 'all' ||
        (filterStatus === 'scheduled' && bus.status === 'Đang chờ') ||
        (filterStatus === 'completed' && bus.status === 'Hoàn thành') ||
        (filterStatus === 'cancelled' && bus.status === 'Hủy');

      const searchMatch = bus.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bus.driver && bus.driver.toLowerCase().includes(searchTerm.toLowerCase()));

      return statusMatch && searchMatch;
    })
  })).filter(route => route.buses.length > 0);

  const totalBuses = busData.reduce((sum, route) => sum + route.buses.length, 0);
  const scheduledBuses = busData.reduce((sum, route) =>
    sum + route.buses.filter(b => b.status === 'Đang chờ').length, 0);
  const completedBuses = busData.reduce((sum, route) =>
    sum + route.buses.filter(b => b.status === 'Hoàn thành').length, 0);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded p-5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu xe bus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen p-6">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
          <svg width="200" height="120" viewBox="0 0 200 120" fill="none">
            <rect x="40" y="20" width="120" height="70" rx="8" fill="white" opacity="0.9" />
            <rect x="50" y="30" width="30" height="25" rx="3" fill="#1e40af" />
            <rect x="85" y="30" width="30" height="25" rx="3" fill="#1e40af" />
            <rect x="120" y="30" width="30" height="25" rx="3" fill="#1e40af" />
            <circle cx="60" cy="100" r="12" fill="white" />
            <circle cx="60" cy="100" r="8" fill="#374151" />
            <circle cx="140" cy="100" r="12" fill="white" />
            <circle cx="140" cy="100" r="8" fill="#374151" />
            <path d="M40 60 L160 60 L160 90 L40 90 Z" fill="white" opacity="0.3" />
          </svg>
        </div>

        <div className="relative px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <BusIcon className="text-white" size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Quản lý xe bus</h1>
                <p className="text-blue-100">Theo dõi và điều phối xe bus trường học</p>
              </div>
            </div>

            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">Tổng số xe</div>
                <div className="text-2xl font-bold text-white">{totalBuses}</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                <div className="text-green-100 text-xs mb-1">Đang chờ</div>
                <div className="text-2xl font-bold text-white">{scheduledBuses}</div>
              </div>
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-blue-300/30">
                <div className="text-blue-100 text-xs mb-1">Hoàn thành</div>
                <div className="text-2xl font-bold text-white">{completedBuses}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter và Search */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap flex-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 hover:border-blue-300 transition-colors">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm outline-none font-medium text-gray-700 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="scheduled">Đang chờ</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Hủy</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="🔍 Tìm theo biển số hoặc tên tài xế..."
              className="flex-1 min-w-[250px] border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus size={20} /> Thêm xe mới
          </button>
        </div>
      </div>

      {/* Bus Routes */}
      <div className="space-y-8">
        {filteredRoutes.map((route) => (
          <section key={route.routeId} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-blue-100">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2.5">
                <RouteIcon className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{route.routeName}</h3>
                <p className="text-sm text-gray-500">{route.buses.length} xe đang hoạt động</p>
              </div>
            </div>

            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <BusIcon className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy xe bus</h3>
            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
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

      {/* ✅ Cập nhật ConfirmDeleteModal với scheduleInfo */}
     
    </div>
  );
};

export default BusManagementPage;