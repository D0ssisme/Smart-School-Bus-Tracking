import mongoose from "mongoose";

const studentRouteAssignmentSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  pickup_stop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stop",
    required: true,
  },
  dropoff_stop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stop",
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentRouteAssignment =
  mongoose.models.StudentRouteAssignment ||
  mongoose.model("StudentRouteAssignment", studentRouteAssignmentSchema);

export default StudentRouteAssignment;
