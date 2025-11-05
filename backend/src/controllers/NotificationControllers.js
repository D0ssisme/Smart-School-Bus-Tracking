import Notification from "../models/Notification.js";

// 🟢 Tạo mới
export const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🟡 Lấy tất cả
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()

      .populate("receiver_id", "name role");
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔵 Lấy theo ID
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

// 🟠 Cập nhật
export const updateNotification = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
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
