import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { ArrowLeft, Plus, X, MapPin } from "lucide-react";
import { createRouteAutoApi } from "@/api/routeApi";

function RoutingMap({ routeInfo, activeInput, onSelectLocation }) {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);

  // Xử lý click chọn vị trí
  useEffect(() => {
    if (!map) return;

    const handleClick = async (e) => {
      if (!activeInput) return;

      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        const address =
          data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        onSelectLocation(activeInput, { lat, lng, address });
      } catch {
        onSelectLocation(activeInput, { lat, lng, address: `${lat}, ${lng}` });
      }
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, activeInput, onSelectLocation]);

  // Vẽ tuyến đường
  useEffect(() => {
    if (!map || !routeInfo.start || !routeInfo.end) {
      // Xóa routing control nếu thiếu điểm đầu/cuối
      if (routingControl) {
        map.removeControl(routingControl);
        setRoutingControl(null);
      }
      return;
    }

    const waypoints = [
      routeInfo.start,
      ...routeInfo.stops.filter((s) => s !== null),
      routeInfo.end,
    ].map((p) => L.latLng(p.lat, p.lng));

    if (routingControl) {
      map.removeControl(routingControl);
    }

    const control = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      createMarker: () => null, // Không tạo marker mặc định
    }).addTo(map);

    setRoutingControl(control);

    return () => {
      if (control) {
        map.removeControl(control);
      }
    };
  }, [routeInfo, map]);

  // Custom icon cho markers
  const createCustomIcon = (color, label) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            color: white;
            font-weight: bold;
            font-size: 14px;
          ">${label}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <>
      {/* Marker điểm khởi đầu */}
      {routeInfo.start && (
        <Marker
          position={[routeInfo.start.lat, routeInfo.start.lng]}
          icon={createCustomIcon('#22c55e', 'A')}
        >
          <Popup>
            <div className="text-sm">
              <strong className="text-green-600">🚩 Điểm khởi đầu</strong><br />
              <span className="text-gray-700">{routeInfo.start.address}</span>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Markers các điểm dừng */}
      {routeInfo.stops.map((stop, index) =>
        stop && (
          <Marker
            key={index}
            position={[stop.lat, stop.lng]}
            icon={createCustomIcon('#3b82f6', index + 1)}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-blue-600">📍 Điểm dừng {index + 1}</strong><br />
                <span className="text-gray-700">{stop.address}</span>
              </div>
            </Popup>
          </Marker>
        )
      )}

      {/* Marker điểm kết thúc */}
      {routeInfo.end && (
        <Marker
          position={[routeInfo.end.lat, routeInfo.end.lng]}
          icon={createCustomIcon('#ef4444', 'B')}
        >
          <Popup>
            <div className="text-sm">
              <strong className="text-red-600">🏁 Điểm kết thúc</strong><br />
              <span className="text-gray-700">{routeInfo.end.address}</span>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

export default function CreateRoute() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [routeInfo, setRouteInfo] = useState({
    name: "",
    start: null,
    end: null,
    stops: [],
  });

  const [activeInput, setActiveInput] = useState(null);

  const handleAddStop = () => {
    setRouteInfo({ ...routeInfo, stops: [...routeInfo.stops, null] });
  };

  const handleRemoveStop = (index) => {
    const newStops = [...routeInfo.stops];
    newStops.splice(index, 1);
    setRouteInfo({ ...routeInfo, stops: newStops });
  };

  const handleSelectLocation = (field, location) => {
    if (field === "start" || field === "end") {
      setRouteInfo({ ...routeInfo, [field]: location });
    } else if (field.startsWith("stop")) {
      const index = parseInt(field.replace("stop", ""));
      const newStops = [...routeInfo.stops];
      newStops[index] = location;
      setRouteInfo({ ...routeInfo, stops: newStops });
    }
  };

  const validateForm = () => {
    if (!routeInfo.name.trim()) {
      setError("Vui lòng nhập tên tuyến");
      return false;
    }

    if (!routeInfo.start) {
      setError("Vui lòng chọn điểm khởi đầu");
      return false;
    }

    if (!routeInfo.end) {
      setError("Vui lòng chọn điểm kết thúc");
      return false;
    }

    // Kiểm tra các điểm dừng (nếu có) phải được chọn đầy đủ
    const hasEmptyStops = routeInfo.stops.some((stop) => !stop);
    if (hasEmptyStops) {
      setError("Vui lòng chọn đầy đủ các điểm dừng hoặc xóa những điểm chưa chọn");
      return false;
    }

    return true;
  };

  const handleCreateRoute = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Transform data theo format API yêu cầu
      const apiData = {
        name: routeInfo.name,
        stops: [
          // Điểm đầu
          {
            name: `Điểm dừng ${routeInfo.start.address.split(",")[0] || "bắt đầu"}`,
            address: routeInfo.start.address,
            coordinates: [routeInfo.start.lng, routeInfo.start.lat],
          },
          // Các điểm dừng giữa
          ...routeInfo.stops.map((stop, index) => ({
            name: `Điểm dừng ${stop.address.split(",")[0] || (index + 2)}`,
            address: stop.address,
            coordinates: [stop.lng, stop.lat],
          })),
          // Điểm cuối
          {
            name: `Điểm dừng ${routeInfo.end.address.split(",")[0] || "kết thúc"}`,
            address: routeInfo.end.address,
            coordinates: [routeInfo.end.lng, routeInfo.end.lat],
          },
        ],
      };

      console.log("Đang gửi dữ liệu:", apiData);

      const response = await createRouteAutoApi(apiData);

      console.log("Kết quả:", response);
      alert("✅ Tuyến đường đã được tạo thành công!");
      navigate("/route");

    } catch (err) {
      console.error("Lỗi khi tạo tuyến:", err);
      setError(
        err.response?.data?.message ||
        "Không thể tạo tuyến đường. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => navigate("/route");

  return (
    <div className="p-4 bg-white rounded shadow min-h-screen m-4 flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Tạo tuyến xe buýt mới</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tên tuyến */}
      <div className="mb-4">
        <input
          placeholder="Tên tuyến (VD: Tuyến Sài Thành)"
          className="border p-2 rounded w-full"
          value={routeInfo.name}
          onChange={(e) => setRouteInfo({ ...routeInfo, name: e.target.value })}
        />
      </div>

      {/* Điểm khởi đầu */}
      <div className="mb-2">
        <label className="font-semibold">
          Điểm khởi đầu: <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Click trên bản đồ để chọn vị trí"
          className={`border p-2 rounded w-full mt-1 ${activeInput === "start" ? "border-blue-500 ring-2 ring-blue-200" : ""
            }`}
          value={routeInfo.start?.address || ""}
          onFocus={() => setActiveInput("start")}
          readOnly
        />
        {routeInfo.start && (
          <p className="text-xs text-gray-500 mt-1">
            📍 Tọa độ: {routeInfo.start.lat.toFixed(5)}, {routeInfo.start.lng.toFixed(5)}
          </p>
        )}
      </div>

      {/* Các điểm dừng */}
      <div className="mb-2">
        <label className="font-semibold flex items-center justify-between">
          <span>Các điểm dừng (tùy chọn):</span>
          <button
            onClick={handleAddStop}
            className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
          >
            <Plus size={16} /> Thêm điểm dừng
          </button>
        </label>
        {routeInfo.stops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <input
              placeholder={`Click trên bản đồ để chọn điểm dừng ${index + 1}`}
              className={`border p-2 rounded flex-1 ${activeInput === `stop${index}`
                ? "border-blue-500 ring-2 ring-blue-200"
                : ""
                }`}
              value={stop?.address || ""}
              onFocus={() => setActiveInput(`stop${index}`)}
              readOnly
            />
            <button
              onClick={() => handleRemoveStop(index)}
              className="bg-red-500 text-white hover:bg-red-600 px-2 py-2 rounded transition"
            >
              <X size={16} />
            </button>
            {stop && (
              <span className="text-xs text-gray-500 w-32">
                {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Điểm kết thúc */}
      <div className="mb-4">
        <label className="font-semibold">
          Điểm kết thúc: <span className="text-red-500">*</span>
        </label>
        <input
          placeholder="Click trên bản đồ để chọn vị trí"
          className={`border p-2 rounded w-full mt-1 ${activeInput === "end" ? "border-blue-500 ring-2 ring-blue-200" : ""
            }`}
          value={routeInfo.end?.address || ""}
          onFocus={() => setActiveInput("end")}
          readOnly
        />
        {routeInfo.end && (
          <p className="text-xs text-gray-500 mt-1">
            📍 Tọa độ: {routeInfo.end.lat.toFixed(5)}, {routeInfo.end.lng.toFixed(5)}
          </p>
        )}
      </div>

      {/* Hướng dẫn */}
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
        <p className="text-sm text-blue-800 flex items-start gap-2">
          <MapPin size={18} className="mt-0.5 flex-shrink-0" />
          <span>
            <strong>Hướng dẫn:</strong> Click vào ô input (điểm đầu/dừng/cuối) trước,
            sau đó click lên bản đồ để chọn vị trí. Tuyến đường sẽ được vẽ tự động.
          </span>
        </p>
      </div>

      {/* Bản đồ */}
      <div className="relative flex-1">
        {!activeInput && (
          <div className="absolute inset-0 z-20 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none">
            <div className="bg-white px-4 py-2 rounded shadow text-gray-800 font-medium flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              Hãy chọn ô input trước khi chọn vị trí trên bản đồ
            </div>
          </div>
        )}

        <MapContainer
          center={[10.776, 106.7]}
          zoom={12}
          style={{ height: "60vh", width: "100%", marginTop: "10px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RoutingMap
            activeInput={activeInput}
            routeInfo={routeInfo}
            onSelectLocation={handleSelectLocation}
          />
        </MapContainer>
      </div>

      {/* Nút dưới cùng */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          disabled={loading}
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <button
          onClick={handleCreateRoute}
          disabled={loading}
          className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Đang tạo..." : "+ Tạo tuyến đường"}
        </button>
      </div>
    </div>
  );
}