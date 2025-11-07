import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["alert", "info", "reminder"],
    default: "info",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false, // 👈 đây chính là chỗ mặc định "chưa đọc"
  },
});

export default mongoose.model("Notification", notificationSchema);
