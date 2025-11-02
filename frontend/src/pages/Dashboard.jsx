import { useEffect, useState } from "react";
import { getDriversApi } from "../api/userApi"; // import hàm API vừa tạo
import { getRoutesApi } from "../api/routeApi";
import axios from "axios";

export default function Dashboard() {
  const [busCount, setBusCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);

  // 🚌 Lấy số lượng xe bus
  const fetchBusCount = async () => {
    const res = await axios.get("http://localhost:8080/api/bus");
    setBusCount(res.data.length);
  };

  // 👨‍✈️ Lấy số lượng tài xế
  const fetchDriverCount = async () => {
    const data = await getDriversApi();
    setDriverCount(data.length);
  };

  const fetchRouteCount = async () => {
    const data = await getRoutesApi();
    setRouteCount(data.length);
  }

  useEffect(() => {
    fetchBusCount();
    fetchDriverCount();
    fetchRouteCount();
  }, []);

  return (
    <div className="bg-white rounded shadow p-5 m-5">
      <h2 className="text-xl font-bold mb-4">🚍 Thống kê hệ thống</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <h3 className="text-lg font-semibold">Xe bus</h3>
          <p className="text-2xl font-bold text-blue-700">{busCount}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold">Tài xế</h3>
          <p className="text-2xl font-bold text-green-700">{driverCount}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="text-lg font-semibold">Tuyến đường</h3>
          <p className="text-2xl font-bold text-yellow-700">{routeCount}</p>
        </div>
      </div>
    </div>
  );
}
