import StudentBusAssignment from "../models/StudentBusAssignment.js";
import mongoose from "mongoose";



// GET /api/studentbusassignments/schedule/:scheduleId
export const getStudentsByScheduleId = async (req, res) => {
  try {
    const { schedule_id } = req.params;

    const students = await StudentBusAssignment.find({
      schedule_id,
    })
      .populate({
        path: "student_id",
        select: "student_id name grade class"
      })
      .populate({
        path: "schedule_id",
        select: "schedule_id route_id bus_id driver_id"
      })
      .lean();

    // Nếu cần thêm thông tin pickup/dropoff stops
    const enrichedStudents = await Promise.all(
      students.map(async (assignment) => {
        // Lấy thông tin route assignment để có pickup/dropoff stops
        const RouteAssignment = mongoose.model("StudentRouteAssignment");
        const routeAssignment = await RouteAssignment.findOne({
          student_id: assignment.student_id._id
        })
          .populate("pickup_stop_id", "name address location")
          .populate("dropoff_stop_id", "name address location")
          .lean();

        return {
          ...assignment,
          pickup_stop_id: routeAssignment?.pickup_stop_id || null,
          dropoff_stop_id: routeAssignment?.dropoff_stop_id || null
        };
      })
    );

    res.status(200).json(enrichedStudents);
  } catch (error) {
    console.error("❌ Error getting students by schedule:", error);
    res.status(500).json({
      message: "Không thể lấy danh sách học sinh",
      error: error.message
    });
  }
};

// GET BY STUDENT ID
export const getStudentBusAssignmentByStudentId = async (req, res) => {
  try {
    const { student_id } = req.params;

    const assignment = await StudentBusAssignment.findOne({
      student_id,

    })
      .populate("student_id", "name grade")
      .populate({
        path: "schedule_id",
        populate: [
          { path: "bus_id", select: "license_plate capacity" },
          { path: "driver_id", select: "name phone" },
          { path: "route_id", select: "name" },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin học sinh"
      });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE
export const createStudentBusAssignment = async (req, res) => {
  try {
    const assignment = new StudentBusAssignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
export const getAllStudentBusAssignments = async (req, res) => {
  try {
    const assignments = await StudentBusAssignment.find()
      .populate("student_id", "name grade")
      .populate({
        path: "schedule_id",
        populate: [
          { path: "bus_id", select: "license_plate capacity" },
          { path: "driver_id", select: "name phone" },
          { path: "route_id", select: "name" },
        ],
      });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ BY ID
export const getStudentBusAssignmentById = async (req, res) => {
  try {
    const assignment = await StudentBusAssignment.findById(req.params.id)
      .populate("student_id", "name grade")
      .populate({
        path: "schedule_id",
        populate: [
          { path: "bus_id", select: "license_plate capacity" },
          { path: "driver_id", select: "name phone" },
          { path: "route_id", select: "name" },
        ],
      });

    if (!assignment) return res.status(404).json({ message: "Không tìm thấy bản ghi!" });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateStudentBusAssignment = async (req, res) => {
  try {
    const updated = await StudentBusAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy bản ghi!" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteStudentBusAssignment = async (req, res) => {
  try {
    const deleted = await StudentBusAssignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy bản ghi!" });
    res.status(200).json({ message: "Xóa bản ghi thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COUNT STUDENTS BY SCHEDULE ID
export const getCountStudentByScheduleId = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const count = await StudentBusAssignment.countDocuments({
      schedule_id
    });

    res.status(200).json({
      success: true,
      schedule_id,
      studentCount: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};