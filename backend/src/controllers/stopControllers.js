import Stop from "../models/Stop.js";

// 🟢 Lấy toàn bộ điểm dừng
export const getAllStops = async (req, res) => {
    try {
        const stops = await Stop.find();
        res.status(200).json(stops);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách điểm dừng:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách điểm dừng!", error: error.message });
    }
};

// 🟢 Tạo mới điểm dừng
export const createStop = async (req, res) => {
    try {
        const { name, address, location, status } = req.body;

        if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
            return res.status(400).json({ message: "❌ Trường location không hợp lệ. Format đúng: { type: 'Point', coordinates: [lng, lat] }" });
        }

        const newStop = new Stop({
            name,
            address,
            location,
            status,
        });

        await newStop.save();
        res.status(201).json({
            message: "✅ Tạo điểm dừng thành công!",
            data: newStop,
        });
    } catch (error) {
        console.error("❌ Lỗi khi tạo điểm dừng:", error);
        res.status(500).json({ message: "Lỗi server khi tạo điểm dừng!", error: error.message });
    }
};

// 🟢 Lấy điểm dừng theo ID
export const getStopById = async (req, res) => {
    try {
        const { id } = req.params;
        const stop = await Stop.findById(id);

        if (!stop) return res.status(404).json({ message: "❌ Không tìm thấy điểm dừng!" });

        res.status(200).json(stop);
    } catch (error) {
        console.error("❌ Lỗi khi lấy điểm dừng:", error);
        res.status(500).json({ message: "Lỗi server khi lấy điểm dừng!", error: error.message });
    }
};

// 🟡 Cập nhật điểm dừng
export const updateStop = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, location, status } = req.body;

        const updated = await Stop.findByIdAndUpdate(
            id,
            { name, address, location, status },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "❌ Không tìm thấy điểm dừng để cập nhật!" });

        res.status(200).json({
            message: "✅ Cập nhật điểm dừng thành công!",
            data: updated,
        });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật điểm dừng:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật điểm dừng!", error: error.message });
    }
};

// 🔴 Xóa điểm dừng
export const deleteStop = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Stop.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "❌ Không tìm thấy điểm dừng để xóa!" });

        res.status(200).json({
            message: "🗑️ Xóa điểm dừng thành công!",
            data: deleted,
        });
    } catch (error) {
        console.error("❌ Lỗi khi xóa điểm dừng:", error);
        res.status(500).json({ message: "Lỗi server khi xóa điểm dừng!", error: error.message });
    }
};

// 🗺️ Tìm các điểm dừng gần vị trí hiện tại (Leaflet dùng cái này)
export const getStopsNear = async (req, res) => {
    try {
        const { lng, lat, radius = 1000 } = req.query; // mét

        if (!lng || !lat) {
            return res.status(400).json({ message: "❌ Thiếu toạ độ! Vui lòng truyền ?lng=106.7&lat=10.7" });
        }

        const stops = await Stop.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(radius),
                },
            },
        });

        res.status(200).json({
            message: "✅ Các điểm dừng gần vị trí hiện tại:",
            count: stops.length,
            data: stops,
        });
    } catch (error) {
        console.error("❌ Lỗi khi tìm điểm dừng gần:", error);
        res.status(500).json({ message: "Lỗi server khi tìm điểm dừng gần!", error: error.message });
    }
};
