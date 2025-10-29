import Bus from "../models/Bus.js";

// 🟢 Lấy toàn bộ xe bus
export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách xe:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách xe!" });
    }
};

// 🟢 Tạo mới xe bus
export const createBus = async (req, res) => {
    try {
        const { license_plate, capacity, status } = req.body;

        const newBus = new Bus({
            license_plate,
            capacity,
            status,
        });

        await newBus.save();

        res.status(201).json({
            message: "✅ Tạo xe bus thành công!",
            bus: newBus,
        });
    } catch (error) {
        console.error("❌ Lỗi khi tạo xe:", error);
        res.status(500).json({ message: "Lỗi server khi tạo xe!", error: error.message });
    }
};

// 🟡 Cập nhật xe bus
export const updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const { license_plate, capacity, status } = req.body;

        const updatedBus = await Bus.findByIdAndUpdate(
            id,
            { license_plate, capacity, status },
            { new: true }
        );

        if (!updatedBus) {
            return res.status(404).json({ message: "Không tìm thấy xe để cập nhật!" });
        }

        res.status(200).json({
            message: "✅ Cập nhật xe thành công!",
            bus: updatedBus,
        });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật xe:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật xe!" });
    }
};

// 🔴 Xóa xe bus
export const deleteBus = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBus = await Bus.findByIdAndDelete(id);

        if (!deletedBus) {
            return res.status(404).json({ message: "Không tìm thấy xe để xóa!" });
        }

        res.status(200).json({
            message: "🗑️ Xóa xe thành công!",
            bus: deletedBus,
        });
    } catch (error) {
        console.error("❌ Lỗi khi xóa xe:", error);
        res.status(500).json({ message: "Lỗi server khi xóa xe!" });
    }
};
