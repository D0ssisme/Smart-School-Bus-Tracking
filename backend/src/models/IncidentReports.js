import mongoose from "mongoose";

const incidentReportSchema = new mongoose.Schema({
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusSchedule",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "ignored"],
    default: "pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// ✅ Thêm index không gian để query theo vị trí
incidentReportSchema.index({ location: "2dsphere" });

const IncidentReport =
  mongoose.models.IncidentReport ||
  mongoose.model("IncidentReport", incidentReportSchema);

export default IncidentReport;
