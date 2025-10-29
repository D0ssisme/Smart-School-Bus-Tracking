import mongoose from "mongoose";
import Counter from "./Counter.js";

const busSchema = new mongoose.Schema({
  bus_id: {
    type: String,
    unique: true,
  },
  license_plate: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "repair"],
    default: "active",
  },
}, {
  timestamps: true,
});

// 🔹 Auto-generate bus_id: BUS001, BUS002...
busSchema.pre("save", async function (next) {
  if (this.isNew && !this.bus_id) {
    const counter = await Counter.findOneAndUpdate(
      { name: "bus" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const nextNumber = counter.seq.toString().padStart(3, "0");
    this.bus_id = `BUS${nextNumber}`;
  }
  next();
});

// ✅ tránh lỗi khi reload server
const Bus = mongoose.models.Bus || mongoose.model("Bus", busSchema);

export default Bus;
