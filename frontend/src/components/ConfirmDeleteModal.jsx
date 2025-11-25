//src/components/ConfirmDeleteModal.jsx
import React from 'react';
import { X, AlertTriangle, Calendar, Bus, User, Route, Clock } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, scheduleInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <AlertTriangle className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Xác nhận xóa lịch trình</h2>
              <p className="text-red-100 text-sm">Hành động này không thể hoàn tác</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">Cảnh báo quan trọng!</p>
                <p className="text-xs text-red-700">
                  Bạn đang thực hiện xóa lịch trình xe bus. Sau khi xóa, mọi thông tin liên quan sẽ bị xóa vĩnh viễn và không thể khôi phục.
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          {scheduleInfo && (
            <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                Thông tin lịch trình
              </h3>

              <div className="space-y-3">
                {/* Schedule ID */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                  <div className="bg-blue-100 rounded-lg p-2 mt-0.5">
                    <Calendar className="text-blue-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Mã lịch trình</p>
                    <p className="text-sm font-semibold text-gray-900">{scheduleInfo.scheduleId}</p>
                  </div>
                </div>

                {/* Bus Plate */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                  <div className="bg-purple-100 rounded-lg p-2 mt-0.5">
                    <Bus className="text-purple-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Biển số xe</p>
                    <p className="text-sm font-semibold text-gray-900">{scheduleInfo.plate}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                  <div className="bg-green-100 rounded-lg p-2 mt-0.5">
                    <Route className="text-green-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Tuyến đường</p>
                    <p className="text-sm font-semibold text-gray-900">{scheduleInfo.routeName}</p>
                  </div>
                </div>

                {/* Driver */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                  <div className="bg-orange-100 rounded-lg p-2 mt-0.5">
                    <User className="text-orange-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Tài xế</p>
                    <p className="text-sm font-semibold text-gray-900">{scheduleInfo.driver}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                  <div className="bg-cyan-100 rounded-lg p-2 mt-0.5">
                    <Clock className="text-cyan-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Thời gian</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {scheduleInfo.startTime} - {scheduleInfo.endTime}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-200">
                  <div className={`rounded-lg p-2 mt-0.5 ${scheduleInfo.status === 'Đang chờ' ? 'bg-yellow-100' :
                    scheduleInfo.status === 'Hoàn thành' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    <div className={`w-3 h-3 rounded-full ${scheduleInfo.status === 'Đang chờ' ? 'bg-yellow-500' :
                      scheduleInfo.status === 'Hoàn thành' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Trạng thái</p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${scheduleInfo.status === 'Đang chờ' ? 'bg-yellow-100 text-yellow-800' :
                      scheduleInfo.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {scheduleInfo.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Question */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900 font-medium text-center">
              Bạn có chắc chắn muốn xóa lịch trình này không?
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <AlertTriangle size={20} />
            Xóa lịch trình
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDeleteModal;