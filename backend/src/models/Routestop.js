//src/models/Routestop.js
import mongoose from "mongoose";

const routeStopSchema = new mongoose.Schema(
  {
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    stop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stop",
      required: true,
    },
    order_number: {
      type: Number,
      required: true,
    },
    estimated_arrival: {
      type: String, // ví dụ: "07:30"
    },
  },
  { timestamps: true }
);

routeStopSchema.index({ route_id: 1, order_number: 1 }, { unique: true });

const RouteStop =
  mongoose.models.RouteStop || mongoose.model("RouteStop", routeStopSchema);
export default RouteStop;
