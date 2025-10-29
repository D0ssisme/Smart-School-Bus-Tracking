import IncidentReport from "../models/IncidentReports.js";

// 🟢 CREATE — thêm báo cáo sự cố
export const createIncidentReport = async (req, res) => {
  try {
    const { driver_id, bus_id, schedule_id, title, description, location } = req.body;

    if (!location || !location.coordinates) {
      return res.status(400).json({ message: "Thiếu tọa độ vị trí (location.coordinates)" });
    }

    const newReport = new IncidentReport({
      driver_id,
      bus_id,
      schedule_id,
      title,
      description,
      location,
    });

    await newReport.save();
    res.status(201).json({ message: "Tạo báo cáo thành công ✅", report: newReport });
  } catch (error) {
    console.error("❌ Lỗi khi tạo IncidentReport:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 🟡 READ ALL — lấy toàn bộ báo cáo
export const getAllIncidentReports = async (req, res) => {
  try {
    const reports = await IncidentReport.find()
      .populate({ path: "driver_id", select: "name phone role" })
      .populate({ path: "bus_id", select: "license_plate status" })
      .populate({ path: "schedule_id", select: "schedule_id date start_time end_time" })
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách IncidentReport:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 🟠 READ BY ID — lấy báo cáo theo ID
export const getIncidentReportById = async (req, res) => {
  try {
    const report = await IncidentReport.findById(req.params.id)
      .populate("driver_id")
      .populate("bus_id")
      .populate("schedule_id");

    if (!report) return res.status(404).json({ message: "Không tìm thấy báo cáo" });

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 UPDATE — cập nhật trạng thái hoặc thông tin báo cáo
export const updateIncidentReport = async (req, res) => {
  try {
    const updated = await IncidentReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Không tìm thấy báo cáo" });

    res.status(200).json({ message: "Cập nhật thành công ✅", report: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔴 DELETE — xóa báo cáo
export const deleteIncidentReport = async (req, res) => {
  try {
    const deleted = await IncidentReport.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy báo cáo" });
    res.status(200).json({ message: "Xóa báo cáo thành công ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🧭 TÌM THEO BÁN KÍNH — lọc sự cố trong khu vực
export const getReportsNearby = async (req, res) => {
  try {
    const { lng, lat, radius } = req.query;

    if (!lng || !lat || !radius) {
      return res.status(400).json({ message: "Thiếu tham số lng, lat hoặc radius" });
    }

    const reports = await IncidentReport.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius),
        },
      },
    }).populate("bus_id driver_id schedule_id");

    res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Lỗi khi tìm báo cáo gần:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
