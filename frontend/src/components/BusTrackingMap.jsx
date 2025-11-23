import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Bus Icon (animated)
const busIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#3b82f6" opacity="0.2"/>
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="#1e40af" stroke-width="2" fill="#3b82f6"/>
      <rect x="6" y="8" width="5" height="4" rx="1" fill="white"/>
      <rect x="13" y="8" width="5" height="4" rx="1" fill="white"/>
      <circle cx="8" cy="18" r="2" stroke="#1e40af" stroke-width="2" fill="white"/>
      <circle cx="16" cy="18" r="2" stroke="#1e40af" stroke-width="2" fill="white"/>
    </svg>
  `),
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
});

// Custom Pickup Stop Icon (Green - Larger)
const pickupIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="8" fill="#10b981" opacity="0.2"/>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#10b981"/>
      <text x="12" y="11" text-anchor="middle" font-size="8" fill="white" font-weight="bold">P</text>
    </svg>
  `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Custom Dropoff Stop Icon (Red - Larger)
const dropoffIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="8" fill="#ef4444" opacity="0.2"/>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ef4444"/>
      <text x="12" y="11" text-anchor="middle" font-size="8" fill="white" font-weight="bold">D</text>
    </svg>
  `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Regular Stop Icon (Blue - Smaller)
const regularStopIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="6" fill="#3b82f6" opacity="0.2"/>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6"/>
    </svg>
  `),
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

// Component để auto-fit bounds
function MapBoundsUpdater({ busLocation, routeStops }) {
    const map = useMap();

    useEffect(() => {
        const bounds = [];

        // Add bus location
        if (busLocation) {
            bounds.push([busLocation.latitude, busLocation.longitude]);
        }

        // Add all route stops
        if (routeStops && routeStops.length > 0) {
            routeStops.forEach(stop => {
                if (stop.stop_id?.location?.coordinates) {
                    const [lng, lat] = stop.stop_id.location.coordinates;
                    bounds.push([lat, lng]);
                }
            });
        }

        // Fit bounds if we have points
        if (bounds.length > 0) {
            map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15
            });
        }
    }, [busLocation, routeStops, map]);

    return null;
}

export default function BusTrackingMap({
    busLocation,
    pickupStop,
    dropoffStop,
    busInfo,
    routeStops = [] // ⭐ Nhận route stops
}) {
    const mapRef = useRef(null);

    // Default center (HCM City)
    const defaultCenter = [10.762622, 106.660172];

    const center = busLocation
        ? [busLocation.latitude, busLocation.longitude]
        : defaultCenter;

    // ⭐ Tạo polyline cho toàn bộ tuyến đường (nối tất cả stops theo thứ tự)
    const getRoutePolyline = () => {
        if (!routeStops || routeStops.length < 2) return null;

        const points = routeStops
            .filter(stop => stop.stop_id?.location?.coordinates)
            .map(stop => {
                const [lng, lat] = stop.stop_id.location.coordinates;
                return [lat, lng];
            });

        return points.length >= 2 ? points : null;
    };

    const routePolyline = getRoutePolyline();

    // Tạo polyline từ bus đến điểm đón gần nhất
    const getBusToPickupPolyline = () => {
        if (!busLocation || !pickupStop?.location?.coordinates) return null;

        return [
            [busLocation.latitude, busLocation.longitude],
            [pickupStop.location.coordinates[1], pickupStop.location.coordinates[0]]
        ];
    };

    const busToPickupPolyline = getBusToPickupPolyline();

    // Kiểm tra stop có phải là pickup hay dropoff không
    const isPickupStop = (stopId) => {
        return stopId?.toString() === pickupStop?._id?.toString();
    };

    const isDropoffStop = (stopId) => {
        return stopId?.toString() === dropoffStop?._id?.toString();
    };

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full"
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* ⭐ Polyline cho toàn bộ tuyến đường */}
                {routePolyline && (
                    <Polyline
                        positions={routePolyline}
                        color="#6366f1"
                        weight={4}
                        opacity={0.7}
                    />
                )}

                {/* ⭐ Polyline từ bus đến điểm đón (nét đứt) */}
                {busToPickupPolyline && (
                    <Polyline
                        positions={busToPickupPolyline}
                        color="#10b981"
                        weight={3}
                        opacity={0.8}
                        dashArray="10, 10"
                    />
                )}

                {/* ⭐ Hiển thị tất cả stops theo thứ tự */}
                {routeStops.map((stop, index) => {
                    if (!stop.stop_id?.location?.coordinates) return null;

                    const stopId = stop.stop_id._id || stop.stop_id;
                    const [lng, lat] = stop.stop_id.location.coordinates;

                    // Chọn icon phù hợp
                    let icon = regularStopIcon;
                    if (isPickupStop(stopId)) {
                        icon = pickupIcon;
                    } else if (isDropoffStop(stopId)) {
                        icon = dropoffIcon;
                    }

                    return (
                        <Marker
                            key={stopId}
                            position={[lat, lng]}
                            icon={icon}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <div className="flex items-start justify-between mb-2">
                                        <p className="font-bold text-gray-800 text-sm">
                                            {isPickupStop(stopId) && '📍 Điểm đón - '}
                                            {isDropoffStop(stopId) && '📍 Điểm trả - '}
                                            {!isPickupStop(stopId) && !isDropoffStop(stopId) && '🚏 '}
                                            {stop.stop_id.name}
                                        </p>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded ml-2">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    {stop.stop_id.address && (
                                        <p className="text-xs text-gray-600 mb-2">
                                            📮 {stop.stop_id.address}
                                        </p>
                                    )}
                                    {stop.estimated_arrival_time && (
                                        <p className="text-xs text-blue-700 font-medium">
                                            ⏰ Dự kiến: {new Date(stop.estimated_arrival_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                    <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                                        Thứ tự: {stop.order || index + 1}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Bus Marker (hiển thị trên cùng) */}
                {busLocation && (
                    <Marker
                        position={[busLocation.latitude, busLocation.longitude]}
                        icon={busIcon}
                        zIndexOffset={1000}
                    >
                        <Popup>
                            <div className="text-center min-w-[180px]">
                                <p className="font-bold text-blue-800 mb-2 text-base">🚌 Xe Bus</p>
                                {busInfo && (
                                    <>
                                        <div className="bg-blue-50 rounded-lg p-2 mb-2">
                                            <p className="text-sm font-bold text-blue-900">
                                                {busInfo.bus_id?.license_plate}
                                            </p>
                                        </div>
                                        {busInfo.driver_id && (
                                            <p className="text-xs text-gray-700 mb-1">
                                                👨‍✈️ Tài xế: <span className="font-semibold">{busInfo.driver_id.name}</span>
                                            </p>
                                        )}
                                    </>
                                )}
                                <div className="mt-2 pt-2 border-t">
                                    <p className="text-xs text-gray-500">
                                        📍 {busLocation.latitude.toFixed(6)}, {busLocation.longitude.toFixed(6)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        ⏰ {new Date(busLocation.timestamp).toLocaleTimeString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Auto-fit bounds */}
                <MapBoundsUpdater busLocation={busLocation} routeStops={routeStops} />
            </MapContainer>

            {/* Loading Overlay */}
            {!busLocation && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-[1000]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-blue-600 font-medium">Đang tải vị trí xe...</p>
                    </div>
                </div>
            )}

            {/* Enhanced Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000] border-2 border-gray-200">
                <p className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Chú thích bản đồ
                </p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            🚌
                        </div>
                        <span className="text-xs font-medium">Xe bus (LIVE)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-500 rounded-full shadow-sm flex items-center justify-center text-white text-[8px] font-bold">
                            P
                        </div>
                        <span className="text-xs">Điểm đón của bạn</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-500 rounded-full shadow-sm flex items-center justify-center text-white text-[8px] font-bold">
                            D
                        </div>
                        <span className="text-xs">Điểm trả của bạn</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-xs">Điểm dừng khác</span>
                    </div>
                    <div className="pt-2 border-t mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-12 h-1 bg-indigo-500 rounded"></div>
                            <span className="text-xs">Tuyến đường</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-green-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #10b981, #10b981 5px, transparent 5px, transparent 10px)' }}></div>
                            <span className="text-xs">Đến điểm đón</span>
                        </div>
                    </div>
                </div>
                {routeStops.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600">
                            📊 Tổng: <span className="font-bold text-blue-600">{routeStops.length}</span> điểm dừng
                        </p>
                    </div>
                )}
            </div>

            {/* Route Info Badge */}
            {routeStops.length > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg px-4 py-2 z-[1000]">
                    <p className="text-xs font-semibold">
                        🗺️ Đang hiển thị toàn bộ tuyến ({routeStops.length} điểm)
                    </p>
                </div>
            )}
        </div>
    );
}