import Notification from "../models/Notification.js";
import { io, userSockets } from "../server.js";

// 🟢 Tạo mới notification và gửi realtime
export const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();

    // Populate để có đầy đủ thông tin
    await notification.populate("receiver_id", "name role");

    // 🔥 Gửi notification qua Socket.IO
    const receiverId = notification.receiver_id._id.toString();
    const socketId = userSockets.get(receiverId);

    if (socketId) {
      console.log(`📨 Sending notification to user ${receiverId} via socket ${socketId}`);
      io.to(socketId).emit("new_notification", notification);
    } else {
      console.log(`⚠️ User ${receiverId} is not connected`);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟡 Lấy tất cả
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("receiver_id", "name role")
      .sort({ createdAt: -1 }); // Mới nhất trước
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 Lấy theo receiver_id
export const getNotificationsByReceiver = async (req, res) => {
  try {
    const { receiver_id } = req.params;
    const notifications = await Notification.find({ receiver_id })
      .populate("receiver_id", "name role")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🟠 Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    ).populate("receiver_id", "name role");
    
    if (!updated) return res.status(404).json({ message: "Not found" });
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟣 Đánh dấu tất cả đã đọc
export const markAllAsRead = async (req, res) => {
  try {
    const { receiver_id } = req.params;
    await Notification.updateMany(
      { receiver_id, isRead: false },
      { isRead: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔴 Xóa
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

      .populate("receiver_id", "name role");
    if (!notification) return res.status(404).json({ message: "Not found" });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};