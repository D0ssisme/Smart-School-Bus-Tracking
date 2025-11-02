import mongoose from "mongoose";
import Counter from "./Counter.js";

const busScheduleSchema = new mongoose.Schema({
  schedule_id: {
    type: String,
    unique: true,
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  start_time: {
    type: String, // "07:30"
    required: true,
  },
  end_time: {
    type: String, // "08:30"
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  }
}, { timestamps: true });

// Auto-generate schedule_id: SCHEDULE001, SCHEDULE002...
busScheduleSchema.pre("save", async function (next) {
  if (!this.schedule_id) {
    const counter = await Counter.findOneAndUpdate(
      { name: "bus_schedule" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const nextNumber = counter.seq.toString().padStart(3, "0");
    this.schedule_id = `SCHEDULE${nextNumber}`;
  }
  next();
});

const BusSchedule = mongoose.models.BusSchedule || mongoose.model("BusSchedule", busScheduleSchema);
export default BusSchedule;
