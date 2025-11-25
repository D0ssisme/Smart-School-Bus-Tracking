import IncidentReport from "../models/IncidentReports.js";
import mongoose from "mongoose";

export const getIncidentReportByDriverId = async (req, res) => {
  try {
    const { driver_id } = req.params;

    console.log('🔍 Fetching incidents for driver:', driver_id);

    if (!driver_id) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required'
      });
    }

    const incidents = await IncidentReport.find({
      driver_id: driver_id  // Mongoose tự convert
    })
      .populate('driver_id', 'name email phone')
      .populate('bus_id', 'bus_id license_plate capacity')
      .populate({
        path: 'schedule_id',
        select: 'schedule_id route_id departure_time',
        populate: {
          path: 'route_id',
          select: 'name description'
        }
      })
      .sort({ timestamp: -1, createdAt: -1 });

    console.log('✅ Found incidents:', incidents.length);

    return res.status(200).json(incidents);

  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching incident reports',
      error: error.message
    });
  }
};







// 🟢 CREATE — thêm báo cáo sự cố
export const createIncidentReport = async (req, res) => {
  try {
    const { driver_id, bus_id, schedule_id, title, description, location, status } = req.body;

    // Validate required fields
    if (!driver_id || !bus_id || !schedule_id || !title) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc: driver_id, bus_id, schedule_id, title"
      });
    }

    // Validate location
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tọa độ vị trí. Format: { type: 'Point', coordinates: [longitude, latitude] }"
      });
    }

    // ✅ VALIDATE TỌA ĐỘ HỢP LỆ
    const [longitude, latitude] = location.coordinates;

    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
      return res.status(400).json({
        success: false,
        message: "Tọa độ phải là số (number)"
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: `Kinh độ không hợp lệ: ${longitude}. Phải từ -180 đến 180. VD Việt Nam: 102-110`
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: `Vĩ độ không hợp lệ: ${latitude}. Phải từ -90 đến 90. VD Việt Nam: 8-24`
      });
    }

    // Create new incident report
    const newReport = new IncidentReport({
      driver_id,
      bus_id,
      schedule_id,
      title,
      description,
      location,
      status: status || 'pending'
    });

    await newReport.save();

    // Populate để trả về đầy đủ thông tin
    const populatedReport = await IncidentReport.findById(newReport._id)
      .populate('driver_id', 'name phoneNumber userId')
      .populate('bus_id', 'bus_id license_plate capacity')
      .populate({
        path: 'schedule_id',
        select: 'schedule_id route_id start_time end_time',
        populate: {
          path: 'route_id',
          select: 'name description'
        }
      });

    res.status(201).json({
      success: true,
      message: "Tạo báo cáo thành công ✅",
      data: populatedReport
    });

  } catch (error) {
    console.error("❌ Lỗi khi tạo IncidentReport:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
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
