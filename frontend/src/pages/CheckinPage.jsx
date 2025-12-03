import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ChevronLeft, LogIn, LogOut, UserCheck, UserX, Sun, Moon } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ToastService from "../lib/toastService";
import { useLanguage } from "../contexts/LanguageContext";
const CheckinPage = () => {
  const { t } = useLanguage();
  const { busId } = useParams();
  const location = useLocation();
  const { busData, studentData } = location.state || { busData: [], studentData: [] };

  const [busInfo, setBusInfo] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [session, setSession] = useState('morning'); // 'morning' or 'afternoon'

  useEffect(() => {
    let foundBus = null;
    for (const route of busData) {
      const bus = route.buses.find(b => b.id.toString() === busId);
      if (bus) {
        foundBus = { ...bus, routeName: route.routeName };
        break;
      }
    }

    if (foundBus) {
      setBusInfo(foundBus);
      const studentsOnBus = studentData.filter(s => foundBus.studentIds.includes(s.student_id));
      setStudentList(studentsOnBus);

      // Khởi tạo trạng thái điểm danh ban đầu
      const initialAttendance = {};
      studentsOnBus.forEach(student => {
        initialAttendance[student.student_id] = {
          morning: { status: 'pending', time: null }, // pending, present, absent
          afternoon: { status: 'pending', time: null },
        };
      });
      setAttendance(initialAttendance);
    }
  }, [busId, busData, studentData]);

  const handleCheckin = (studentId) => {
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [session]: { status: 'present', time: now },
      }
    }));
    const studentName = studentList.find(s => s.student_id === studentId)?.name;
    ToastService.success(`${studentName} ${t('checkin.checkinAt')} ${now}`);
  };

  const handleCheckout = (studentId) => {
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [session]: { status: 'absent', time: now },
      }
    }));
    const studentName = studentList.find(s => s.student_id === studentId)?.name;
    ToastService.warning(`${studentName} ${t('checkin.checkoutAt')} ${now}`);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'present':
        return { icon: <UserCheck size={16} />, text: t('checkin.status.present'), color: 'text-green-600' };
      case 'absent':
        return { icon: <UserX size={16} />, text: t('checkin.status.absent'), color: 'text-red-600' };
      default:
        return { icon: null, text: t('checkin.status.pending'), color: 'text-gray-500' };
    }
  };


  if (!busInfo) {
    return (
      <div className="p-6 text-center">
        <p>{t('checkin.loading')}</p>
        <Link to="/buses" className="text-blue-600 hover:underline mt-4 inline-block">{t('common.back')}</Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 min-h-full rounded-lg">
      <Toaster position="bottom-right" />
      <div className="mb-4">
        <Link to="/buses" className="flex items-center text-sm text-gray-500 hover:text-gray-800">
          <ChevronLeft size={18} className="mr-1" />
          {t('checkin.backToBusManagement')}
        </Link>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{busInfo.routeName} - Xe {busInfo.plate}</h2>
          <p className="text-sm text-gray-500">{t('checkin.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
          <button onClick={() => setSession('morning')} className={`px-4 py-1.5 text-sm font-medium rounded-md ${session === 'morning' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}>
            <Sun size={16} className="inline mr-2" />{t('checkin.sessionMorning')}
          </button>
          <button onClick={() => setSession('afternoon')} className={`px-4 py-1.5 text-sm font-medium rounded-md ${session === 'afternoon' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}>
            <Moon size={16} className="inline mr-2" />{t('checkin.sessionAfternoon')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-600">{t('checkin.table.name')}</th>
              <th className="p-3 text-left font-semibold text-gray-600">{t('checkin.table.status')} ({session === 'morning' ? t('checkin.sessionMorning') : t('checkin.sessionAfternoon')})</th>
              <th className="p-3 text-center font-semibold text-gray-600">{t('checkin.table.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {studentList.map(student => {
              const currentStatus = attendance[student.student_id]?.[session]?.status || 'pending';
              const checkinTime = attendance[student.student_id]?.[session]?.time;
              const { icon, text, color } = getStatusInfo(currentStatus);

              return (
                <tr key={student.student_id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">{t('checkin.table.studentCode')} {student.student_id} - {student.grade}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className={`flex items-center gap-2 font-medium ${color}`}>
                      {icon}
                      <div>
                        <p>{text}</p>
                        {checkinTime && <p className="text-xs font-normal text-gray-400">{checkinTime}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleCheckin(student.student_id)}
                        disabled={currentStatus === 'present'}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <LogIn size={14} /> {t('checkin.checkIn')}
                      </button>
                      <button
                        onClick={() => handleCheckout(student.student_id)}
                        disabled={currentStatus === 'absent'}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <LogOut size={14} /> {t('checkin.checkOut')}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckinPage;

