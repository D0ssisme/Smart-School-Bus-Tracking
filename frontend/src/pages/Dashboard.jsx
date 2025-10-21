export default function Dashboard() {
  return (
    <div className="bg-white rounded shadow p-5 m-5">
      <h2 className="text-xl font-bold mb-4">🚍 Thống kê hệ thống</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <h3 className="text-lg font-semibold">Xe bus</h3>
          <p className="text-2xl font-bold text-blue-700">25</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold">Tài xế</h3>
          <p className="text-2xl font-bold text-green-700">18</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="text-lg font-semibold">Tuyến đường</h3>
          <p className="text-2xl font-bold text-yellow-700">12</p>
        </div>
      </div>
    </div>
  );
}
