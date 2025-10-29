import mongoose from "mongoose";
import Counter from "./Counter.js";

const stopSchema = new mongoose.Schema({
  stop_id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },

  // ✅ GeoJSON field — [longitude, latitude]
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      // format: [longitude, latitude]
    },
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
}, {
  timestamps: true,
});

// 🔹 Tạo chỉ mục không gian để query theo vị trí
stopSchema.index({ location: "2dsphere" });

// 🔹 Auto-generate stop_id: STOP001, STOP002...
stopSchema.pre("save", async function (next) {
  if (this.isNew && !this.stop_id) {
    const counter = await Counter.findOneAndUpdate(
      { name: "stop" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const nextNumber = counter.seq.toString().padStart(3, "0");
    this.stop_id = `STOP${nextNumber}`;
  }
  next();
});

const Stop = mongoose.models.Stop || mongoose.model("Stop", stopSchema);
export default Stop;
