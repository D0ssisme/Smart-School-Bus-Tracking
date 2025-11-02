import axios from "axios";
import Route from "../models/Route.js";
import RouteStop from "../models/RouteStop.js";
import Stop from "../models/Stop.js";
import mongoose from "mongoose";





export const createRouteAuto = async (req, res) => {
    try {
        let { name, stops } = req.body;
        // stops = [{ name: "Stop A", address: "...", coordinates: [lng, lat] }, ...]

        if (!stops || stops.length < 2) {
            return res.status(400).json({ message: "Cần ít nhất 2 điểm dừng!" });
        }

        const stopIds = [];

        for (let stop of stops) {
            // Kiểm tra stop đã tồn tại dựa trên tọa độ (hoặc theo name nếu muốn)
            let existingStop = await Stop.findOne({
                "location.coordinates": stop.coordinates,
            });

            if (!existingStop) {
                // Nếu chưa có thì tạo mới
                const newStop = new Stop({
                    name: stop.name,
                    address: stop.address,
                    location: {
                        type: "Point",
                        coordinates: stop.coordinates,
                    },
                });
                await newStop.save();
                stopIds.push(newStop._id);
            } else {
                stopIds.push(existingStop._id);
            }
        }

        // Tạo Route mới
        const route = new Route({
            name,
            start_point: stopIds[0],
            end_point: stopIds[stopIds.length - 1],
            path: {
                coordinates: stops.map((s) => s.coordinates), // giả lập path
            },
        });
        await route.save();

        // Tạo RouteStop theo thứ tự
        for (let i = 0; i < stopIds.length; i++) {
            const routeStop = new RouteStop({
                route_id: route._id,
                stop_id: stopIds[i],
                order_number: i + 1,
            });
            await routeStop.save();
        }

        res.status(201).json({
            message: "Tạo tuyến đường & stop tự động thành công!",
            route,
            stopIds,
        });
    } catch (error) {
        console.error("❌ Lỗi khi tạo tuyến tự động:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};


// 🟢 Lấy tất cả tuyến đường
export const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find()
            .populate("start_point", "name location")
            .populate("end_point", "name location");

        res.status(200).json(routes);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách tuyến:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

export const getRouteById = async (req, res) => {
    const { id } = req.params;

    // ✅ Kiểm tra id có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID route không hợp lệ!" });
    }

    try {
        const route = await Route.findById(id)
            .populate("start_point", "name location")
            .populate("end_point", "name location");

        if (!route) return res.status(404).json({ message: "Không tìm thấy tuyến!" });

        const stops = await RouteStop.find({ route_id: id })
            .populate("stop_id", "name location")
            .sort("order_number");

        res.status(200).json({ route, stops });
    } catch (error) {
        console.error("❌ Lỗi khi lấy chi tiết tuyến:", error);
        res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// 🟢 Tạo mới tuyến — gọi API định tuyến để lấy path
export const createRoute = async (req, res) => {
    try {
        const { name, stop_ids } = req.body; // stop_ids là mảng theo thứ tự [A, B, C, D]

        if (!stop_ids || stop_ids.length < 2) {
            return res.status(400).json({ message: "Phải có ít nhất 2 điểm dừng!" });
        }

        // Lấy thông tin toạ độ các điểm
        const stops = await Stop.find({ _id: { $in: stop_ids } });

        if (stops.length !== stop_ids.length) {
            return res.status(400).json({ message: "Một số điểm dừng không tồn tại!" });
        }

        // 🔹 Chuẩn bị toạ độ theo thứ tự đã chọn
        const coordinates = stop_ids.map((id) => {
            const stop = stops.find((s) => s._id.toString() === id);
            return stop.location.coordinates;
        });

        // 🗺️ Gọi API Mapbox Directions (hoặc Google nếu muốn)
        const mapboxToken = process.env.MAPBOX_TOKEN; // cần có token trong .env
        const coordStr = coordinates.map((c) => `${c[0]},${c[1]}`).join(";");
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordStr}?geometries=geojson&access_token=${mapboxToken}`;

        const { data } = await axios.get(url);

        if (!data.routes || !data.routes[0]) {
            return res.status(400).json({ message: "Không lấy được dữ liệu tuyến đường!" });
        }

        const geometry = data.routes[0].geometry;

        // 🔹 Tạo mới route
        const newRoute = new Route({
            name,
            start_point: stop_ids[0],
            end_point: stop_ids[stop_ids.length - 1],
            path: geometry,
        });

        await newRoute.save();

        // 🔹 Lưu các điểm dừng vào RouteStops
        const routeStops = stop_ids.map((stopId, index) => ({
            route_id: newRoute._id,
            stop_id: stopId,
            order_number: index + 1,
        }));

        await RouteStop.insertMany(routeStops);

        res.status(201).json({
            message: "✅ Tạo tuyến mới thành công!",
            route: newRoute,
        });
    } catch (error) {
        console.error("❌ Lỗi khi tạo tuyến:", error);
        res.status(500).json({ message: "Lỗi server khi tạo tuyến!", error: error.message });
    }
};

// 🟡 Cập nhật tuyến
export const updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updated = await Route.findByIdAndUpdate(
            id,
            { name, status },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Không tìm thấy tuyến!" });

        res.status(200).json({
            message: "✅ Cập nhật tuyến thành công!",
            data: updated,
        });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật tuyến:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật!", error: error.message });
    }
};

// 🔴 Xoá tuyến
export const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Route.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy tuyến!" });

        // Xoá luôn các RouteStops liên quan
        await RouteStop.deleteMany({ route_id: id });

        res.status(200).json({ message: "🗑️ Xoá tuyến thành công!" });
    } catch (error) {
        console.error("❌ Lỗi khi xoá tuyến:", error);
        res.status(500).json({ message: "Lỗi server khi xoá tuyến!", error: error.message });
    }
};
