import RouteStop from "../models/RouteStop.js";
import Route from "../models/Route.js";
import Stop from "../models/Stop.js";

// 🟢 Tạo mới RouteStop
export const createRouteStop = async (req, res) => {
  try {
    const { route_id, stop_id, order_number, estimated_arrival } = req.body;

    // kiểm tra route & stop có tồn tại không
    const route = await Route.findById(route_id);
    if (!route) return res.status(404).json({ message: "❌ Tuyến đường không tồn tại!" });

    const stop = await Stop.findById(stop_id);
    if (!stop) return res.status(404).json({ message: "❌ Điểm dừng không tồn tại!" });

    // tạo mới
    const routeStop = await RouteStop.create({
      route_id,
      stop_id,
      order_number,
      estimated_arrival
    });

    res.status(201).json({
      message: "✅ Thêm điểm dừng vào tuyến thành công!",
      data: routeStop
    });
  } catch (err) {
    console.error("Lỗi khi tạo RouteStop:", err);
    res.status(400).json({ message: "Lỗi khi tạo RouteStop", error: err.message });
  }
};

// 🟢 Lấy toàn bộ RouteStops (có populate)
export const getAllRouteStops = async (req, res) => {
  try {
    const routeStops = await RouteStop.find()
      .populate("route_id", "route_id name")
      .populate("stop_id", "stop_id name location")
      .sort("order_number");

    res.status(200).json(routeStops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Lấy danh sách Stop theo Route
export const getStopsByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const stops = await RouteStop.find({ route_id: routeId })
      .populate("stop_id", "stop_id name location")
      .sort("order_number");

    if (!stops.length)
      return res.status(404).json({ message: "Không có điểm dừng cho tuyến này!" });

    res.status(200).json(stops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟡 Cập nhật RouteStop
export const updateRouteStop = async (req, res) => {
  try {
    const updated = await RouteStop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy RouteStop để cập nhật!" });

    res.status(200).json({
      message: "✅ Cập nhật RouteStop thành công!",
      data: updated
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔴 Xóa RouteStop
export const deleteRouteStop = async (req, res) => {
  try {
    const deleted = await RouteStop.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy RouteStop để xóa!" });

    res.status(200).json({
      message: "🗑️ Xóa RouteStop thành công!",
      data: deleted
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
