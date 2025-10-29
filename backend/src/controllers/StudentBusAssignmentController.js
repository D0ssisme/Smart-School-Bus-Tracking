import StudentBusAssignment from "../models/StudentBusAssignment.js";

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

