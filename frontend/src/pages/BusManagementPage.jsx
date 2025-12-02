import React, { useState, useEffect, useCallback } from 'react';
import BusCard from '../components/BusCard';
import AddBusModal from '../components/AddBusModal';
import { Plus, Filter, Bus as BusIcon, Route as RouteIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllBuschedule, deleteBusScheduleApi, updateBusScheduleApi } from '../api/busscheduleApi';
import { getDriversApi } from '../api/userApi';
import { getRoutesApi } from '../api/routeApi';
import { getAllBuses } from '../api/busApi';
import ToastService from "@/lib/toastService";
import Swal from 'sweetalert2';
import { useLanguage } from '../contexts/LanguageContext'; // ✅ Import hook

const BusManagementPage = () => {
  const { t, language } = useLanguage(); // ✅ Sử dụng hook
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

  // ✅ Chuyển hàm transform ra ngoài hoặc dùng useCallback để tái sử dụng khi đổi ngôn ngữ
  const transformDataForDisplay = useCallback((schedulesList) => {
    const routeMap = {};

    schedulesList.forEach(schedule => {
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

      // ✅ Dùng translation key cho trạng thái hiển thị
      const statusMap = {
        'scheduled': t('busManagement.status.scheduled'),
        'completed': t('busManagement.status.completed'),
        'cancelled': t('busManagement.status.cancelled')
      };

      const busObj = {
        id: schedule._id,
        scheduleId: schedule.schedule_id,
        busId: schedule.bus_id._id,
        plate: schedule.bus_id.license_plate,
        driver: schedule.driver_id ? schedule.driver_id.name : t('busManagement.status.unassigned'),
        driverId: schedule.driver_id?._id || null,
        status: statusMap[schedule.status] || t('busManagement.status.scheduled'),
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
  }, [t]); // Phụ thuộc vào t để render lại khi đổi ngôn ngữ

  // ✅ Effect để fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Load tất cả dữ liệu song song
        const [schedulesData, driversData, routesData, busesData] = await Promise.all([
          getAllBuschedule(),
          getDriversApi(),
          getRoutesApi(),
          getAllBuses()
        ]);

        setSchedules(schedulesData);

        // Transform drivers
        const transformedDrivers = driversData.map(driver => ({
          id: driver._id,
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          licenseNumber: driver.driverInfo?.licenseNumber,
        }));

        // Transform routes
        const transformedRoutes = routesData.map(route => ({
          id: route._id,
          route_id: route.route_id,
          name: route.name,
          startPoint: route.start_point?.name,
          endPoint: route.end_point?.name,
        }));

        // Transform buses
        const transformedBuses = busesData.map(bus => ({
          id: bus._id,
          bus_id: bus.bus_id,
          plate: bus.license_plate,
          capacity: bus.capacity,
          status: bus.status,
        }));

        setDrivers(transformedDrivers);
        setRoutes(transformedRoutes);
        setBuses(transformedBuses);

        // Gọi transform lần đầu
        const transformedData = transformDataForDisplay(schedulesData);
        setBusData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('busManagement.messages.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chỉ chạy 1 lần khi mount

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
        routeId: schedule.route_id._id,
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

  const handleOpenEditModal = async (busToEditOrId, formData) => {
    // Nếu có 2 tham số thì đây là việc update từ EditScheduleModal trong BusCard
    if (formData) {
      const loadingToast = ToastService.loading("Đang cập nhật lịch trình...");
      try {
        await updateBusScheduleApi(busToEditOrId, formData);

        // Reload data
        const schedulesData = await getAllBuschedule();
        setSchedules(schedulesData);
        const transformedData = transformDataForDisplay(schedulesData);
        setBusData(transformedData);

        ToastService.update(loadingToast, "Cập nhật lịch trình thành công!", "success");
      } catch (error) {
        console.error("Error updating schedule:", error);
        ToastService.update(
          loadingToast,
          error.response?.data?.message || "Không thể cập nhật lịch trình!",
          "error"
        );
        throw error;
      }
    } else {
      // Nếu chỉ có 1 tham số thì đây là việc mở modal từ main page
      setEditingBus(busToEditOrId);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBus(null);
  };

  // ✅ Xử lý xóa lịch trình với SweetAlert2
  const handleOpenDeleteModal = (busId) => {
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
      toast.error(t('busManagement.messages.notFound'));
      return;
    }

    const statusColor = {
      [t('busManagement.status.scheduled')]: '#ffc107',
      [t('busManagement.status.completed')]: '#28a745',
      [t('busManagement.status.cancelled')]: '#dc3545'
    };

    const statusBg = {
      [t('busManagement.status.scheduled')]: '#fff3cd',
      [t('busManagement.status.completed')]: '#d4edda',
      [t('busManagement.status.cancelled')]: '#f8d7da'
    };

    Swal.fire({
      title: t('busManagement.swal.confirmTitle'),
      html: `
        <div style="text-align: left;">
          <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc3545;">
            <p style="margin: 0; font-size: 16px;">
              <strong>🚌 ${t('busManagement.swal.plate')}:</strong> ${scheduleInfo.plate}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🆔 ${t('busManagement.swal.scheduleCode')}:</strong> ${scheduleInfo.scheduleId}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🛣️ ${t('busManagement.swal.route')}:</strong> ${routeName}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>👨‍✈️ ${t('busManagement.swal.driver')}:</strong> ${scheduleInfo.driver}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>🕐 ${t('busManagement.swal.time')}:</strong> ${scheduleInfo.startTime} - ${scheduleInfo.endTime}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>👥 ${t('busManagement.swal.capacity')}:</strong> ${scheduleInfo.capacity} ${t('busManagement.swal.seat')}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">
              <strong>📊 ${t('busManagement.swal.status')}:</strong> <span style="background: ${statusBg[scheduleInfo.status] || '#eee'}; padding: 2px 8px; border-radius: 4px; color: ${statusColor[scheduleInfo.status] || '#333'}; font-weight: 600;">${scheduleInfo.status}</span>
            </p>
          </div>
          <p style="color: #d33; font-weight: bold; margin-top: 16px;">${t('busManagement.swal.warningAction')}</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t('busManagement.swal.btnDelete'),
      cancelButtonText: t('busManagement.swal.btnCancel'),
      width: 600
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loadingToast = ToastService.loading(t('busManagement.swal.deleteLoading'));

        try {
          await deleteBusScheduleApi(busId);

          setBusData(prevData =>
            prevData.map(route => ({
              ...route,
              buses: route.buses.filter(bus => bus.id !== busId)
            })).filter(route => route.buses.length > 0)
          );

          ToastService.update(loadingToast, `${t('busManagement.swal.deleteSuccess')} ${scheduleInfo.scheduleId}!`, "success");

        } catch (error) {
          console.error('Error deleting schedule:', error);
          const errorMessage = error.response?.data?.message || "";

          if (error.response?.status === 400 && errorMessage.includes("học sinh")) {
            ToastService.update(loadingToast, "", "error");

            Swal.fire({
              title: t('busManagement.swal.errorTitle'),
              html: `
                <div style="text-align: left;">
                  <div style="background: #ffe5e5; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #dc3545;">
                    <p style="margin: 0; font-size: 15px;">
                      <strong>🚌 ${scheduleInfo.plate}</strong> (${scheduleInfo.scheduleId})
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #666;">
                      ${t('busManagement.swal.route')}: ${routeName}
                    </p>
                  </div>
                  <p><strong>${t('busManagement.swal.errorHasStudents')}</strong></p>
                  <p style="margin-top: 12px; color: #666;">
                    ${t('busManagement.swal.errorHasStudentsDesc')}
                  </p>
                  <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #ffc107;">
                    <p style="margin: 0; font-size: 14px;">
                      💡 <strong>${t('busManagement.swal.guideTitle')}:</strong><br/>
                      ${t('busManagement.swal.guideStep1')}<br/>
                      ${t('busManagement.swal.guideStep2')}<br/>
                      ${t('busManagement.swal.guideStep3')}
                    </p>
                  </div>
                </div>
              `,
              icon: "error",
              confirmButtonText: t('busManagement.swal.btnUnderstood'),
              confirmButtonColor: "#3085d6",
              width: 600
            });
          } else {
            const errorMsg = errorMessage || t('busManagement.messages.deleteGenericError');
            ToastService.update(loadingToast, errorMsg, "error");
          }
        }
      }
    });
  };

  const handleSaveBus = async (data) => {
    const loadingToast = ToastService.loading(t('busManagement.messages.processing'));

    try {
      if (data.schedule_id || data._id) {
        ToastService.update(loadingToast, t('busManagement.messages.createSuccess'), "success");

        const schedulesData = await getAllBuschedule();
        setSchedules(schedulesData);
        // transformDataForDisplay sẽ tự chạy lại nhờ useEffect khi schedules thay đổi
        
        setIsModalOpen(false);
        return;
      }

      ToastService.update(loadingToast, t('busManagement.messages.actionSuccess'), "success");
      setIsModalOpen(false);

    } catch (error) {
      console.error("❌ Error saving bus:", error);
      ToastService.update(
        loadingToast,
        error.message || t('busManagement.messages.saveError'),
        "error"
      );
    }
  };

  const filteredRoutes = busData.map(route => ({
    ...route,
    buses: route.buses.filter(bus => {
      // Logic filter sử dụng rawStatus để không bị ảnh hưởng bởi ngôn ngữ hiển thị
      const statusMatch = filterStatus === 'all' ||
        (filterStatus === 'scheduled' && bus.rawStatus === 'scheduled') ||
        (filterStatus === 'completed' && bus.rawStatus === 'completed') ||
        (filterStatus === 'cancelled' && bus.rawStatus === 'cancelled');

      const searchMatch = bus.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bus.driver && bus.driver.toLowerCase().includes(searchTerm.toLowerCase()));

      return statusMatch && searchMatch;
    })
  })).filter(route => route.buses.length > 0);

  const totalBuses = busData.reduce((sum, route) => sum + route.buses.length, 0);
  const scheduledBuses = busData.reduce((sum, route) =>
    sum + route.buses.filter(b => b.rawStatus === 'scheduled').length, 0);
  const completedBuses = busData.reduce((sum, route) =>
    sum + route.buses.filter(b => b.rawStatus === 'completed').length, 0);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded p-5 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('busManagement.loading')}</p>
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
          {/* SVG giữ nguyên */}
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
                <h1 className="text-3xl font-bold text-white mb-1">{t('busManagement.title')}</h1>
                <p className="text-blue-100">{t('busManagement.subtitle')}</p>
              </div>
            </div>

            <div className="hidden md:flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                <div className="text-white/70 text-xs mb-1">{t('busManagement.stats.total')}</div>
                <div className="text-2xl font-bold text-white">{totalBuses}</div>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-green-300/30">
                <div className="text-green-100 text-xs mb-1">{t('busManagement.stats.waiting')}</div>
                <div className="text-2xl font-bold text-white">{scheduledBuses}</div>
              </div>
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-blue-300/30">
                <div className="text-blue-100 text-xs mb-1">{t('busManagement.stats.completed')}</div>
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
                <option value="all">{t('busManagement.filter.all')}</option>
                <option value="scheduled">{t('busManagement.filter.scheduled')}</option>
                <option value="completed">{t('busManagement.filter.completed')}</option>
                <option value="cancelled">{t('busManagement.filter.cancelled')}</option>
              </select>
            </div>

            <input
              type="text"
              placeholder={t('busManagement.filter.searchPlaceholder')}
              className="flex-1 min-w-[250px] border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus size={20} /> {t('busManagement.filter.addBtn')}
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
                <p className="text-sm text-gray-500">{route.buses.length} {t('busManagement.card.activeBuses')}</p>
              </div>
            </div>

            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {route.buses.map((bus) => (
                <BusCard
                  key={bus.id}
                  bus={{ ...bus, routeId: route.routeId }}
                  allBusData={busData}
                  drivers={drivers}
                  routes={routes}
                  buses={buses}
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('busManagement.empty.title')}</h3>
            <p className="text-gray-500">{t('busManagement.empty.subtitle')}</p>
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
    </div>
  );
};

export default BusManagementPage;