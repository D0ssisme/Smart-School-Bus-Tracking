import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { ArrowLeft, Plus, X, MapPin } from "lucide-react";

function RoutingMap({ routeInfo, activeInput, onSelectLocation }) {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);

  // Xử lý click chọn vị trí
  useEffect(() => {
    if (!map) return;

    const handleClick = async (e) => {
      if (!activeInput) return; // ❗ Chưa chọn input thì bỏ qua

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
    if (!map || !routeInfo.start || !routeInfo.end) return;

    const waypoints = [
      routeInfo.start,
      ...(routeInfo.stops.filter((s) => s !== null)),
      routeInfo.end,
    ].map((p) => L.latLng(p.lat, p.lng));

    if (routingControl) map.removeControl(routingControl);

    const control = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
      createMarker: (i, wp) => L.marker(wp.latLng),
    }).addTo(map);

    setRoutingControl(control);

    return () => map.removeControl(control);
  }, [routeInfo, map]);

  return null;
}

export default function CreateRoute() {
  const [routeInfo, setRouteInfo] = useState({
    id: "",
    name: "",
    start: null,
    end: null,
    stops: [],
  });

  const [activeInput, setActiveInput] = useState(null);

  const handleAddStop = () =>
    setRouteInfo({ ...routeInfo, stops: [...routeInfo.stops, null] });

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

  const onBack = () => window.history.back();

  const handleCreateRoute = () => {
    console.log("Tuyến mới:", routeInfo);
    alert("✅ Tuyến đường đã được tạo!");
  };

  return (
    <div className="p-4 bg-white rounded shadow min-h-screen m-4 flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Tạo tuyến xe buýt mới</h2>
      </div>

      {/* Inputs */}
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Mã tuyến"
          className="border p-2 rounded w-32"
          value={routeInfo.id}
          onChange={(e) => setRouteInfo({ ...routeInfo, id: e.target.value })}
        />
        <input
          placeholder="Tên tuyến"
          className="border p-2 rounded flex-1"
          value={routeInfo.name}
          onChange={(e) => setRouteInfo({ ...routeInfo, name: e.target.value })}
        />
      </div>

      {/* Điểm khởi đầu */}
      <div className="mb-2">
        <label className="font-semibold">Điểm khởi đầu:</label>
        <input
          placeholder="Nhập hoặc chọn trên bản đồ"
          className={`border p-2 rounded w-full mt-1 ${
            activeInput === "start" ? "border-blue-500 ring-2 ring-blue-200" : ""
          }`}
          value={routeInfo.start?.address || ""}
          onFocus={() => setActiveInput("start")}
          onChange={(e) =>
            setRouteInfo({
              ...routeInfo,
              start: { ...(routeInfo.start || {}), address: e.target.value },
            })
          }
        />
      </div>

      {/* Các điểm dừng */}
      <div className="mb-2">
        <label className="font-semibold flex items-center justify-between">
          <span>Các điểm dừng:</span>
          <button
            onClick={handleAddStop}
            className="flex items-center gap-1 bg-green-200 px-2 py-1 rounded hover:bg-green-300"
          >
            <Plus size={16} /> Thêm
          </button>
        </label>
        {routeInfo.stops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <input
              placeholder={`Điểm dừng ${index + 1}`}
              className={`border p-2 rounded flex-1 ${
                activeInput === `stop${index}`
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : ""
              }`}
              value={stop?.address || ""}
              onFocus={() => setActiveInput(`stop${index}`)}
              onChange={(e) => {
                const newStops = [...routeInfo.stops];
                newStops[index] = {
                  ...(newStops[index] || {}),
                  address: e.target.value,
                };
                setRouteInfo({ ...routeInfo, stops: newStops });
              }}
            />
            <button
              onClick={() => handleRemoveStop(index)}
              className="bg-red-200 hover:bg-red-300 px-2 py-1 rounded"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Điểm kết thúc */}
      <div className="mb-4">
        <label className="font-semibold">Điểm kết thúc:</label>
        <input
          placeholder="Nhập hoặc chọn trên bản đồ"
          className={`border p-2 rounded w-full mt-1 ${
            activeInput === "end" ? "border-blue-500 ring-2 ring-blue-200" : ""
          }`}
          value={routeInfo.end?.address || ""}
          onFocus={() => setActiveInput("end")}
          onChange={(e) =>
            setRouteInfo({
              ...routeInfo,
              end: { ...(routeInfo.end || {}), address: e.target.value },
            })
          }
        />
      </div>

      {/* Hướng dẫn */}
      <p className="text-gray-700 mb-2">
        👉 Chọn ô input trước, sau đó click lên bản đồ để gán vị trí.
      </p>

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
          center={[10.776, 106.700]}
          zoom={12}
          style={{ height: "70vh", width: "100%", marginTop: "10px" }}
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
          className="flex items-center gap-1 bg-red-200 px-4 py-2 rounded hover:bg-red-300 transition"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <button
          onClick={handleCreateRoute}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          + Tạo tuyến đường
        </button>
      </div>
    </div>
  );
}
