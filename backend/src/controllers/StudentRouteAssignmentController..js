import StudentRouteAssignment from "../models/StudentRouteAssignment.js";

// CREATE
export const createStudentRouteAssignment = async (req, res) => {
  try {
    const assignment = new StudentRouteAssignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
export const getAllStudentRouteAssignments = async (req, res) => {
  try {
    const assignments = await StudentRouteAssignment.find()
      .populate({ path: "student_id", select: "name grade" })
      .populate({ path: "route_id", select: "name start_point end_point" })
      .populate({ path: "pickup_stop_id", select: "name latitude longitude" })
      .populate({ path: "dropoff_stop_id", select: "name latitude longitude" });

    res.status(200).json(assignments);
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu StudentRouteAssignment:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// READ BY ID
export const getStudentRouteAssignmentById = async (req, res) => {
  try {
    const assignment = await StudentRouteAssignment.findById(req.params.id)
      .populate("student_id")
      .populate("route_id")
      .populate("pickup_stop_id")
      .populate("dropoff_stop_id");
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateStudentRouteAssignment = async (req, res) => {
  try {
    const assignment = await StudentRouteAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteStudentRouteAssignment = async (req, res) => {
  try {
    const assignment = await StudentRouteAssignment.findByIdAndDelete(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
