import mongoose from "mongoose";
import Counter from "./Counter.js";

const routeSchema = new mongoose.Schema(
  {
    route_id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 Điểm bắt đầu và kết thúc của tuyến (tham chiếu đến Stop)
    start_point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stop",
      required: true,
    },
    end_point: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stop",
      required: true,
    },

    // 🔹 Đường thực tế của tuyến (GeoJSON LineString)
    // Lấy từ API như Google Directions hoặc Mapbox
    path: {
      type: {
        type: String,
        enum: ["LineString"],
        default: "LineString",
      },
      coordinates: {
        type: [[Number]], // [[lng, lat], [lng, lat], ...]
        required: true,
      },
    },

  

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// 🔹 Index để query không gian (cho map)
routeSchema.index({ path: "2dsphere" });

// 🔹 Auto-generate route_id: ROUTE001, ROUTE002...
routeSchema.pre("save", async function (next) {
  if (this.isNew && !this.route_id) {
    const counter = await Counter.findOneAndUpdate(
      { name: "route" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const nextNumber = counter.seq.toString().padStart(3, "0");
    this.route_id = `ROUTE${nextNumber}`;
  }
  next();
});

const Route = mongoose.models.Route || mongoose.model("Route", routeSchema);
export default Route;
