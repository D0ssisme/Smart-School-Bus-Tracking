import StudentBusAssignment from "../models/StudentBusAssignment.js";


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