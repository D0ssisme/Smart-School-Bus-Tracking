import RouteStop from '../models/Routestop.js'
import Route from "../models/Route.js";

export const createRouteStop = async (req, res) => {
  try {
    const { route_id } = req.body;

    // ✅ Kiểm tra route_id có tồn tại không
    const routeExists = await Route.findById(route_id);
    if (!routeExists) {
      return res.status(404).json({ message: "Route không tồn tại!" });
    }

    const stop = new RouteStop(req.body);
    await stop.save();
    res.status(201).json(stop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔵 READ - Lấy tất cả điểm dừng
export const getAllRouteStops = async (req, res) => {
    try {
        const stops = await RouteStop.find()
            .populate("route_id", "name start_point end_point")
            .sort({ route_id: 1, order_number: 1 });
        res.status(200).json(stops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🟣 READ ONE - Lấy điểm dừng theo ID
export const getRouteStopById = async (req, res) => {
    try {
        const stop = await RouteStop.findById(req.params.id)
            .populate("route_id", "name");
        if (!stop) return res.status(404).json({ message: "Không tìm thấy điểm dừng" });
        res.status(200).json(stop);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔵 READ BY ROUTE_ID - Lấy tất cả điểm dừng theo tuyến
export const getStopsByRoute = async (req, res) => {
    try {
        const stops = await RouteStop.find({ route_id: req.params.route_id })
            .sort({ order_number: 1 });
        if (!stops.length)
            return res.status(404).json({ message: "Tuyến này chưa có điểm dừng" });
        res.status(200).json(stops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

