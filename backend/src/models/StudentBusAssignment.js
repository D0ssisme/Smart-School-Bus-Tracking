import mongoose from "mongoose";

const studentBusAssignmentSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusSchedule",
    required: true,
  },
  pickup_status: {
    type: String,
    enum: ["pending", "picked"],
    default: "pending",
  },
  dropoff_status: {
    type: String,
    enum: ["pending", "dropped"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentBusAssignment =
  mongoose.models.StudentBusAssignment ||
  mongoose.model("StudentBusAssignment", studentBusAssignmentSchema);

export default StudentBusAssignment;
