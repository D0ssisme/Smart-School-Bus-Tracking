//src/pages/DriverDashboard.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { getBusScheduleByDriverIdApi } from '@/api/busscheduleApi';
import { getCountStudentByScheduleId } from '@/api/studentbusassignmentApi';
import ScheduleDetailModal from '@/components/ScheduleDetailModal';
import { useLanguage } from '@/contexts/LanguageContext'; // ✅ Import hook

import {
    Bus,
    MapPin,
    Clock,
    Calendar,
    Users,
    Route as RouteIcon,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Navigation
} from 'lucide-react';

export default function DriverDashboard() {
    const { t, language } = useLanguage(); // ✅ Sử dụng hook
    const { user } = useContext(AuthContext);

    const [driverInfo, setDriverInfo] = useState({
        name: "",
        driverId: "",
        licenseNumber: ""
    });

    const [todaySchedules, setTodaySchedules] = useState([]);
    const [stats, setStats] = useState({
        totalTripsToday: 0,
        completedTrips: 0,
        upcomingTrips: 0,
        totalStudents: 0
    });

    const [loading, setLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchDriverData();
        }
    }, [user]);

    const fetchDriverData = async () => {
        try {
            setLoading(true);

            setDriverInfo({
                name: user.name || "Tài xế",
                driverId: user.userId || "N/A",
                licenseNumber: user.driverInfo?.licenseNumber || "N/A"
            });

            const driverId = user._id || user.userId;
            const today = new Date().toISOString().split('T')[0];

            const schedulesResponse = await getBusScheduleByDriverIdApi(driverId, today);
            const schedules = schedulesResponse?.data || [];

            if (!Array.isArray(schedules)) {
                console.error("❌ API did not return an array:", schedules);
                setTodaySchedules([]);
                return;
            }

            const transformedSchedules = await Promise.all(
                schedules.map(async (schedule) => {
                    let studentsCount = 0;
                    try {
                        const countResponse = await getCountStudentByScheduleId(schedule._id);
                        studentsCount = countResponse?.studentCount || 0;
                    } catch (error) {
                        console.error(`❌ Error getting student count for schedule ${schedule._id}:`, error);
                    }

                    return {
                        id: schedule._id,
                        scheduleId: schedule.schedule_id || schedule._id,
                        route: schedule.route_id?.name || t('driverDashboard.status.cancelled'), // Fallback text
                        busPlate: schedule.bus_id?.license_plate || "N/A",
                        busId: schedule.bus_id?._id,
                        routeId: schedule.route_id?._id,
                        startTime: schedule.start_time || "N/A",
                        endTime: schedule.end_time || "N/A",
                        status: schedule.status || "scheduled",
                        studentsCount: studentsCount,
                        stops: schedule.route_id?.stops?.map(stop => stop.name) || []
                    };
                })
            );

            setTodaySchedules(transformedSchedules);

            setStats({
                totalTripsToday: transformedSchedules.length,
                completedTrips: transformedSchedules.filter(s => s.status === "completed").length,
                upcomingTrips: transformedSchedules.filter(s => s.status === "scheduled").length,
                totalStudents: transformedSchedules.reduce((sum, s) => sum + s.studentsCount, 0)
            });

        } catch (error) {
            console.error("❌ Error fetching driver data:", error);
            setTodaySchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getGreetingTime = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('driverDashboard.greeting.morning');
        if (hour < 18) return t('driverDashboard.greeting.afternoon');
        return t('driverDashboard.greeting.evening');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            scheduled: {
                label: t('driverDashboard.status.scheduled'),
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                icon: Clock
            },
            in_progress: {
                label: t('driverDashboard.status.in_progress'),
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                icon: Navigation
            },
            completed: {
                label: t('driverDashboard.status.completed'),
                bg: 'bg-green-100',
                text: 'text-green-800',
                icon: CheckCircle
            },
            cancelled: {
                label: t('driverDashboard.status.cancelled'),
                bg: 'bg-red-100',
                text: 'text-red-800',
                icon: AlertCircle
            }
        };

        const config = statusConfig[status] || statusConfig.scheduled;
        const Icon = config.icon;

        return (
            <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
                <Icon size={14} />
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">{t('driverDashboard.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen p-6">
            {/* Welcome Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* Bus illustration */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-20 hidden lg:block">
                    <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
                        <rect x="30" y="20" width="120" height="60" rx="8" fill="white" opacity="0.9" />
                        <rect x="40" y="30" width="25" height="20" rx="3" fill="#1e40af" />
                        <rect x="70" y="30" width="25" height="20" rx="3" fill="#1e40af" />
                        <rect x="100" y="30" width="25" height="20" rx="3" fill="#1e40af" />
                        <circle cx="50" cy="85" r="10" fill="white" />
                        <circle cx="50" cy="85" r="6" fill="#374151" />
                        <circle cx="130" cy="85" r="10" fill="white" />
                        <circle cx="130" cy="85" r="6" fill="#374151" />
                    </svg>
                </div>

                <div className="relative px-8 py-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                                <Bus className="text-white" size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    {t('driverDashboard.greeting.hello')
                                        .replace('{time}', getGreetingTime())
                                        .replace('{name}', driverInfo.name)}
                                </h1>
                                <p className="text-blue-100">
                                    {t('driverDashboard.greeting.subtext')}
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:flex gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">{t('driverDashboard.time.current')}</div>
                                <div className="text-2xl font-bold text-white">{getCurrentTime()}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                                <div className="text-white/70 text-xs mb-1">{t('driverDashboard.time.today')}</div>
                                <div className="text-lg font-bold text-white">
                                    {new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                                        day: '2-digit',
                                        month: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Driver Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Bus className="text-blue-600" size={24} />
                    {t('driverDashboard.info.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="bg-blue-100 rounded-full p-2">
                            <Users className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">{t('driverDashboard.info.name')}</p>
                            <p className="font-semibold text-gray-900">{driverInfo.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="bg-green-100 rounded-full p-2">
                            <Bus className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">{t('driverDashboard.info.id')}</p>
                            <p className="font-semibold text-gray-900">{driverInfo.driverId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="bg-purple-100 rounded-full p-2">
                            <CheckCircle className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">{t('driverDashboard.info.license')}</p>
                            <p className="font-semibold text-gray-900">{driverInfo.licenseNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <Calendar className="text-blue-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('driverDashboard.stats.todayTrips')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTripsToday}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('driverDashboard.stats.totalTrips')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('driverDashboard.stats.completed')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.completedTrips}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('driverDashboard.stats.tripsDone')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 rounded-full p-3">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('driverDashboard.stats.upcoming')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.upcomingTrips}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('driverDashboard.stats.tripsPending')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 rounded-full p-3">
                            <Users className="text-purple-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{t('driverDashboard.stats.students')}</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                    <p className="text-xs text-gray-500 mt-2">{t('driverDashboard.stats.totalStudents')}</p>
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="text-blue-600" size={24} />
                        {t('driverDashboard.schedule.title')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {todaySchedules.length === 0 ? (
                    <div className="text-center py-12 px-6">
                        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-gray-400" size={48} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {t('driverDashboard.schedule.emptyTitle')}
                        </h3>
                        <p className="text-gray-500">
                            {t('driverDashboard.schedule.emptyDesc')}
                        </p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="space-y-4">
                            {todaySchedules.map((schedule, index) => (
                                <div
                                    key={schedule.id}
                                    className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-r-xl p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 rounded-full p-2">
                                                <Bus className="text-blue-600" size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{schedule.route}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {t('driverDashboard.schedule.tripPrefix')} #{index + 1} - {schedule.scheduleId}
                                                </p>
                                            </div>
                                        </div>
                                        {getStatusBadge(schedule.status)}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Bus className="text-gray-500" size={16} />
                                            <span className="text-gray-600">{t('driverDashboard.schedule.bus')}:</span>
                                            <span className="font-semibold text-gray-900">{schedule.busPlate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="text-gray-500" size={16} />
                                            <span className="text-gray-600">{t('driverDashboard.schedule.students')}:</span>
                                            <span className="font-semibold text-gray-900">
                                                {schedule.studentsCount} {t('driverDashboard.schedule.studentUnit')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="text-gray-500" size={16} />
                                            <span className="text-gray-600">{t('driverDashboard.schedule.departure')}:</span>
                                            <span className="font-semibold text-gray-900">{schedule.startTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="text-gray-500" size={16} />
                                            <span className="text-gray-600">{t('driverDashboard.schedule.arrival')}:</span>
                                            <span className="font-semibold text-gray-900">{schedule.endTime}</span>
                                        </div>
                                    </div>

                                    {schedule.stops.length > 0 && (
                                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                                            <div className="flex items-start gap-2">
                                                <RouteIcon className="text-indigo-600 mt-0.5" size={18} />
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-indigo-900 mb-1">{t('driverDashboard.schedule.stops')}:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {schedule.stops.map((stop, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center gap-1 bg-white text-indigo-700 px-2 py-1 rounded text-xs font-medium"
                                                            >
                                                                <MapPin size={12} />
                                                                {stop}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {schedule.status === 'scheduled' && (
                                        <div className="mt-4 flex gap-2">
                                            <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all">
                                                {t('driverDashboard.schedule.btnStart')}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedSchedule(schedule);
                                                    setIsDetailModalOpen(true);
                                                }}
                                                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                                            >
                                                {t('driverDashboard.schedule.btnDetail')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Tips */}
            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="text-yellow-600" size={20} />
                    💡 {t('driverDashboard.tips.title')}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-600 mt-0.5" size={16} />
                        <span>{t('driverDashboard.tips.tip1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-600 mt-0.5" size={16} />
                        <span>{t('driverDashboard.tips.tip2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-600 mt-0.5" size={16} />
                        <span>{t('driverDashboard.tips.tip3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="text-green-600 mt-0.5" size={16} />
                        <span>{t('driverDashboard.tips.tip4')}</span>
                    </li>
                </ul>
            </div>
            <ScheduleDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedSchedule(null);
                }}
                schedule={selectedSchedule}
            />

        </div>
    );
}