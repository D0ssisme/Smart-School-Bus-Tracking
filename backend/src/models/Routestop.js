import mongoose from "mongoose";

const routeStopSchema = new mongoose.Schema({
  stop_id: {
    type: Number,
    unique: true
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  order_number: {
    type: Number,
    required: true
  },
  estimated_arrival: {
    type: String, // "HH:mm"
    required: false
  }
}, { timestamps: true });

// Auto-increment stop_id
routeStopSchema.pre("save", async function (next) {
  if (!this.stop_id) {
    const last = await mongoose.model("RouteStop").findOne().sort("-stop_id");
    this.stop_id = last ? last.stop_id + 1 : 1;
  }
  next();
});

const RouteStop = mongoose.model("RouteStop", routeStopSchema);
export default RouteStop;
