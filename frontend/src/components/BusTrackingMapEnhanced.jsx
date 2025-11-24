import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons với hover effect
const createCustomIcon = (color, label, isHovered = false) => {
    const size = isHovered ? 44 : 36;
    const borderWidth = isHovered ? 4 : 3;

    return L.divIcon({
        className: 'custom-marker',
        html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: ${borderWidth}px solid ${isHovered ? '#000' : 'white'};
          box-shadow: 0 ${isHovered ? 6 : 4}px ${isHovered ? 16 : 12}px rgba(0,0,0,${isHovered ? 0.5 : 0.4});
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;
        ">
          <span style="
            transform: rotate(45deg);
            color: white;
            font-weight: bold;
            font-size: ${isHovered ? 16 : 14}px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          ">${label}</span>
        </div>
      `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
};

// Bus icon với hover
const createBusIcon = (isHovered = false) => {
    const size = isHovered ? 52 : 48;

    return L.divIcon({
        className: 'custom-bus-marker',
        html: `
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></div>
          <div style="
            background: #3b82f6;
            width: ${size - 8}px;
            height: ${size - 8}px;
            border-radius: 10px;
            border: ${isHovered ? 4 : 3}px solid ${isHovered ? '#000' : 'white'};
            box-shadow: 0 ${isHovered ? 6 : 4}px ${isHovered ? 16 : 12}px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isHovered ? 24 : 20}px;
            position: relative;
            z-index: 1;
            cursor: pointer;
          ">🚌</div>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.4; }
          }
        </style>
      `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
};

// Routing component với logging
function RoutingMachine({ routeStops, busLocation }) {
    const map = useMap();
    const [routingControl, setRoutingControl] = useState(null);

    useEffect(() => {
        console.log('🗺️ RoutingMachine - routeStops:', routeStops);
        console.log('🚌 RoutingMachine - busLocation:', busLocation);

        if (!map) {
            console.log('⚠️ Map not ready');
            return;
        }

        if (!routeStops || routeStops.length < 2) {
            console.log('⚠️ Not enough stops for routing:', routeStops?.length);
            if (routingControl) {
                map.removeControl(routingControl);
                setRoutingControl(null);
            }
            return;
        }

        // Create waypoints from route stops
        const waypoints = routeStops
            .filter(stop => {
                const hasCoords = stop.stop_id?.location?.coordinates;
                if (!hasCoords) {
                    console.log('⚠️ Stop missing coordinates:', stop);
                }
                return hasCoords;
            })
            .map(stop => {
                const [lng, lat] = stop.stop_id.location.coordinates;
                console.log(`📍 Waypoint: ${stop.stop_id.name} at [${lat}, ${lng}]`);
                return L.latLng(lat, lng);
            });

        console.log('✅ Total waypoints for routing:', waypoints.length);

        if (waypoints.length < 2) {
            console.log('⚠️ Not enough valid waypoints');
            return;
        }

        // Remove existing control
        if (routingControl) {
            console.log('🔄 Removing old routing control');
            map.removeControl(routingControl);
        }

        // Create new routing control
        console.log('🎨 Creating new routing control...');
        const control = L.Routing.control({
            waypoints,
            routeWhileDragging: false,
            showAlternatives: false,
            addWaypoints: false,
            lineOptions: {
                styles: [{
                    color: '#6366f1',
                    weight: 6,
                    opacity: 0.8,
                    className: 'route-line'
                }]
            },
            createMarker: () => null, // Don't create default markers
            fitSelectedRoutes: true,
            show: false,
        }).addTo(map);

        console.log('✅ Routing control created');

        // Hide the routing instructions container
        const routingContainer = control.getContainer();
        if (routingContainer) {
            routingContainer.style.display = 'none';
        }

        // Listen to routing events
        control.on('routesfound', function (e) {
            console.log('✅ Routes found:', e.routes);
        });

        control.on('routingerror', function (e) {
            console.error('❌ Routing error:', e);
        });

        setRoutingControl(control);

        return () => {
            if (control) {
                console.log('🧹 Cleaning up routing control');
                map.removeControl(control);
            }
        };
    }, [routeStops, map]);

    return null;
}

// Auto-fit bounds
function MapBoundsUpdater({ busLocation, routeStops }) {
    const map = useMap();

    useEffect(() => {
        const bounds = [];

        if (busLocation) {
            bounds.push([busLocation.latitude, busLocation.longitude]);
        }

        if (routeStops && routeStops.length > 0) {
            routeStops.forEach(stop => {
                if (stop.stop_id?.location?.coordinates) {
                    const [lng, lat] = stop.stop_id.location.coordinates;
                    bounds.push([lat, lng]);
                }
            });
        }

        if (bounds.length > 0) {
            console.log('📐 Fitting bounds to', bounds.length, 'points');
            map.fitBounds(bounds, {
                padding: [80, 80],
                maxZoom: 14
            });
        }
    }, [busLocation, routeStops, map]);

    return null;
}

// Hoverable Marker Component
function HoverableMarker({ position, icon, children, stopId, onHover }) {
    const [isHovered, setIsHovered] = useState(false);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!markerRef.current) return;

        const marker = markerRef.current;

        marker.on('mouseover', () => {
            setIsHovered(true);
            onHover?.(stopId, true);
        });

        marker.on('mouseout', () => {
            setIsHovered(false);
            onHover?.(stopId, false);
        });

        return () => {
            marker.off('mouseover');
            marker.off('mouseout');
        };
    }, [stopId, onHover]);

    return (
        <Marker position={position} icon={icon} ref={markerRef}>
            {children}
        </Marker>
    );
}

export default function BusTrackingMapEnhanced({
    busLocation,
    pickupStop,
    dropoffStop,
    busInfo,
    routeStops = []
}) {
    const mapRef = useRef(null);
    const [hoveredStop, setHoveredStop] = useState(null);
    const [hoveredBus, setHoveredBus] = useState(false);
    const defaultCenter = [10.762622, 106.660172];

    // Log props for debugging
    useEffect(() => {
        console.log('🎯 BusTrackingMapEnhanced Props:');
        console.log('  - busLocation:', busLocation);
        console.log('  - pickupStop:', pickupStop);
        console.log('  - dropoffStop:', dropoffStop);
        console.log('  - busInfo:', busInfo);
        console.log('  - routeStops:', routeStops);
    }, [busLocation, pickupStop, dropoffStop, busInfo, routeStops]);

    const center = busLocation
        ? [busLocation.latitude, busLocation.longitude]
        : defaultCenter;

    // Check if stop is pickup or dropoff
    const isPickupStop = (stopId) => {
        const result = stopId?.toString() === pickupStop?._id?.toString();
        console.log(`🔍 Is pickup stop? ${stopId} === ${pickupStop?._id}: ${result}`);
        return result;
    };

    const isDropoffStop = (stopId) => {
        const result = stopId?.toString() === dropoffStop?._id?.toString();
        console.log(`🔍 Is dropoff stop? ${stopId} === ${dropoffStop?._id}: ${result}`);
        return result;
    };

    // Get icon for stop with hover state
    const getStopIcon = (stop, index) => {
        const stopId = stop.stop_id?._id || stop.stop_id;
        const isHovered = hoveredStop === stopId;

        if (isPickupStop(stopId)) {
            return createCustomIcon('#22c55e', 'P', isHovered);
        } else if (isDropoffStop(stopId)) {
            return createCustomIcon('#ef4444', 'D', isHovered);
        } else {
            return createCustomIcon('#3b82f6', index + 1, isHovered);
        }
    };

    const handleMarkerHover = (stopId, isHovered) => {
        setHoveredStop(isHovered ? stopId : null);
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

                {/* Routing Machine - draws the route */}
                <RoutingMachine routeStops={routeStops} busLocation={busLocation} />

                {/* Route Stop Markers */}
                {routeStops && routeStops.length > 0 && routeStops.map((stop, index) => {
                    if (!stop || !stop.stop_id?.location?.coordinates) {
                        console.log(`⚠️ Skipping stop ${index}: invalid data`, stop);
                        return null;
                    }

                    const stopId = stop.stop_id._id || stop.stop_id;
                    const [lng, lat] = stop.stop_id.location.coordinates;

                    console.log(`✅ Rendering stop ${index}: ${stop.stop_id.name} at [${lat}, ${lng}]`);

                    return (
                        <HoverableMarker
                            key={stopId}
                            position={[lat, lng]}
                            icon={getStopIcon(stop, index)}
                            stopId={stopId}
                            onHover={handleMarkerHover}
                        >
                            <Popup>
                                <div className="min-w-[220px]">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-bold text-gray-800 text-base">
                                                {isPickupStop(stopId) && '📍 Điểm đón của bạn'}
                                                {isDropoffStop(stopId) && '🏁 Điểm trả của bạn'}
                                                {!isPickupStop(stopId) && !isDropoffStop(stopId) && '🚏 Điểm dừng'}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-700 mt-1">
                                                {stop.stop_id.name}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ml-2 ${isPickupStop(stopId) ? 'bg-green-100 text-green-800' :
                                                isDropoffStop(stopId) ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            #{index + 1}
                                        </span>
                                    </div>
                                    {stop.stop_id.address && (
                                        <p className="text-xs text-gray-600 mb-2">
                                            📮 {stop.stop_id.address}
                                        </p>
                                    )}
                                    {stop.estimated_arrival_time && (
                                        <p className="text-xs text-blue-700 font-medium mt-2 bg-blue-50 p-2 rounded">
                                            ⏰ Dự kiến: {new Date(stop.estimated_arrival_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                    <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                                        Thứ tự: {stop.order || index + 1}
                                    </div>
                                </div>
                            </Popup>
                        </HoverableMarker>
                    );
                })}

                {/* Bus Marker - Always on top with hover */}
                {busLocation && (
                    <HoverableMarker
                        position={[busLocation.latitude, busLocation.longitude]}
                        icon={createBusIcon(hoveredBus)}
                        stopId="bus"
                        onHover={(id, isHovered) => setHoveredBus(isHovered)}
                    >
                        <Popup>
                            <div className="text-center min-w-[200px]">
                                <p className="font-bold text-blue-800 mb-2 text-lg">🚌 Xe Bus LIVE</p>
                                {busInfo && (
                                    <>
                                        <div className="bg-blue-50 rounded-lg p-3 mb-2">
                                            <p className="text-base font-bold text-blue-900">
                                                {busInfo.bus_id?.license_plate}
                                            </p>
                                        </div>
                                        {busInfo.driver_id && (
                                            <p className="text-sm text-gray-700 mb-2">
                                                👨‍✈️ Tài xế: <span className="font-semibold">{busInfo.driver_id.name}</span>
                                            </p>
                                        )}
                                    </>
                                )}
                                <div className="mt-2 pt-2 border-t text-xs">
                                    <p className="text-gray-500 mb-1">
                                        📍 {busLocation.latitude.toFixed(6)}, {busLocation.longitude.toFixed(6)}
                                    </p>
                                    <p className="text-gray-400">
                                        ⏰ {new Date(busLocation.timestamp).toLocaleTimeString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </HoverableMarker>
                )}

                {/* Auto-fit bounds */}
                <MapBoundsUpdater busLocation={busLocation} routeStops={routeStops} />
            </MapContainer>

            {/* Loading Overlay */}
            {!busLocation && routeStops.length === 0 && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-[1000]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-blue-600 font-medium">Đang tải bản đồ...</p>
                    </div>
                </div>
            )}

            {/* Map Legend - Compact Version */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-xl p-3 z-[1000] border-2 border-gray-200 max-w-[200px]">
                <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Chú thích
                </p>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white font-bold shadow-sm">
                            🚌
                        </div>
                        <span className="font-medium">Xe bus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-500 rounded-sm shadow-sm flex items-center justify-center text-white text-[10px] font-bold">
                            P
                        </div>
                        <span>Điểm đón</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-500 rounded-sm shadow-sm flex items-center justify-center text-white text-[10px] font-bold">
                            D
                        </div>
                        <span>Điểm trả</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-sm shadow-sm"></div>
                        <span>Điểm khác</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t">
                        <div className="w-8 h-1 bg-indigo-500 rounded"></div>
                        <span>Tuyến đường</span>
                    </div>
                </div>
                {routeStops.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600 font-semibold">
                            📊 {routeStops.length} điểm dừng
                        </p>
                    </div>
                )}
            </div>

            {/* Route Info Badge */}
            {routeStops.length > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg px-3 py-2 z-[1000]">
                    <p className="text-xs font-bold">
                        🗺️ Tuyến đường ({routeStops.length} điểm)
                    </p>
                </div>
            )}

            {/* Hover Instruction */}
            <div className="absolute top-4 right-4 bg-black/70 text-white rounded-lg shadow-lg px-3 py-2 z-[1000] text-xs">
                💡 Di chuột qua marker để nổi bật
            </div>
        </div>
    );
}