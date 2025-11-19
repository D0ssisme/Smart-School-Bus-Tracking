// src/components/BusTrackingMap.jsx
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

// Custom Bus Icon
const busIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="#2563eb" stroke-width="2" fill="#3b82f6"/>
      <rect x="6" y="8" width="5" height="4" rx="1" fill="white"/>
      <rect x="13" y="8" width="5" height="4" rx="1" fill="white"/>
      <circle cx="8" cy="18" r="2" stroke="#2563eb" stroke-width="2" fill="white"/>
      <circle cx="16" cy="18" r="2" stroke="#2563eb" stroke-width="2" fill="white"/>
    </svg>
  `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Custom Pickup Stop Icon (Green)
const pickupIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#10b981">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

// Custom Dropoff Stop Icon (Red)
const dropoffIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#ef4444">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

// Component để auto-center map
function MapUpdater({ busLocation, pickupLocation, dropoffLocation }) {
    const map = useMap();

    useEffect(() => {
        if (busLocation) {
            // Center on bus location
            map.setView([busLocation.latitude, busLocation.longitude], 15);
        }
    }, [busLocation, map]);

    return null;
}

export default function BusTrackingMap({
    busLocation,
    pickupStop,
    dropoffStop,
    busInfo
}) {
    const mapRef = useRef(null);

    // Default center (HCM City)
    const defaultCenter = [10.762622, 106.660172];

    const center = busLocation
        ? [busLocation.latitude, busLocation.longitude]
        : defaultCenter;

    // Tạo polyline từ bus đến pickup stop
    const getPolyline = () => {
        if (!busLocation || !pickupStop?.location?.coordinates) return null;

        return [
            [busLocation.latitude, busLocation.longitude],
            [pickupStop.location.coordinates[1], pickupStop.location.coordinates[0]]
        ];
    };

    const polyline = getPolyline();

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full"
                ref={mapRef}
            >
                {/* Map Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Bus Marker */}
                {busLocation && (
                    <Marker
                        position={[busLocation.latitude, busLocation.longitude]}
                        icon={busIcon}
                    >
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold text-blue-800 mb-1">🚌 Xe Bus</p>
                                {busInfo && (
                                    <>
                                        <p className="text-sm font-semibold">{busInfo.bus_id?.license_plate}</p>
                                        {busInfo.driver_id && (
                                            <p className="text-xs text-gray-600">Tài xế: {busInfo.driver_id.name}</p>
                                        )}
                                    </>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    📍 {busLocation.latitude.toFixed(6)}, {busLocation.longitude.toFixed(6)}
                                </p>
                                <p className="text-xs text-gray-400">
                                    ⏰ {new Date(busLocation.timestamp).toLocaleTimeString('vi-VN')}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Pickup Stop Marker */}
                {pickupStop?.location?.coordinates && (
                    <Marker
                        position={[
                            pickupStop.location.coordinates[1],
                            pickupStop.location.coordinates[0]
                        ]}
                        icon={pickupIcon}
                    >
                        <Popup>
                            <div>
                                <p className="font-bold text-green-800 mb-1">📍 Điểm đón</p>
                                <p className="text-sm font-semibold">{pickupStop.name}</p>
                                {pickupStop.address && (
                                    <p className="text-xs text-gray-600 mt-1">{pickupStop.address}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Dropoff Stop Marker */}
                {dropoffStop?.location?.coordinates && (
                    <Marker
                        position={[
                            dropoffStop.location.coordinates[1],
                            dropoffStop.location.coordinates[0]
                        ]}
                        icon={dropoffIcon}
                    >
                        <Popup>
                            <div>
                                <p className="font-bold text-red-800 mb-1">📍 Điểm trả</p>
                                <p className="text-sm font-semibold">{dropoffStop.name}</p>
                                {dropoffStop.address && (
                                    <p className="text-xs text-gray-600 mt-1">{dropoffStop.address}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Polyline from bus to pickup stop */}
                {polyline && (
                    <Polyline
                        positions={polyline}
                        color="#3b82f6"
                        weight={3}
                        opacity={0.7}
                        dashArray="10, 10"
                    />
                )}

                {/* Auto-center map */}
                <MapUpdater
                    busLocation={busLocation}
                    pickupLocation={pickupStop?.location}
                    dropoffLocation={dropoffStop?.location}
                />
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

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
                <p className="text-xs font-bold text-gray-700 mb-2">Chú thích:</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs">🚌</div>
                        <span className="text-xs">Xe bus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Điểm đón</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-xs">Điểm trả</span>
                    </div>
                </div>
            </div>
        </div>
    );
}