// Example component showing how to use translation system
// Ví dụ về cách sử dụng hệ thống dịch

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ExampleTranslation() {
    const { t, translateData } = useLanguage();

    // Giả sử data này từ backend (tiếng Việt)
    const busFromBackend = {
        id: "BUS001",
        plate: "51B-12345",
        status: "hoạt động",  // ← Data từ backend (tiếng Việt)
        capacity: 45
    };

    const routeFromBackend = {
        id: "ROUTE001",
        name: "Tuyến 19 - Bến xe Miền Tây ⇄ ĐHQG",  // ← Data từ backend (tiếng Việt)
        status: "Đang hoạt động"
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                {/* ✅ Cách 1: Dịch UI LABELS - dùng t() */}
                {t('common.example')} - Translation Example
            </h1>

            {/* Card 1: Dịch UI Labels */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">
                    {/* ✅ UI Label - dùng t() */}
                    {t('busManager.card.code')}: {busFromBackend.id}
                </h2>

                <div className="space-y-2">
                    {/* ✅ UI Label */}
                    <p><strong>{t('busManager.card.plateHeader')}:</strong> {busFromBackend.plate}</p>

                    {/* ✅ UI Label + translateData() cho status từ backend */}
                    <p>
                        <strong>{t('busManager.card.status')}:</strong> {' '}
                        {translateData(busFromBackend.status)}
                        {/* Kết quả:
              - Khi VI: "Trạng thái: hoạt động"
              - Khi EN: "Status: Active"
            */}
                    </p>

                    {/* ✅ UI Label */}
                    <p><strong>{t('busManager.card.capacity')}:</strong> {busFromBackend.capacity}</p>
                </div>
            </div>

            {/* Card 2: Dịch Data động từ Backend */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">
                    {/* ✅ UI Label */}
                    {t('routePage.table.name')}
                </h2>

                <div className="space-y-2">
                    {/* ✅ Dịch tên tuyến từ backend */}
                    <p className="text-lg">
                        {translateData(routeFromBackend.name)}
                        {/* Kết quả:
              - Khi VI: "Tuyến 19 - Bến xe Miền Tây ⇄ ĐHQG"
              - Khi EN: "Route 19 - Western Bus Station ⇄ VNU"
            */}
                    </p>

                    {/* ✅ UI Label + translateData() */}
                    <p>
                        <strong>{t('common.status')}:</strong> {' '}
                        {translateData(routeFromBackend.status)}
                    </p>
                </div>
            </div>

            {/* Card 3: List với map */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">
                    {t('routePage.table.stops')}
                </h2>

                <ul className="space-y-2">
                    {['Đang hoạt động', 'Không hoạt động', 'Đang bảo trì'].map((status, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            {/* ✅ Dịch mỗi item trong list */}
                            <span className="w-32">{status}</span>
                            <span>→</span>
                            <span className="font-bold">{translateData(status)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">📝 Tóm tắt:</h3>
                <ul className="text-sm space-y-1">
                    <li>✅ <strong>t('key')</strong> - Dịch UI labels (button, title, placeholder...)</li>
                    <li>✅ <strong>translateData(text)</strong> - Dịch data từ backend (status, tên tuyến...)</li>
                    <li>💡 Backend giữ nguyên tiếng Việt, Frontend tự động dịch khi cần</li>
                </ul>
            </div>
        </div>
    );
}
